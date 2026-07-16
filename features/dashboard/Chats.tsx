"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Phone, Video as VideoIcon, MoreVertical, Smile, Check, CheckCheck, Mic } from "lucide-react";
import { ChatMessage } from "@/lib/mockData";
import { useAudio } from "@/hooks/useAudio";

interface ChatsProps {
  messages: ChatMessage[];
  recipientName: string;
}

export default function Chats({ messages, recipientName }: ChatsProps) {
  const { playSfx } = useAudio();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(messages);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeReactionId, setActiveReactionId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleSend = (textToSend = inputText) => {
    if (!textToSend.trim()) return;
    
    playSfx("click");
    const newMsg: ChatMessage = {
      id: `chat-user-${Date.now()}`,
      sender: "me",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: [],
    };
    
    setChatMessages((prev) => [...prev, newMsg]);
    setInputText("");

    // Simulate recipient replying after 2 seconds
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      playSfx("success");
      const replies = [
        "Aww, that is so sweet! 🥰",
        "Omg, I'm loving this birthday scrapbook! ❤️",
        "Haha, you're code is amazing! 😂",
        "Let's play the mini games next! 🎯",
        "Did you open the gifts yet? 🎁"
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      
      setChatMessages((prev) => [
        ...prev,
        {
          id: `chat-reply-${Date.now()}`,
          sender: "them",
          text: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reactions: [],
        }
      ]);
    }, 2200);
  };

  const handleReact = (id: string, emoji: string) => {
    playSfx("click");
    setChatMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === id) {
          const reactions = msg.reactions.includes(emoji)
            ? msg.reactions.filter((r) => r !== emoji)
            : [...msg.reactions, emoji].slice(-3); // Limit to 3 reactions max
          return { ...msg, reactions };
        }
        return msg;
      })
    );
    setActiveReactionId(null);
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8">
      {/* Phone container style */}
      <div className="rounded-3xl shadow-xl border border-gray-200 overflow-hidden bg-[#E5DDD5] h-[550px] flex flex-col relative">
        
        {/* WHATSAPP TOP BAR */}
        <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-md select-none z-10">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-pink/30 flex items-center justify-center font-bold text-white border border-white/20">
              {recipientName[0]}
            </div>
            
            <div className="flex flex-col">
              <span className="font-poppins text-sm font-bold">{recipientName}</span>
              <span className="text-[10px] text-teal-100 font-medium">
                {isTyping ? "typing..." : "online"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-teal-100 hover:text-white transition-colors">
            <button onClick={() => playSfx("click")}><Phone size={16} /></button>
            <button onClick={() => playSfx("click")}><VideoIcon size={16} /></button>
            <button onClick={() => playSfx("click")}><MoreVertical size={16} /></button>
          </div>
        </div>

        {/* CHAT BUBBLES SCROLL AREA */}
        <div 
          ref={scrollRef}
          className="flex-1 p-4 overflow-y-auto space-y-4 no-scrollbar relative"
          style={{
            backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
            backgroundSize: "cover",
            backgroundBlendMode: "overlay",
          }}
        >
          {chatMessages.map((msg) => {
            const isMe = msg.sender === "me";
            return (
              <div 
                key={msg.id}
                className={`flex w-full ${isMe ? "justify-end" : "justify-start"} relative`}
              >
                {/* Bubble box */}
                <div 
                  onClick={() => {
                    setActiveReactionId(activeReactionId === msg.id ? null : msg.id);
                  }}
                  className={`max-w-[75%] rounded-2xl px-3 py-2 shadow-sm relative group cursor-pointer ${
                    isMe 
                      ? "bg-[#DCF8C6] text-gray-800 rounded-tr-none" 
                      : "bg-white text-gray-800 rounded-tl-none"
                  }`}
                >
                  <p className="font-nunito text-sm leading-snug whitespace-pre-wrap pr-1">{msg.text}</p>
                  
                  {/* Timestamp & Read receipts */}
                  <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-gray-400 font-bold select-none">
                    <span>{msg.timestamp}</span>
                    {isMe && (
                      <CheckCheck size={12} className="text-[#34B7F1]" />
                    )}
                  </div>

                  {/* Render Emoji reactions inside the bubble */}
                  {msg.reactions.length > 0 && (
                    <div className="absolute -bottom-2 right-2 bg-white rounded-full px-1.5 py-0.5 border border-pink/30 flex gap-0.5 shadow-sm text-xs select-none">
                      {msg.reactions.map((r, i) => (
                        <span key={i} className="animate-bounce">{r}</span>
                      ))}
                    </div>
                  )}

                  {/* Reaction Popup drawer */}
                  <AnimatePresence>
                    {activeReactionId === msg.id && (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className={`absolute -top-10 z-20 bg-white rounded-full border border-pink/30 shadow-md px-2 py-1 flex gap-2 text-base select-none ${
                          isMe ? "right-0" : "left-0"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {["❤️", "😂", "👍", "🎉", "😮"].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => handleReact(msg.id, emoji)}
                            className="hover:scale-125 transition-transform"
                          >
                            {emoji}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}

          {/* Recipient Typing Indicator bubble */}
          {isTyping && (
            <div className="flex w-full justify-start">
              <div className="bg-white rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0s]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.3s]" />
              </div>
            </div>
          )}
        </div>

        {/* MOCK CHAT INPUT BAR */}
        <div className="bg-[#F0F0F0] px-3 py-2 flex items-center gap-2 border-t border-gray-300 z-10">
          <button 
            onClick={() => playSfx("hover")}
            className="text-gray-500 hover:text-gray-700"
          >
            <Smile size={22} />
          </button>
          
          <input
            type="text"
            placeholder="Type message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-1.5 text-sm font-nunito focus:outline-none"
            onFocus={() => playSfx("hover")}
          />

          {inputText.trim() ? (
            <button
              onClick={() => handleSend()}
              className="w-9 h-9 rounded-full bg-[#075E54] hover:bg-[#064e46] text-white flex items-center justify-center active:scale-90 transition-transform"
            >
              <Send size={16} className="ml-0.5" />
            </button>
          ) : (
            <button
              onClick={() => {
                playSfx("success");
                handleSend("🎙 Voice Note Sent [0:04] 🎵");
              }}
              className="w-9 h-9 rounded-full bg-[#075E54] hover:bg-[#064e46] text-white flex items-center justify-center active:scale-90 transition-transform"
            >
              <Mic size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
