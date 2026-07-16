"use client";

import React from "react";
import { logoutAction } from "@/lib/supabase/projectActions";
import { OCCASION_PRESETS } from "@/lib/themePresets";
import { 
  Folder, Settings, Sparkles, LogOut, Layout, 
  ImageIcon, ArrowRight
} from "lucide-react";

export default function TemplatesPage() {
  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <div className="min-h-screen w-screen bg-[#F7F5F2] flex font-sans overflow-hidden select-none font-sans">
      
      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <aside className="w-64 border-r border-gray-200 bg-white flex flex-col justify-between shrink-0">
        <div className="p-6 space-y-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple flex items-center justify-center text-white shadow-md">
              <Sparkles size={16} />
            </div>
            <span className="font-poppins font-extrabold text-gray-800 text-sm tracking-tight">
              Scrapbook SaaS
            </span>
          </div>

          <nav className="space-y-1">
            <a href="/admin/projects" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 text-gray-500 hover:text-gray-800 text-xs font-bold transition-all">
              <Folder size={14} /> Projects
            </a>
            <a href="/admin/media" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 text-gray-500 hover:text-gray-800 text-xs font-bold transition-all">
              <ImageIcon size={14} /> Media Assets
            </a>
            <a href="/admin/templates" className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-purple/10 text-purple text-xs font-bold transition-all shadow-sm">
              <Layout size={14} /> Occasions
            </a>
            <a href="/admin/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 text-gray-500 hover:text-gray-800 text-xs font-bold transition-all">
              <Settings size={14} /> Auth Settings
            </a>
          </nav>
        </div>

        <div className="p-6 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </aside>

      {/* 2. OCCASION PRESETS GALLERY */}
      <main className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto no-scrollbar flex flex-col justify-start">
        
        <header className="mb-8">
          <h1 className="font-poppins font-extrabold text-2xl text-gray-800 tracking-tight flex items-center gap-2">
            <Layout size={20} className="text-purple" /> Occasion Presets Gallery
          </h1>
          <p className="text-xs text-gray-400 font-nunito font-semibold uppercase tracking-wider mt-1">
            Browse our pre-designed templates with matching fonts, stickers, cursors, and animated mascots
          </p>
        </header>

        {/* Templates cards list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(OCCASION_PRESETS).map(([key, preset]) => (
            <div 
              key={key}
              className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-poppins font-black text-gray-800 text-base leading-tight">
                    {preset.name}
                  </h3>
                  <span className="text-[10px] font-mono font-bold uppercase bg-pink-50 text-purple border border-pink-100 px-2 py-0.5 rounded-full">
                    {key}
                  </span>
                </div>

                <p className="text-xs text-gray-400 font-nunito leading-relaxed mb-4">
                  Automatically provisions a matching theme, interactive {preset.mascot.type} mascot default layout, and ambient {preset.theme.backgroundAnimation} animations.
                </p>

                {/* Color swatches preview */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-nunito text-gray-500 font-bold">
                    <span>Swatches:</span>
                    <div className="flex gap-1.5">
                      <div className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: preset.theme.primaryColor }} title="Primary" />
                      <div className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: preset.theme.secondaryColor }} title="Secondary" />
                      <div className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: preset.theme.backgroundColor }} title="Background" />
                      <div className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: preset.theme.foregroundColor }} title="Text" />
                    </div>
                  </div>

                  {/* Font and details list */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-nunito text-gray-400 font-bold uppercase tracking-wider">
                    <div>🔤 Title: {preset.theme.fontHeading}</div>
                    <div>✍️ Scribble: {preset.theme.fontHandwriting}</div>
                    <div>🦁 Companion: {preset.mascot.type}</div>
                    <div>✨ Cursor: {preset.theme.cursor}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <a
                  href="/admin/projects"
                  className="flex items-center gap-1.5 px-4 py-2 bg-purple/10 text-purple text-xs font-bold rounded-xl hover:bg-purple/20 transition-all select-none"
                >
                  Create Project with Template <ArrowRight size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>

      </main>

    </div>
  );
}
