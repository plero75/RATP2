// types.ts

// ✅ Statut des départs pour le widget Transport
export enum DepartureStatus {
  ON_TIME,
  IMMINENT,
  DELAYED,
  CANCELLED,
  SERVICE_ENDED,
}

// ✅ Configuration d'une ligne de transport
export interface TransportConfig {
  stopAreaId: string;
  lineId?: string; // Made optional for bus hubs
  label: string;
  omitLineRef?: boolean;
}

// ✅ Données statiques GTFS pour les premiers/derniers départs
export interface GtfsData {
    [stopAreaId: string]: {
        [lineId: string]: {
            dirA_first: string; dirA_last: string;
            dirB_first: string; dirB_last: string;
        };
    };
}

// ✅ Types pour l'API Transport (SIRI - StopMonitoring)
export interface MonitoredStopVisit {
  MonitoringRef: { value: string };
  MonitoredVehicleJourney: {
    LineRef: { value: string };
    DatedVehicleJourneyRef: string;
    DestinationName?: { value: string }[];
    JourneyNote?: { value: string }[];
    MonitoredCall: {
      AimedDepartureTime: string; // ISO date string
      ExpectedDepartureTime?: string; // ISO date string
      // Fix: Add optional DepartureStatus property based on SIRI spec and usage in TransportWidget.
      DepartureStatus?: string;
    };
  };
}

export interface StopMonitoringResponse {
  Siri: {
    ServiceDelivery: {
      StopMonitoringDelivery: {
        MonitoredStopVisit: MonitoredStopVisit[];
      }[];
    };
  };
}

// ✅ Types for Vehicle Journey API
export interface JourneyCall {
  StopPointName: { value: string };
  AimedArrivalTime: string; // ISO date string
  ExpectedArrivalTime: string; // ISO date string
}

export interface DatedVehicleJourney {
    DatedVehicleJourneyRef: string;
    Calls: {
      Call: JourneyCall[];
    };
}

export interface VehicleJourneyResponse {
  Siri: {
    ServiceDelivery: {
      VehicleJourneyDelivery: {
        DatedVehicleJourney: DatedVehicleJourney[];
      }[];
    };
  };
}


// ✅ Types pour l'API Alertes Trafic (SIRI - GeneralMessage)
export interface InfoMessage {
  Content: {
    Message: {
      MessageText: { value: string }[];
    }[];
  };
}

export interface GeneralMessageResponse {
  Siri: {
    ServiceDelivery: {
      GeneralMessageDelivery: {
        InfoMessage: InfoMessage[];
      }[];
    };
  };
}

// ✅ Types pour l'API Météo (Open-Meteo)
export interface WeatherResponse {
  current_weather: {
    temperature: number;
    weathercode: number;
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
  };
}

// ✅ Types pour l'API Vélib' (Smovengo)
export interface VelibStation {
  stationcode: string | number;
  name: string;
  mechanical: number;
  ebike: number;
  numdocksavailable: number;
  is_renting: 'OUI' | 'NON';
  is_installed: 'OUI' | 'NON';
}

export type VelibStationStatus = VelibStation[];


// ✅ Types pour l'API PMU
export interface PmuRace {
  numOrdre: number;
  libelle: string;
  heureDepart: string;
}

export interface PmuReunion {
  hippodrome: {
    libelleCourt: string;
  };
  courses: PmuRace[];
}

export interface PmuResponse {
  programme: {
    reunions: PmuReunion[];
  };
}

// ✅ Types for News RSS
export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

// ✅ Types for Paris Traffic Events API (opendata.paris.fr)
export interface TrafficEvent {
  lieu: string;
  intitule: string;
  type: string;
  datedebut: string; // ISO date string
  datefin?: string; // ISO date string
  description: string;
}

export interface TrafficApiResponse {
  total_count: number;
  results: TrafficEvent[];
}