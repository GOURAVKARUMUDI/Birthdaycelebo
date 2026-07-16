"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, Trophy, Heart } from "lucide-react";
import { useAudio } from "@/hooks/useAudio";
import confetti from "canvas-confetti";

export default function Games() {
  const { playSfx } = useAudio();
  const [activeGame, setActiveGame] = useState<"scratch" | "match" | "wheel" | "hunt">("scratch");
  const [score, setScore] = useState(0);

  const handleWin = (rewardText: string) => {
    playSfx("success");
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#FADADD", "#E8DEF8", "#E0F2FE", "#FFF9E6"],
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 select-none">
      <div className="rounded-3xl shadow-xl border border-pink/30 bg-[#FFFDF9] glass-panel p-6 flex flex-col items-center">
        
        {/* Game Selector Header */}
        <h2 className="font-caveat text-4xl text-purple font-bold mb-4 flex items-center gap-2">
          <Trophy size={28} className="text-yellow fill-yellow animate-bounce" /> Play & Win Rewards!
        </h2>

        {/* Tab Selection */}
        <div className="flex gap-1.5 bg-pink/20 rounded-full p-1 w-full overflow-x-auto no-scrollbar mb-6">
          {(["scratch", "match", "wheel", "hunt"] as const).map((game) => (
            <button
              key={game}
              onClick={() => {
                playSfx("click");
                setActiveGame(game);
              }}
              className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold whitespace-nowrap capitalize transition-all ${
                activeGame === game
                  ? "bg-purple text-white shadow-sm"
                  : "text-gray-500 hover:text-purple"
              }`}
            >
              {game === "scratch" ? "Scratch Card" : game === "match" ? "Memory Match" : game === "wheel" ? "Spin Wheel" : "Find Hearts"}
            </button>
          ))}
        </div>

        {/* GAME CONTENT CONTAINER */}
        <div className="w-full min-h-[340px] flex items-center justify-center bg-white/50 border border-pink/20 rounded-2xl p-4">
          <AnimatePresence mode="wait">
            {activeGame === "scratch" && <ScratchCardGame key="scratch" onWin={handleWin} />}
            {activeGame === "match" && <MemoryMatchGame key="match" onWin={handleWin} />}
            {activeGame === "wheel" && <SpinWheelGame key="wheel" onWin={handleWin} />}
            {activeGame === "hunt" && <HiddenHeartsGame key="hunt" onWin={handleWin} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   1. SCRATCH CARD GAME
   ========================================== */
function ScratchCardGame({ onWin }: { onWin: (reward: string) => void }) {
  const { playSfx } = useAudio();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const isScratching = useRef(false);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fill with cute metallic golden glitter
    ctx.fillStyle = "#E8DEF8"; // Lavender base
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw gold glitter dust
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = i % 2 === 0 ? "#FADADD" : "#FFF9E6";
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        2 + Math.random() * 3,
        2 + Math.random() * 3
      );
    }

    ctx.font = "bold 20px sans-serif";
    ctx.fillStyle = "#8E729B";
    ctx.textAlign = "center";
    ctx.fillText("Scratch to Reveal 🍀", canvas.width / 2, canvas.height / 2 + 5);
    setIsUnlocked(false);
  };

  useEffect(() => {
    initCanvas();
  }, []);

  const getCoordinates = (e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX = 0;
    let clientY = 0;
    
    if (window.TouchEvent && e instanceof TouchEvent) {
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
    } else if (e instanceof MouseEvent) {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handleStart = () => {
    isScratching.current = true;
  };

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isScratching.current || isUnlocked) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e.nativeEvent);
    
    // Erase canvas at coordinate
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();

    // Trigger soft slide sound
    if (Math.random() > 0.8) {
      playSfx("hover");
    }

    checkScratchPercentage();
  };

  const handleEnd = () => {
    isScratching.current = false;
  };

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let clearedCount = 0;

    // Check alpha channels
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) clearedCount++;
    }

    const percentage = clearedCount / (pixels.length / 4);
    if (percentage > 0.5) {
      setIsUnlocked(true);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onWin("Voucher");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[280px] h-[160px] bg-purple/10 border border-pink/30 rounded-xl shadow-inner flex items-center justify-center p-4">
        
        {/* Hidden Content Beneath */}
        <div className="text-center font-patrick text-2xl text-gray-800 font-bold z-0">
          🎉 Double Bubble Tea date on me! 🥤✨
        </div>

        {/* Scratch Canvas Cover */}
        {!isUnlocked && (
          <canvas
            ref={canvasRef}
            width={280}
            height={160}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
            className="absolute inset-0 w-full h-full rounded-xl cursor-crosshair z-10"
          />
        )}
      </div>

      <button
        onClick={initCanvas}
        className="mt-4 flex gap-1 items-center px-3 py-1.5 bg-white border border-pink/30 text-xs font-bold rounded-lg text-gray-600 hover:bg-pink/10 transition-colors"
      >
        <RefreshCw size={12} /> Reset Card
      </button>
    </div>
  );
}

/* ==========================================
   2. MEMORY MATCH GAME
   ========================================== */
interface MatchCard {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARDS_ICONS = ["🧁", "🧸", "🍿", "🥑", "🏝", "🎸"];

function MemoryMatchGame({ onWin }: { onWin: (reward: string) => void }) {
  const { playSfx } = useAudio();
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  const setupMatchGame = () => {
    const doubled = [...CARDS_ICONS, ...CARDS_ICONS]
      .map((icon, idx) => ({
        id: idx,
        icon,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);
    setCards(doubled);
    setSelectedCards([]);
  };

  useEffect(() => {
    setupMatchGame();
  }, []);

  const handleCardClick = (id: number) => {
    if (selectedCards.length >= 2) return;
    const cardIdx = cards.findIndex((c) => c.id === id);
    if (cards[cardIdx].isFlipped || cards[cardIdx].isMatched) return;

    playSfx("hover");
    
    // Flip selected card
    const updated = [...cards];
    updated[cardIdx].isFlipped = true;
    setCards(updated);

    const newSelected = [...selectedCards, cardIdx];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const [firstIdx, secondIdx] = newSelected;
      if (cards[firstIdx].icon === cards[secondIdx].icon) {
        // Matched!
        setTimeout(() => {
          playSfx("click");
          const matchedState = [...cards];
          matchedState[firstIdx].isMatched = true;
          matchedState[secondIdx].isMatched = true;
          setCards(matchedState);
          setSelectedCards([]);
          
          if (matchedState.every((c) => c.isMatched)) {
            onWin("Memory Card Match completed");
          }
        }, 500);
      } else {
        // Failed match, flip back
        setTimeout(() => {
          const resetState = [...cards];
          resetState[firstIdx].isFlipped = false;
          resetState[secondIdx].isFlipped = false;
          setCards(resetState);
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="grid grid-cols-4 gap-2 w-full max-w-[280px]">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`w-14 h-14 rounded-xl border border-pink/20 flex items-center justify-center cursor-pointer shadow-sm relative transition-all duration-300 transform preserve-3d ${
              card.isFlipped || card.isMatched ? "rotate-y-180 bg-white" : "bg-pink/40"
            }`}
          >
            {card.isFlipped || card.isMatched ? (
              <span className="text-2xl">{card.icon}</span>
            ) : (
              <Heart size={18} fill="#FADADD" className="text-white" />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={setupMatchGame}
        className="mt-4 flex gap-1 items-center px-3 py-1.5 bg-white border border-pink/30 text-xs font-bold rounded-lg text-gray-600 hover:bg-pink/10 transition-colors"
      >
        <RefreshCw size={12} /> Restart Game
      </button>
    </div>
  );
}

/* ==========================================
   3. SPIN WHEEL GAME
   ========================================== */
const WHEEL_SECTIONS = [
  "Hug 🫂",
  "Movie Ticket 🍿",
  "Bubble Tea 🧋",
  "Compliment 💖",
  "Choco Cake 🎂",
  "Late Sleep 🛌",
];

function SpinWheelGame({ onWin }: { onWin: (reward: string) => void }) {
  const { playSfx } = useAudio();
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prize, setPrize] = useState("");

  const spin = () => {
    if (isSpinning) return;
    
    playSfx("click");
    setIsSpinning(true);
    setPrize("");
    
    const extraRotations = 5 + Math.floor(Math.random() * 5); // 5-10 spins
    const sectionIndex = Math.floor(Math.random() * WHEEL_SECTIONS.length);
    const sectionDegrees = 360 / WHEEL_SECTIONS.length;
    const finalAngle = extraRotations * 360 + sectionIndex * sectionDegrees;

    setRotation(finalAngle);

    // Simulate clicking sound while spinning
    const totalDuration = 4000; // 4s spin
    const stepsCount = 15;
    for (let i = 0; i < stepsCount; i++) {
      setTimeout(() => {
        playSfx("hover");
      }, (totalDuration / stepsCount) * i);
    }

    setTimeout(() => {
      setIsSpinning(false);
      
      // Calculate selected prize (offset by wheel initial pointer positioning)
      const normalizedAngle = (360 - (finalAngle % 360)) % 360;
      const prizeIndex = Math.floor(normalizedAngle / sectionDegrees);
      
      const wonPrize = WHEEL_SECTIONS[prizeIndex];
      setPrize(wonPrize);
      onWin(wonPrize);
    }, totalDuration);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Pointer */}
      <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[18px] border-t-purple z-10 relative -mb-3" />

      {/* SVG Wheel container */}
      <div className="relative w-48 h-48 rounded-full border-4 border-purple shadow-md overflow-hidden bg-white">
        <motion.div
          animate={isSpinning ? { rotate: rotation } : { rotate: rotation }}
          transition={{ duration: 4, ease: [0.1, 0.8, 0.25, 1] }}
          className="w-full h-full relative"
        >
          {/* Wheel slices */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {WHEEL_SECTIONS.map((sec, idx) => {
              const startAngle = (idx * 360) / WHEEL_SECTIONS.length;
              const angleVal = 360 / WHEEL_SECTIONS.length;
              const isEven = idx % 2 === 0;

              return (
                <g key={idx} transform={`rotate(${startAngle} 50 50)`}>
                  <path
                    d={`M 50 50 L 50 0 A 50 50 0 0 1 ${50 + 50 * Math.sin((angleVal * Math.PI) / 180)} ${
                      50 - 50 * Math.cos((angleVal * Math.PI) / 180)
                    } Z`}
                    fill={isEven ? "#FADADD" : "#FFF9E6"}
                  />
                  {/* Text labels inside slices */}
                  <text
                    x="50"
                    y="22"
                    transform={`rotate(${angleVal / 2} 50 50)`}
                    textAnchor="middle"
                    className="font-poppins text-[6px] font-bold fill-gray-700"
                  >
                    {sec}
                  </text>
                </g>
              );
            })}
          </svg>
        </motion.div>
      </div>

      <button
        onClick={spin}
        disabled={isSpinning}
        className="mt-6 px-6 py-2.5 bg-purple hover:bg-purple/90 disabled:bg-zinc-400 font-bold text-sm text-white rounded-full shadow-md active:scale-95 transition-all"
      >
        {isSpinning ? "Spinning..." : "SPIN WHEEL"}
      </button>

      {prize && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-4 font-patrick text-xl text-purple font-bold"
        >
          🎁 You won: {prize}!
        </motion.div>
      )}
    </div>
  );
}

/* ==========================================
   4. HIDDEN HEARTS GAME
   ========================================== */
interface HuntHeart {
  id: number;
  x: number;
  y: number;
  isFound: boolean;
}

function HiddenHeartsGame({ onWin }: { onWin: (reward: string) => void }) {
  const { playSfx } = useAudio();
  const [hearts, setHearts] = useState<HuntHeart[]>([]);
  const [foundCount, setFoundCount] = useState(0);

  const initHunt = () => {
    const list: HuntHeart[] = [];
    for (let i = 0; i < 7; i++) {
      list.push({
        id: i,
        // Place hearts at random positions inside 260x180 box
        x: 10 + Math.random() * 240,
        y: 10 + Math.random() * 140,
        isFound: false,
      });
    }
    setHearts(list);
    setFoundCount(0);
  };

  useEffect(() => {
    initHunt();
  }, []);

  const clickHeart = (id: number) => {
    const heartIdx = hearts.findIndex((h) => h.id === id);
    if (hearts[heartIdx].isFound) return;

    playSfx("click");
    const updated = [...hearts];
    updated[heartIdx].isFound = true;
    setHearts(updated);

    const totalFound = foundCount + 1;
    setFoundCount(totalFound);

    if (totalFound === 7) {
      onWin("Hidden Hearts found");
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <p className="text-xs font-nunito font-semibold text-gray-500 mb-2">
        Find 7 hearts hidden in the grassy box:
      </p>

      {/* Grass field border container */}
      <div className="w-[280px] h-[160px] bg-gradient-to-b from-[#E6F4EA] to-[#C2E7D9] rounded-xl border border-pink/30 shadow-inner relative overflow-hidden">
        {hearts.map((h) => (
          <div
            key={h.id}
            onClick={() => clickHeart(h.id)}
            style={{ left: h.x, top: h.y }}
            className={`absolute cursor-pointer transition-all duration-300 select-none ${
              h.isFound ? "opacity-100 scale-125" : "opacity-10 hover:opacity-30 scale-100"
            }`}
          >
            <Heart size={16} fill="#F87171" className="text-red-500" />
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between w-[280px] items-center text-xs font-bold font-nunito text-gray-600">
        <span>Hearts Found: {foundCount}/7</span>
        <button
          onClick={initHunt}
          className="flex gap-1 items-center px-2 py-1 bg-white border border-pink/30 text-[10px] rounded-md text-gray-500 hover:bg-pink/10 transition-colors"
        >
          <RefreshCw size={10} /> Reset Game
        </button>
      </div>
    </div>
  );
}
