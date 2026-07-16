"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Mascot, { MascotState } from "@/components/Mascot";
import { useAudio } from "@/hooks/useAudio";
import confetti from "canvas-confetti";

interface WelcomeProps {
  onYes: () => void;
  recipientName: string;
}

export default function Welcome({ onYes, recipientName }: WelcomeProps) {
  const { playSfx } = useAudio();
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [dialogue, setDialogue] = useState(`Hey ${recipientName}! I made something special for you. Do you want to see it?`);
  
  // Custom positions for the jumping "No" button
  const [noBtnPosition, setNoBtnPosition] = useState({ x: 0, y: 0 });
  const [noCount, setNoCount] = useState(0);

  const handleNoHover = () => {
    playSfx("hover");
    setMascotState("cry");
    
    // Jump button around randomly
    const randomX = (Math.random() - 0.5) * 240;
    const randomY = (Math.random() - 0.5) * 160;
    setNoBtnPosition({ x: randomX, y: randomY });

    const sadDialogues = [
      "Oh... are you sure? I spent weeks coding this for you... 🥺",
      "But... there are fun mini-games inside! Please? 👉👈",
      "Mascot is sad now... look at its tears! 😭",
      "Fine, but please press YES! ❤️"
    ];
    setDialogue(sadDialogues[Math.min(noCount, sadDialogues.length - 1)]);
    setNoCount((c) => c + 1);
  };

  const handleYes = () => {
    setMascotState("celebrate");
    playSfx("success");
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      onYes();
    }, 1800);
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#FFFDF9] px-4 select-none overflow-hidden relative">
      
      {/* Animated Mascot */}
      <div className="mb-4">
        <Mascot state={mascotState} size={220} />
      </div>

      {/* Bubble Dialogue Box */}
      <motion.div
        key={dialogue}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-pink/30 p-5 rounded-3xl shadow-md text-center font-patrick text-xl md:text-2xl text-gray-700 relative mb-8"
      >
        {/* Triangle arrow for bubble dialog */}
        <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-white" />
        {dialogue}
      </motion.div>

      {/* Buttons */}
      <div className="flex gap-6 items-center relative min-h-[60px] w-full max-w-sm justify-center">
        {/* YES BUTTON */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleYes}
          className="px-8 py-3 bg-purple text-white text-lg font-bold rounded-full shadow-md hover:bg-purple/90 transition-all font-nunito min-w-[120px]"
        >
          YES! 🎉
        </motion.button>

        {/* NO BUTTON (Jumping element) */}
        <motion.button
          animate={{ x: noBtnPosition.x, y: noBtnPosition.y }}
          onMouseEnter={handleNoHover}
          onClick={handleNoHover}
          className="px-8 py-3 bg-white border border-pink/30 text-gray-500 text-lg font-bold rounded-full shadow-sm hover:text-red-400 font-nunito min-w-[120px] transition-all absolute z-30"
          style={{ transition: "all 0.1s ease-out" }}
        >
          No 😢
        </motion.button>
      </div>
    </div>
  );
}
