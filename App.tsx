import React, { useRef } from 'react';
import { Clock } from './components/Clock';
import { HeaderBar } from './components/HeaderBar';
import { TransportWidget } from './components/TransportWidget';
import { WeatherWidget } from './components/WeatherWidget';
import { VelibWidget } from './components/VelibWidget';
import { PmuWidget } from './components/PmuWidget';
import { NewsTicker } from './components/NewsTicker';
import { ItineraryWidget } from './components/ItineraryWidget';
import { TrafficWidget } from './components/TrafficWidget';
import { TRANSPORT_CONFIG, VELIB_STATION_IDS } from './constants';
import { RerAIcon, BusIcon } from './components/icons';
import { useViewportScale } from './hooks/useViewportScale';

const App: React.FC = () => {
  const scale = useViewportScale(1400, 900);

  return (
    <main
      className="bg-[#0d1b2a] text-white font-sans w-screen h-screen flex items-start justify-center overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div
        className="flex flex-col w-full h-full max-w-[1400px]"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: `${100 / scale}%`,
          height: `${100 / scale}%`,
        }}
      >
        <header className="flex justify-between items-center p-2 md:p-3 border-b border-gray-700 flex-shrink-0 gap-2">
          <h1 className="text-lg md:text-2xl font-bold tracking-tight text-[#e0e1dd] leading-tight">
            Dashboard VHP — Paris-Vincennes
          </h1>
          <Clock />
        </header>

        <div className="flex-grow p-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 overflow-hidden min-h-0">
          {/* Colonne 1: Infos Locales & Événements */}
          <div className="flex flex-col gap-2 min-h-0">
            <TrafficWidget />
            <ItineraryWidget />
            <VelibWidget stationIds={Object.values(VELIB_STATION_IDS).map(String)} />
            <WeatherWidget />
            <PmuWidget />
          </div>
        
          {/* Colonne 2: Hub de Transports */}
          <div className="flex flex-col gap-2 p-1 min-h-0 overflow-y-auto">
            {/* Section Gare de Joinville-le-Pont */}
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-bold text-sky-300 bg-[#0d1b2a] py-1">Gare de Joinville-le-Pont</h2>
              <TransportWidget config={TRANSPORT_CONFIG.RER_A} icon={<RerAIcon />} />
              <TransportWidget
                config={TRANSPORT_CONFIG.JOINVILLE_HUB_GARE}
                icon={<BusIcon />}
                title="Bus - Arrêt Gare"
              />
              <TransportWidget
                config={TRANSPORT_CONFIG.JOINVILLE_HUB_GALLIENI}
                icon={<BusIcon />}
                title="Bus - Arrêt Av. Gallieni"
              />
            </div>

            {/* Section Hippodrome de Vincennes */}
            <div className="flex flex-col gap-2 mt-2">
              <h2 className="text-lg font-bold text-sky-300 bg-[#0d1b2a] py-1">Hippodrome de Vincennes</h2>
              <TransportWidget config={TRANSPORT_CONFIG.HIPPODROME_HUB} icon={<BusIcon />} title="Arrêt de Bus" />
            </div>

            {/* Section École du Breuil */}
            <div className="flex flex-col gap-2 mt-2">
              <h2 className="text-lg font-bold text-sky-300 bg-[#0d1b2a] py-1">École du Breuil</h2>
              <TransportWidget config={TRANSPORT_CONFIG.ECOLE_DU_BREUIL_HUB} icon={<BusIcon />} title="Arrêt de Bus" />
            </div>
          </div>

          {/* Colonne 3: NewsTicker (visible uniquement sur xl) */}
          <div className="hidden xl:flex flex-col gap-2 min-h-0">
            <NewsTicker />
          </div>
        </div>

        <footer className="flex-shrink-0 xl:hidden">
          <NewsTicker />
        </footer>
      </div>
    </main>
  );
};

export default App;