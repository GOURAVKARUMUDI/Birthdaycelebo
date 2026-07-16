"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Image as ImageIcon, Heart, Info, X } from "lucide-react";
import { TimelineEvent } from "@/lib/mockData";
import { useAudio } from "@/hooks/useAudio";

interface TimelineProps {
  timeline: TimelineEvent[];
}

export default function Timeline({ timeline }: TimelineProps) {
  const { playSfx } = useAudio();
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 relative">
      <h2 className="text-center font-caveat text-4xl text-purple font-bold mb-12 select-none">
        Our Timeline Road ❤️
      </h2>

      {/* Dotted vertical center line */}
      <div className="absolute left-1/2 -translate-x-1/2 top-28 bottom-12 w-1 border-l-2 border-dashed border-pink/40" />

      {/* Timeline nodes */}
      <div className="relative flex flex-col gap-12 md:gap-16">
        {timeline.map((event, index) => {
          const isLeft = index % 2 === 0;
          
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`flex w-full items-center ${
                isLeft ? "justify-start md:flex-row-reverse" : "justify-start md:flex-row"
              }`}
            >
              {/* Event card container */}
              <div className={`w-[45%] hidden md:block`} />
              
              {/* Node Center Dot */}
              <div 
                onClick={() => {
                  playSfx("success");
                  setSelectedEvent(event);
                }}
                className="w-10 h-10 rounded-full bg-pink hover:bg-purple border-4 border-[#FFFDF9] shadow-md flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all z-10"
              >
                <Heart size={14} className="text-white fill-white" />
              </div>

              {/* Event card content */}
              <div 
                onClick={() => {
                  playSfx("click");
                  setSelectedEvent(event);
                }}
                className={`w-[85%] md:w-[45%] ml-4 md:ml-0 cursor-pointer bg-white/70 glass-card p-5 rounded-2xl border border-pink/30 hover:border-pink transition-all flex flex-col`}
              >
                {/* Header info */}
                <div className="flex items-center gap-2 text-xs font-nunito font-bold text-purple/80 uppercase mb-2">
                  <Calendar size={12} />
                  <span>{event.date}</span>
                </div>

                {/* Event title */}
                <h3 className="font-patrick text-2xl text-gray-800 font-bold mb-2">
                  {event.title}
                </h3>

                {/* Media preview */}
                {event.mediaUrl && (
                  <div className="w-full h-32 overflow-hidden rounded-xl border border-pink/10 mb-3 bg-pink/5">
                    <img 
                      src={event.mediaUrl} 
                      alt={event.title}
                      className="w-full h-full object-cover rounded-xl"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Description */}
                <p className="font-nunito text-sm text-gray-500 line-clamp-2 leading-relaxed">
                  {event.description}
                </p>

                {/* Detail hint */}
                <span className="text-[10px] text-pink font-semibold mt-3 text-right flex items-center justify-end gap-1 font-nunito">
                  <Info size={10} /> View details
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* MODAL OVERLAY FOR TIMELINE DETAILS */}
      <AnimatePresence>
        {selectedEvent && (
          <div 
            onClick={() => setSelectedEvent(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-9999 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden border border-pink/30 shadow-2xl p-6 relative flex flex-col"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-pink/10 text-gray-400 hover:text-gray-600 transition-colors z-20"
              >
                <X size={20} />
              </button>

              {/* Event Image */}
              {selectedEvent.mediaUrl && (
                <div className="w-full h-56 rounded-2xl overflow-hidden mb-4 bg-pink/5 relative border border-pink/10">
                  <img 
                    src={selectedEvent.mediaUrl} 
                    alt={selectedEvent.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Date */}
              <span className="text-xs font-nunito font-extrabold text-purple tracking-widest uppercase mb-1">
                {selectedEvent.date}
              </span>

              {/* Title */}
              <h3 className="font-patrick text-3xl text-gray-800 font-bold mb-3">
                {selectedEvent.title}
              </h3>

              {/* Description */}
              <p className="font-nunito text-base text-gray-600 leading-relaxed overflow-y-auto max-h-48 pr-2">
                {selectedEvent.description}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
