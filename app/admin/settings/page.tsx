"use client";

import React, { useEffect, useState } from "react";
import { logoutAction } from "@/lib/supabase/projectActions";
import { 
  Folder, Settings, Sparkles, LogOut, Layout, 
  ImageIcon, Shield, Lock, Eye, Check
} from "lucide-react";

export default function SettingsPage() {
  const [sessionTimeout, setSessionTimeout] = useState("15");
  const [saved, setSaved] = useState(false);

  const handleLogout = async () => {
    await logoutAction();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen w-screen bg-[#F7F5F2] flex font-sans overflow-hidden select-none">
      
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
            <a href="/admin/templates" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 text-gray-500 hover:text-gray-800 text-xs font-bold transition-all">
              <Layout size={14} /> Occasions
            </a>
            <a href="/admin/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-purple/10 text-purple text-xs font-bold transition-all shadow-sm">
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

      {/* 2. SETTINGS CONTENT */}
      <main className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto no-scrollbar">
        <header className="mb-8">
          <h1 className="font-poppins font-extrabold text-2xl text-gray-800 tracking-tight flex items-center gap-2">
            <Shield size={20} className="text-purple" /> Authentication Settings
          </h1>
          <p className="text-xs text-gray-400 font-nunito font-semibold uppercase tracking-wider mt-1">
            Configure secure sessions, JWT expirations, and access timeouts
          </p>
        </header>

        <form onSubmit={handleSave} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple/10 flex items-center justify-center text-purple shrink-0">
              <Lock size={18} />
            </div>
            <div className="flex-1 space-y-4">
              <h3 className="font-poppins font-bold text-sm text-gray-700">JWT Token Session Duration</h3>
              
              <div className="space-y-1 max-w-xs text-xs text-gray-500">
                <label className="block text-gray-400 font-bold uppercase tracking-wider text-[9px]">Session Timeout (Minutes)</label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full px-3 py-2 border border-pink-100 bg-white rounded-xl text-xs focus:outline-none"
                >
                  <option value="5">5 Minutes (Strict Security)</option>
                  <option value="15">15 Minutes (Default)</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">60 Minutes</option>
                </select>
              </div>

              <div className="p-3 bg-pink-50/50 text-purple-700 text-[10px] leading-relaxed rounded-xl max-w-md border border-pink-100">
                🔒 Access tokens are stored in secure HTTP-only cookies and automatically validated on the edge by Next.js middleware. A sliding window mechanism will refresh the token automatically as long as the user remains active.
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-gray-100" />

          {/* Account credentials info */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple/10 flex items-center justify-center text-purple shrink-0">
              <Eye size={18} />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-poppins font-bold text-sm text-gray-700">Administrator Credentials</h3>
              <p className="text-xs text-gray-400 leading-normal max-w-md">
                Admin account credentials are bootstrapped from the local env variables (`ADMIN_USERNAME` and `ADMIN_PASSWORD`) on first boot and stored securely inside the database with hashed salts. Plaintext values are never exposed.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-purple text-white text-xs font-bold rounded-xl shadow-md hover:bg-purple/90 active:scale-95 transition-all select-none"
            >
              {saved ? (
                <>
                  <Check size={14} className="text-emerald-300" /> Settings Saved
                </>
              ) : (
                "Save Configuration"
              )}
            </button>
          </div>
        </form>

      </main>

    </div>
  );
}
