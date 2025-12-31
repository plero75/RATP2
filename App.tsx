import React from 'react';
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
        <HeaderBar />

        <div className="flex-grow p-3 grid grid-cols-1 xl:grid-cols-[1.1fr_1.4fr_1fr] gap-3 overflow-hidden min-h-0">
          {/* Colonne 1: Infos locales */}
          <div className="flex flex-col gap-3 min-h-0">
            <TrafficWidget />
            <WeatherWidget />
            <ItineraryWidget />
            <VelibWidget stationIds={Object.values(VELIB_STATION_IDS).map(String)} />
            <PmuWidget />
          </div>

          {/* Colonne 2: Transports */}
          <div className="flex flex-col gap-3 min-h-0">
            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-bold text-sky-300">Gare de Joinville-le-Pont</h2>
              <TransportWidget config={TRANSPORT_CONFIG.RER_A} icon={<RerAIcon />} />
              <TransportWidget config={TRANSPORT_CONFIG.JOINVILLE_HUB_GARE} icon={<BusIcon />} />
              <TransportWidget config={TRANSPORT_CONFIG.JOINVILLE_HUB_GALLIENI} icon={<BusIcon />} />
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-bold text-sky-300">Hippodrome de Vincennes</h2>
              <TransportWidget config={TRANSPORT_CONFIG.HIPPODROME_HUB} icon={<BusIcon />} />
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-bold text-sky-300">École du Breuil</h2>
              <TransportWidget config={TRANSPORT_CONFIG.ECOLE_DU_BREUIL_HUB} icon={<BusIcon />} />
            </section>
          </div>

          {/* Colonne 3: Actualités */}
          <div className="hidden xl:flex flex-col gap-3 min-h-0">
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
