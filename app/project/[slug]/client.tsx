"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Sparkles } from "lucide-react";

// Dynamically import heavy page components to split the bundle
const Loading = dynamic(() => import("@/features/landing/Loading"), { ssr: false });
const PasswordGate = dynamic(() => import("@/features/landing/PasswordGate"), { ssr: false });
const Envelope = dynamic(() => import("@/features/landing/Envelope"), { ssr: false });
const Welcome = dynamic(() => import("@/features/landing/Welcome"), { ssr: false });
const Intro = dynamic(() => import("@/features/landing/Intro"), { ssr: false });
const Dashboard = dynamic(() => import("@/features/dashboard/Dashboard"), { ssr: false });

type FlowState = "LOADING" | "PASSWORD" | "ENVELOPE" | "WELCOME" | "INTRO" | "DASHBOARD";

interface Props {
  slug: string;
  initialConfig: any;
  initialError: string | null;
}

export default function PublicProjectClient({ slug, initialConfig, initialError }: Props) {
  const [flowState, setFlowState] = useState<FlowState>(initialConfig ? "LOADING" : "LOADING");
  const [mode, setMode] = useState<"friend" | "relationship" | "family">("relationship");

  if (initialError) {
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-[#FFFDF9] font-sans text-center px-4 gap-3 select-none">
        <div
          className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-400 text-xl"
          role="img"
          aria-label="Gift box icon"
        >
          🎁
        </div>
        <h1 className="text-sm font-black text-gray-800">Scrapbook Not Found</h1>
        <p className="text-xs text-gray-500 max-w-sm leading-relaxed">{initialError}</p>
      </div>
    );
  }

  if (!initialConfig) {
    return (
      <div
        className="flex h-screen w-screen flex-col items-center justify-center bg-[#FFFDF9] font-sans gap-3.5 select-none"
        role="status"
        aria-label="Loading scrapbook"
      >
        <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-400 shadow animate-bounce">
          <Sparkles size={16} aria-hidden="true" />
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-xs font-black text-gray-600">Unlocking Surprise</h2>
          <p className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider mt-1">
            Setting up memories and background animations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-screen flex flex-col bg-[#FFFDF9] overflow-x-hidden">
      {flowState === "LOADING" && (
        <Loading
          onComplete={() => setFlowState("PASSWORD")}
          recipientName={initialConfig.recipientName}
        />
      )}

      {flowState === "PASSWORD" && (
        <PasswordGate
          onSuccess={(selectedMode) => {
            setMode(selectedMode);
            setFlowState("ENVELOPE");
          }}
          validPasswords={initialConfig.passwords}
        />
      )}

      {flowState === "ENVELOPE" && (
        <Envelope
          onOpenComplete={() => setFlowState("WELCOME")}
          recipientName={initialConfig.recipientName}
        />
      )}

      {flowState === "WELCOME" && (
        <Welcome
          onYes={() => setFlowState("INTRO")}
          recipientName={initialConfig.recipientName}
        />
      )}

      {flowState === "INTRO" && (
        <Intro
          onComplete={() => setFlowState("DASHBOARD")}
          recipientName={initialConfig.recipientName}
        />
      )}

      {flowState === "DASHBOARD" && (
        <Dashboard
          config={initialConfig}
          mode={mode}
        />
      )}
    </main>
  );
}
