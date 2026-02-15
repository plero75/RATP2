import React, { useState, useEffect, useCallback } from 'react';
import { useData } from '../hooks/useData';
import { fetchPmuProgramme } from '../services/api';
import { REFRESH_INTERVALS } from '../constants';

const Countdown: React.FC<{ targetTime: string }> = ({ targetTime }) => {
    const calculateRemaining = useCallback(() => {
        const [hours, minutes] = targetTime.split('h').map(Number);
        const targetDate = new Date();
        targetDate.setHours(hours, minutes, 0, 0);

        const diff = targetDate.getTime() - new Date().getTime();
        
        if (diff <= 0) return { minutes: 0, seconds: 0 };

        return {
            minutes: Math.floor(diff / (1000 * 60)),
            seconds: Math.floor((diff / 1000) % 60),
        };
    }, [targetTime]);

    const [remaining, setRemaining] = useState(calculateRemaining);

    useEffect(() => {
        const timer = setInterval(() => {
            setRemaining(calculateRemaining());
        }, 1000);
        return () => clearInterval(timer);
    }, [calculateRemaining]);
    
    return (
        <span className="text-4xl font-bold text-sky-300 tabular-nums">
            {remaining.minutes.toString().padStart(2, '0')}:{remaining.seconds.toString().padStart(2, '0')}
        </span>
    );
};


export const PmuWidget: React.FC = () => {
  const { data, error, isLoading } = useData(fetchPmuProgramme, REFRESH_INTERVALS.PMU);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Recherche de la réunion à Vincennes
  const vincennesReunion = data?.programme?.reunions?.find(
    (r) => r.hippodrome?.libelleCourt?.toUpperCase() === 'VINCENNES'
  );

  // Fonction pour trouver la prochaine course
  const findNextRace = useCallback(() => {
    if (!vincennesReunion || !vincennesReunion.courses || vincennesReunion.courses.length === 0) {
      return null;
    }

    const now = currentTime;
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHours * 60 + currentMinutes;

    // Filtrer et trier les courses à venir
    const upcomingRaces = vincennesReunion.courses
      .filter(race => {
        if (!race.heureDepart) return false;
        
        // Parser l'heure de départ (format "14h30")
        const [hours, minutes] = race.heureDepart.split('h').map(Number);
        const raceTimeInMinutes = hours * 60 + minutes;
        
        // Retourner true si la course est dans le futur
        return raceTimeInMinutes > currentTimeInMinutes;
      })
      .sort((a, b) => {
        // Trier par heure de départ croissante
        const [aHours, aMinutes] = a.heureDepart.split('h').map(Number);
        const [bHours, bMinutes] = b.heureDepart.split('h').map(Number);
        const aTime = aHours * 60 + aMinutes;
        const bTime = bHours * 60 + bMinutes;
        return aTime - bTime;
      });

    return upcomingRaces;
  }, [vincennesReunion, currentTime]);

  const renderContent = () => {
    if (isLoading) return <p className="text-gray-400 text-sm">Chargement du programme...</p>;
    if (error) return <p className="text-red-400 text-sm">Erreur de chargement.</p>;
    if (!vincennesReunion || vincennesReunion.courses.length === 0) {
      return <p className="text-gray-400 text-sm">Aucune course à Vincennes aujourd'hui.</p>;
    }

    const upcomingRaces = findNextRace();
    
    if (!upcomingRaces || upcomingRaces.length === 0) {
      return (
        <p className="text-gray-400 text-center text-sm py-2">
          Toutes les courses du jour sont terminées.
        </p>
      );
    }

    const nextRace = upcomingRaces[0];
    const otherUpcomingRaces = upcomingRaces.slice(1, 4); // Afficher les 3 suivantes

    return (
      <div className="flex flex-col h-full">
        {/* Prochaine course - mise en valeur */}
        <div className="flex-shrink-0 text-center p-3 bg-gradient-to-br from-sky-900/40 to-blue-900/30 rounded-lg mb-3 border border-sky-500/20">
            <p className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-1">
              Prochaine Course
            </p>
            <div className="my-2">
                <Countdown targetTime={nextRace.heureDepart} />
            </div>
            <p className="font-bold text-lg text-white">
              {`Course ${nextRace.numOrdre} — ${nextRace.heureDepart}`}
            </p>
            <p className="text-gray-200 text-sm mt-1 px-2 truncate" title={nextRace.libelle}>
              {nextRace.libelle}
            </p>
            {nextRace.distance && (
              <p className="text-xs text-gray-400 mt-1">
                {nextRace.distance}m
              </p>
            )}
        </div>

        {/* Courses suivantes */}
        {otherUpcomingRaces.length > 0 && (
             <div className="flex-grow overflow-y-auto">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 px-1">
                  Courses à venir
                </h3>
                <div className="space-y-1.5">
                    {otherUpcomingRaces.map(race => (
                        <div 
                          key={race.numOrdre} 
                          className="grid grid-cols-[auto_1fr] items-center gap-2 p-2 rounded-md bg-black/20 text-xs hover:bg-black/30 transition-colors"
                        >
                            <span className="font-bold tabular-nums text-white bg-sky-600/30 px-2 py-1 rounded">
                                {race.heureDepart}
                            </span>
                            <span className="truncate text-gray-300" title={race.libelle}>
                                {`C${race.numOrdre} — ${race.libelle}`}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Nombre total de courses restantes */}
        {upcomingRaces.length > 4 && (
          <div className="flex-shrink-0 text-center mt-2 pt-2 border-t border-white/10">
            <p className="text-xs text-gray-400">
              + {upcomingRaces.length - 4} autre{upcomingRaces.length - 4 > 1 ? 's' : ''} course{upcomingRaces.length - 4 > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#1b263b]/60 p-3 rounded-lg shadow-lg backdrop-blur-sm border border-white/10 flex flex-col h-full">
      <h2 className="text-lg font-bold mb-2 text-[#e0e1dd] flex items-center gap-2">
        <span className="text-2xl">🏇</span>
        PMU — Vincennes
      </h2>
      <div className="flex-grow overflow-hidden">{renderContent()}</div>
    </div>
  );
};