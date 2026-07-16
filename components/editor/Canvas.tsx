"use client";

import React, { useRef, useEffect, useState } from "react";
import { useEditorStore } from "@/lib/store/editorStore";
import { BlockRenderer } from "@/components/builder/registry";
import ErrorBoundary from "./ErrorBoundary";
import { HelpCircle, Lock, EyeOff, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Canvas() {
  const {
    previewDevice,
    canvasZoom,
    pages,
    selectedPageId,
    theme,
    mascot,
    recipientName,
    selectedBlockId,
    setSelectedBlockId,
    addBlock,
    activeSidebarTab,
    setActiveSidebarTab
  } = useEditorStore() as any;

  const canvasRef = useRef<HTMLDivElement>(null);
  const [showAddInline, setShowAddInline] = useState(false);
  
  // Find active page
  const activePage = pages.find((p: any) => p.id === selectedPageId) || pages[0];

  // Device Dims
  const getDeviceDims = () => {
    switch (previewDevice) {
      case "mobile-se": return { w: 320, h: 568, name: "iPhone SE" };
      case "android": return { w: 360, h: 740, name: "Google Pixel 8" };
      case "fold": return { w: 712, h: 653, name: "Galaxy Fold" };
      case "tablet-p": return { w: 768, h: 1024, name: "iPad Portrait" };
      case "tablet-l": return { w: 1024, h: 768, name: "iPad Landscape" };
      case "laptop": return { w: 1280, h: 800, name: "MacBook Air" };
      case "desktop": return { w: 1440, h: 900, name: "Desktop Monitor" };
      case "ultrawide": return { w: 1920, h: 1080, name: "UltraWide Display" };
      case "mobile-15":
      default:
        return { w: 393, h: 852, name: "iPhone 15 Pro" };
    }
  };

  const device = getDeviceDims();

  // Apply custom theme colors to document variables inside preview context
  const previewStyles = {
    "--background": theme.backgroundColor,
    "--foreground": theme.foregroundColor,
    "--primary": theme.primaryColor,
    "--secondary": theme.secondaryColor,
    "--radius": theme.radius,
    "--shadow-sm": theme.shadows === "sm" ? "0 1px 3px rgba(0,0,0,0.05)" : "0 4px 12px rgba(0,0,0,0.05)",
    "--shadow-md": theme.shadows === "md" ? "0 4px 12px rgba(0,0,0,0.08)" : "0 10px 25px rgba(0,0,0,0.08)",
    "--shadow-lg": theme.shadows === "lg" ? "0 10px 25px rgba(0,0,0,0.12)" : "0 10px 25px rgba(0,0,0,0.12)",
    fontFamily: theme.fontBody,
  } as React.CSSProperties;

  // Compile specific heading font families
  const headingStyles = {
    fontFamily: theme.fontHeading,
  };

  const handwritingStyles = {
    fontFamily: theme.fontHandwriting,
  };

  // Compile falling background elements based on animation setting
  const renderBackgroundEffects = () => {
    if (theme.backgroundAnimation === "none") return null;

    const count = 12;
    const items = Array.from({ length: count });
    let char = "🎈";
    if (theme.backgroundAnimation === "hearts") char = "💖";
    if (theme.backgroundAnimation === "stars") char = "⭐";
    if (theme.backgroundAnimation === "petals") char = "🌸";
    if (theme.backgroundAnimation === "confetti") char = "🎉";

    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {items.map((_, i) => {
          const delay = i * 1.5;
          const left = (i * (100 / count)) + (Math.random() * 5);
          const sizeVal = 14 + (Math.random() * 20);
          const duration = 8 + (Math.random() * 6);

          return (
            <motion.div
              key={i}
              initial={{ y: "110%", opacity: 0.1, x: `${left}%` }}
              animate={{
                y: "-10%",
                opacity: [0, 0.7, 0.7, 0],
                x: [`${left}%`, `${left + (Math.random() * 10 - 5)}%`, `${left}%`]
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

  return (
    <div 
      ref={canvasRef}
      className="flex-1 bg-[#F5F4F0] overflow-auto flex items-center justify-center p-8 relative selection:bg-purple/10 cursor-grab active:cursor-grabbing"
      style={{
        backgroundImage: "radial-gradient(circle, #E1DDD5 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px"
      }}
      onClick={() => {
        setSelectedBlockId(null);
        setActiveSidebarTab("theme");
      }}
    >
      
      {/* Visual Alignment Guides / Grid coordinates details */}
      <div className="absolute top-4 left-4 pointer-events-none font-nunito font-bold text-[10px] text-gray-400 uppercase tracking-widest bg-white/50 backdrop-blur px-2.5 py-1 rounded-md border border-gray-200/50 shadow-sm">
        Canvas Workspace • Zoom: {Math.round(canvasZoom * 100)}% • {device.name} ({device.w}x{device.h}px)
      </div>

      {/* Rulers / snapping boundary guide */}
      <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-gray-300/30 border-l border-dashed border-gray-400/20 pointer-events-none" />
      <div className="absolute left-0 right-0 top-12 h-[1px] bg-gray-300/30 border-t border-dashed border-gray-400/20 pointer-events-none" />

      {/* Frame container scaling */}
      <motion.div
        animate={{ scale: canvasZoom }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ originX: 0.5, originY: 0.5 }}
        onClick={(e) => e.stopPropagation()}
        className="relative"
      >
        
        {/* Outer Frame device label indicator */}
        <div className="absolute -top-6 left-2 font-nunito font-extrabold text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-1">
          {device.name} • {device.w} × {device.h}
        </div>

        {/* The responsive frame */}
        <div
          style={{ 
            width: device.w, 
            height: device.h,
            ...previewStyles
          }}
          className="bg-white border-8 border-gray-800 rounded-[38px] shadow-2xl relative flex flex-col justify-between overflow-hidden transition-all duration-300"
        >
          
          {/* Status bar notch simulation for mobile layouts */}
          {(previewDevice.startsWith("mobile") || previewDevice === "android") && (
            <div className="absolute top-0 inset-x-0 h-7 bg-black z-50 flex justify-between items-center px-6 text-[10px] text-white font-nunito pointer-events-none select-none">
              <span>9:41</span>
              <div className="w-20 h-4 bg-black rounded-b-xl mx-auto absolute left-1/2 -translate-x-1/2 top-0" />
              <div className="flex gap-1">
                <span>📶</span>
                <span>🔋</span>
              </div>
            </div>
          )}

          {/* Top header navigation inside preview scrapbook */}
          <header className={`sticky top-0 w-full backdrop-blur-md bg-white/70 border-b border-pink-100 z-40 select-none py-3 px-6 flex justify-between items-center shadow-sm ${previewDevice.startsWith("mobile") || previewDevice === "android" ? "mt-7" : ""}`}>
            <span className="font-poppins text-xs md:text-sm font-bold tracking-tight" style={headingStyles}>
              🎂 {recipientName}'s Custom Scrapbook
            </span>
          </header>

          {/* Inner Canvas Page Content Scroll */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative flex flex-col justify-start z-10 no-scrollbar">
            
            {/* Custom page headings set by Caption Manager (Clickable Hotspot) */}
            {activePage && (
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBlockId(null);
                  setActiveSidebarTab("captions");
                }}
                className="text-center mb-8 mt-2 space-y-2 z-10 cursor-pointer hover:ring-1 hover:ring-purple/40 hover:bg-purple/5 p-2 rounded-2xl transition-all relative group"
                title="Click to edit Page Headings & Quotes"
              >
                <div className="absolute top-1 right-2 text-[8px] font-black uppercase tracking-wider bg-purple text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-30">
                  Edit Headings
                </div>
                {activePage.heading && (
                  <h1 className="text-2xl md:text-3xl font-black text-gray-800 leading-tight" style={headingStyles}>
                    {activePage.heading}
                  </h1>
                )}
                {activePage.subheading && (
                  <p className="text-xs text-gray-400 font-extrabold uppercase tracking-widest">
                    {activePage.subheading}
                  </p>
                )}
                {activePage.quote && (
                  <div className="max-w-xs mx-auto p-4 bg-purple/5 border-l-4 border-purple italic text-base text-gray-600 rounded-r-xl" style={handwritingStyles}>
                    &ldquo;{activePage.quote}&rdquo;
                  </div>
                )}
              </div>
            )}

            {/* Custom falling animated background effects */}
            {renderBackgroundEffects()}

            {/* Editable layout blocks list */}
            {activePage && activePage.blocks && activePage.blocks.length > 0 ? (
              <div className="space-y-6 flex-1 z-10 relative">
                {activePage.blocks.map((block: any) => {
                  const isSelected = selectedBlockId === block.id;
                  const isHidden = block.properties?.hidden;
                  const isLocked = block.properties?.locked;
                  
                  return (
                    <div
                      key={block.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBlockId(block.id);
                      }}
                      className={`relative cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? "ring-2 ring-purple rounded-2xl shadow-md scale-[1.01]" 
                          : "hover:ring-1 hover:ring-pink-300 hover:rounded-2xl"
                      } ${isHidden ? "opacity-50 border border-dashed border-gray-400 bg-gray-100/5" : ""}`}
                    >
                      {/* Visual indicator handle for active block */}
                      {isSelected && (
                        <div className="absolute -top-2.5 -left-1 bg-purple text-[8px] text-white font-nunito font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm z-50 flex items-center gap-1">
                          {isLocked && <Lock size={8} />}
                          <span>{block.type}</span>
                        </div>
                      )}

                      {/* Top right indicator icons */}
                      <div className="absolute top-2 right-2 flex gap-1 z-30">
                        {isLocked && (
                          <span className="p-1 bg-white/90 backdrop-blur rounded-full text-amber-600 shadow-sm" title="Locked Block">
                            <Lock size={10} />
                          </span>
                        )}
                        {isHidden && (
                          <span className="p-1 bg-white/90 backdrop-blur rounded-full text-gray-500 shadow-sm" title="Hidden in Live View">
                            <EyeOff size={10} />
                          </span>
                        )}
                      </div>
                      
                      <ErrorBoundary>
                        <BlockRenderer
                          block={block}
                          recipientName={recipientName}
                          fallbackData={{
                            memories: [],
                            timeline: [],
                            playlist: [],
                            voiceNotes: [],
                            gifts: [],
                            chats: [],
                            letterContent: "Write a letter...",
                            countdownDate: new Date().toISOString(),
                          }}
                        />
                      </ErrorBoundary>
                    </div>
                  );
                })}

                {/* Inline Inserter Component at Page bottom */}
                <div className="mt-8 pt-4 border-t border-dashed border-pink-100">
                  {showAddInline ? (
                    <div className="bg-white/95 border border-pink-200 rounded-2xl p-3 shadow-md flex flex-wrap gap-1.5 justify-center items-center max-w-[280px] mx-auto transition-all z-20">
                      {[
                        { type: "heading", label: "Title", icon: "✨" },
                        { type: "text", label: "Text", icon: "✏️" },
                        { type: "countdown", label: "Timer", icon: "⏳" },
                        { type: "mascot", label: "Mascot", icon: "🦁" },
                        { type: "memories", label: "Photos", icon: "🖼️" },
                        { type: "letter", label: "Letter", icon: "✉️" },
                        { type: "playlist", label: "Music", icon: "🎵" },
                        { type: "quote", label: "Quote", icon: "✍️" },
                      ].map((btn) => (
                        <button
                          key={btn.type}
                          onClick={() => {
                            addBlock(activePage.id, btn.type);
                            setShowAddInline(false);
                          }}
                          className="px-2 py-1 bg-gray-50 hover:bg-purple/10 border border-gray-100 hover:border-purple/20 rounded-lg text-[9px] font-bold text-gray-600 hover:text-purple transition-all flex items-center gap-1 shrink-0"
                        >
                          <span>{btn.icon}</span>
                          <span>{btn.label}</span>
                        </button>
                      ))}
                      <button
                        onClick={() => setShowAddInline(false)}
                        className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[9px] font-bold transition-all shrink-0"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <button
                        onClick={() => setShowAddInline(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-pink-200 hover:border-purple/40 bg-white hover:bg-purple/5 rounded-xl text-[9px] font-bold text-gray-500 hover:text-purple shadow-sm transition-all"
                      >
                        <PlusCircle size={11} /> Add Component Inline
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="text-center py-16 text-gray-400 font-nunito text-xs border-2 border-dashed border-pink-200 rounded-3xl flex flex-col justify-center items-center gap-2.5 p-6 flex-1 z-10">
                <HelpCircle size={32} className="text-pink animate-bounce" />
                <p className="font-bold text-gray-500">Empty Page Design Canvas</p>
                
                {/* Empty State Inline list picker */}
                <div className="bg-white/80 border border-pink-100 rounded-2xl p-3 shadow-inner flex flex-wrap gap-1.5 justify-center max-w-[260px] mt-2">
                  {[
                    { type: "heading", label: "Heading", icon: "✨" },
                    { type: "countdown", label: "Countdown", icon: "⏳" },
                    { type: "mascot", label: "Mascot", icon: "🦁" },
                    { type: "memories", label: "Photos", icon: "🖼️" },
                  ].map((btn) => (
                    <button
                      key={btn.type}
                      onClick={() => addBlock(activePage?.id || pages[0]?.id, btn.type)}
                      className="px-2 py-1 bg-white hover:bg-purple hover:text-white border border-pink-100 rounded-lg text-[9px] font-bold text-gray-500 transition-all flex items-center gap-1"
                    >
                      <span>{btn.icon}</span>
                      <span>{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom page button & footer text (Clickable Hotspot) */}
            {activePage && (
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBlockId(null);
                  setActiveSidebarTab("captions");
                }}
                className="text-center mt-12 mb-4 space-y-4 z-10 cursor-pointer hover:ring-1 hover:ring-purple/40 hover:bg-purple/5 p-2 rounded-2xl transition-all relative group"
                title="Click to edit CTA Button & Footer"
              >
                <div className="absolute top-1 right-2 text-[8px] font-black uppercase tracking-wider bg-purple text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-30">
                  Edit Button & Footer
                </div>
                {activePage.buttonText && (
                  <button className="px-6 py-2.5 bg-purple text-white text-xs font-bold rounded-full shadow-md hover:bg-purple/90 transition-all">
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

          </div>

          {/* Dynamic iOS-style Bottom Tab Bar Navigation Simulator */}
          <footer className="bg-white/90 border-t border-pink-100 py-3 z-40 flex justify-around shadow-lg">
            {pages.map((p: any) => (
              <div
                key={p.id}
                onClick={(e) => { e.stopPropagation(); (useEditorStore.getState() as any).setSelectedPageId(p.id); }}
                className={`flex flex-col items-center gap-0.5 text-[9px] font-bold select-none cursor-pointer transition-all ${
                  selectedPageId === p.id 
                    ? "text-purple scale-105" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <div className="w-4 h-4 rounded bg-gray-100 flex items-center justify-center text-[10px]">
                  📂
                </div>
                <span>{p.title}</span>
              </div>
            ))}
          </footer>

        </div>
      </motion.div>
    </div>
  );
}
