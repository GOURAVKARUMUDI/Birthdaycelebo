"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CountdownProps {
  targetDate: string;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference <= 0) {
        setIsCompleted(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const timeItems = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      {isCompleted ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center font-caveat text-4xl text-purple font-bold tracking-wide animate-pulse"
        >
          🎉 The Big Day Is Here! 🎉
        </motion.div>
      ) : (
        <div className="flex gap-3 md:gap-4 justify-center items-center">
          {timeItems.map((item, index) => (
            <React.Fragment key={item.label}>
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                {/* Number Card */}
                <div className="w-16 h-18 md:w-20 md:h-22 rounded-2xl glass-card border border-pink/40 flex items-center justify-center shadow-md relative overflow-hidden bg-white/70">
                  {/* Decorative horizontal line dividing the card */}
                  <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-pink/20" />
                  
                  <span className="font-poppins text-2xl md:text-3xl font-bold text-purple drop-shadow-sm">
                    {String(item.value).padStart(2, "0")}
                  </span>
                </div>
                
                {/* Label */}
                <span className="mt-2 font-nunito text-xs uppercase tracking-widest text-gray-500 font-semibold">
                  {item.label}
                </span>
              </motion.div>

              {index < timeItems.length - 1 && (
                <span className="font-poppins text-2xl font-bold text-pink/80 mb-6">:</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
