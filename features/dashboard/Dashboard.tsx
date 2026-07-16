"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, Calendar, Mail, MessageCircle, Trophy, Gift, 
  Volume2, VolumeX, Pause, Play, Music as MusicIcon, LayoutGrid 
} from "lucide-react";
import MascotRenderer from "@/components/builder/MascotRenderer";
import { BlockRenderer } from "@/components/builder/registry";
import { useAudio } from "@/hooks/useAudio";

interface PageConfig {
  id: string;
  title: string;
  heading?: string;
  subheading?: string;
  quote?: string;
  buttonText?: string;
  footerText?: string;
  blocks: any[];
}

interface DashboardProps {
  config: any;
  mode: "friend" | "relationship" | "family";
}

interface CursorParticle {
  id: number;
  x: number;
  y: number;
  char: string;
  scale: number;
}

export default function Dashboard({ config, mode }: DashboardProps) {
  const { isPlayingMusic, playMusic, pauseMusic, musicVolume, setVolume, playSfx, activeTrackName } = useAudio();
  const [activePageId, setActivePageId] = useState("");
  const [mascotMood, setMascotMood] = useState<"idle" | "smile" | "dance" | "celebrate">("idle");
  const [cursorParticles, setCursorParticles] = useState<CursorParticle[]>([]);

  // Theme Settings
  const theme = config.theme || {
    themeName: "Birthday Theme",
    primaryColor: "#FFD1DC",
    secondaryColor: "#E8DEF8",
    backgroundColor: "#FFF8F8",
    foregroundColor: "#4A3B32",
    radius: "24px",
    shadows: "md",
    cursor: "sparkle",
    loader: "cake",
    fontHeading: "Poppins",
    fontBody: "Nunito",
    fontHandwriting: "Caveat",
    backgroundAnimation: "balloons",
    buttonStyle: "rounded",
    cardStyle: "shadow",
    pageTransition: "fade",
  };

  const mascot = config.mascot || {
    type: "giraffe",
    defaultPose: "idle",
    animationStyle: "floating",
    size: 150,
    enableFloating: true,
    enableInteractions: true,
    enableBirthdayOutfit: true,
  };

  // Compile specific heading font families
  const headingStyles = {
    fontFamily: theme.fontHeading || "Poppins",
  };

  const handwritingStyles = {
    fontFamily: theme.fontHandwriting || "Caveat",
  };

  useEffect(() => {
    if (config.pages && config.pages.length > 0) {
      setActivePageId(config.pages[0].id);
    }
  }, [config]);

  // Apply customization color tokens to CSS variables dynamically
  useEffect(() => {
    document.documentElement.style.setProperty("--background", theme.backgroundColor);
    document.documentElement.style.setProperty("--foreground", theme.foregroundColor);
    document.documentElement.style.setProperty("--primary", theme.primaryColor);
    document.documentElement.style.setProperty("--secondary", theme.secondaryColor);
    document.documentElement.style.setProperty("--radius", theme.radius || "24px");
  }, [theme]);

  // Cursor trails interactive logic
  useEffect(() => {
    if (!theme.cursor || theme.cursor === "none") return;

    let char = "✨";
    if (theme.cursor === "heart") char = "❤️";
    if (theme.cursor === "star") char = "⭐";
    if (theme.cursor === "flower") char = "🌸";

    const handleMouseMove = (e: MouseEvent) => {
      // Limit frequency slightly to avoid cluttering
      if (Math.random() > 0.3) return;

      const newParticle: CursorParticle = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        char,
        scale: 0.5 + Math.random() * 0.8
      };

      setCursorParticles((prev) => [...prev.slice(-30), newParticle]);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [theme.cursor]);

  // Clean particles trail regularly
  useEffect(() => {
    if (cursorParticles.length === 0) return;
    const timer = setInterval(() => {
      setCursorParticles((prev) => prev.slice(1));
    }, 100);
    return () => clearInterval(timer);
  }, [cursorParticles]);

  const activePage = config.pages?.find((p: any) => p.id === activePageId) || config.pages?.[0];

  const handleMascotInteraction = () => {
    if (!mascot.enableInteractions) return;
    playSfx("success");
    const moods: Array<typeof mascotMood> = ["smile", "dance", "celebrate"];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    setMascotMood(randomMood);
    setTimeout(() => setMascotMood("idle"), 2500);
  };

  // Compile falling background elements based on animation setting
  const renderBackgroundEffects = () => {
    if (theme.backgroundAnimation === "none" || !theme.backgroundAnimation) return null;

    const count = 15;
    const items = Array.from({ length: count });
    let char = "🎈";
    if (theme.backgroundAnimation === "hearts") char = "💖";
    if (theme.backgroundAnimation === "stars") char = "⭐";
    if (theme.backgroundAnimation === "petals") char = "🌸";
    if (theme.backgroundAnimation === "confetti") char = "🎉";

    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
        {items.map((_, i) => {
          const delay = i * 1.2;
          const left = (i * (100 / count)) + (Math.random() * 5);
          const sizeVal = 14 + (Math.random() * 22);
          const duration = 9 + (Math.random() * 7);

          return (
            <motion.div
              key={i}
              initial={{ y: "110vh", opacity: 0.1, x: `${left}vw` }}
              animate={{
                y: "-10vh",
                opacity: [0, 0.7, 0.7, 0],
                x: [`${left}vw`, `${left + (Math.random() * 12 - 6)}vw`, `${left}vw`]
              }}
              transition={{
                repeat: Infinity,
                duration,
                delay,
                ease: "linear"
              }}
              style={{
                position: "absolute",
                fontSize: sizeVal,
                bottom: -30,
              }}
            >
              {char}
            </motion.div>
          );
        })}
      </div>
    );
  };

  // Custom tab icons mapping
  const getTabIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("home")) return <LayoutGrid size={18} />;
    if (t.includes("memories")) return <Heart size={18} />;
    if (t.includes("game")) return <Trophy size={18} />;
    if (t.includes("letter")) return <Mail size={18} />;
    if (t.includes("gift")) return <Gift size={18} />;
    return <Calendar size={18} />;
  };

  return (
    <div 
      className="w-full min-h-screen pb-24 relative flex flex-col justify-between selection:bg-purple/10"
      style={{ 
        backgroundColor: theme.backgroundColor, 
        color: theme.foregroundColor,
        fontFamily: theme.fontBody || "Nunito" 
      }}
    >
      
      {/* 1. CURSOR PARTICLES LAYOVER */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {cursorParticles.map((pt) => (
            <motion.span
              key={pt.id}
              initial={{ opacity: 1, scale: pt.scale, x: pt.x, y: pt.y }}
              animate={{ opacity: 0, y: pt.y - 45, scale: pt.scale * 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{
                position: "absolute",
                left: -10,
                top: -10,
                fontSize: 16,
              }}
            >
              {pt.char}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* 2. AMBIENT BACKGROUND PARTICLES */}
      {renderBackgroundEffects()}

      {/* 3. GLOBAL TOP NAV PLAYER BAR */}
      <header className="sticky top-0 w-full backdrop-blur-md bg-white/70 border-b border-pink-100 z-45 py-3 px-6 flex justify-between items-center shadow-sm select-none">
        <div className="flex items-center gap-2">
          <span className="font-poppins text-base md:text-lg font-black tracking-tight" style={headingStyles}>
            🎂 {config.recipientName}'s Scrapbook
          </span>
          <span className="text-[9px] bg-purple/10 text-purple border border-purple/20 px-2 py-0.5 rounded-full capitalize font-bold font-nunito">
            {mode} Mode
          </span>
        </div>

        {/* Music controllers */}
        <div className="flex items-center gap-3 bg-white/80 rounded-full px-4 py-1.5 border border-pink-100 shadow-sm">
          <motion.div
            animate={isPlayingMusic ? { rotate: 360 } : {}}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="text-pink flex items-center justify-center"
          >
            <MusicIcon size={12} />
          </motion.div>
          
          <div className="flex flex-col text-[9px] font-nunito max-w-[80px] truncate">
            <span className="font-bold text-gray-700 leading-tight">Playing:</span>
            <span className="text-gray-400 font-semibold truncate">{activeTrackName}</span>
          </div>

          <div className="flex gap-2 items-center border-l border-pink-100 pl-2">
            {isPlayingMusic ? (
              <button onClick={pauseMusic} className="text-gray-600 hover:text-pink transition-colors">
                <Pause size={12} fill="currentColor" />
              </button>
            ) : (
              <button onClick={() => playMusic(config.bgMusicUrl)} className="text-gray-600 hover:text-pink transition-colors">
                <Play size={12} fill="currentColor" />
              </button>
            )}
            
            <button
              onClick={() => setVolume(musicVolume === 0 ? 0.4 : 0)}
              className="text-gray-600 hover:text-pink transition-colors"
            >
              {musicVolume === 0 ? <VolumeX size={12} /> : <Volume2 size={12} />}
            </button>
          </div>
        </div>
      </header>

      {/* 4. ACTIVE PAGE CONTENT AREA */}
      <main className="max-w-4xl w-full mx-auto px-4 mt-6 flex-1 flex flex-col items-center z-10 relative">
        
        {/* Interactive Companion Mascot */}
        {mascot.type && (
          <div 
            onClick={handleMascotInteraction}
            className="cursor-pointer transition-transform hover:scale-105 active:scale-95 mb-4 z-20 flex flex-col items-center"
          >
            <MascotRenderer
              type={mascot.type}
              state={mascotMood}
              size={mascot.size}
              customUrl={mascot.customUrl}
              enableFloating={mascot.enableFloating}
              enableBirthdayOutfit={mascot.enableBirthdayOutfit}
              animationStyle={mascot.animationStyle}
            />
          </div>
        )}

        {/* Custom page headings set by Caption Manager */}
        {activePage && (
          <div className="text-center mb-8 mt-2 space-y-2 z-10">
            {activePage.heading && (
              <h1 className="text-3xl md:text-4xl font-black text-gray-800 leading-tight" style={headingStyles}>
                {activePage.heading}
              </h1>
            )}
            {activePage.subheading && (
              <p className="text-xs text-gray-400 font-extrabold uppercase tracking-widest">
                {activePage.subheading}
              </p>
            )}
            {activePage.quote && (
              <div className="max-w-md mx-auto p-4 bg-purple/5 border-l-4 border-purple italic text-lg text-gray-600 rounded-r-xl" style={handwritingStyles}>
                "{activePage.quote}"
              </div>
            )}
          </div>
        )}

        {/* Dynamic block lists renderer */}
        {activePage && activePage.blocks && activePage.blocks.length > 0 ? (
          <div className="w-full space-y-6">
            {activePage.blocks.filter((b: any) => !b.properties?.hidden).map((block: any) => (
              <BlockRenderer
                key={block.id}
                block={block}
                recipientName={config.recipientName}
                fallbackData={{
                  memories: [],
                  timeline: [],
                  playlist: [],
                  voiceNotes: [],
                  gifts: [],
                  chats: [],
                  letterContent: "Letter content...",
                  countdownDate: config.countdownDate,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400 font-nunito">
            Layout page holds no blocks. Customize your blocks catalog inside the Visual Editor workspace!
          </div>
        )}

        {/* Page Proceed Button & Footer */}
        {activePage && (
          <div className="text-center mt-12 mb-4 space-y-4">
            {activePage.buttonText && (
              <button 
                onClick={() => playSfx("click")}
                className="px-6 py-2.5 bg-purple text-white text-xs font-bold rounded-full shadow-md hover:bg-purple/90 transition-all"
              >
                {activePage.buttonText}
              </button>
            )}
            {activePage.footerText && (
              <footer className="text-[10px] text-gray-400 font-nunito uppercase tracking-widest font-extrabold block">
                {activePage.footerText}
              </footer>
            )}
          </div>
        )}

        {/* Dynamic iOS-style Bottom Tab Bar Navigation */}
        <footer className="fixed bottom-0 inset-x-0 bg-white/80 backdrop-blur border-t border-pink-100 py-3.5 z-45 flex justify-around shadow-lg select-none">
          {config.pages?.map((p: any) => (
            <button
              key={p.id}
              onClick={() => {
                playSfx("click");
                setActivePageId(p.id);
              }}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-all ${
                activePageId === p.id 
                  ? "text-purple scale-105" 
                  : "text-gray-400 hover:text-purple"
              }`}
            >
              {getTabIcon(p.title)}
              <span>{p.title}</span>
            </button>
          ))}
        </footer>

      </main>

    </div>
  );
}
