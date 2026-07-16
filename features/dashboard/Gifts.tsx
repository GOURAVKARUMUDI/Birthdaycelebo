"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift as GiftIcon, Award, Key, QrCode, FileImage, X } from "lucide-react";
import { Gift } from "@/lib/mockData";
import { useAudio } from "@/hooks/useAudio";
import confetti from "canvas-confetti";

interface GiftsProps {
  gifts: Gift[];
}

export default function Gifts({ gifts }: GiftsProps) {
  const { playSfx } = useAudio();
  const [openedGifts, setOpenedGifts] = useState<Record<string, boolean>>({});
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);

  const handleOpenGift = (gift: Gift) => {
    if (openedGifts[gift.id]) {
      // If already opened, just inspect the reward again
      playSfx("click");
      setSelectedGift(gift);
      return;
    }

    playSfx("success");
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#FADADD", "#E8DEF8"],
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#FADADD", "#E8DEF8"],
    });

    setOpenedGifts((prev) => ({ ...prev, [gift.id]: true }));
    setSelectedGift(gift);
  };

  const getGiftIcon = (type: Gift["giftType"]) => {
    switch (type) {
      case "coupon":
        return <Award className="text-yellow w-8 h-8" />;
      case "secret_message":
        return <Key className="text-purple w-8 h-8" />;
      case "qr_code":
        return <QrCode className="text-sky w-8 h-8" />;
      case "photo":
        return <FileImage className="text-pink w-8 h-8" />;
      default:
        return <GiftIcon className="text-purple w-8 h-8" />;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8">
      <h2 className="text-center font-caveat text-4xl text-purple font-bold mb-8 select-none">
        Open Your Gifts 🎁
      </h2>

      {/* Gift Grid */}
      <div className="grid grid-cols-2 gap-6">
        {gifts.map((gift, index) => {
          const isOpen = openedGifts[gift.id];
          return (
            <motion.div
              key={gift.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleOpenGift(gift)}
              className="flex flex-col items-center cursor-pointer group"
            >
              {/* Gift Box Graphic Wrapper */}
              <div className="w-32 h-32 relative flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    /* Open Gift State */
                    <motion.div
                      key="open"
                      initial={{ scale: 0.8, rotate: -15, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="w-24 h-24 rounded-2xl bg-white border border-pink/30 shadow-md flex items-center justify-center relative hover:scale-105 transition-transform"
                    >
                      {getGiftIcon(gift.giftType)}
                      {/* Little star badge */}
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-yellow text-[10px] rounded-full flex items-center justify-center animate-bounce shadow">
                        ⭐
                      </span>
                    </motion.div>
                  ) : (
                    /* Closed Box SVG Graphic */
                    <motion.div
                      key="closed"
                      whileHover={{ scale: 1.05, rotate: [0, -3, 3, 0] }}
                      transition={{ duration: 0.3 }}
                      className="w-24 h-24 flex items-center justify-center relative"
                    >
                      {/* LID */}
                      <motion.div
                        className="absolute top-2 w-[90px] h-6 bg-[#FADADD] border border-pink/60 rounded-md z-10 shadow-sm flex justify-center items-center"
                        style={{ originY: "bottom" }}
                      >
                        {/* Ribbon bow */}
                        <div className="absolute -top-3 w-6 h-3 bg-purple rounded-t-full border border-purple/30" />
                      </motion.div>
                      
                      {/* BOX CONTAINER */}
                      <div className="absolute bottom-2 w-20 h-16 bg-[#FBC5CC] border border-pink/60 rounded-b-xl shadow-md flex items-center justify-center">
                        <div className="w-3.5 h-full bg-purple/80" /> {/* Vertical ribbon */}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Title under box */}
              <span className="mt-2 font-nunito text-xs font-bold text-gray-500 group-hover:text-purple transition-colors uppercase tracking-wider">
                {gift.title}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* POPUP PREVIEW FOR OPENED GIFT */}
      <AnimatePresence>
        {selectedGift && (
          <div
            onClick={() => setSelectedGift(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-9999 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-sm border border-pink/30 shadow-2xl p-6 relative flex flex-col items-center text-center"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedGift(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-pink/10 text-gray-400 hover:text-gray-600 transition-colors z-20"
              >
                <X size={20} />
              </button>

              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-pink/15 flex items-center justify-center mb-4">
                {getGiftIcon(selectedGift.giftType)}
              </div>

              <span className="text-[10px] font-nunito font-extrabold text-purple tracking-widest uppercase mb-1">
                Surprise Unlocked!
              </span>

              <h3 className="font-patrick text-3xl text-gray-800 font-bold mb-4">
                {selectedGift.title}
              </h3>

              {/* Content rendering based on gift type */}
              {selectedGift.giftType === "photo" ? (
                <div className="w-full rounded-2xl overflow-hidden shadow-md border border-pink/20 mb-2">
                  <img src={selectedGift.content} alt={selectedGift.title} className="w-full object-cover max-h-56" />
                </div>
              ) : selectedGift.giftType === "qr_code" ? (
                <div className="flex flex-col items-center">
                  <img src={selectedGift.content} alt="QR Code Surprise" className="w-40 h-40 border border-gray-200 rounded p-1 mb-2 bg-white" />
                  <p className="text-xs text-gray-400 font-nunito mt-1">Scan this QR code using your phone camera!</p>
                </div>
              ) : (
                <p className="font-nunito text-base text-gray-600 leading-relaxed px-2 bg-pink/5 rounded-xl py-4 border border-dashed border-pink/30 w-full mb-2">
                  {selectedGift.content}
                </p>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
