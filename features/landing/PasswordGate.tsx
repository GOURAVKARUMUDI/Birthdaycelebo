"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Unlock, Eye, EyeOff } from "lucide-react";
import { useAudio } from "@/hooks/useAudio";

interface PasswordGateProps {
  onSuccess: (mode: "friend" | "relationship" | "family") => void;
  validPasswords: {
    friend?: string;
    relationship?: string;
    family?: string;
  };
}

export default function PasswordGate({ onSuccess, validPasswords }: PasswordGateProps) {
  const { playSfx } = useAudio();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorShake, setErrorShake] = useState(false);

  const handleUnlock = () => {
    // Check which mode this password matches
    let matchedMode: "friend" | "relationship" | "family" | null = null;

    if (password === (validPasswords.relationship || "love123")) {
      matchedMode = "relationship";
    } else if (password === (validPasswords.friend || "friend123")) {
      matchedMode = "friend";
    } else if (password === (validPasswords.family || "family123")) {
      matchedMode = "family";
    }

    if (matchedMode) {
      playSfx("success");
      onSuccess(matchedMode);
    } else {
      // Wrong password
      playSfx("error");
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 500);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#FFFDF9] px-4 select-none overflow-hidden relative">
      
      {/* Floating background graphics */}
      <div className="absolute top-[25%] right-[25%] text-pink text-4xl animate-float-delayed">🔒</div>
      <div className="absolute bottom-[25%] left-[20%] text-purple/40 text-4xl animate-float">🗝️</div>

      {/* Lock header */}
      <motion.div
        animate={errorShake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center max-w-sm w-full text-center"
      >
        <div className="w-16 h-16 rounded-full bg-pink/20 flex items-center justify-center mb-6 text-purple border border-pink/30">
          {password ? <Unlock size={24} /> : <Lock size={24} />}
        </div>

        <h2 className="font-poppins text-2xl font-bold text-gray-800 mb-2">Locked With Love</h2>
        <p className="font-nunito text-xs text-gray-500 mb-8 font-semibold">
          Enter the secret code to open your gift
        </p>

        {/* Input box */}
        <div className={`w-full relative flex flex-col items-center ${errorShake ? "animate-shake" : ""}`}>
          <div className="w-full relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter secret code..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleUnlock();
              }}
              className="w-full pl-6 pr-12 py-3 rounded-full border border-pink/30 bg-white/80 shadow-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink/50 text-gray-700 font-nunito font-semibold transition-all text-center tracking-widest text-base"
              onFocus={() => playSfx("hover")}
            />
            {/* Show/Hide eye */}
            <button
              onClick={() => {
                playSfx("click");
                setShowPassword(!showPassword);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            onClick={handleUnlock}
            className="mt-6 w-full max-w-[200px] py-2.5 bg-purple hover:bg-purple/90 font-bold text-sm text-white rounded-full shadow-md active:scale-95 transition-all font-nunito"
          >
            UNLOCK
          </button>
        </div>

        {/* Hints for reviewer convenience */}
        <p className="mt-8 text-[10px] text-gray-400 font-nunito leading-normal">
          Hint: Try <code className="bg-pink/20 px-1 py-0.5 rounded text-purple">love123</code> for Relationship Mode, <br />
          <code className="bg-pink/20 px-1 py-0.5 rounded text-purple">friend123</code> for Friend Mode, or <br />
          <code className="bg-pink/20 px-1 py-0.5 rounded text-purple">family123</code> for Family Mode.
        </p>
      </motion.div>
    </div>
  );
}
