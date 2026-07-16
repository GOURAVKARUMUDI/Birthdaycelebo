"use client";

import React from "react";
import { motion } from "framer-motion";

export type MascotState =
  | "idle"
  | "blink"
  | "smile"
  | "wave"
  | "jump"
  | "dance"
  | "celebrate"
  | "cry"
  | "sleep"
  | "hold_flowers"
  | "hold_cake"
  | "hold_balloons"
  | "hold_gift";

interface MascotRendererProps {
  type?: string;
  customUrl?: string;
  state?: MascotState;
  size?: number;
  enableFloating?: boolean;
  enableBirthdayOutfit?: boolean;
  animationStyle?: "floating" | "bounce" | "wiggle" | "none";
  positionX?: number;
  positionY?: number;
  scale?: number;
  rotation?: number;
  opacity?: number;
  className?: string;
  onClick?: () => void;
}

export default function MascotRenderer({
  type = "giraffe",
  customUrl = "",
  state = "idle",
  size = 160,
  enableFloating = true,
  enableBirthdayOutfit = false,
  animationStyle = "floating",
  rotation = 0,
  opacity = 1,
  className = "",
  onClick,
}: MascotRendererProps) {

  // If a custom mascot URL is uploaded and provided
  if (customUrl) {
    return (
      <div 
        onClick={onClick}
        className={`flex flex-col items-center justify-center cursor-pointer select-none transition-transform hover:scale-105 active:scale-95 ${className}`}
        style={{ width: size, height: size, transform: `rotate(${rotation}deg)`, opacity }}
      >
        <img src={customUrl} alt="Custom Mascot" className="w-full h-full object-contain" />
      </div>
    );
  }

  // Set colors based on animal type
  const getAnimalColors = (animal: string) => {
    switch (animal) {
      case "panda": return { body: "#FFFFFF", secondary: "#212121", muzzle: "#F5F5F5" };
      case "bear": return { body: "#8D6E63", secondary: "#5D4037", muzzle: "#D7CCC8" };
      case "cat": return { body: "#FFB74D", secondary: "#E65100", muzzle: "#FFE0B2" };
      case "dog": return { body: "#A1887F", secondary: "#4E342E", muzzle: "#D7CCC8" };
      case "bunny": return { body: "#E0E0E0", secondary: "#F48FB1", muzzle: "#F5F5F5" };
      case "fox": return { body: "#FF7043", secondary: "#D84315", muzzle: "#FFFFFF" };
      case "penguin": return { body: "#37474F", secondary: "#ECEFF1", muzzle: "#FFB300" };
      case "koala": return { body: "#B0BEC5", secondary: "#78909C", muzzle: "#37474F" };
      case "sloth": return { body: "#CFD8DC", secondary: "#90A4AE", muzzle: "#ECEFF1" };
      case "hamster": return { body: "#FFCC80", secondary: "#FFB74D", muzzle: "#FFF9C4" };
      case "elephant": return { body: "#90A4AE", secondary: "#607D8B", muzzle: "#CFD8DC" };
      case "tiger": return { body: "#FFA726", secondary: "#212121", muzzle: "#FFFFFF" };
      case "lion": return { body: "#FFD54F", secondary: "#A1887F", muzzle: "#FFE082" };
      case "dinosaur": return { body: "#81C784", secondary: "#4CAF50", muzzle: "#C8E6C9" };
      case "unicorn": return { body: "#FFFFFF", secondary: "#E1BEE7", muzzle: "#F8BBD0" };
      case "giraffe":
      default:
        return { body: "#FFD54F", secondary: "#F5B041", muzzle: "#FFE082" };
    }
  };

  const colors = getAnimalColors(type);

  // Framer Motion Animation Variants based on state and style options
  const getContainerAnimate = () => {
    if (state === "jump" || state === "celebrate") {
      return {
        y: [0, -30, 0],
        scaleY: [1, 0.85, 1.15, 1],
        transition: { repeat: Infinity, duration: 0.7, ease: "easeInOut" as const },
      };
    }
    if (state === "dance") {
      return {
        y: [0, -10, 0],
        rotate: [-6, 6, -6],
        transition: { repeat: Infinity, duration: 0.8, ease: "easeInOut" as const },
      };
    }
    if (state === "sleep") {
      return {
        scaleY: [1, 1.03, 1],
        transition: { repeat: Infinity, duration: 2.2, ease: "easeInOut" as const },
      };
    }
    if (enableFloating && animationStyle === "floating") {
      return {
        y: [0, -12, 0],
        transition: { repeat: Infinity, duration: 3, ease: "easeInOut" as const },
      };
    }
    if (animationStyle === "bounce") {
      return {
        y: [0, -8, 0],
        transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" as const },
      };
    }
    if (animationStyle === "wiggle") {
      return {
        rotate: [-3, 3, -3],
        transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" as const },
      };
    }
    return {};
  };

  const headVariants = {
    idle: { y: 0, rotate: 0 },
    dance: { rotate: [-8, 8, -8], transition: { repeat: Infinity, duration: 0.8 } },
    celebrate: { y: -4, rotate: [-10, 10, -10], transition: { repeat: Infinity, duration: 0.5 } },
    cry: { y: 8, rotate: 3 },
    sleep: { y: 3, rotate: 5 },
  };

  const leftArmVariants = {
    idle: { rotate: 0 },
    wave: { rotate: [0, -60, -20, -60, 0], transition: { repeat: Infinity, duration: 1.2 } },
    dance: { rotate: [-40, 20, -40], transition: { repeat: Infinity, duration: 0.8 } },
    celebrate: { rotate: -130, y: [0, -5, 0], transition: { repeat: Infinity, duration: 0.7 } },
    cry: { rotate: 20 },
    sleep: { rotate: 10 },
  };

  const rightArmVariants = {
    idle: { rotate: 0 },
    dance: { rotate: [40, -20, 40], transition: { repeat: Infinity, duration: 0.8 } },
    celebrate: { rotate: 130, y: [0, -5, 0], transition: { repeat: Infinity, duration: 0.7 } },
    hold_flowers: { rotate: -35 },
    hold_cake: { rotate: -40 },
    hold_balloons: { rotate: -45 },
    hold_gift: { rotate: -35 },
    cry: { rotate: -20 },
  };

  // Eyes dynamic rendering
  const renderEyes = () => {
    if (state === "cry") {
      return (
        <>
          <path d="M 68 62 Q 74 68 80 64" stroke="#4A3B32" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 120 62 Q 126 68 132 64" stroke="#4A3B32" strokeWidth="3" fill="none" strokeLinecap="round" />
          <motion.circle cx="72" cy="68" r="4" fill="#93C5FD" animate={{ y: [0, 20], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeIn" }} />
          <motion.circle cx="124" cy="68" r="4" fill="#93C5FD" animate={{ y: [0, 20], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeIn", delay: 0.3 }} />
        </>
      );
    }
    if (state === "blink" || state === "sleep") {
      return (
        <>
          <line x1="68" y1="65" x2="82" y2="65" stroke="#4A3B32" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="118" y1="65" x2="132" y2="65" stroke="#4A3B32" strokeWidth="3.5" strokeLinecap="round" />
        </>
      );
    }
    if (state === "smile" || state === "celebrate" || state === "dance" || state === "wave" || state === "jump") {
      return (
        <>
          <path d="M 68 66 Q 75 58 82 66" stroke="#4A3B32" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M 118 66 Q 125 58 132 66" stroke="#4A3B32" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      );
    }
    // Normal friendly eyes
    return (
      <>
        <g>
          <circle cx="75" cy="64" r="7.5" fill="#4A3B32" />
          <circle cx="73" cy="61.5" r="2.8" fill="#FFFFFF" />
        </g>
        <g>
          <circle cx="125" cy="64" r="7.5" fill="#4A3B32" />
          <circle cx="123" cy="61.5" r="2.8" fill="#FFFFFF" />
        </g>
      </>
    );
  };

  // Mouth rendering
  const renderMouth = () => {
    if (state === "cry") {
      return <path d="M 93 84 Q 100 78 107 84" stroke="#4A3B32" strokeWidth="3" fill="none" strokeLinecap="round" />;
    }
    if (state === "smile" || state === "celebrate" || state === "dance" || state === "wave" || state === "hold_flowers" || state === "hold_cake" || state === "hold_balloons" || state === "hold_gift" || state === "jump") {
      return <path d="M 91 78 Q 100 91 109 78" stroke="#4A3B32" strokeWidth="3.2" fill="none" strokeLinecap="round" />;
    }
    return <path d="M 94 80 Q 100 84 106 80" stroke="#4A3B32" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
  };

  // Unique animal ears, horns, or features
  const renderEarsAndHorns = () => {
    switch (type) {
      case "giraffe":
        return (
          <>
            {/* Horns */}
            <line x1="88" y1="35" x2="88" y2="15" stroke={colors.body} strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="88" cy="12" r="5.5" fill="#B37D14" />
            <line x1="112" y1="35" x2="112" y2="15" stroke={colors.body} strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="112" cy="12" r="5.5" fill="#B37D14" />
            {/* Ears */}
            <path d="M 75 32 Q 45 22 62 43 Z" fill={colors.body} stroke={colors.secondary} strokeWidth="1.5" />
            <path d="M 70 34 Q 52 28 62 40 Z" fill="#F8BBD0" />
            <path d="M 125 32 Q 155 22 138 43 Z" fill={colors.body} stroke={colors.secondary} strokeWidth="1.5" />
            <path d="M 130 34 Q 148 28 138 40 Z" fill="#F8BBD0" />
          </>
        );
      case "panda":
        return (
          <>
            <circle cx="65" cy="35" r="16" fill={colors.secondary} />
            <circle cx="65" cy="35" r="9" fill="#FFF" opacity="0.1" />
            <circle cx="135" cy="35" r="16" fill={colors.secondary} />
            <circle cx="135" cy="35" r="9" fill="#FFF" opacity="0.1" />
          </>
        );
      case "bear":
      case "koala":
        const earRadius = type === "koala" ? 22 : 15;
        return (
          <>
            <circle cx="62" cy="36" r={earRadius} fill={colors.secondary} />
            <circle cx="62" cy="36" r={earRadius * 0.6} fill="#F8BBD0" />
            <circle cx="138" cy="36" r={earRadius} fill={colors.secondary} />
            <circle cx="138" cy="36" r={earRadius * 0.6} fill="#F8BBD0" />
          </>
        );
      case "cat":
      case "fox":
        return (
          <>
            <path d="M 60 40 L 52 16 L 80 32 Z" fill={colors.body} stroke={colors.secondary} strokeWidth="1.5" />
            <path d="M 63 37 L 57 22 L 75 31 Z" fill="#F8BBD0" />
            <path d="M 140 40 L 148 16 L 120 32 Z" fill={colors.body} stroke={colors.secondary} strokeWidth="1.5" />
            <path d="M 137 37 L 143 22 L 125 31 Z" fill="#F8BBD0" />
          </>
        );
      case "dog":
        return (
          <>
            {/* Floppy ears */}
            <path d="M 64 35 Q 40 45 52 85 Q 68 85 70 50 Z" fill={colors.secondary} />
            <path d="M 136 35 Q 160 45 148 85 Q 132 85 130 50 Z" fill={colors.secondary} />
          </>
        );
      case "bunny":
        return (
          <>
            {/* Long bunny ears */}
            <path d="M 72 32 Q 54 -15 72 -15 Q 90 -15 82 32 Z" fill={colors.body} stroke={colors.secondary} strokeWidth="1.5" />
            <path d="M 74 28 Q 63 -8 72 -8 Q 81 -8 79 28 Z" fill={colors.secondary} />
            <path d="M 128 32 Q 146 -15 128 -15 Q 110 -15 118 32 Z" fill={colors.body} stroke={colors.secondary} strokeWidth="1.5" />
            <path d="M 126 28 Q 137 -8 128 -8 Q 119 -8 121 28 Z" fill={colors.secondary} />
          </>
        );
      case "penguin":
        return null; // penguins do not have external ears
      case "unicorn":
        return (
          <>
            {/* Unicorn Horn */}
            <path d="M 94 30 L 100 -5 L 106 30 Z" fill="#FFF59D" stroke="#FBC02D" strokeWidth="1.5" />
            <line x1="97" y1="18" x2="103" y2="18" stroke="#F5B041" strokeWidth="2" />
            <line x1="95" y1="8" x2="105" y2="8" stroke="#F5B041" strokeWidth="2" />
            {/* Ears */}
            <path d="M 66 38 L 56 18 L 80 32 Z" fill={colors.body} stroke={colors.secondary} strokeWidth="1.5" />
            <path d="M 134 38 L 144 18 L 120 32 Z" fill={colors.body} stroke={colors.secondary} strokeWidth="1.5" />
          </>
        );
      case "dinosaur":
        return (
          <>
            {/* Head spikes */}
            <path d="M 75 25 L 70 12 L 85 22 Z" fill="#FFA726" />
            <path d="M 100 22 L 100 8 L 108 20 Z" fill="#FFA726" />
            <path d="M 125 25 L 130 12 L 115 22 Z" fill="#FFA726" />
          </>
        );
      default:
        return (
          <>
            <circle cx="66" cy="38" r="10" fill={colors.body} />
            <circle cx="134" cy="38" r="10" fill={colors.body} />
          </>
        );
    }
  };

  // Unique facial details (beak, snout, trunk, manes)
  const renderFaceDetails = () => {
    switch (type) {
      case "giraffe":
        return (
          <>
            {/* spots on head */}
            <circle cx="73" cy="46" r="4.5" fill="#F39C12" opacity="0.8" />
            <circle cx="127" cy="46" r="4.5" fill="#F39C12" opacity="0.8" />
            <ellipse cx="100" cy="85" rx="26" ry="16" fill={colors.muzzle} stroke={colors.secondary} strokeWidth="1.5" />
            {renderMouth()}
            <circle cx="95" cy="79" r="1.8" fill="#B37D14" />
            <circle cx="105" cy="79" r="1.8" fill="#B37D14" />
          </>
        );
      case "panda":
        return (
          <>
            {/* Black patches around eyes */}
            <ellipse cx="75" cy="65" rx="13" ry="16" transform="rotate(-15, 75, 65)" fill={colors.secondary} />
            <ellipse cx="125" cy="65" rx="13" ry="16" transform="rotate(15, 125, 65)" fill={colors.secondary} />
            {renderEyes()}
            <ellipse cx="100" cy="82" rx="16" ry="11" fill={colors.muzzle} />
            {renderMouth()}
            <ellipse cx="100" cy="77" rx="4" ry="2.5" fill="#111" />
          </>
        );
      case "bear":
      case "bunny":
      case "koala":
      case "sloth":
      case "hamster":
      case "tiger":
      case "cat":
      case "dog":
        return (
          <>
            {renderEyes()}
            {type === "sloth" && (
              <>
                <path d="M 63 65 Q 73 52 83 66" fill="#A1887F" opacity="0.6" />
                <path d="M 137 65 Q 127 52 117 66" fill="#A1887F" opacity="0.6" />
              </>
            )}
            {type === "tiger" && (
              <>
                {/* Tiger stripes */}
                <path d="M 65 50 L 78 52 L 65 56 Z" fill="#212121" />
                <path d="M 135 50 L 122 52 L 135 56 Z" fill="#212121" />
                <path d="M 100 30 L 100 42" stroke="#212121" strokeWidth="3.5" strokeLinecap="round" />
              </>
            )}
            <ellipse cx="100" cy="83" rx="20" ry="13" fill={colors.muzzle} />
            {renderMouth()}
            {type === "koala" ? (
              <ellipse cx="100" cy="73" rx="8" ry="14" fill={colors.secondary} />
            ) : (
              <polygon points="96,75 104,75 100,79" fill="#212121" />
            )}
            {type === "cat" && (
              <>
                {/* whiskers */}
                <line x1="55" y1="80" x2="35" y2="78" stroke="#4A3B32" strokeWidth="1.5" />
                <line x1="55" y1="85" x2="33" y2="87" stroke="#4A3B32" strokeWidth="1.5" />
                <line x1="145" y1="80" x2="165" y2="78" stroke="#4A3B32" strokeWidth="1.5" />
                <line x1="145" y1="85" x2="167" y2="87" stroke="#4A3B32" strokeWidth="1.5" />
              </>
            )}
          </>
        );
      case "lion":
        return (
          <>
            {/* Mane */}
            <circle cx="100" cy="65" r="42" fill={colors.secondary} />
            <circle cx="100" cy="65" r="33" fill={colors.body} />
            {renderEyes()}
            <ellipse cx="100" cy="81" rx="16" ry="11" fill={colors.muzzle} />
            {renderMouth()}
            <polygon points="96,75 104,75 100,79" fill="#212121" />
          </>
        );
      case "penguin":
        return (
          <>
            {renderEyes()}
            {/* Penguin white face overlay */}
            <ellipse cx="80" cy="70" rx="16" ry="20" fill={colors.secondary} />
            <ellipse cx="120" cy="70" rx="16" ry="20" fill={colors.secondary} />
            <polygon points="94,76 106,76 100,90" fill={colors.muzzle} />
          </>
        );
      case "elephant":
        return (
          <>
            {renderEyes()}
            <ellipse cx="100" cy="80" rx="16" ry="12" fill={colors.body} />
            {/* Trunk */}
            <motion.path
              animate={state === "celebrate" ? { rotate: [-10, 10, -10] } : {}}
              transition={{ repeat: Infinity, duration: 0.8 }}
              d="M 97 80 C 97 100 112 105 110 115"
              stroke={colors.body}
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
            />
          </>
        );
      default:
        return (
          <>
            {renderEyes()}
            <ellipse cx="100" cy="83" rx="18" ry="12" fill={colors.muzzle} />
            {renderMouth()}
            <circle cx="100" cy="75" r="3.5" fill="#212121" />
          </>
        );
    }
  };

  return (
    <div 
      onClick={onClick} 
      className={`flex flex-col items-center justify-center select-none ${className}`}
      style={{ transform: `rotate(${rotation}deg)`, opacity }}
    >
      <motion.svg
        width={size}
        height={size * 1.2}
        viewBox="0 0 200 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={getContainerAnimate()}
      >
        {/* Dynamic Shadow based on pose */}
        <ellipse cx="100" cy="225" rx={state === "jump" ? "35" : "50"} ry="8" fill="#E6E0D8" opacity={state === "jump" ? "0.4" : "0.8"} />

        {/* Mascot Body Group */}
        <motion.g>
          
          {/* Elephant giant ears render behind body */}
          {type === "elephant" && (
            <>
              <ellipse cx="50" cy="85" rx="30" ry="40" fill={colors.secondary} />
              <ellipse cx="50" cy="85" rx="20" ry="28" fill="#F8BBD0" />
              <ellipse cx="150" cy="85" rx="30" ry="40" fill={colors.secondary} />
              <ellipse cx="150" cy="85" rx="20" ry="28" fill="#F8BBD0" />
            </>
          )}

          {/* TORSO & NECK */}
          {type === "giraffe" ? (
            <path
              d="M 85 100 L 80 180 Q 75 210 100 210 Q 125 210 120 180 L 115 100 Z"
              fill={colors.body}
              stroke={colors.secondary}
              strokeWidth="2.5"
            />
          ) : (
            <rect x="75" y="115" width="50" height="75" rx="22" fill={colors.body} stroke={colors.secondary} strokeWidth="2.5" />
          )}

          {/* Torso spots/markings */}
          {type === "giraffe" && (
            <>
              <circle cx="95" cy="140" r="7.5" fill="#F39C12" />
              <circle cx="105" cy="170" r="10" fill="#F39C12" />
              <circle cx="90" cy="190" r="6" fill="#F39C12" />
            </>
          )}
          {type === "dinosaur" && (
            <>
              <circle cx="90" cy="150" r="4" fill="#66BB6A" />
              <circle cx="110" cy="165" r="5" fill="#66BB6A" />
            </>
          )}

          {/* Left Hand/Arm */}
          <motion.path
            variants={leftArmVariants}
            animate={state}
            style={{ originX: "80px", originY: "135px" }}
            d="M 80 130 C 58 130 44 140 48 160 C 51 170 64 165 64 155 C 64 145 76 145 80 145 Z"
            fill={colors.body}
            stroke={colors.secondary}
            strokeWidth="2"
          />

          {/* Right Hand/Arm */}
          <motion.path
            variants={rightArmVariants}
            animate={state}
            style={{ originX: "120px", originY: "135px" }}
            d="M 120 130 C 142 130 156 140 152 160 C 149 170 136 165 136 155 C 136 145 124 145 120 145 Z"
            fill={colors.body}
            stroke={colors.secondary}
            strokeWidth="2"
          />

          {/* FLOATING Zzz bubbles if sleeping */}
          {state === "sleep" && (
            <g>
              <motion.text x="145" y="60" fill="#BA68C8" fontSize="12" fontWeight="bold" animate={{ y: [60, 40], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut" }}>Z</motion.text>
              <motion.text x="155" y="48" fill="#BA68C8" fontSize="16" fontWeight="bold" animate={{ y: [48, 25], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.8, delay: 0.6, ease: "easeOut" }}>Z</motion.text>
            </g>
          )}

          {/* ACCESSORY OVERLAYS */}
          {state === "hold_flowers" && (
            <g>
              <line x1="142" y1="140" x2="152" y2="160" stroke="#4CAF50" strokeWidth="2.5" />
              <line x1="150" y1="140" x2="152" y2="160" stroke="#4CAF50" strokeWidth="2.5" />
              <circle cx="140" cy="132" r="6" fill="#F48FB1" />
              <circle cx="134" cy="136" r="6" fill="#F48FB1" />
              <circle cx="146" cy="136" r="6" fill="#F48FB1" />
              <circle cx="140" cy="136" r="4.5" fill="#FFF59D" />
            </g>
          )}

          {/* Hold Cake */}
          {state === "hold_cake" && (
            <g transform="translate(130, 115)">
              <rect x="0" y="10" width="30" height="20" rx="3" fill="#D7CCC8" />
              <rect x="0" y="8" width="30" height="4" fill="#EC407A" />
              {/* candle */}
              <line x1="15" y1="8" x2="15" y2="2" stroke="#FFD54F" strokeWidth="2.5" />
              <circle cx="15" cy="0" r="2" fill="#FF7043" />
            </g>
          )}

          {/* Hold Balloons */}
          {state === "hold_balloons" && (
            <g transform="translate(132, 70)">
              {/* Balloon strings */}
              <path d="M 12 70 Q 5 95 18 105" stroke="#90A4AE" strokeWidth="1" fill="none" />
              <path d="M 12 70 Q 22 95 18 105" stroke="#90A4AE" strokeWidth="1" fill="none" />
              {/* Red Balloon */}
              <ellipse cx="6" cy="62" rx="10" ry="13" fill="#EF5350" />
              {/* Blue Balloon */}
              <ellipse cx="20" cy="58" rx="10" ry="13" fill="#42A5F5" />
            </g>
          )}

          {/* Hold Gift */}
          {state === "hold_gift" && (
            <g transform="translate(132, 130)">
              <rect x="0" y="0" width="22" height="20" rx="2" fill="#AB47BC" />
              <line x1="11" y1="0" x2="11" y2="20" stroke="#FFD54F" strokeWidth="3" />
              <line x1="0" y1="10" x2="22" y2="10" stroke="#FFD54F" strokeWidth="3" />
            </g>
          )}

          {/* HEAD GROUP */}
          <motion.g variants={headVariants} animate={state} style={{ originX: "100px", originY: "90px" }}>
            
            {/* Ears / Horns unique render */}
            {renderEarsAndHorns()}

            {/* Base head shape */}
            {type !== "lion" && (
              <rect x="65" y="32" width="70" height="70" rx="32" fill={colors.body} stroke={colors.secondary} strokeWidth="2.5" />
            )}

            {/* Cute Cheek Blush */}
            {(state === "smile" || state === "celebrate" || state === "dance" || state === "wave" || state === "idle") && (
              <>
                <circle cx="68" cy="74" r="6" fill="#F48FB1" opacity="0.6" />
                <circle cx="132" cy="74" r="6" fill="#F48FB1" opacity="0.6" />
              </>
            )}

            {/* Face details rendering (Beak, Snout, whiskers, nose, eyes) */}
            {renderFaceDetails()}

            {/* PARTY HAT/BIRTHDAY OUTFIT OVERLAY */}
            {enableBirthdayOutfit && (
              <g transform="translate(85, 2)">
                {/* Cone party hat */}
                <polygon points="15,30 30,0 0,30" fill="#EC407A" stroke="#AD1457" strokeWidth="1" />
                {/* dots on hat */}
                <circle cx="10" cy="22" r="2.5" fill="#FFE082" />
                <circle cx="18" cy="15" r="2" fill="#80DEEA" />
                {/* Pom-pom at top */}
                <circle cx="15" cy="-2" r="4.5" fill="#FFF59D" />
              </g>
            )}

          </motion.g>

        </motion.g>
      </motion.svg>
    </div>
  );
}
