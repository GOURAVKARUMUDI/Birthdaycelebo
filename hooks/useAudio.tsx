"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface AudioContextType {
  isPlayingMusic: boolean;
  musicVolume: number;
  playMusic: (url?: string) => void;
  pauseMusic: () => void;
  setVolume: (volume: number) => void;
  // Sound effects synthesized via Web Audio API
  playSfx: (type: "hover" | "click" | "error" | "success" | "envelope" | "confetti") => void;
  activeTrackName: string;
  setActiveTrackName: (name: string) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.4);
  const [activeTrackName, setActiveTrackName] = useState("Birthday Lofi Theme");
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize Web Audio API context on first interaction
  const getAudioContext = (): AudioContext => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioCtx();
    }
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  };

  // Play background music
  const playMusic = (url?: string) => {
    if (typeof window === "undefined") return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }

    if (url && audioRef.current.src !== url) {
      audioRef.current.src = url;
    }

    audioRef.current.volume = musicVolume;
    
    // Resume browser audio context if suspended
    const ctx = getAudioContext();
    
    audioRef.current.play()
      .then(() => {
        setIsPlayingMusic(true);
      })
      .catch((err) => {
        console.warn("Autoplay blocked by browser. Music will start on interaction.", err);
      });
  };

  const pauseMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    }
  };

  const setVolume = (volume: number) => {
    const safeVolume = Math.max(0, Math.min(1, volume));
    setMusicVolume(safeVolume);
    if (audioRef.current) {
      audioRef.current.volume = safeVolume;
    }
  };

  // Synthesize Sound Effects
  const playSfx = (type: "hover" | "click" | "error" | "success" | "envelope" | "confetti") => {
    if (typeof window === "undefined") return;
    
    try {
      const ctx = getAudioContext();
      const dest = ctx.destination;
      
      const playSineTone = (freqStart: number, freqEnd: number, duration: number, gainValue = 0.1) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freqStart, ctx.currentTime);
        if (freqEnd !== freqStart) {
          osc.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + duration);
        }
        
        gainNode.gain.setValueAtTime(gainValue, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        
        osc.connect(gainNode);
        gainNode.connect(dest);
        
        osc.start();
        osc.stop(ctx.currentTime + duration);
      };

      switch (type) {
        case "hover":
          // Soft little pop/slide up
          playSineTone(600, 800, 0.08, 0.05);
          break;
        case "click":
          // Cute bubble popping sound
          playSineTone(400, 150, 0.12, 0.1);
          break;
        case "error": {
          // Low double buzz
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc1.type = "triangle";
          osc2.type = "sawtooth";
          osc1.frequency.setValueAtTime(130, ctx.currentTime);
          osc2.frequency.setValueAtTime(132, ctx.currentTime);
          
          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          gain.gain.setValueAtTime(0.12, ctx.currentTime + 0.1);
          gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.25);
          
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(dest);
          
          osc1.start();
          osc2.start();
          osc1.stop(ctx.currentTime + 0.25);
          osc2.stop(ctx.currentTime + 0.25);
          break;
        }
        case "success": {
          // Major chord arpeggio chime (C4 -> E4 -> G4 -> C5)
          const now = ctx.currentTime;
          const notes = [261.63, 329.63, 392.00, 523.25];
          notes.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now + index * 0.08);
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.08, now + index * 0.08 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.35);
            
            osc.connect(gain);
            gain.connect(dest);
            
            osc.start(now + index * 0.08);
            osc.stop(now + index * 0.08 + 0.4);
          });
          break;
        }
        case "envelope": {
          // Soft whoosh (using filtered white noise)
          const bufferSize = ctx.sampleRate * 0.4;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }
          
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          
          const filter = ctx.createBiquadFilter();
          filter.type = "bandpass";
          filter.frequency.setValueAtTime(100, ctx.currentTime);
          filter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.4);
          filter.Q.setValueAtTime(3, ctx.currentTime);
          
          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
          
          noise.connect(filter);
          filter.connect(gain);
          gain.connect(dest);
          
          noise.start();
          break;
        }
        case "confetti": {
          // Sharp snap followed by soft crackles
          playSineTone(800, 200, 0.15, 0.15);
          // Small noise crackles
          for (let i = 0; i < 5; i++) {
            setTimeout(() => {
              playSineTone(1000 + Math.random() * 2000, 500, 0.03 + Math.random() * 0.04, 0.03);
            }, 50 + i * 40);
          }
          break;
        }
      }
    } catch (e) {
      console.warn("Audio Context failed to execute SFX", e);
    }
  };

  useEffect(() => {
    // Keep volume synced on change
    if (audioRef.current) {
      audioRef.current.volume = musicVolume;
    }
  }, [musicVolume]);

  return (
    <AudioContext.Provider
      value={{
        isPlayingMusic,
        musicVolume,
        playMusic,
        pauseMusic,
        setVolume,
        playSfx,
        activeTrackName,
        setActiveTrackName,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
