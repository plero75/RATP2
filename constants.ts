import { TransportConfig } from './types';

// URLs et Clés
export const PROXY_URL = "https://ratp-proxy.hippodrome-proxy42.workers.dev/?url=";
export const PRIM_API_KEY = "7nAc6NHplCJtJ46Qw32QFtefq3TQEYrT";

// Zones d'arrêt (StopPoints précis selon le fichier Excel)
export const STOP_AREAS = {
  JOINVILLE_RER: "STIF:StopArea:SP:43135:", // Zone globale RER
  // Quais bus spécifiques à Joinville
  JOINVILLE_BUS_Q_39406: "STIF:StopPoint:Q:39406:", // Quai principal (77, 201, N33)
  JOINVILLE_BUS_Q_39407: "STIF:StopPoint:Q:39407:", // Quai secondaire (101, 106, 108, 110, 112, 281)
  HIPPODROME_Q: "STIF:StopPoint:Q:463641:",
  BREUIL_Q: "STIF:StopPoint:Q:463644:"
};

// Codes Lignes (Complets pour Joinville)
export const LINES_CODE = { 
  RER_A: "C01742", 
  BUS_77: "C02251", 
  BUS_101: "C01130",
  BUS_106: "C01133",
  BUS_108: "C01137",
  BUS_110: "C01139",
  BUS_112: "C01135",
  BUS_201: "C01219", 
  BUS_281: "C01260",
  N33: "C01399"
};

// Reverse mapping: from LineRef codes to LINES_CODE keys
export const REVERSE_LINE_REFS: Record<string, string> = {
  "C01742": "RER_A",
  "C02251": "BUS_77",
  "C01130": "BUS_101",
  "C01133": "BUS_106",
  "C01137": "BUS_108",
  "C01139": "BUS_110",
  "C01135": "BUS_112",
  "C01219": "BUS_201",
  "C01260": "BUS_281",
  "C01399": "N33"
};

// Service reprise (maintenance windows by line)
export const SERVICE_REPRISE_BY_LINE: Record<string, {start: string; end: string} | null> = {
  RER_A: null,
  BUS_77: null,
  BUS_101: null,
  BUS_106: null,
  BUS_108: null,
  BUS_110: null,
  BUS_112: null,
  BUS_201: null,
  BUS_281: null,
  N33: null
};

// Vélib
export const VELIB_STATION_IDS = {
  HIPPODROME: 12163,
  PYRAMIDE: 12128,
};

// Configuration des Widgets
export const TRANSPORT_CONFIG: Record<string, TransportConfig> = {
  // 1. RER A
  RER_A: {
    title: 'RER A - Gare de Joinville-le-Pont',
    stopAreaId: STOP_AREAS.JOINVILLE_RER,
    lines: [
      { id: LINES_CODE.RER_A, code: 'A', name: 'RER A', direction: 'Paris (Ouest)', filterDirection: 'W' },
      { id: LINES_CODE.RER_A, code: 'A', name: 'RER A', direction: 'Boissy (Est)', filterDirection: 'E' },
    ],
  },
  
  // 2. Bus Joinville - Quai 1 (Principal)
  JOINVILLE_HUB_GARE: {
    title: 'Bus - Arrêt Gare (Quai 1)',
    stopAreaId: STOP_AREAS.JOINVILLE_BUS_Q_39406,
    lines: [
      { id: LINES_CODE.BUS_77, code: '77', name: 'Gare de Lyon' },
      { id: LINES_CODE.BUS_201, code: '201', name: 'Champigny / Pte Dorée' },
      { id: LINES_CODE.N33, code: 'N33', name: 'Noctilien N33' },
    ],
  },

  // 3. Bus Joinville - Quai 2 (Gallieni / Autres)
  JOINVILLE_HUB_GALLIENI: {
    title: 'Bus - Arrêt Gallieni (Quai 2)',
    stopAreaId: STOP_AREAS.JOINVILLE_BUS_Q_39407,
    lines: [
      { id: LINES_CODE.BUS_101, code: '101', name: 'Camping International' },
      { id: LINES_CODE.BUS_106, code: '106', name: 'Villiers-sur-Marne' },
      { id: LINES_CODE.BUS_108, code: '108', name: 'Champigny - Jeanne Vacher' },
      { id: LINES_CODE.BUS_110, code: '110', name: 'Villiers-sur-Marne' },
      { id: LINES_CODE.BUS_112, code: '112', name: 'Ch. de Vincennes' },
      { id: LINES_CODE.BUS_281, code: '281', name: 'Créteil-Europarc' },
    ],
  },

  // 4. Autres Arrêts (Hippodrome & Breuil)
  HIPPODROME_HUB: {
    title: 'Bus - Arrêt Hippodrome',
    stopAreaId: STOP_AREAS.HIPPODROME_Q,
    lines: [
       { id: LINES_CODE.BUS_77, code: '77', name: 'Vers Gare de Lyon / Joinville' }
    ]
  },
  ECOLE_DU_BREUIL_HUB: {
    title: 'Bus - Arrêt École du Breuil',
    stopAreaId: STOP_AREAS.BREUIL_Q,
    lines: [
       { id: LINES_CODE.BUS_201, code: '201', name: 'Vers Champigny / Porte Dorée' }
    ]
  }
};

// ===========================
// API URLs and Configuration
// ===========================

// PRIM API URL builder
export function primUrl(endpoint: string, params: Record<string, string> = {}): string {
  const query = new URLSearchParams({
    apiKey: PRIM_API_KEY,
    ...params,
  }).toString();
  return PROXY_URL + encodeURIComponent(`https://api.ratp.fr${endpoint}?${query}`);
}

// Vélib API
export const VELIB_API_URL = "https://opendata.paris.fr/api/records/1.0/search/?dataset=velib-disponibilite-en-temps-reel&rows=2&sort=-record_timestamp";

// PMU API
export const PMU_API_BASE_URL = "https://www.letrot.com/ajax/pronostics/hippiques/";

// Météo (Open-Meteo)
export const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";
export const WEATHER_PARAMS = {
  latitude: 48.8235,
  longitude: 2.5068,
  current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
  hourly: "temperature_2m,weather_code",
  daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum",
  timezone: "Europe/Paris",
  forecast_days: 7,
};

// Actualités (RSS Feed)
export const NEWS_FEED_URL = "https://feeds.reuters.com/reuters/frenchNews?format=xml";

// Trafic Paris
export const PARIS_TRAFFIC_API_BASE_URL = "https://api.paris.fr/api/datasets/1.0/search/";
export const PARIS_TRAFFIC_API_PARAMS = {
  q: "circulation",
  rows: 50,
};

// Saint du jour
export const SAINT_API_URL = "https://saintsday.com/api/saints/today";

// ===========================
// Refresh Intervals
// ===========================
export const REFRESH_INTERVALS = {
  TRANSPORT: 30000, // 30 secondes
  VELIB: 60000, // 1 minute
  WEATHER: 600000, // 10 minutes
  NEWS: 1800000, // 30 minutes
  TRAFFIC: 120000, // 2 minutes
  TRAFFIC_ALERTS: 300000, // 5 minutes
  PMU: 300000, // 5 minutes
};
