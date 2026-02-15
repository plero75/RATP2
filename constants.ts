// =====================================================
// 🌐 constants.ts – Dashboard Hippodrome de Vincennes
// =====================================================
// Gère toutes les constantes, endpoints, proxys et
// valeurs de configuration pour le dashboard live.
// Compatible avec les anciens modules (rétro support).
// =====================================================

// ---------------------------------------------
// 🔐 Proxy PRIM (clé API gérée dans le Worker)
// ---------------------------------------------
export const PROXY_URL =
  "https://ratp-proxy.hippodrome-proxy42.workers.dev/?url=";

// ---------------------------------------------
// 🧩 Générateur d'URL PRIM
// ---------------------------------------------
export function primUrl(
  path: string,
  params: Record<string, string>
) {
  const base = "https://prim.iledefrance-mobilites.fr" + path;
  const qs = new URLSearchParams(params).toString();
  return PROXY_URL + encodeURIComponent(`${base}?${qs}`);
}

// =====================================================
// 🚍 Identifiants de lignes (LineRef)
// =====================================================
export const LINE_REFS = {
  RERA: "STIF:Line::C01742:",
  BUS_77: "STIF:Line::C02251:",
  BUS_101: "STIF:Line::C01130:",
  BUS_106: "STIF:Line::C01135:",
  BUS_108: "STIF:Line::C01137:",
  BUS_110: "STIF:Line::C01139:",
  BUS_201: "STIF:Line::C01219:",
  N33: "STIF:Line::C01399:",
  N71: "STIF:Line::C01501:",
} as const;

export const REVERSE_LINE_REFS: { [key: string]: string } = Object.fromEntries(
  Object.entries(LINE_REFS).map(([key, value]) => [value, key])
);

// =====================================================
// 🏁 StopPoints valides (MonitoringRef)
// =====================================================
export const STOPS = {
  JOINVILLE_RER: {
    RERA: ["STIF:StopPoint:Q:22452:", "STIF:StopPoint:Q:22453:"],
    BUS_77: ["STIF:StopPoint:Q:39406:"],
    BUS_101: ["STIF:StopPoint:Q:39407:"],
    BUS_106: ["STIF:StopPoint:Q:39407:"],
    BUS_108: ["STIF:StopPoint:Q:39407:"],
    BUS_110: ["STIF:StopPoint:Q:39407:"],
    BUS_201: ["STIF:StopPoint:Q:39406:"],
  },
  ECOLE_DU_BREUIL: {
    BUS_77: ["STIF:StopPoint:Q:463644:"],
    BUS_201: ["STIF:StopPoint:Q:463644:"],
    N33: ["STIF:StopPoint:Q:463644:"],
  },
  HIPPODROME_VINCENNES: {
    BUS_77: ["STIF:StopPoint:Q:463641:"],
    BUS_106: ["STIF:StopPoint:Q:463641:"],
    N33: ["STIF:StopPoint:Q:463641:"],
    N71: ["STIF:StopPoint:Q:463641:"],
  },
} as const;

