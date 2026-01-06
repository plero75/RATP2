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
