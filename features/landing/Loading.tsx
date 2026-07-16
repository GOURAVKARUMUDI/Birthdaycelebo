"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Gift } from "lucide-react";
import { useAudio } from "@/hooks/useAudio";

interface LoadingProps {
  onComplete: () => void;
  recipientName: string;
}

export default function Loading({ onComplete, recipientName }: LoadingProps) {
  const { playSfx, playMusic } = useAudio();
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const duration = 2400; // 2.4 seconds loading
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep += 1;
      const nextProgress = Math.min(100, Math.floor((currentStep / steps) * 100));
      setProgress(nextProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setLoaded(true);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const handleStart = () => {
    playSfx("success");
    // Wake up background music!
    playMusic();
    onComplete();
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#FFFDF9] select-none overflow-hidden relative">
      
      {/* Floating decorative elements */}
      <div className="absolute top-[20%] left-[15%] text-pink text-3xl animate-float">🌸</div>
      <div className="absolute top-[30%] right-[20%] text-lavender text-4xl animate-float-delayed">✨</div>
      <div className="absolute bottom-[25%] left-[25%] text-sky text-2xl animate-float-delayed">⭐</div>
      <div className="absolute bottom-[20%] right-[15%] text-pink text-3xl animate-float">❤️</div>

      {/* Center Gift Box */}
      <motion.div
        animate={loaded ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : { y: [-5, 5, -5] }}
        transition={loaded ? { duration: 0.5 } : { repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        className="w-24 h-24 rounded-full bg-pink/20 flex items-center justify-center mb-6 shadow-inner"
      >
        <Gift className="text-purple w-12 h-12" />
      </motion.div>

      {/* Recipient Greetings */}
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl md:text-2xl font-patrick font-semibold text-gray-700 text-center px-4"
      >
        Preparing something special for {recipientName}...
      </motion.h2>

      {/* Progress percentage or button */}
      <div className="mt-8 flex flex-col items-center w-full max-w-[240px]">
        {loaded ? (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="px-6 py-2.5 bg-purple text-white font-bold rounded-full shadow-md hover:bg-purple/90 transition-all font-nunito flex items-center gap-2 select-none"
          >
            <Sparkles size={16} /> Enter Experience
          </motion.button>
        ) : (
          <>
            {/* Custom progress loading bar */}
            <div className="w-full h-2 bg-pink/20 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-purple rounded-full transition-all duration-70"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-nunito text-xs text-gray-400 font-bold">
              {progress}% Loaded
            </span>
          </>
        )}
      </div>
    </div>
  );
}