// =====================================================
// 🌍 Configurations de transport
// =====================================================
export const TRANSPORT_CONFIG = {
  // Lignes individuelles
  RER_A: {
    stopAreaId: STOPS.JOINVILLE_RER.RERA.join(','),
    lineId: LINE_REFS.RERA,
    label: 'RER A',
  },
  BUS_77_JOINVILLE: { 
    stopAreaId: STOPS.JOINVILLE_RER.BUS_77[0], 
    lineId: LINE_REFS.BUS_77, 
    label: 'Bus 77' 
  },
  BUS_101: { 
    stopAreaId: STOPS.JOINVILLE_RER.BUS_101[0], 
    lineId: LINE_REFS.BUS_101, 
    label: 'Bus 101' 
  },
  BUS_106_JOINVILLE: { 
    stopAreaId: STOPS.JOINVILLE_RER.BUS_106[0], 
    lineId: LINE_REFS.BUS_106, 
    label: 'Bus 106' 
  },
  BUS_108: { 
    stopAreaId: STOPS.JOINVILLE_RER.BUS_108[0], 
    lineId: LINE_REFS.BUS_108, 
    label: 'Bus 108' 
  },
  BUS_110: { 
    stopAreaId: STOPS.JOINVILLE_RER.BUS_110[0], 
    lineId: LINE_REFS.BUS_110, 
    label: 'Bus 110' 
  },
  BUS_201_JOINVILLE: { 
    stopAreaId: STOPS.JOINVILLE_RER.BUS_201[0], 
    lineId: LINE_REFS.BUS_201, 
    label: 'Bus 201' 
  },
  
  BUS_77_HIPPODROME: { 
    stopAreaId: STOPS.HIPPODROME_VINCENNES.BUS_77[0], 
    lineId: LINE_REFS.BUS_77, 
    label: 'Bus 77' 
  },
  BUS_106_HIPPODROME: { 
    stopAreaId: STOPS.HIPPODROME_VINCENNES.BUS_106[0], 
    lineId: LINE_REFS.BUS_106, 
    label: 'Bus 106' 
  },
  BUS_N33_HIPPODROME: { 
    stopAreaId: STOPS.HIPPODROME_VINCENNES.N33[0], 
    lineId: LINE_REFS.N33, 
    label: 'Noctilien N33' 
  },
  BUS_N71_HIPPODROME: { 
    stopAreaId: STOPS.HIPPODROME_VINCENNES.N71[0], 
    lineId: LINE_REFS.N71, 
    label: 'Noctilien N71' 
  },
  
  BUS_77_ECOLE_DU_BREUIL: { 
    stopAreaId: STOPS.ECOLE_DU_BREUIL.BUS_77[0], 
    lineId: LINE_REFS.BUS_77, 
    label: 'Bus 77' 
  },
  BUS_201_ECOLE_DU_BREUIL: { 
    stopAreaId: STOPS.ECOLE_DU_BREUIL.BUS_201[0], 
    lineId: LINE_REFS.BUS_201, 
    label: 'Bus 201' 
  },
  BUS_N33_ECOLE_DU_BREUIL: { 
    stopAreaId: STOPS.ECOLE_DU_BREUIL.N33[0], 
    lineId: LINE_REFS.N33, 
    label: 'Noctilien N33' 
  },

  // Hubs multi-lignes (vue consolidée)
  JOINVILLE_HUB_GARE: { 
    stopAreaId: STOPS.JOINVILLE_RER.BUS_77[0],
    label: 'Bus - Arrêt Gare',
    omitLineRef: [LINE_REFS.RERA], // Exclut le RER A
  },
  JOINVILLE_HUB_GALLIENI: {
    stopAreaId: STOPS.JOINVILLE_RER.BUS_108[0],
    label: 'Bus - Arrêt Av. Gallieni',
    omitLineRef: [LINE_REFS.RERA], // Exclut le RER A
  },
  HIPPODROME_HUB: {
    stopAreaId: STOPS.HIPPODROME_VINCENNES.BUS_77[0],
    label: 'Bus - Arrêt Hippodrome',
  },
  ECOLE_DU_BREUIL_HUB: {
    stopAreaId: STOPS.ECOLE_DU_BREUIL.BUS_77[0],
    label: 'Bus - Arrêt École du Breuil',
  },
} as const;

// =====================================================
// 🌦️ Météo
// =====================================================
export const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";
export const WEATHER_PARAMS = {
  latitude: 48.827,
  longitude: 2.45,
  current_weather: "true",
  timezone: "Europe/Paris",
};

// =====================================================
// 📰 Actualités
// =====================================================
export const NEWS_FEED_URL = "https://www.lemonde.fr/rss/une.xml";
export const NEWS_FEED_BACKUP = "https://www.lemonde.fr/rss/une.xml";

// =====================================================
// 🚗 Trafic Paris
// =====================================================
export const PARIS_TRAFFIC_API_BASE_URL = "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/chantiers-perturbants/records";
export const PARIS_TRAFFIC_API_PARAMS = {
  where: 'geom within(circle(48.827, 2.45, 2000))',
  limit: '10'
};

// =====================================================
// 🏇 Courses hippiques (PMU)
// =====================================================
export const PMU_API_BASE_URL = "https://online.turfinfo.api.pmu.fr/rest/client/1/programme/";

// =====================================================
// 🚲 Vélib'
// =====================================================
export const VELIB_API_URL = "https://velib-metropole-opendata.smovengo.fr/opendata/Velib_Metropole/station_status.json";
export const VELIB_STATION_IDS = {
  VINCENNES: 12163,
  BREUIL: 12128,
} as const;

export const VELIB_STATION_NAMES: { [key: string]: string } = {
  [VELIB_STATION_IDS.VINCENNES]: "Hippodrome de Vincennes",
  [VELIB_STATION_IDS.BREUIL]: "École du Breuil / Pyramides",
} as const;

// =====================================================
// 🔁 Rafraîchissement (REFRESH_INTERVALS)
// =====================================================
export const REFRESH_INTERVALS = {
  TRANSPORT: 30000,
  TRAFFIC_ALERTS: 120000,
  TRAFFIC_INFO: 120000,
  WEATHER: 300000,
  VELIB: 60000,
  NEWS: 180000,
  PMU: 60000,
};

// =====================================================
// 🧩 Compatibilité rétro complète
// =====================================================
export const ITINERARY_CONSTANTS = {
  MAX_STOPS: 20,
  BUS_TIME_HIPPODROME_TO_JOINVILLE_MIN: 10,
  WALK_TIME_TO_JOINVILLE_MIN: 25,
  BUS_TIME_HIPPODROME_TO_GARE_DE_LYON_MIN: 40,
  TRANSFER_TIME_MIN: 5,
  RER_TIME_JOINVILLE_TO_GARE_DE_LYON_MIN: 10,
  VELIB_TIME_TO_GARE_DE_LYON_MIN: 35,
  RER_TIME_JOINVILLE_TO_CHATELET_MIN: 15,
  VELIB_TIME_TO_CHATELET_MIN: 45,
};