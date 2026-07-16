"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Volume2, RotateCcw, Activity } from "lucide-react";
import { Song, VoiceNote } from "@/lib/mockData";
import { useAudio } from "@/hooks/useAudio";

interface PlaylistProps {
  songs: Song[];
  voiceNotes: VoiceNote[];
}

export default function Playlist({ songs, voiceNotes }: PlaylistProps) {
  const { playMusic, pauseMusic, isPlayingMusic, setVolume, musicVolume, playSfx, activeTrackName, setActiveTrackName } = useAudio();
  
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [seekTime, setSeekTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(180); // Fallback mock duration in seconds
  const [isVoiceNoteMode, setIsVoiceNoteMode] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const seekTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeTracks: Array<Song | VoiceNote> = isVoiceNoteMode ? voiceNotes : songs;
  const currentTrack = activeTracks[currentTrackIndex] || songs[0];

  const handlePlayPause = () => {
    // Play physical analog tape click SFX
    playSfx("click");
    
    if (isPlayingMusic) {
      pauseMusic();
    } else {
      setActiveTrackName(currentTrack.title);
      playMusic(currentTrack.url);
    }
  };

  const handleNext = () => {
    playSfx("hover");
    const nextIndex = (currentTrackIndex + 1) % activeTracks.length;
    setCurrentTrackIndex(nextIndex);
    setSeekTime(0);
    
    const track = activeTracks[nextIndex];
    setActiveTrackName(track.title);
    if (isPlayingMusic) {
      playMusic(track.url);
    }
  };

  const handlePrev = () => {
    playSfx("hover");
    const prevIndex = (currentTrackIndex - 1 + activeTracks.length) % activeTracks.length;
    setCurrentTrackIndex(prevIndex);
    setSeekTime(0);
    
    const track = activeTracks[prevIndex];
    setActiveTrackName(track.title);
    if (isPlayingMusic) {
      playMusic(track.url);
    }
  };

  const toggleSpeed = () => {
    playSfx("hover");
    const speeds = [0.5, 1, 1.5, 2];
    const nextSpeedIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextSpeedIdx]);
  };

  // Simulate tape scroll position incrementing
  useEffect(() => {
    if (isPlayingMusic) {
      seekTimerRef.current = setInterval(() => {
        setSeekTime((t) => {
          if (t >= trackDuration) {
            handleNext();
            return 0;
          }
          return t + 1 * playbackSpeed;
        });
      }, 1000);
    } else {
      if (seekTimerRef.current) {
        clearInterval(seekTimerRef.current);
      }
    }
    return () => {
      if (seekTimerRef.current) clearInterval(seekTimerRef.current);
    };
  }, [isPlayingMusic, currentTrackIndex, playbackSpeed, isVoiceNoteMode]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins}:${String(remaining).padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-8">
      {/* Container holding the player */}
      <div className="rounded-3xl shadow-xl border border-pink/30 bg-[#FFFDF9] glass-panel p-6 flex flex-col items-center">
        
        {/* Toggle Mode: Playlist or Voice Notes */}
        <div className="flex gap-2 bg-pink/20 rounded-full p-1 mb-6 w-full max-w-[280px] select-none">
          <button
            onClick={() => {
              playSfx("click");
              setIsVoiceNoteMode(false);
              setCurrentTrackIndex(0);
              setSeekTime(0);
            }}
            className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${
              !isVoiceNoteMode ? "bg-purple text-white shadow-sm" : "text-gray-500 hover:text-purple"
            }`}
          >
            🎵 Playlist
          </button>
          <button
            onClick={() => {
              playSfx("click");
              setIsVoiceNoteMode(true);
              setCurrentTrackIndex(0);
              setSeekTime(0);
            }}
            className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${
              isVoiceNoteMode ? "bg-purple text-white shadow-sm" : "text-gray-500 hover:text-purple"
            }`}
          >
            🎙 Voice Notes
          </button>
        </div>

        {/* PHYSICAL CASSETTE DECK GRAPHIC */}
        <div className="relative w-full aspect-[1.6/1] bg-[#4A3F3F] border-4 border-[#332A2A] rounded-2xl p-4 shadow-2xl flex flex-col justify-between overflow-hidden">
          {/* Top screws */}
          <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-zinc-600 border border-zinc-700" />
          <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-zinc-600 border border-zinc-700" />
          <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-zinc-600 border border-zinc-700" />
          <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-zinc-600 border border-zinc-700" />

          {/* Cassette Label Plate */}
          <div className="w-full h-[65%] bg-pink border-2 border-pink/60 rounded-lg p-2.5 flex flex-col justify-between shadow-inner relative">
            
            {/* Horizontal stripes */}
            <div className="absolute top-1 left-0 right-0 h-1 bg-white/20" />
            <div className="absolute top-3 left-0 right-0 h-1.5 bg-white/25" />

            {/* Song Label Text */}
            <div className="flex justify-between items-center bg-cream/90 border border-pink/30 rounded px-2 py-1 z-10">
              <span className="font-patrick text-base text-gray-700 truncate w-[70%]">
                {currentTrack?.title || "No Track Selected"}
              </span>
              <span className="font-nunito text-[10px] text-pink font-bold truncate">
                {isVoiceNoteMode ? "VOICE TAPE" : "MIX TAPE"}
              </span>
            </div>

            {/* Spindle Deck Center */}
            <div className="w-full flex justify-around items-center h-12 bg-[#2D2424] rounded border-2 border-[#1A1515] p-1 relative">
              
              {/* Left Reel spindle */}
              <motion.div
                animate={isPlayingMusic ? { rotate: 360 } : {}}
                transition={{ repeat: Infinity, duration: 3 / playbackSpeed, ease: "linear" }}
                className="w-10 h-10 rounded-full border-4 border-dashed border-zinc-500 bg-[#1A1515] flex items-center justify-center relative"
              >
                <div className="w-4 h-4 rounded-full bg-zinc-700 border border-zinc-800" />
              </motion.div>

              {/* Tape View Window showing tape winding */}
              <div className="w-16 h-8 bg-black/60 rounded border border-[#443838] flex items-center justify-center overflow-hidden">
                {/* Visual EQ Lines moving if music is playing */}
                {isPlayingMusic ? (
                  <div className="flex gap-0.5 items-end h-6">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [4, 20, 4] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.5 + Math.random() * 0.4,
                          delay: i * 0.08,
                        }}
                        className="w-1 bg-[#4CAF50] rounded-t"
                      />
                    ))}
                  </div>
                ) : (
                  <Activity size={16} className="text-zinc-600 animate-pulse" />
                )}
              </div>

              {/* Right Reel spindle */}
              <motion.div
                animate={isPlayingMusic ? { rotate: 360 } : {}}
                transition={{ repeat: Infinity, duration: 3 / playbackSpeed, ease: "linear" }}
                className="w-10 h-10 rounded-full border-4 border-dashed border-zinc-500 bg-[#1A1515] flex items-center justify-center relative"
              >
                <div className="w-4 h-4 rounded-full bg-zinc-700 border border-zinc-800" />
              </motion.div>
            </div>
          </div>

          {/* Bottom Cassette trapezoid fold */}
          <div 
            className="w-[70%] h-[25%] bg-[#3D3535] border-t-2 border-[#262020] mx-auto flex justify-between items-center px-4"
            style={{ clipPath: "polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)" }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#1A1515]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#1A1515]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#1A1515]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#1A1515]" />
          </div>
        </div>

        {/* TIMELINE PROGRESS & SPEED CONTROLS */}
        <div className="w-full mt-6 select-none flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-nunito text-gray-500 font-bold">
            <span>{formatTime(seekTime)}</span>
            <span>{formatTime(trackDuration)}</span>
          </div>
          {/* Progress Slider */}
          <div className="w-full h-1.5 bg-pink/20 rounded-full overflow-hidden relative cursor-pointer">
            <motion.div
              style={{ width: `${(seekTime / trackDuration) * 100}%` }}
              className="h-full bg-purple"
            />
          </div>
        </div>

        {/* PLAYER ACTION PANEL */}
        <div className="w-full flex items-center justify-between mt-6 select-none">
          {/* Track speed control */}
          <button
            onClick={toggleSpeed}
            className="px-2.5 py-1 rounded-md border border-pink/30 text-xs font-bold text-gray-600 hover:bg-pink/10 transition-colors"
          >
            {playbackSpeed.toFixed(1)}x Speed
          </button>

          {/* Control Buttons */}
          <div className="flex gap-4 items-center">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full border border-pink/20 text-gray-600 hover:bg-pink/10 active:scale-90 transition-transform"
            >
              <SkipBack size={18} />
            </button>

            <button
              onClick={handlePlayPause}
              className={`p-4 rounded-full text-white shadow-md active:scale-95 transition-all ${
                isPlayingMusic ? "bg-pink hover:bg-pink/90" : "bg-purple hover:bg-purple/90"
              }`}
            >
              {isPlayingMusic ? <Pause size={22} fill="#FFFFFF" /> : <Play size={22} fill="#FFFFFF" className="ml-1" />}
            </button>

            <button
              onClick={handleNext}
              className="p-2 rounded-full border border-pink/20 text-gray-600 hover:bg-pink/10 active:scale-90 transition-transform"
            >
              <SkipForward size={18} />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-1">
            <Volume2 size={16} className="text-gray-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={musicVolume * 100}
              onChange={(e) => setVolume(Number(e.target.value) / 100)}
              className="w-16 h-1 rounded-lg accent-purple"
            />
          </div>
        </div>

        {/* Decorative note */}
        {!isVoiceNoteMode && currentTrack && (
          <p className="mt-4 font-patrick text-sm text-gray-400 font-medium">
            Song Artist: {(currentTrack as any).artist}
          </p>
        )}
      </div>
    </div>
  );
}
