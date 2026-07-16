"use client";

import React, { useState, useEffect, use } from "react";
import Loading from "@/features/landing/Loading";
import PasswordGate from "@/features/landing/PasswordGate";
import Envelope from "@/features/landing/Envelope";
import Welcome from "@/features/landing/Welcome";
import Intro from "@/features/landing/Intro";
import Dashboard from "@/features/dashboard/Dashboard";
import { loadProjectData } from "@/lib/supabase/editorDb";
import { Sparkles } from "lucide-react";

type FlowState = "LOADING" | "PASSWORD" | "ENVELOPE" | "WELCOME" | "INTRO" | "DASHBOARD";

export default function LegacyProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [flowState, setFlowState] = useState<FlowState>("LOADING");
  const [config, setConfig] = useState<any>(null);
  const [mode, setMode] = useState<"friend" | "relationship" | "family">("relationship");
  const [error, setError] = useState<string | null>(null);

  // Load layout from Supabase by slug
  useEffect(() => {
    async function loadData() {
      try {
        const loadedConfig = await loadProjectData(slug);
        if (loadedConfig) {
          setConfig(loadedConfig);
        } else {
          setError("This scrapbook surprise does not exist or has been deleted.");
        }
      } catch (e) {
        setError("An error occurred while loading this scrapbook.");
      }
    }
    loadData();
  }, [slug]);

  if (error) {
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-[#FFFDF9] font-sans text-center px-4 gap-3 select-none">
        <div className="w-12 h-12 rounded-2xl bg-pink/10 flex items-center justify-center text-pink text-xl">
          🎁
        </div>
        <h2 className="text-sm font-black text-gray-800">Scrapbook Surprise</h2>
        <p className="text-xs text-gray-500 max-w-sm leading-relaxed">{error}</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#FFFDF9] font-sans gap-3.5 select-none">
        <div className="w-10 h-10 rounded-2xl bg-purple/10 flex items-center justify-center text-purple shadow animate-bounce">
          <Sparkles size={16} />
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-xs font-black text-gray-600">Unlocking Surprise</h2>
          <p className="text-[9px] text-gray-400 font-nunito font-semibold uppercase tracking-wider mt-1">
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
          recipientName={config.recipientName} 
        />
      )}

      {flowState === "PASSWORD" && (
        <PasswordGate 
          onSuccess={(selectedMode) => {
            setMode(selectedMode);
            setFlowState("ENVELOPE");
          }} 
          validPasswords={config.passwords} 
        />
      )}

      {flowState === "ENVELOPE" && (
        <Envelope 
          onOpenComplete={() => setFlowState("WELCOME")} 
          recipientName={config.recipientName} 
        />
      )}

      {flowState === "WELCOME" && (
        <Welcome 
          onYes={() => setFlowState("INTRO")} 
          recipientName={config.recipientName} 
        />
      )}

      {flowState === "INTRO" && (
        <Intro 
          onComplete={() => setFlowState("DASHBOARD")} 
          recipientName={config.recipientName} 
        />
      )}

      {flowState === "DASHBOARD" && (
        <Dashboard 
          config={config} 
          mode={mode} 
        />
      )}
    </main>
  );
}
