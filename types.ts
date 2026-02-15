// =====================================================
// 📑 types.ts – Dashboard Hippodrome de Vincennes
// =====================================================
// Définit tous les types TypeScript pour le dashboard.
// =====================================================

// ---------------------------------------------
// 🚍 Configuration de transport
// ---------------------------------------------
export interface TransportConfig {
  stopAreaId: string;
  lineId?: string;
  label: string;
  omitLineRef?: string[]; // Lignes à exclure (ex: RER A dans les hubs bus)
}

// ---------------------------------------------
// 🛤️ Données SIRI temps réel
// ---------------------------------------------
export interface SiriValue {
  value: string;
}

export interface MonitoredCall {
  AimedDepartureTime: string;
  ExpectedDepartureTime?: string;
  DepartureStatus?: string;
}

export interface MonitoredVehicleJourney {
  LineRef: SiriValue;
  DirectionRef?: SiriValue;
  DestinationName?: SiriValue[];
  MonitoredCall: MonitoredCall;
  DatedVehicleJourneyRef?: string;
  JourneyNote?: SiriValue[];
}

export interface MonitoredStopVisit {
  MonitoredVehicleJourney: MonitoredVehicleJourney;
}

export interface StopMonitoringDelivery {
  MonitoredStopVisit: MonitoredStopVisit[];
}

export interface ServiceDelivery {
  StopMonitoringDelivery?: StopMonitoringDelivery[];
  GeneralMessageDelivery?: GeneralMessageDelivery[];
}

export interface SiriResponse {
  Siri: {
    ServiceDelivery: ServiceDelivery;
  };
}

// ---------------------------------------------
// ⚠️ Alertes trafic
// ---------------------------------------------
export interface MessageText {
  value: string;
}

export interface Message {
  MessageText?: MessageText[];
}

export interface InfoMessageContent {
  Message?: Message[];
}

export interface InfoMessage {
  Content?: InfoMessageContent;
}

export interface GeneralMessageDelivery {
  InfoMessage?: InfoMessage[];
}

export interface GeneralMessageResponse {
  Siri: {
    ServiceDelivery: {
      GeneralMessageDelivery?: GeneralMessageDelivery[];
    };
  };
}

// ---------------------------------------------
// 🌦️ Météo
// ---------------------------------------------
export interface WeatherData {
  current_weather: {
    temperature: number;
    weathercode: number;
    windspeed: number;
  };
}

// ---------------------------------------------
// 📰 Actualités
// ---------------------------------------------
export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
}

// ---------------------------------------------
// 🚲 Vélib'
// ---------------------------------------------
export interface VelibStation {
  station_id: number;
  num_bikes_available: number;
  num_docks_available: number;
}

export interface VelibData {
  data: {
    stations: VelibStation[];
  };
}

// ---------------------------------------------
// 🏇 PMU
// ---------------------------------------------
export interface PmuRace {
  numOrdre: number;
  libelleCourt: string;
  heureDepart: string;
}

export interface PmuReunion {
  hippodrome: {
    libelleCourt: string;
  };
  courses: PmuRace[];
}

export interface PmuData {
  programme: {
    reunions: PmuReunion[];
  };
}