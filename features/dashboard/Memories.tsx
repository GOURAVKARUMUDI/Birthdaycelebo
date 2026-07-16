"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Share2, Info } from "lucide-react";
import { Memory } from "@/lib/mockData";
import { useAudio } from "@/hooks/useAudio";

interface MemoriesProps {
  memories: Memory[];
}

export default function Memories({ memories }: MemoriesProps) {
  const { playSfx } = useAudio();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "image" | "trip" | "date" | "favorites">("all");
  const [selectedMemoryIndex, setSelectedMemoryIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [likedMemories, setLikedMemories] = useState<Record<string, boolean>>({});

  // Filter memories based on search query and active tab
  const filteredMemories = memories.filter((mem) => {
    const matchesSearch =
      mem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.caption.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeTab === "all") return true;
    if (activeTab === "favorites") return !!likedMemories[mem.id];
    return mem.type === activeTab;
  });

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playSfx("click");
    setLikedMemories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedMemoryIndex === null) return;
    playSfx("hover");
    setZoomLevel(1);
    setSelectedMemoryIndex(
      selectedMemoryIndex === 0 ? filteredMemories.length - 1 : selectedMemoryIndex - 1
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedMemoryIndex === null) return;
    playSfx("hover");
    setZoomLevel(1);
    setSelectedMemoryIndex(
      selectedMemoryIndex === filteredMemories.length - 1 ? 0 : selectedMemoryIndex + 1
    );
  };

  // Block copy/downloads
  const preventDownload = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      
      {/* GOOGLE SEARCH MOCK */}
      <div className="flex flex-col items-center mb-10 mt-4">
        {/* Cute Google Logo Variant */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 font-poppins flex items-center gap-1 select-none"
        >
          <span className="text-sky font-bold drop-shadow-sm">M</span>
          <span className="text-pink font-bold drop-shadow-sm">o</span>
          <span className="text-yellow font-bold drop-shadow-sm">m</span>
          <span className="text-sky font-bold drop-shadow-sm">e</span>
          <span className="text-mint font-bold drop-shadow-sm">n</span>
          <span className="text-purple font-bold drop-shadow-sm">t</span>
          <span className="text-pink font-bold drop-shadow-sm">s</span>
          <span className="text-purple ml-2 text-2xl animate-pulse font-normal">of Us ❤️</span>
        </motion.h1>

        {/* Search Bar Wrapper */}
        <div className="w-full max-w-xl relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search our special moments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 rounded-full border border-pink/30 bg-white/80 shadow-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink/50 text-gray-700 font-nunito text-base transition-all"
            onFocus={() => playSfx("hover")}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")} 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Google Mock Action Buttons */}
        <div className="flex gap-4 mt-4">
          <button 
            onClick={() => playSfx("click")}
            className="px-4 py-2 text-sm font-semibold rounded-md bg-white border border-gray-200 text-gray-600 shadow-sm hover:shadow hover:border-pink/30 hover:text-pink transition-all"
          >
            Google Search
          </button>
          <button 
            onClick={() => {
              playSfx("success");
              // Pick random memory
              if (filteredMemories.length > 0) {
                const randIndex = Math.floor(Math.random() * filteredMemories.length);
                setSelectedMemoryIndex(randIndex);
              }
            }}
            className="px-4 py-2 text-sm font-semibold rounded-md bg-white border border-gray-200 text-gray-600 shadow-sm hover:shadow hover:border-pink/30 hover:text-pink transition-all"
          >
            I'm Feeling Lucky 🌟
          </button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-2 border-b border-pink/20 pb-2 mb-6 overflow-x-auto select-none no-scrollbar">
        {(["all", "date", "trip", "image", "favorites"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              playSfx("hover");
              setActiveTab(tab);
            }}
            className={`px-4 py-2 rounded-full text-sm font-semibold capitalize whitespace-nowrap transition-all ${
              activeTab === tab
                ? "bg-purple text-white shadow-sm"
                : "text-gray-500 hover:bg-pink/10 hover:text-purple"
            }`}
          >
            {tab === "image" ? "Photos" : tab === "all" ? "All Moments" : tab}
          </button>
        ))}
      </div>

      {/* PINTEREST POLAROID MASONRY GRID */}
      {filteredMemories.length === 0 ? (
        <div className="text-center py-20 text-gray-400 font-nunito">
          No matches found for your search. Try "sunset" or "coffee"!
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredMemories.map((mem, index) => {
            const isLiked = likedMemories[mem.id];
            return (
              <div
                key={mem.id}
                onClick={() => {
                  playSfx("click");
                  setSelectedMemoryIndex(index);
                }}
                className="break-inside-avoid bg-white p-4 rounded-xl shadow-md border border-pink/20 flex flex-col cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg group"
                onContextMenu={preventDownload}
              >
                {/* Image Wrap */}
                <div className="relative w-full overflow-hidden rounded-lg bg-pink/10 aspect-[4/3] sm:aspect-auto">
                  <img
                    src={mem.url}
                    alt={mem.title}
                    className="w-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500 select-none pointer-events-none"
                    loading="lazy"
                  />
                  
                  {/* Floating Type Badge */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-white/80 text-purple border border-pink/20">
                    {mem.type}
                  </span>

                  {/* Favorite overlay */}
                  <button
                    onClick={(e) => handleLike(mem.id, e)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-red-400 border border-pink/20 hover:scale-110 active:scale-95 transition-all shadow-sm z-10"
                  >
                    <Heart size={15} fill={isLiked ? "#F87171" : "none"} className={isLiked ? "text-red-500" : "text-gray-400"} />
                  </button>
                </div>

                {/* Text description (Polaroid bottom style) */}
                <div className="mt-3 flex flex-col font-patrick">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-800">{mem.title}</span>
                    <span className="text-xs font-nunito font-semibold text-gray-400">{mem.date}</span>
                  </div>
                  <p className="mt-1 text-base text-gray-500 line-clamp-2 leading-tight">
                    {mem.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX DIALOG */}
      <AnimatePresence>
        {selectedMemoryIndex !== null && (
          <div
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-9999 select-none p-4"
            onClick={() => setSelectedMemoryIndex(null)}
            onContextMenu={preventDownload}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMemoryIndex(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all shadow-md z-50"
            >
              <X size={24} />
            </button>

            {/* Navigation buttons */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all z-50"
            >
              <ChevronLeft size={28} />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all z-50"
            >
              <ChevronRight size={28} />
            </button>

            {/* Middle Frame content */}
            <div 
              className="relative max-w-4xl max-h-[80vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative overflow-hidden rounded-xl bg-neutral-900 border border-white/10 shadow-2xl">
                <img
                  src={filteredMemories[selectedMemoryIndex].url}
                  alt={filteredMemories[selectedMemoryIndex].title}
                  style={{ transform: `scale(${zoomLevel})` }}
                  className="max-h-[65vh] w-auto max-w-full object-contain transition-transform duration-200 select-none pointer-events-none"
                />
              </div>

              {/* Control bar */}
              <div className="mt-4 flex gap-4 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 border border-white/10 text-white">
                <button onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))} className="hover:text-pink transition-colors">
                  <ZoomIn size={20} />
                </button>
                <button onClick={() => setZoomLevel((z) => Math.max(1, z - 0.25))} className="hover:text-pink transition-colors">
                  <ZoomOut size={20} />
                </button>
                <button onClick={(e) => handleLike(filteredMemories[selectedMemoryIndex].id, e)} className="hover:text-red-400 transition-colors">
                  <Heart size={20} fill={likedMemories[filteredMemories[selectedMemoryIndex].id] ? "#F87171" : "none"} />
                </button>
              </div>

              {/* Title & Caption */}
              <div className="mt-4 text-center max-w-xl text-white font-patrick px-4">
                <h3 className="text-2xl font-bold">{filteredMemories[selectedMemoryIndex].title}</h3>
                <p className="text-sm font-nunito font-medium text-gray-400 mt-0.5">{filteredMemories[selectedMemoryIndex].date}</p>
                <p className="text-lg text-gray-300 mt-2 leading-relaxed">
                  {filteredMemories[selectedMemoryIndex].caption}
                </p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
