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

  const vincennesReunion = data?.programme.reunions.find(
    (r) => r.hippodrome.libelleCourt === 'VINCENNES'
  );

  const renderContent = () => {
    if (isLoading) return <p className="text-gray-400 text-sm">Chargement du programme...</p>;
    if (error) return <p className="text-red-400 text-sm">Erreur de chargement.</p>;
    if (!vincennesReunion || vincennesReunion.courses.length === 0) {
      return <p className="text-gray-400 text-sm">Aucune course à Vincennes.</p>;
    }

    const nowStr = `${currentTime.getHours().toString().padStart(2, '0')}h${currentTime.getMinutes().toString().padStart(2, '0')}`;
    const upcomingRaces = vincennesReunion.courses.filter(race => race.heureDepart >= nowStr);
    
    const nextRace = upcomingRaces[0];
    const otherUpcomingRaces = upcomingRaces.slice(1, 3); // show next 2

    if (!nextRace) return <p className="text-gray-400 text-center text-sm py-2">Courses terminées.</p>;

    return (
      <div className="flex flex-col h-full">
        <div className="flex-shrink-0 text-center p-2 bg-black/20 rounded-lg mb-2">
            <p className="text-xs font-bold uppercase tracking-widest text-sky-400">Prochaine Course</p>
            <div className="my-1">
                <Countdown targetTime={nextRace.heureDepart} />
            </div>
            <p className="font-bold text-base">{`C${nextRace.numOrdre} - ${nextRace.heureDepart}`}</p>
            <p className="text-gray-300 text-sm truncate" title={nextRace.libelle}>{nextRace.libelle}</p>
        </div>

        {otherUpcomingRaces.length > 0 && (
             <div className="flex-grow overflow-y-auto">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">À venir</h3>
                <div className="space-y-1">
                    {otherUpcomingRaces.map(race => (
                        <div key={race.numOrdre} className="grid grid-cols-[auto_1fr] items-center gap-2 p-1.5 rounded-md bg-black/20 text-xs">
                            <span className="font-bold tabular-nums text-white bg-white/10 px-1.5 py-0.5 rounded">
                                {race.heureDepart}
                            </span>
                            <span className="truncate text-gray-300" title={race.libelle}>
                                {`C${race.numOrdre} - ${race.libelle}`}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#1b263b]/60 p-3 rounded-lg shadow-lg backdrop-blur-sm border border-white/10 flex flex-col">
      <h2 className="text-lg font-bold mb-2 text-[#e0e1dd]">
        PMU — Vincennes
      </h2>
      <div className="flex-grow">{renderContent()}</div>
    </div>
  );
};