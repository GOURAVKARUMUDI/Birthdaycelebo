"use client";

import React, { useState } from "react";
import { logoutAction } from "@/lib/supabase/projectActions";
import { 
  Folder, Settings, Sparkles, LogOut, Layout, 
  ImageIcon, Trash2, Search, Upload, Play, Image
} from "lucide-react";

export default function MediaLibraryPage() {
  const [mediaSearch, setMediaSearch] = useState("");
  const [mediaFolder, setMediaFolder] = useState<"photos" | "audio" | "stickers">("photos");

  const [assets, setAssets] = useState([
    { id: "ast-1", name: "Beach sunset.jpg", type: "image", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600", folder: "photos", tags: ["beach", "sunset"] },
    { id: "ast-2", name: "Cafe date coffee.jpg", type: "image", url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=600", folder: "photos", tags: ["cafe", "coffee"] },
    { id: "ast-3", name: "Lofi instrumental.mp3", type: "music", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", folder: "audio", tags: ["lofi", "background"] },
    { id: "ast-4", name: "Cute dance panda.gif", type: "gif", url: "https://media.giphy.com/media/EatwJSm34XFBK/giphy.gif", folder: "stickers", tags: ["panda", "dance"] },
  ]);

  const handleLogout = async () => {
    await logoutAction();
  };

  const handleUpload = () => {
    const name = prompt("Enter file name for mock upload:");
    if (!name) return;

    const newAsset = {
      id: `ast-${Date.now()}`,
      name,
      type: mediaFolder === "photos" ? "image" : mediaFolder === "audio" ? "music" : "gif",
      url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800",
      folder: mediaFolder,
      tags: ["user", "uploaded"]
    };

    setAssets([newAsset, ...assets]);
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
            <a href="/admin/media" className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-purple/10 text-purple text-xs font-bold transition-all shadow-sm">
              <ImageIcon size={14} /> Media Assets
            </a>
            <a href="/admin/templates" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 text-gray-500 hover:text-gray-800 text-xs font-bold transition-all">
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

      {/* 2. MEDIA CONTENT */}
      <main className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto no-scrollbar flex flex-col justify-start">
        
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-poppins font-extrabold text-2xl text-gray-800 tracking-tight flex items-center gap-2">
              <ImageIcon size={20} className="text-purple" /> Media Assets Library
            </h1>
            <p className="text-xs text-gray-400 font-nunito font-semibold uppercase tracking-wider mt-1">
              Store photos, music background tracks, and stickers for your scrapbook canvases
            </p>
          </div>

          <button
            onClick={handleUpload}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-purple text-white text-xs font-bold rounded-xl shadow-md hover:bg-purple/90 active:scale-95 transition-all select-none"
          >
            <Upload size={14} /> Upload Media
          </button>
        </header>

        {/* Filters and search toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between">
          <div className="flex border-b border-gray-200 text-xs font-extrabold uppercase text-gray-400 gap-6 select-none shrink-0 w-full sm:w-auto">
            {(["photos", "audio", "stickers"] as const).map((folder) => (
              <button
                key={folder}
                onClick={() => setMediaFolder(folder)}
                className={`pb-2.5 border-b-2 transition-all ${
                  mediaFolder === folder ? "border-purple text-purple" : "border-transparent"
                }`}
              >
                {folder}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={mediaSearch}
              onChange={(e) => setMediaSearch(e.target.value)}
              placeholder="Search assets name..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none font-nunito shadow-sm"
            />
          </div>
        </div>

        {/* Asset cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-1">
          {assets
            .filter(ast => ast.folder === mediaFolder && (!mediaSearch || ast.name.toLowerCase().includes(mediaSearch.toLowerCase())))
            .map((ast) => (
              <div 
                key={ast.id}
                className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col justify-between hover:shadow hover:scale-[1.01] transition-all"
              >
                <div className="aspect-square w-full rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden relative mb-3 group border border-gray-50">
                  {ast.type === "image" || ast.type === "gif" ? (
                    <img src={ast.url} alt={ast.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-purple/10 flex items-center justify-center text-purple">
                      <Play size={20} fill="currentColor" />
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-poppins font-black text-gray-800 text-[11px] truncate leading-none">
                    {ast.name}
                  </h4>
                  <div className="flex justify-between items-center mt-2.5">
                    <span className="text-[8px] font-mono uppercase bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-bold">
                      {ast.type}
                    </span>
                    <button
                      onClick={() => setAssets(assets.filter(a => a.id !== ast.id))}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

      </main>

    </div>
  );
}
