// services/api.ts
import { 
  primUrl,
  PROXY_URL,
  REFRESH_INTERVALS,
  VELIB_API_URL,
  PMU_API_BASE_URL,
  WEATHER_URL,
  WEATHER_PARAMS,
  NEWS_FEED_URL,
  PARIS_TRAFFIC_API_BASE_URL,
  PARIS_TRAFFIC_API_PARAMS,
  SAINT_API_URL,
} from '../constants';
import type {
  GeneralMessageResponse,
  NewsItem,
  PmuResponse,
  SaintResponse,
  StopMonitoringResponse,
  TrafficApiResponse,
  VehicleJourneyResponse,
  VelibStationStatus,
  WeatherResponse,
} from '../types';
import { format } from 'date-fns';

// cache générique en mémoire (front)
const cache: Record<string, { data: any; ts: number }> = {};

// Sequential throttling for PRIM API requests
let lastRequestTime = 0;
const THROTTLE_DELAY = 200; // 200ms between requests (more conservative)
const REQUEST_TIMEOUT = 5000; // 5s timeout per request

// Semaphore to ensure sequential execution
let throttlePromise = Promise.resolve();

function throttledFetch<T>(fetcher: () => Promise<T>): Promise<T> {
  // Chain requests sequentially with delay
  throttlePromise = throttlePromise.then(() => {
    // Wait minimum time since last request
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    const delayNeeded = Math.max(0, THROTTLE_DELAY - timeSinceLastRequest);
    
    return new Promise<T>((resolve, reject) => {
      setTimeout(() => {
        lastRequestTime = Date.now();
        
        // Add timeout to prevent hanging
        const timeoutId = setTimeout(() => {
          reject(new Error('Request timeout'));
        }, REQUEST_TIMEOUT);
        
        fetcher()
          .then(result => {
            clearTimeout(timeoutId);
            resolve(result);
          })
          .catch(error => {
            clearTimeout(timeoutId);
            reject(error);
          });
      }, delayNeeded);
    });
  });
  
  return throttlePromise;
}

// wrapper de cache
export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = 60000
): Promise<T> {
  const now = Date.now();
  const hit = cache[key];
  if (hit && now - hit.ts < ttl) return hit.data;
  const data = await fetcher();
  cache[key] = { data, ts: now };
  return data;
}

