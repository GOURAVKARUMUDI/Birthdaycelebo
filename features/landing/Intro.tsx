"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Mascot from "@/components/Mascot";
import { useAudio } from "@/hooks/useAudio";
import confetti from "canvas-confetti";

interface IntroProps {
  onComplete: () => void;
  recipientName: string;
}

export default function Intro({ onComplete, recipientName }: IntroProps) {
  const { playSfx } = useAudio();

  useEffect(() => {
    // Continuous birthday confetti bursts
    const end = Date.now() + 1500;
    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: {
          x: Math.random(),
          y: Math.random() - 0.2
        },
        colors: ["#FADADD", "#E8DEF8", "#E0F2FE", "#FFF9E6"]
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const handleProceed = () => {
    playSfx("success");
    onComplete();
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-b from-[#FFFDF9] to-[#FADADD]/40 px-4 select-none overflow-hidden relative">
      
      {/* Floating Balloons decoration */}
      <div className="absolute top-[10%] left-[10%] text-5xl animate-bounce-slow">🎈</div>
      <div className="absolute top-[15%] right-[10%] text-5xl animate-bounce-slow [animation-delay:0.5s]">🎈</div>
      <div className="absolute bottom-[20%] left-[8%] text-5xl animate-bounce-slow [animation-delay:1.2s]">🎈</div>
      <div className="absolute bottom-[25%] right-[8%] text-5xl animate-bounce-slow [animation-delay:0.8s]">🎈</div>

      {/* Confetti streams */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -50, x: Math.random() * 400 - 200, opacity: 1 }}
            animate={{ y: 800, opacity: 0, rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3 + Math.random() * 3, ease: "linear", delay: Math.random() * 2 }}
            style={{ left: `${Math.random() * 100}%` }}
            className={`absolute w-3 h-3 rounded-full ${
              i % 4 === 0 ? "bg-pink" : i % 4 === 1 ? "bg-lavender" : i % 4 === 2 ? "bg-sky" : "bg-yellow"
            }`}
          />
        ))}
      </div>

      {/* Mascot holding flowers */}
      <motion.div 
        initial={{ y: 50, scale: 0.8, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="mb-6 z-10"
      >
        <Mascot state="hold_flowers" size={240} />
      </motion.div>

      {/* Happy Birthday typography */}
      <div className="text-center z-10 max-w-lg">
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="font-poppins text-4xl md:text-6xl font-extrabold text-gray-800 tracking-tight leading-tight mb-2 drop-shadow-sm"
        >
          Happy Birthday, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple via-pink to-sky font-bold block mt-1">
            {recipientName}! 🎂
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="font-patrick text-xl md:text-2xl text-gray-500 mb-8"
        >
          Your special digital scrapbook is waiting for you...
        </motion.p>

        {/* Enter Dashboard Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleProceed}
          className="px-8 py-3 bg-purple text-white text-lg font-bold rounded-full shadow-lg hover:bg-purple/90 transition-all font-nunito"
        >
          Open Scrapbook 🎁
        </motion.button>
      </div>
    </div>
  );
}
