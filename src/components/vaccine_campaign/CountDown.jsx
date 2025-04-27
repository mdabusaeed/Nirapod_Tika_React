import React, { useState, useEffect } from 'react';

const CountDown = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!endDate) return;

    const target = new Date(endDate).getTime();
    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <div className="flex justify-center gap-2 text-sm font-medium text-gray-800">
      {timeLeft ? (
        <>
          <span className="px-3 py-2 bg-yellow-100 rounded-md">{timeLeft.days}d</span>
          <span className="px-3 py-2 bg-yellow-100 rounded-md">{timeLeft.hours}h</span>
          <span className="px-3 py-2 bg-yellow-100 rounded-md">{timeLeft.minutes}m</span>
          <span className="px-3 py-2 bg-yellow-100 rounded-md">{timeLeft.seconds}s</span>
        </>
      ) : (
        <span className="text-gray-200 text-sm">Campaign Ended</span>
      )}
    </div>
  );
};

export default CountDown;