// fetch sûr
export async function safeFetch<T>(url: string): Promise<T> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status} — ${url}`);
  return r.json() as Promise<T>;
}

// Données de passages
export async function fetchTransportData(
  stopAreaId: string,
  lineId?: string,
  omitLineRef?: boolean
) {
  // Use throttled fetch for PRIM API
  return throttledFetch(async () => {
    // Hubs (no lineId) need all data for a specific stop -> stop-monitoring is efficient
    if (!lineId) {
      const params: Record<string, string> = { MonitoringRef: stopAreaId };
      const url = primUrl("/marketplace/stop-monitoring", params);
      return safeFetch<StopMonitoringResponse>(url);
    }

    // Specific line queries -> requete-ligne as requested
    // This endpoint fetches data for the entire line.
    const params: Record<string, string> = { LineRef: lineId };
    const url = primUrl("/marketplace/requete-ligne", params);
    const response = await safeFetch<StopMonitoringResponse>(url);

    // We must then filter the results for the specific stop(s) we need.
    // This handles both single-stop requests and multi-stop ones like RER A.
    const stopAreaIds = stopAreaId.split(',');
    if (response?.Siri?.ServiceDelivery?.StopMonitoringDelivery?.[0]?.MonitoredStopVisit) {
      const allVisits = response.Siri.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit;
      const filteredVisits = allVisits.filter(visit => 
          stopAreaIds.includes(visit.MonitoringRef.value)
      );
      
      // Reconstruct the response with only the filtered visits
      const filteredResponse = JSON.parse(JSON.stringify(response));
      const delivery = filteredResponse.Siri.ServiceDelivery.StopMonitoringDelivery[0];

      if (delivery) {
        delivery.MonitoredStopVisit = filteredVisits;
        
        // Sort the final list of visits chronologically by departure time
        delivery.MonitoredStopVisit.sort((a, b) => {
          const timeA = a.MonitoredVehicleJourney.MonitoredCall.ExpectedDepartureTime || a.MonitoredVehicleJourney.MonitoredCall.AimedDepartureTime;
          const timeB = b.MonitoredVehicleJourney.MonitoredCall.ExpectedDepartureTime || b.MonitoredVehicleJourney.MonitoredCall.AimedDepartureTime;
          return new Date(timeA).getTime() - new Date(timeB).getTime();
        });
      }

      return filteredResponse;
    }

    return response;
  });
}


// Desserte d'un véhicule (vehicle_journeys)
export async function fetchVehicleJourney(vehicleJourneyRef: string) {
  return throttledFetch(async () => {
    const url = primUrl("/marketplace/vehicle-journeys", { "DatedVehicleJourneyRef": vehicleJourneyRef });
    return safeFetch<VehicleJourneyResponse>(url);
  });
}

// Alertes trafic (general-message) — cache 5 min
export async function fetchTrafficAlerts(lineId: string) {
  return cachedFetch<GeneralMessageResponse>(
    `alerts-${lineId}`,
    async () => {
      return throttledFetch(async () => {
        const url = primUrl("/marketplace/general-message", { LineRef: lineId });
        return safeFetch<GeneralMessageResponse>(url);
      });
    },
    300_000 // 5 minutes
  );
}

// Statut des stations Vélib'
export async function fetchVelibStatus() {
  const url = PROXY_URL + encodeURIComponent(VELIB_API_URL);
  return safeFetch<VelibStationStatus>(url);
}

// Programme PMU du jour
export async function fetchPmuProgramme() {
  const today = format(new Date(), 'ddMMyyyy');
  const fullUrl = `${PMU_API_BASE_URL}${today}`;
  const url = PROXY_URL + encodeURIComponent(fullUrl);
  return safeFetch<PmuResponse>(url);
}

// Météo (Open-Meteo)
export async function fetchWeatherData() {
  const params = new URLSearchParams(WEATHER_PARAMS as any).toString();
  const fullUrl = `${WEATHER_URL}?${params}`;
  const url = PROXY_URL + encodeURIComponent(fullUrl);
  return safeFetch<WeatherResponse>(url);
}

// Actualités (RSS)
export async function fetchNews(): Promise<NewsItem[]> {
  return cachedFetch<NewsItem[]>(
    'news-rss',
    async () => {
      const url = PROXY_URL + encodeURIComponent(NEWS_FEED_URL);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} — ${url}`);
      }
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
      const items = Array.from(xmlDoc.querySelectorAll('item')).slice(0, 10); // Take top 10 for rotation
      
      const plainText = (html: string) => {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || '';
      }

      return items.map(item => ({
        title: item.querySelector('title')?.textContent || 'Sans titre',
        link: item.querySelector('link')?.textContent || '#',
        pubDate: item.querySelector('pubDate')?.textContent || new Date().toISOString(),
        description: plainText(item.querySelector('description')?.textContent || '').substring(0, 200) + '...',
      }));
    },
    REFRESH_INTERVALS.NEWS
  );
}

// Traffic Events in Paris
export async function fetchTrafficEvents() {
    const params = new URLSearchParams(PARIS_TRAFFIC_API_PARAMS).toString().replace(/\+/g, '%20');
    const fullUrl = `${PARIS_TRAFFIC_API_BASE_URL}?${params}`;
    const url = PROXY_URL + encodeURIComponent(fullUrl);
    return safeFetch<TrafficApiResponse>(url);
}

// Saint du jour
export async function fetchSaintOfDay() {
  return safeFetch<SaintResponse>(SAINT_API_URL);
}
