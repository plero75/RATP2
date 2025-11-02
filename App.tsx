import React from 'react';
import { Clock } from './components/Clock';
import { TransportWidget } from './components/TransportWidget';
import { WeatherWidget } from './components/WeatherWidget';
import { VelibWidget } from './components/VelibWidget';
import { PmuWidget } from './components/PmuWidget';
import { NewsTicker } from './components/NewsTicker';
import { ItineraryWidget } from './components/ItineraryWidget';
import { TrafficWidget } from './components/TrafficWidget';
import { TRANSPORT_CONFIG, VELIB_STATION_IDS } from './constants';
import { RerAIcon, BusIcon, NoctilienIcon } from './components/icons';

const App: React.FC = () => {
  return (
    <main
      className="bg-[#0d1b2a] text-white font-sans w-screen h-screen flex flex-col overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <header className="flex justify-between items-center p-2 md:p-4 border-b border-gray-700 flex-shrink-0">
        <h1 className="text-xl md:text-3xl font-bold tracking-tight text-[#e0e1dd]">
          Dashboard VHP — Paris-Vincennes
        </h1>
        <Clock />
      </header>

      <div className="flex-grow p-2 grid grid-cols-1 lg:grid-cols-2 gap-2 overflow-hidden">
        {/* Colonne 1: Infos Locales & Événements */}
        <div className="flex flex-col gap-2 overflow-y-auto">
          <TrafficWidget />
          <ItineraryWidget />
          <VelibWidget stationIds={Object.values(VELIB_STATION_IDS).map(String)} />
          <WeatherWidget />
          <PmuWidget />
        </div>
        
        {/* Colonne 2: Hub de Transports */}
        <div className="flex flex-col gap-2 overflow-y-auto p-2">
          {/* Section Gare de Joinville-le-Pont */}
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-sky-300 sticky top-0 bg-[#0d1b2a] py-1 z-10">
              Gare de Joinville-le-Pont
            </h2>
            <TransportWidget config={TRANSPORT_CONFIG.RER_A} icon={<RerAIcon />} />
            <TransportWidget config={TRANSPORT_CONFIG.JOINVILLE_HUB_GARE} icon={<BusIcon />} title="Bus - Arrêt Gare" />
            <TransportWidget config={TRANSPORT_CONFIG.JOINVILLE_HUB_GALLIENI} icon={<BusIcon />} title="Bus - Arrêt Av. Gallieni" />
          </div>

          {/* Section Hippodrome de Vincennes */}
          <div className="flex flex-col gap-2 mt-2">
             <h2 className="text-xl font-bold text-sky-300 sticky top-0 bg-[#0d1b2a] py-1 z-10">
              Hippodrome de Vincennes
            </h2>
            <TransportWidget config={TRANSPORT_CONFIG.HIPPODROME_HUB} icon={<BusIcon />} title="Arrêt de Bus" />
          </div>
          
          {/* Section École du Breuil */}
          <div className="flex flex-col gap-2 mt-2">
            <h2 className="text-xl font-bold text-sky-300 sticky top-0 bg-[#0d1b2a] py-1 z-10">
              École du Breuil
            </h2>
            <TransportWidget config={TRANSPORT_CONFIG.ECOLE_DU_BREUIL_HUB} icon={<BusIcon />} title="Arrêt de Bus" />
          </div>
        </div>
      </div>
      
      <footer className="flex-shrink-0">
        <NewsTicker />
      </footer>
    </main>
  );
};

export default App;