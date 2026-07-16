"use client";

import React from "react";
import Countdown from "@/features/dashboard/Countdown";
import MascotRenderer from "@/components/builder/MascotRenderer";
import Memories from "@/features/dashboard/Memories";
import Letter from "@/features/dashboard/Letter";
import Playlist from "@/features/dashboard/Playlist";
import Timeline from "@/features/dashboard/Timeline";
import Chats from "@/features/dashboard/Chats";
import Games from "@/features/dashboard/Games";
import Gifts from "@/features/dashboard/Gifts";

// Dynamic block registration map
export const COMPONENT_REGISTRY: Record<string, React.ComponentType<any>> = {
  countdown: ({ properties }) => <Countdown targetDate={properties.targetDate} />,
  mascot: ({ properties }) => (
    <div className="flex flex-col items-center select-none">
      <MascotRenderer
        type={properties.type || "giraffe"}
        state={properties.state || "idle"}
        size={properties.size || 150}
        customUrl={properties.customUrl}
        enableBirthdayOutfit={properties.enableBirthdayOutfit}
        animationStyle={properties.animationStyle}
        rotation={properties.rotation}
        opacity={properties.opacity}
      />
      {properties.caption && (
        <p className="mt-2 font-patrick text-sm text-gray-500 text-center">{properties.caption}</p>
      )}
    </div>
  ),
  heading: ({ properties }) => (
    <div className="text-center p-2">
      <h2 className="font-poppins text-3xl font-extrabold text-gray-800 leading-tight">
        {properties.title || "Custom Section Title"}
      </h2>
      {properties.subtitle && (
        <p className="font-nunito text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">
          {properties.subtitle}
        </p>
      )}
    </div>
  ),
  text: ({ properties }) => (
    <p className="font-nunito text-base text-gray-600 leading-relaxed px-4 text-center">
      {properties.text || "Write some beautiful story text paragraphs here..."}
    </p>
  ),
  letter: ({ properties, fallbackData }) => <Letter content={properties.content || fallbackData.letterContent} />,
  memories: ({ properties, fallbackData }) => <Memories memories={properties.memories || fallbackData.memories} />,
  playlist: ({ properties, fallbackData }) => <Playlist songs={properties.songs || fallbackData.playlist} voiceNotes={properties.voiceNotes || fallbackData.voiceNotes} />,
  timeline: ({ properties, fallbackData }) => <Timeline timeline={properties.timeline || fallbackData.timeline} />,
  chats: ({ properties, fallbackData, recipientName }) => <Chats messages={properties.messages || fallbackData.chats} recipientName={recipientName} />,
  gifts: ({ properties, fallbackData }) => <Gifts gifts={properties.gifts || fallbackData.gifts} />,
  games: () => <Games />,
  spotify: ({ properties }) => (
    <div className="w-full flex justify-center p-2">
      <iframe
        src={properties.embedUrl || "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGmq7BmE"}
        width="100%"
        height="352"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-view"
        loading="lazy"
        className="rounded-2xl border border-pink/10 shadow"
      />
    </div>
  ),
  youtube: ({ properties }) => (
    <div className="w-full aspect-video rounded-2xl overflow-hidden border border-pink/10 shadow p-2">
      <iframe
        width="100%"
        height="100%"
        src={properties.embedUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        loading="lazy"
        className="border-0"
      />
    </div>
  ),
  image: ({ properties }) => (
    <div className="w-full max-w-lg mx-auto overflow-hidden rounded-2xl border border-pink/10 shadow p-2 bg-white">
      <img
        src={properties.imageUrl || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop"}
        alt="Custom"
        className="w-full h-auto object-cover rounded-xl"
      />
      {properties.caption && (
        <p className="mt-2 font-patrick text-sm text-gray-500 text-center">{properties.caption}</p>
      )}
    </div>
  ),
  quote: ({ properties }) => (
    <div className="w-full max-w-md mx-auto p-6 bg-pink/5 rounded-2xl border-l-4 border-purple italic font-caveat text-2xl text-gray-700 text-center shadow-sm">
      "{properties.quote || "Sometimes, all you need is code that compiles on the first try."}"
      {properties.author && (
        <span className="block font-sans text-xs uppercase font-extrabold tracking-widest text-pink mt-2 not-italic">
          — {properties.author}
        </span>
      )}
    </div>
  ),
};

interface BlockRendererProps {
  block: {
    id: string;
    type: string;
    properties: Record<string, any>;
    styles: Record<string, any>;
    animation: Record<string, any>;
  };
  recipientName: string;
  fallbackData: any;
}

export function BlockRenderer({ block, recipientName, fallbackData }: BlockRendererProps) {
  const Component = COMPONENT_REGISTRY[block.type];

  if (!Component) {
    return (
      <div className="p-4 border border-dashed border-red-300 rounded text-center text-xs text-red-400">
        Component not registered: {block.type}
      </div>
    );
  }

  // Error boundary protection
  return (
    <React.Suspense fallback={<div className="p-4 animate-pulse bg-gray-50 rounded">Loading block...</div>}>
      <Component block={block} properties={block.properties} styles={block.styles} animation={block.animation} recipientName={recipientName} fallbackData={fallbackData} />
    </React.Suspense>
  );
}
