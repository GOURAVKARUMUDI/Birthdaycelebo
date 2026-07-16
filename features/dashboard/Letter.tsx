"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Bookmark } from "lucide-react";
import { useAudio } from "@/hooks/useAudio";

interface LetterProps {
  content: string;
}

export default function Letter({ content }: LetterProps) {
  const { playSfx } = useAudio();
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const textIndex = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTyping = () => {
    if (isTyping) return;
    setIsTyping(true);
  };

  const pauseTyping = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTyping(false);
  };

  const resetTyping = () => {
    pauseTyping();
    setDisplayedText("");
    textIndex.current = 0;
  };

  useEffect(() => {
    if (isTyping) {
      timerRef.current = setInterval(() => {
        if (textIndex.current < content.length) {
          const nextChar = content.charAt(textIndex.current);
          setDisplayedText((prev) => prev + nextChar);
          textIndex.current += 1;
          
          // Play tick sound for characters (skip spaces to sound natural)
          if (nextChar !== " " && nextChar !== "\n" && Math.random() > 0.3) {
            playSfx("hover"); // A soft pitch tick
          }
        } else {
          pauseTyping();
        }
      }, 50); // Type speed
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTyping, content]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="relative rounded-2xl shadow-xl border border-pink/30 overflow-hidden bg-[#FFFDF9] glass-panel p-6 md:p-10 min-h-[500px] flex flex-col justify-between">
        
        {/* Bookmark ribbon */}
        <div 
          onClick={() => {
            playSfx("success");
            setIsBookmarked(!isBookmarked);
          }}
          className={`absolute top-0 right-8 w-8 h-12 cursor-pointer transition-transform duration-300 z-10 origin-top flex justify-center items-end pb-2 ${
            isBookmarked ? "bg-purple text-white translate-y-0" : "bg-pink/30 text-pink hover:translate-y-1"
          }`}
        >
          <Bookmark size={16} fill={isBookmarked ? "#FFFFFF" : "none"} />
        </div>

        {/* Lined notebook paper writing area */}
        <div className="flex-1 notebook-paper p-4 pl-10 pr-6 mt-4 relative">
          {/* Vertical margins red line */}
          <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-red-400 opacity-40" />
          
          <div className="font-caveat text-2xl md:text-3xl text-gray-800 font-bold whitespace-pre-wrap leading-7 min-h-[350px]">
            {displayedText}
            {isTyping && (
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-1.5 h-6 bg-purple ml-0.5 align-middle"
              />
            )}
            {!isTyping && displayedText.length === 0 && (
              <span className="text-gray-400 italic font-sans text-base block mt-2">
                Click Play below to begin reading your letter...
              </span>
            )}
          </div>
        </div>

        {/* Control bar */}
        <div className="mt-8 pt-4 border-t border-pink/20 flex justify-between items-center select-none">
          <div className="flex gap-3">
            {isTyping ? (
              <button
                onClick={pauseTyping}
                className="w-12 h-12 rounded-full bg-pink hover:bg-pink/80 text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
              >
                <Pause size={20} />
              </button>
            ) : (
              <button
                onClick={startTyping}
                className="w-12 h-12 rounded-full bg-purple hover:bg-purple/90 text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
              >
                <Play size={20} className="ml-1" />
              </button>
            )}

            <button
              onClick={() => {
                playSfx("click");
                resetTyping();
              }}
              className="w-12 h-12 rounded-full bg-white border border-pink/30 text-gray-600 flex items-center justify-center shadow-md hover:bg-pink/10 active:scale-95 transition-all"
            >
              <RotateCcw size={18} />
            </button>
          </div>

          <span className="font-nunito text-xs text-gray-500 font-bold">
            {displayedText.length === content.length
              ? "Read Complete ❤️"
              : `${Math.round((displayedText.length / content.length) * 100)}% typed`}
          </span>
        </div>
      </div>
    </div>
  );
}
