import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

export const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="text-2xl font-semibold text-[#e0e1dd] tabular-nums">
      {format(time, 'HH:mm:ss')}
    </div>
  );
};
