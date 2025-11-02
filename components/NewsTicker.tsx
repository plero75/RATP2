import React, { useState, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { fetchNews } from '../services/api';
import { REFRESH_INTERVALS } from '../constants';
import type { NewsItem } from '../types';

export const NewsTicker: React.FC = () => {
  const { data: news, error, isLoading } = useData(fetchNews, REFRESH_INTERVALS.NEWS);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  useEffect(() => {
    if (!news || news.length === 0) return;

    const interval = setInterval(() => {
      setCurrentItemIndex((prevIndex) => (prevIndex + 1) % news.length);
    }, 20000); // Change news every 20 seconds

    return () => clearInterval(interval);
  }, [news]);

  const renderTickerContent = () => {
    if (isLoading) return <span>Chargement des actualités...</span>;
    if (error || !news || news.length === 0) return <span className="text-red-400">Service d'actualités indisponible.</span>;

    const currentItem: NewsItem = news[currentItemIndex];

    return (
      <div className="animate-fade-in">
        <a href={currentItem.link} target="_blank" rel="noopener noreferrer">
          <span className="font-bold text-sky-300 mr-4">{currentItem.title}</span>
          <span className="text-gray-300 hidden md:inline">{currentItem.description}</span>
        </a>
      </div>
    );
  };

  return (
    <div className="bg-black/40 text-white text-sm md:text-base py-2 px-4 w-full overflow-hidden whitespace-nowrap border-t border-gray-700">
      <div className="relative h-6">
        <div
          key={currentItemIndex}
          className="absolute inset-0 flex items-center"
        >
          {renderTickerContent()}
        </div>
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
