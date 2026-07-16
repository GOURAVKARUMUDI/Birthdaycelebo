"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAudio } from "@/hooks/useAudio";

interface EnvelopeProps {
  onOpenComplete: () => void;
  recipientName: string;
}

export default function Envelope({ onOpenComplete, recipientName }: EnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBroken, setIsBroken] = useState(false);
  const { playSfx } = useAudio();

  const handleOpen = () => {
    if (isOpen) return;
    
    // Play envelope tear/swoosh SFX
    playSfx("envelope");
    setIsBroken(true);
    
    setTimeout(() => {
      setIsOpen(true);
      
      // Delay transitioning to welcome screen until slide out is complete
      setTimeout(() => {
        onOpenComplete();
      }, 2000);
    }, 600);
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#FFFDF9] px-4 overflow-hidden">
      {/* Decorative text */}
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 font-patrick text-2xl md:text-3xl text-purple/80 text-center animate-pulse-slow"
      >
        You've received a special letter. Click to open it!
      </motion.p>

      {/* 3D Envelope Wrapper */}
      <div className="relative w-[320px] h-[220px] md:w-[400px] md:h-[260px] perspective-1000 cursor-pointer" onClick={handleOpen}>
        
        {/* The Letter Card inside */}
        <motion.div
          initial={{ y: 0, scale: 0.95 }}
          animate={isOpen ? { y: "-100%", scale: 1.05, zIndex: 30 } : { y: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut", delay: 0.6 }}
          className="absolute inset-x-4 top-4 bottom-4 bg-white rounded-xl shadow-lg border border-pink/30 flex flex-col items-center justify-center p-6 z-10"
        >
          <p className="font-caveat text-3xl md:text-4xl text-purple font-bold mb-2">Hello, {recipientName}!</p>
          <div className="w-12 h-1 bg-pink/50 rounded-full mb-3" />
          <p className="font-patrick text-lg text-gray-600 text-center">
            A digital gift, custom made for you.
          </p>
        </motion.div>

        {/* Envelope Body back */}
        <div className="absolute inset-0 bg-pink/20 rounded-xl border border-pink/30 shadow-md z-0" />

        {/* Left and Right triangular flaps (simulated with CSS clip-paths) */}
        <div 
          className="absolute inset-0 bg-[#FADADD] rounded-xl border border-pink/40 z-20"
          style={{
            clipPath: "polygon(0% 100%, 50% 50%, 0% 0%)"
          }}
        />
        <div 
          className="absolute inset-0 bg-[#FCD5D9] rounded-xl border border-pink/40 z-20"
          style={{
            clipPath: "polygon(100% 100%, 50% 50%, 100% 0%)"
          }}
        />

        {/* Bottom Fold */}
        <div 
          className="absolute inset-0 bg-[#FBC5CC] rounded-xl border border-pink/50 shadow-inner z-20"
          style={{
            clipPath: "polygon(0% 100%, 50% 50%, 100% 100%)"
          }}
        />

        {/* Top flap (folding open 180 deg) */}
        <motion.div
          initial={{ rotateX: 0 }}
          animate={isOpen ? { rotateX: 180 } : { rotateX: 0 }}
          transition={{ duration: 0.8, ease: "easeIn" }}
          style={{ 
            originY: "top",
            clipPath: "polygon(0% 0%, 50% 50%, 100% 0%)"
          }}
          className="absolute inset-0 bg-[#F8B3BD] rounded-t-xl border-t border-pink/40 shadow-sm z-25"
        />

        {/* Wax Seal - Heart shaped */}
        {!isOpen && (
          <motion.div
            animate={isBroken ? { scale: [1, 1.4, 0], rotate: [0, 45, 90] } : { scale: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-purple hover:bg-purple/90 border border-purple/30 rounded-full flex items-center justify-center shadow-md z-28"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#FFFDF9">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
        )}
      </div>

      {/* Ribbon decor underneath envelope */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 flex gap-2"
      >
        <span className="w-2.5 h-2.5 bg-pink rounded-full animate-bounce" />
        <span className="w-2.5 h-2.5 bg-lavender rounded-full animate-bounce [animation-delay:0.2s]" />
        <span className="w-2.5 h-2.5 bg-sky rounded-full animate-bounce [animation-delay:0.4s]" />
      </motion.div>
    </div>
  );
}
