"use client";

import React, { useState } from "react";
import { useEditorStore, PageConfig, BlockConfig } from "@/lib/store/editorStore";
import { OCCASION_PRESETS } from "@/lib/themePresets";
import DndList from "./DndList";
import { 
  Layers, Plus, Palette, Smile, MessageSquare, ImageIcon, 
  Trash2, Sparkles, Folder, Search, Upload, Play, Star
} from "lucide-react";

export default function LeftSidebar() {
  const {
    pages,
    selectedPageId,
    setSelectedPageId,
    selectedBlockId,
    setSelectedBlockId,
    addPage,
    deletePage,
    reorderPages,
    addBlock,
    deleteBlock,
    reorderBlocks,
    theme,
    updateTheme,
    mascot,
    updateMascot,
    occasion,
    updateProject,
    recipientName,
    activeSidebarTab,
    setActiveSidebarTab
  } = useEditorStore() as any;

  const [newPageTitle, setNewPageTitle] = useState("");
  const [mediaSearch, setMediaSearch] = useState("");
  const [mediaFolder, setMediaFolder] = useState<"photos" | "audio" | "videos" | "stickers">("photos");

  // Local state for uploaded assets mock list
  const [mediaAssets, setMediaAssets] = useState([
    { id: "ast-1", name: "Beach sunset.jpg", type: "image", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600", folder: "photos", tags: ["beach", "sunset"] },
    { id: "ast-2", name: "Cafe date coffee.jpg", type: "image", url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=600", folder: "photos", tags: ["cafe", "coffee"] },
    { id: "ast-3", name: "Lofi instrumental.mp3", type: "music", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", folder: "audio", tags: ["lofi", "background"] },
    { id: "ast-4", name: "Cute dance panda.gif", type: "gif", url: "https://media.giphy.com/media/EatwJSm34XFBK/giphy.gif", folder: "stickers", tags: ["panda", "dance"] },
  ]);

  const activePage = pages.find((p: any) => p.id === selectedPageId) || pages[0];

  const handleAddPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim()) return;
    addPage(newPageTitle);
    setNewPageTitle("");
  };

  const handleApplyPreset = (key: keyof typeof OCCASION_PRESETS) => {
    const preset = OCCASION_PRESETS[key];
    if (!preset) return;
    
    // Update store state with preset colors and mascot
    updateProject({ occasion: key, bgMusicUrl: preset.bgMusicUrl });
    updateTheme(preset.theme);
    updateMascot(preset.mascot);
    
    // Update captions on the active page to suggested presets
    if (activePage) {
      const pageIndex = pages.findIndex((p: any) => p.id === activePage.id);
      const updatedPages = [...pages];
      updatedPages[pageIndex] = {
        ...activePage,
        heading: preset.suggestedCaptions.heading,
        subheading: preset.suggestedCaptions.subheading,
        quote: preset.suggestedCaptions.quote,
        buttonText: preset.suggestedCaptions.buttonText,
        footerText: preset.suggestedCaptions.footerText,
      };
      reorderPages(updatedPages);
    }
  };

  const generateAiText = (type: "heading" | "subheading" | "quote") => {
    const templates: Record<string, Record<string, string[]>> = {
      birthday: {
        heading: [`Happy Birthday, ${recipientName}!`, `Today is All About ${recipientName}!`, `To an Incredible Person: ${recipientName}`],
        subheading: ["Happy Birthday!", "Make a Wish!", "Let's Celebrate!"],
        quote: [
          "Blow the candles and make a wish, because today is your day to shine.",
          "May this year bring you as much joy and happiness as you bring to everyone around you.",
          "Another year older, another year wiser, and a million more memories to make!"
        ]
      },
      anniversary: {
        heading: [`Happy Anniversary, ${recipientName}!`, `Celebrating Us: ${recipientName} & Me`, `Our Love Story`],
        subheading: ["Forever Together", "Every Moment Matters", "Our Beautiful Journey"],
        quote: [
          "In you, I've found the love of my life and my closest, truest friend.",
          "Every day I spend with you becomes my new favorite memory.",
          "Through all of life's seasons, my heart belongs to you. Happy Anniversary!"
        ]
      },
      best_friend: {
        heading: [`To My Best Friend, ${recipientName}`, `Partners in Crime: Me & ${recipientName}`, `Friendship Scrapbook`],
        subheading: ["Friends Forever", "Thanks for Everything", "My Favorite Human"],
        quote: [
          "A true friend is the greatest of all blessings, and that friend is you.",
          "Through thick and thin, late-night texts and crazy plans, you've always been there.",
          "Here's to the laughs, the inside jokes, and the memories we haven't even made yet!"
        ]
      },
      graduation: {
        heading: [`Congratulations, Grad ${recipientName}!`, `You Did It, ${recipientName}!`, `Class of 2026: ${recipientName}`],
        subheading: ["New Journey Begins", "So Proud of You", "Future Leader"],
        quote: [
          "The horizon is wide, and the future is yours. Go make your mark!",
          "Congratulations on this amazing milestone. Your hard work has truly paid off.",
          "Believing in yourself is the first secret to success. You proved it today!"
        ]
      },
      proposal: {
        heading: [`Marry Me, ${recipientName}?`, `My Heart Belongs to ${recipientName}`, `Our Forever Starts Here`],
        subheading: ["Will You?", "Say Yes!", "Together Forever"],
        quote: [
          "I want to wake up next to you, travel the world with you, and love you forever.",
          "You are my today, my tomorrow, and all of my future.",
          "Life is an adventure, and I want you as my partner for all of it. Will you marry me?"
        ]
      }
    };

    const oTemplates = templates[occasion] || templates.birthday;
    const list = oTemplates[type] || ["Custom text"];
    return list[Math.floor(Math.random() * list.length)];
  };

  const handleAiFill = (field: "heading" | "subheading" | "quote") => {
    if (!activePage) return;
    const pageIndex = pages.findIndex((p: any) => p.id === activePage.id);
    const updatedPages = [...pages];
    updatedPages[pageIndex] = {
      ...activePage,
      [field === "heading" ? "heading" : field === "subheading" ? "subheading" : "quote"]: generateAiText(field)
    };
    reorderPages(updatedPages);
  };

  const handleLanguageTranslate = (lang: string) => {
    if (!activePage) return;
    
    // Translation dictionary presets based on occasion
    const translations: Record<string, Record<string, any>> = {
      es: {
        birthday: { heading: "¡Feliz Cumpleaños!", subheading: "¡Hoy es tu día!", quote: "Sopla las velas y pide un deseo.", buttonText: "Abrir", footerText: "Con amor" },
        anniversary: { heading: "Feliz Aniversario", subheading: "Cada momento importa", quote: "En ti encontré al amor de mi vida.", buttonText: "Nuestro viaje", footerText: "Para siempre" }
      },
      fr: {
        birthday: { heading: "Joyeux Anniversaire !", subheading: "C'est ta journée !", quote: "Souffle les bougies et fais un vœu.", buttonText: "Ouvrir", footerText: "Avec amour" },
        anniversary: { heading: "Joyeux Anniversaire", subheading: "Chaque moment compte", quote: "En toi, j'ai trouvé l'amour de ma vie.", buttonText: "Notre histoire", footerText: "Pour toujours" }
      },
      hi: {
        birthday: { heading: "जन्मदिन मुबारक हो!", subheading: "आज आपका दिन है!", quote: "मोमबत्तियाँ बुझाओ और एक मन्नत मांगो।", buttonText: "खोलें", footerText: "प्यार के साथ" },
        anniversary: { heading: "सालगिरह मुबारक!", subheading: "हर पल मायने रखता है", quote: "आप में मुझे अपने जीवन का प्यार मिला है।", buttonText: "हमारी यात्रा", footerText: "हमेशा के लिए" }
      }
    };

    const trans = translations[lang]?.[occasion] || translations[lang]?.birthday;
    if (!trans) return;

    const pageIndex = pages.findIndex((p: any) => p.id === activePage.id);
    const updatedPages = [...pages];
    updatedPages[pageIndex] = {
      ...activePage,
      heading: trans.heading,
      subheading: trans.subheading,
      quote: trans.quote,
      buttonText: trans.buttonText,
      footerText: trans.footerText,
    };
    reorderPages(updatedPages);
  };

  const handleMockUpload = () => {
    const filename = prompt("Enter asset filename (e.g. photos.jpg):");
    if (!filename) return;

    const newAsset = {
      id: `ast-${Date.now()}`,
      name: filename,
      type: mediaFolder === "photos" ? "image" : mediaFolder === "audio" ? "music" : "video",
      url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800",
      folder: mediaFolder,
      tags: ["user", "uploaded"]
    };

    setMediaAssets([newAsset, ...mediaAssets]);
  };

  return (
    <aside className="w-[340px] border-r border-gray-200 bg-white flex flex-col z-20 shadow-sm select-none font-sans shrink-0">
      
      {/* 4x2 Grid tab selector (with AI assistant Span-2 at the bottom) */}
      <div className="grid grid-cols-4 border-b border-gray-100 text-center text-[9px] font-bold text-gray-500 bg-gray-50/50 p-1 gap-1 shrink-0">
        <button 
          onClick={() => setActiveSidebarTab("pages")} 
          className={`py-2 px-0.5 rounded-lg flex flex-col items-center gap-1 transition-all ${activeSidebarTab === "pages" ? "bg-white text-purple shadow-sm border border-pink-100 font-extrabold" : "hover:text-gray-700"}`}
        >
          <Layers size={13} /> <span>Layout</span>
        </button>
        <button 
          onClick={() => setActiveSidebarTab("add")} 
          className={`py-2 px-0.5 rounded-lg flex flex-col items-center gap-1 transition-all ${activeSidebarTab === "add" ? "bg-white text-purple shadow-sm border border-pink-100 font-extrabold" : "hover:text-gray-700"}`}
        >
          <Plus size={13} /> <span>Blocks</span>
        </button>
        <button 
          onClick={() => setActiveSidebarTab("theme")} 
          className={`py-2 px-0.5 rounded-lg flex flex-col items-center gap-1 transition-all ${activeSidebarTab === "theme" ? "bg-white text-purple shadow-sm border border-pink-100 font-extrabold" : "hover:text-gray-700"}`}
        >
          <Palette size={13} /> <span>Themes</span>
        </button>
        <button 
          onClick={() => setActiveSidebarTab("mascot")} 
          className={`py-2 px-0.5 rounded-lg flex flex-col items-center gap-1 transition-all ${activeSidebarTab === "mascot" ? "bg-white text-purple shadow-sm border border-pink-100 font-extrabold" : "hover:text-gray-700"}`}
        >
          <Smile size={13} /> <span>Mascot</span>
        </button>
        <button 
          onClick={() => setActiveSidebarTab("captions")} 
          className={`py-2 px-0.5 rounded-lg flex flex-col items-center gap-1 transition-all ${activeSidebarTab === "captions" ? "bg-white text-purple shadow-sm border border-pink-100 font-extrabold" : "hover:text-gray-700"}`}
        >
          <MessageSquare size={13} /> <span>Captions</span>
        </button>
        <button 
          onClick={() => setActiveSidebarTab("assets")} 
          className={`py-2 px-0.5 rounded-lg flex flex-col items-center gap-1 transition-all ${activeSidebarTab === "assets" ? "bg-white text-purple shadow-sm border border-pink-100 font-extrabold" : "hover:text-gray-700"}`}
        >
          <ImageIcon size={13} /> <span>Media</span>
        </button>
        <button 
          onClick={() => setActiveSidebarTab("ai")} 
          className={`py-2 px-0.5 rounded-lg flex flex-col items-center justify-center gap-1 col-span-2 transition-all ${activeSidebarTab === "ai" ? "bg-white text-purple shadow-sm border border-pink-100 font-extrabold" : "hover:text-gray-700"}`}
        >
          <div className="flex items-center gap-1">
            <Sparkles size={11} className="text-amber-500 animate-pulse" />
            <span className="text-amber-600 font-black">AI Assistant</span>
          </div>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar">
        
        {/* ================= LAYOUT TREE PANEL ================= */}
        {activeSidebarTab === "pages" && (
          <div className="space-y-5">
            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-nunito mb-3">Pages List (Draggable)</h3>
              {pages.length > 0 ? (
                <DndList
                  items={pages}
                  onReorder={reorderPages}
                  renderItem={(p: any, idx, dragHandlers) => (
                    <div 
                      {...dragHandlers}
                      onClick={() => { setSelectedPageId(p.id); setSelectedBlockId(null); }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 mb-1.5 rounded-xl text-xs font-bold text-left border cursor-grab active:cursor-grabbing transition-all ${
                        selectedPageId === p.id 
                          ? "bg-purple/10 text-purple border-purple/30 shadow-sm" 
                          : "bg-white hover:bg-gray-50 border-gray-100 text-gray-700"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-gray-300">☰</span>
                        {p.title}
                      </span>
                      {pages.length > 1 && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); deletePage(p.id); }}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  )}
                />
              ) : (
                <p className="text-xs text-gray-400 text-center py-4">No pages found. Add one below!</p>
              )}

              {/* Add Page Form */}
              <form onSubmit={handleAddPage} className="flex gap-1.5 mt-3">
                <input 
                  type="text" 
                  value={newPageTitle} 
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  placeholder="New page name..."
                  className="flex-1 px-3 py-1.5 border border-pink-100 rounded-xl text-xs bg-white/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple focus:border-purple font-nunito"
                />
                <button type="submit" className="p-2 bg-purple text-white rounded-xl hover:bg-purple/90 active:scale-95 transition-all">
                  <Plus size={14} />
                </button>
              </form>
            </div>

            {/* Blocks hierarchy inside selected page */}
            {activePage && (
              <div>
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-nunito mb-3">
                  Blocks inside: {activePage.title}
                </h3>
                {activePage.blocks && activePage.blocks.length > 0 ? (
                  <DndList
                    items={activePage.blocks}
                    onReorder={(newBlocks) => reorderBlocks(activePage.id, newBlocks)}
                    renderItem={(b: any, idx, dragHandlers) => (
                      <div 
                        {...dragHandlers}
                        onClick={() => setSelectedBlockId(b.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 mb-1.5 rounded-xl text-xs font-bold text-left border cursor-grab active:cursor-grabbing transition-all ${
                          selectedBlockId === b.id 
                            ? "bg-purple/5 border-purple/20 text-purple" 
                            : "bg-white hover:bg-gray-50 border-gray-100 text-gray-600"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-gray-300">☰</span>
                          <span className="text-[10px] uppercase bg-gray-100 text-gray-500 font-extrabold tracking-wide px-1.5 py-0.5 rounded">
                            {b.type}
                          </span>
                          <span className="truncate max-w-[120px] font-medium text-[11px]">
                            {b.properties.title || b.properties.text || b.properties.caption || "Content Block"}
                          </span>
                        </span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteBlock(b.id); }}
                          className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  />
                ) : (
                  <p className="text-[10px] text-gray-400 text-center py-4 border border-dashed border-gray-100 rounded-xl">
                    No blocks added. Switch to "Blocks" tab to insert components!
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= BLOCKS CATALOG PANEL ================= */}
        {activeSidebarTab === "add" && (
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-nunito">Add scrapbook block</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: "heading", label: "Heading Block", desc: "Title & subtitle", icon: "✨" },
                { type: "text", label: "Text Block", desc: "Paragraph description", icon: "✏️" },
                { type: "countdown", label: "Countdown", desc: "Event timer clocks", icon: "⏳" },
                { type: "mascot", label: "Mascot", desc: "Animated character", icon: "🦁" },
                { type: "memories", label: "Memories", desc: "Unsplash photo slider", icon: "🖼️" },
                { type: "letter", label: "Letter Scroll", desc: "A special written message", icon: "✉️" },
                { type: "playlist", label: "Audio Jukebox", desc: "Songs & voice memos", icon: "🎵" },
                { type: "timeline", label: "Timeline Events", desc: "Milestone date lists", icon: "📅" },
                { type: "chats", label: "Chats History", desc: "WhatsApp bubbles clone", icon: "💬" },
                { type: "gifts", label: "Gift Coupons", desc: "Mystery reward scratchers", icon: "🎁" },
                { type: "games", label: "Arcade Games", desc: "Catch cake / Match puzzles", icon: "🎮" },
                { type: "spotify", label: "Spotify Embed", desc: "Music album frame", icon: "🎧" },
                { type: "youtube", label: "YouTube Embed", desc: "Video iframe player", icon: "📺" },
                { type: "quote", label: "Quote Box", desc: "Highlighted memo card", icon: "✍️" },
              ].map((cat) => (
                <button
                  key={cat.type}
                  onClick={() => addBlock(selectedPageId || pages[0]?.id, cat.type)}
                  className="bg-white border border-gray-100 hover:border-purple/30 hover:bg-purple/5 hover:scale-[1.02] p-3 rounded-2xl flex flex-col items-start gap-1.5 text-left active:scale-98 transition-all shadow-sm"
                >
                  <span className="text-xl">{cat.icon}</span>
                  <div>
                    <h4 className="text-[11px] font-black text-gray-700 leading-tight">{cat.label}</h4>
                    <p className="text-[9px] text-gray-400 mt-0.5 leading-tight">{cat.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================= THEME MANAGER PANEL ================= */}
        {activeSidebarTab === "theme" && (
          <div className="space-y-5">
            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-nunito mb-3">Occasion Template Presets</h3>
              <div className="grid grid-cols-2 gap-1.5 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                {Object.entries(OCCASION_PRESETS).map(([key, value]) => {
                  const getPresetEmoji = (k: string) => {
                    switch (k) {
                      case "birthday": return "🎂";
                      case "luxury_birthday": return "👑";
                      case "cute_birthday": return "🐰";
                      case "kids_birthday": return "🦖";
                      case "romantic_birthday": return "💖";
                      case "best_friend": return "🤝";
                      case "anniversary": return "🌹";
                      case "proposal": return "💍";
                      case "wedding": return "🕊️";
                      case "graduation": return "🎓";
                      case "christmas": return "🎄";
                      case "minimal": return "🔳";
                      case "pastel": return "🍡";
                      case "galaxy": return "🪐";
                      case "anime": return "🌸";
                      case "vintage": return "🕰️";
                      case "nature": return "🍃";
                      case "luxury": return "💎";
                      default: return "✨";
                    }
                  };
                  
                  return (
                    <button
                      key={key}
                      onClick={() => handleApplyPreset(key)}
                      title={`Apply ${value.name}`}
                      className={`p-2.5 rounded-xl border text-[10px] font-black text-left flex flex-col justify-between gap-1 hover:scale-[1.02] active:scale-98 transition-all h-[64px] ${
                        occasion === key 
                          ? "bg-purple text-white border-purple shadow-md" 
                          : "bg-white hover:bg-gray-50 border-gray-100 text-gray-700 shadow-sm"
                      }`}
                    >
                      <span className="text-sm">{getPresetEmoji(key)}</span>
                      <span className="truncate w-full">{value.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-[1px] bg-gray-100" />

            {/* Custom Brand Colors */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-nunito">Brand Color Palette</h3>
              <div className="grid grid-cols-2 gap-2.5 text-xs text-gray-500">
                <div>
                  <label className="block mb-1">Primary Color</label>
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="color" 
                      value={theme.primaryColor} 
                      onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                      className="w-8 h-8 rounded border border-gray-200 cursor-pointer p-0 shrink-0" 
                    />
                    <span className="font-mono text-[10px]">{theme.primaryColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block mb-1">Secondary Color</label>
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="color" 
                      value={theme.secondaryColor} 
                      onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                      className="w-8 h-8 rounded border border-gray-200 cursor-pointer p-0 shrink-0" 
                    />
                    <span className="font-mono text-[10px]">{theme.secondaryColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block mb-1">Background Color</label>
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="color" 
                      value={theme.backgroundColor} 
                      onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                      className="w-8 h-8 rounded border border-gray-200 cursor-pointer p-0 shrink-0" 
                    />
                    <span className="font-mono text-[10px]">{theme.backgroundColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block mb-1">Text Color</label>
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="color" 
                      value={theme.foregroundColor} 
                      onChange={(e) => updateTheme({ foregroundColor: e.target.value })}
                      className="w-8 h-8 rounded border border-gray-200 cursor-pointer p-0 shrink-0" 
                    />
                    <span className="font-mono text-[10px]">{theme.foregroundColor}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-gray-100" />

            {/* Typography Fonts */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-nunito">Typography & Layout</h3>
              <div className="space-y-2.5 text-xs text-gray-500">
                <div>
                  <label className="block mb-1">Heading Font</label>
                  <select
                    value={theme.fontHeading}
                    onChange={(e) => updateTheme({ fontHeading: e.target.value })}
                    className="w-full px-3 py-1.5 border border-pink-100 bg-white rounded-xl text-xs focus:outline-none"
                  >
                    <option value="Poppins">Poppins (Modern Bold)</option>
                    <option value="Montserrat">Montserrat (Geometric)</option>
                    <option value="Playfair Display">Playfair (Romantic Serif)</option>
                    <option value="Inter">Inter (Sleek Neo-grotesque)</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Handwriting Font</label>
                  <select
                    value={theme.fontHandwriting}
                    onChange={(e) => updateTheme({ fontHandwriting: e.target.value })}
                    className="w-full px-3 py-1.5 border border-pink-100 bg-white rounded-xl text-xs focus:outline-none"
                  >
                    <option value="Caveat">Caveat (Cute Brush)</option>
                    <option value="Pacifico">Pacifico (Retro script)</option>
                    <option value="Great Vibes">Great Vibes (Formal Calligraphy)</option>
                    <option value="Patrick Hand">Patrick Hand (Clean marker)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-gray-100" />

            {/* Visual Effects & Components styles */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-nunito">Visual Effects Engine</h3>
              <div className="space-y-2.5 text-xs text-gray-500">
                <div>
                  <label className="block mb-1">Background Ambient Particles</label>
                  <select
                    value={theme.backgroundAnimation}
                    onChange={(e) => updateTheme({ backgroundAnimation: e.target.value })}
                    className="w-full px-3 py-1.5 border border-pink-100 bg-white rounded-xl text-xs focus:outline-none"
                  >
                    <option value="balloons">Balloons (Floating Party)</option>
                    <option value="confetti">Confetti (Birthday Celebrations)</option>
                    <option value="hearts">Floating Hearts (Romance)</option>
                    <option value="stars">Twinkling Gold Stars (Anniversary/Grad)</option>
                    <option value="petals">Sakura Petals (Cherry Blossom)</option>
                    <option value="none">Disabled (Clean background)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Visual Cursor Effect</label>
                  <select
                    value={theme.cursor}
                    onChange={(e) => updateTheme({ cursor: e.target.value })}
                    className="w-full px-3 py-1.5 border border-pink-100 bg-white rounded-xl text-xs focus:outline-none"
                  >
                    <option value="sparkle">Sparkle Trails</option>
                    <option value="heart">Heart Trails</option>
                    <option value="flower">Falling Flowers</option>
                    <option value="star">Star Trails</option>
                    <option value="none">Standard Browser Pointer</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Buttons Border Style</label>
                  <select
                    value={theme.buttonStyle}
                    onChange={(e) => updateTheme({ buttonStyle: e.target.value })}
                    className="w-full px-3 py-1.5 border border-pink-100 bg-white rounded-xl text-xs focus:outline-none"
                  >
                    <option value="rounded">Soft Rounded Corners (12px)</option>
                    <option value="pills">Pills Oval (99px)</option>
                    <option value="square">Square Hard Corners (0px)</option>
                    <option value="glass">Glassmorphic Blur</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= MASCOT MANAGER PANEL ================= */}
        {activeSidebarTab === "mascot" && (
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-nunito">Mascot Settings</h3>
            
            <div className="space-y-3.5 text-xs text-gray-500">
              <div>
                <label className="block mb-1 font-bold">Select Species Mascot</label>
                <select
                  value={mascot.type}
                  onChange={(e) => updateMascot({ type: e.target.value })}
                  className="w-full px-3 py-1.5 border border-pink-100 bg-white rounded-xl text-xs focus:outline-none"
                >
                  <option value="giraffe">🦒 Giraffe</option>
                  <option value="panda">🐼 Panda</option>
                  <option value="bear">🐻 Teddy Bear</option>
                  <option value="cat">🐱 Cat</option>
                  <option value="dog">🐶 Puppy</option>
                  <option value="bunny">🐰 Bunny</option>
                  <option value="fox">🦊 Fox</option>
                  <option value="penguin">🐧 Penguin</option>
                  <option value="koala">🐨 Koala</option>
                  <option value="sloth">🦥 Sloth</option>
                  <option value="hamster">🐹 Hamster</option>
                  <option value="elephant">🐘 Elephant</option>
                  <option value="tiger">🐯 Tiger Cub</option>
                  <option value="lion">🦁 Lion Cub</option>
                  <option value="dinosaur">🦖 Dinosaur</option>
                  <option value="unicorn">🦄 Unicorn</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Custom Mascot (SVG/Image URL)</label>
                <input
                  type="text"
                  value={mascot.customUrl || ""}
                  onChange={(e) => updateMascot({ customUrl: e.target.value })}
                  placeholder="Paste direct PNG/SVG image URL..."
                  className="w-full px-3 py-1.5 border border-pink-100 rounded-xl text-xs bg-white/60 focus:bg-white focus:outline-none font-nunito"
                />
              </div>

              <div className="h-[1px] bg-gray-100" />

              <div>
                <label className="block mb-1 font-bold">Mascot Pose (Default)</label>
                <select
                  value={mascot.defaultPose}
                  onChange={(e) => updateMascot({ defaultPose: e.target.value })}
                  className="w-full px-3 py-1.5 border border-pink-100 bg-white rounded-xl text-xs focus:outline-none"
                >
                  <option value="idle">Idle blinking</option>
                  <option value="smile">Sweet Smile</option>
                  <option value="wave">Wave greeting hand</option>
                  <option value="jump">Jumping up/down</option>
                  <option value="dance">Dance sway</option>
                  <option value="celebrate">Celebrate loops</option>
                  <option value="cry">Sad tear drips</option>
                  <option value="sleep">Zzz sleeping bubbles</option>
                  <option value="hold_flowers">Hold Flowers bouquet</option>
                  <option value="hold_cake">Hold birthday cake</option>
                  <option value="hold_balloons">Hold helium balloons</option>
                  <option value="hold_gift">Hold magenta gift box</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Base Animation Sway</label>
                <select
                  value={mascot.animationStyle}
                  onChange={(e) => updateMascot({ animationStyle: e.target.value as any })}
                  className="w-full px-3 py-1.5 border border-pink-100 bg-white rounded-xl text-xs focus:outline-none"
                >
                  <option value="floating">Floating hover (smooth)</option>
                  <option value="bounce">Bouncy vertical loop</option>
                  <option value="wiggle">Wiggle rotation sway</option>
                  <option value="none">No layout loop</option>
                </select>
              </div>

              <div>
                <label className="flex items-center justify-between mb-1">
                  <span>Mascot scale size</span>
                  <span className="font-mono text-[10px]">{mascot.size}px</span>
                </label>
                <input
                  type="range"
                  min="80"
                  max="220"
                  value={mascot.size}
                  onChange={(e) => updateMascot({ size: Number(e.target.value) })}
                  className="w-full accent-purple"
                />
              </div>

              <div className="h-[1px] bg-gray-100" />

              <div className="space-y-2">
                <label className="flex items-center gap-2 select-none cursor-pointer font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={mascot.enableBirthdayOutfit}
                    onChange={(e) => updateMascot({ enableBirthdayOutfit: e.target.checked })}
                    className="accent-purple rounded"
                  />
                  <span>Enable Birthday Party Hat</span>
                </label>
                
                <label className="flex items-center gap-2 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mascot.enableFloating}
                    onChange={(e) => updateMascot({ enableFloating: e.target.checked })}
                    className="accent-purple rounded"
                  />
                  <span>Enable Ambient Floating</span>
                </label>

                <label className="flex items-center gap-2 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mascot.enableInteractions}
                    onChange={(e) => updateMascot({ enableInteractions: e.target.checked })}
                    className="accent-purple rounded"
                  />
                  <span>Interaction Click Sound & Bounce</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ================= CAPTIONS MANAGER PANEL ================= */}
        {activeSidebarTab === "captions" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-nunito">Page Text Manager</h3>
              
              {/* Translate button */}
              <select
                onChange={(e) => handleLanguageTranslate(e.target.value)}
                defaultValue=""
                className="text-[10px] uppercase font-black bg-pink-50 border border-pink-100 text-purple rounded px-2 py-0.5 outline-none cursor-pointer"
              >
                <option value="" disabled>Translate</option>
                <option value="hi">Hindi 🇮🇳</option>
                <option value="es">Spanish 🇪🇸</option>
                <option value="fr">French 🇫🇷</option>
              </select>
            </div>

            {/* Caption presets helper */}
            {activePage && (
              <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-3.5 space-y-2">
                <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-nunito flex items-center gap-1">
                  <Sparkles size={10} className="text-amber-500" /> AI Caption Suggestions
                </h4>
                
                <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto pr-1 no-scrollbar">
                  {[
                    { label: "Sweet Greeting", text: "A Very Special Gift For You ❤️" },
                    { label: "Fun EMB", text: "Ready for your birthday embarrassment? 🦖" },
                    { label: "Cute Ask", text: "Do you wanna see a little surprise? 🐰" },
                    { label: "Romantic", text: "To the person who makes my life full of joy..." },
                    { label: "Wishes", text: "Wishing you another year of magic & dreams ✨" },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        const pageIndex = pages.findIndex((p: any) => p.id === activePage.id);
                        const updatedPages = [...pages];
                        updatedPages[pageIndex] = { ...activePage, quote: preset.text };
                        reorderPages(updatedPages);
                      }}
                      className="px-2 py-1 bg-white hover:bg-purple/10 border border-gray-100 hover:border-purple/20 text-[9px] font-bold text-gray-500 hover:text-purple rounded-lg transition-all"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activePage ? (
              <div className="space-y-3.5 text-xs text-gray-500">
                
                {/* Heading field */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-gray-700">Page Heading</label>
                    <button 
                      onClick={() => handleAiFill("heading")}
                      className="text-[9px] text-purple hover:underline flex items-center gap-0.5 font-bold uppercase tracking-wider"
                    >
                      <Sparkles size={8} /> AI Generate
                    </button>
                  </div>
                  <input
                    type="text"
                    value={activePage.heading || ""}
                    onChange={(e) => {
                      const pageIndex = pages.findIndex((p: any) => p.id === activePage.id);
                      const updatedPages = [...pages];
                      updatedPages[pageIndex] = { ...activePage, heading: e.target.value };
                      reorderPages(updatedPages);
                    }}
                    className="w-full px-3 py-1.5 border border-pink-100 rounded-xl text-xs focus:outline-none bg-white font-nunito"
                  />
                </div>

                {/* Subheading */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-gray-700">Subheading / Caption</label>
                    <button 
                      onClick={() => handleAiFill("subheading")}
                      className="text-[9px] text-purple hover:underline flex items-center gap-0.5 font-bold uppercase tracking-wider"
                    >
                      <Sparkles size={8} /> AI Generate
                    </button>
                  </div>
                  <input
                    type="text"
                    value={activePage.subheading || ""}
                    onChange={(e) => {
                      const pageIndex = pages.findIndex((p: any) => p.id === activePage.id);
                      const updatedPages = [...pages];
                      updatedPages[pageIndex] = { ...activePage, subheading: e.target.value };
                      reorderPages(updatedPages);
                    }}
                    className="w-full px-3 py-1.5 border border-pink-100 rounded-xl text-xs focus:outline-none bg-white font-nunito"
                  />
                </div>

                {/* Quote card */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-gray-700">Quote / Dedication Card</label>
                    <button 
                      onClick={() => handleAiFill("quote")}
                      className="text-[9px] text-purple hover:underline flex items-center gap-0.5 font-bold uppercase tracking-wider"
                    >
                      <Sparkles size={8} /> AI Generate
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={activePage.quote || ""}
                    onChange={(e) => {
                      const pageIndex = pages.findIndex((p: any) => p.id === activePage.id);
                      const updatedPages = [...pages];
                      updatedPages[pageIndex] = { ...activePage, quote: e.target.value };
                      reorderPages(updatedPages);
                    }}
                    className="w-full px-3 py-1.5 border border-pink-100 rounded-xl text-xs focus:outline-none bg-white font-nunito"
                  />
                </div>

                {/* Button CTA */}
                <div>
                  <label className="block mb-1 font-bold text-gray-700">Proceed Button Text</label>
                  <input
                    type="text"
                    value={activePage.buttonText || ""}
                    onChange={(e) => {
                      const pageIndex = pages.findIndex((p: any) => p.id === activePage.id);
                      const updatedPages = [...pages];
                      updatedPages[pageIndex] = { ...activePage, buttonText: e.target.value };
                      reorderPages(updatedPages);
                    }}
                    className="w-full px-3 py-1.5 border border-pink-100 rounded-xl text-xs focus:outline-none bg-white font-nunito"
                  />
                </div>

                {/* Footer text */}
                <div>
                  <label className="block mb-1 font-bold text-gray-700">Footer Text</label>
                  <input
                    type="text"
                    value={activePage.footerText || ""}
                    onChange={(e) => {
                      const pageIndex = pages.findIndex((p: any) => p.id === activePage.id);
                      const updatedPages = [...pages];
                      updatedPages[pageIndex] = { ...activePage, footerText: e.target.value };
                      reorderPages(updatedPages);
                    }}
                    className="w-full px-3 py-1.5 border border-pink-100 rounded-xl text-xs focus:outline-none bg-white font-nunito"
                  />
                </div>

              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-4">Select a page inside "Layout" panel to manage its captions.</p>
            )}
          </div>
        )}

        {/* ================= MEDIA DRIVE PANEL ================= */}
        {activeSidebarTab === "assets" && (
          <div className="space-y-4 font-sans">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-nunito">Media Storage</h3>
            
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                value={mediaSearch}
                onChange={(e) => setMediaSearch(e.target.value)}
                placeholder="Search uploads..."
                className="w-full pl-9 pr-4 py-2 border border-pink-100 rounded-xl text-xs bg-white/60 focus:bg-white focus:outline-none font-nunito"
              />
            </div>

            {/* Folder Tabs */}
            <div className="flex border-b border-gray-100 text-[9px] font-extrabold uppercase text-gray-400 justify-around select-none">
              {(["photos", "audio", "stickers"] as const).map((folder) => (
                <button
                  key={folder}
                  onClick={() => setMediaFolder(folder)}
                  className={`pb-2 border-b-2 transition-all ${
                    mediaFolder === folder ? "border-purple text-purple" : "border-transparent"
                  }`}
                >
                  {folder}
                </button>
              ))}
            </div>

            {/* Assets List */}
            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
              {mediaAssets
                .filter(ast => ast.folder === mediaFolder && (!mediaSearch || ast.name.toLowerCase().includes(mediaSearch.toLowerCase())))
                .map((ast) => (
                  <div 
                    key={ast.id} 
                    className="flex items-center justify-between p-2 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 max-w-[190px] truncate">
                      {ast.type === "image" || ast.type === "gif" ? (
                        <img src={ast.url} alt={ast.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-purple/10 flex items-center justify-center text-purple text-xs shrink-0">
                          <Play size={10} fill="currentColor" />
                        </div>
                      )}
                      <div>
                        <p className="text-[10px] font-black text-gray-700 truncate leading-none">{ast.name}</p>
                        <p className="text-[8px] text-gray-400 mt-1 font-mono uppercase tracking-wider">{ast.type}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setMediaAssets(mediaAssets.filter(a => a.id !== ast.id))}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
            </div>

            {/* Upload Button */}
            <button
              onClick={handleMockUpload}
              className="w-full py-2.5 bg-gray-100 hover:bg-purple/10 hover:text-purple text-gray-600 text-xs font-bold rounded-xl border border-dashed border-gray-200 hover:border-purple/30 flex items-center justify-center gap-1.5 transition-all select-none"
            >
              <Upload size={12} /> Upload Media Asset
            </button>
          </div>
        )}

        {/* ================= ✨ AI ASSISTANT PANEL ================= */}
        {activeSidebarTab === "ai" && (
          <div className="space-y-4 font-sans">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-nunito flex items-center gap-1.5">
              <Sparkles size={12} className="text-amber-500" /> ✨ AI Layout Creator
            </h3>
            
            <div className="bg-gradient-to-r from-purple/5 to-indigo-600/5 border border-purple/10 rounded-2xl p-3.5 text-xs text-gray-600 leading-relaxed shadow-sm">
              💡 <span className="font-extrabold">Instant Magic Styling:</span> Click any layout assistant options below to automatically modify color palettes, cursors, companion mascots, and typography sets.
            </div>

            <div className="space-y-2.5">
              {[
                { 
                  id: "romantic", 
                  label: "Make Romantic Mood", 
                  desc: "Blush pink tones, falling flower petals, cute cat companion",
                  emoji: "💖", 
                  action: () => handleApplyPreset("romantic_birthday") 
                },
                { 
                  id: "cute", 
                  label: "Make Super Cute", 
                  desc: "Candy cotton colors, bouncy hamster mascot, bubble click sounds",
                  emoji: "🐹", 
                  action: () => handleApplyPreset("cute_birthday") 
                },
                { 
                  id: "luxury", 
                  label: "Make VIP Luxury", 
                  desc: "Gold & platinum, starry particle trails, majestic lion mascot",
                  emoji: "👑", 
                  action: () => handleApplyPreset("luxury_birthday") 
                },
                { 
                  id: "galaxy", 
                  label: "Make Cosmic Space", 
                  desc: "Deep nebula indigo, twinkling cursors, stargazing space fox",
                  emoji: "🪐", 
                  action: () => handleApplyPreset("galaxy") 
                },
                { 
                  id: "vintage", 
                  label: "Make Classic Vintage", 
                  desc: "Warm sepia tones, typewriter serif typography, minimal details",
                  emoji: "📜", 
                  action: () => handleApplyPreset("vintage") 
                },
                { 
                  id: "minimal", 
                  label: "Make stark Minimalist", 
                  desc: "Plain monochrome backgrounds, sharp headers, clean outlines",
                  emoji: "🔳", 
                  action: () => handleApplyPreset("minimal") 
                },
              ].map((aiOpt) => (
                <button
                  key={aiOpt.id}
                  type="button"
                  onClick={() => {
                    aiOpt.action();
                    alert(`AI applied: ${aiOpt.label}! Preview updated.`);
                  }}
                  className="w-full bg-white border border-gray-100 hover:border-purple/30 hover:bg-purple/5 p-3 rounded-2xl flex items-center gap-3 text-left active:scale-[0.99] transition-all shadow-sm group"
                >
                  <span className="text-2xl shrink-0 group-hover:animate-bounce">{aiOpt.emoji}</span>
                  <div>
                    <h4 className="text-[11px] font-black text-gray-700 group-hover:text-purple transition-colors leading-tight">{aiOpt.label}</h4>
                    <p className="text-[9px] text-gray-400 mt-0.5 leading-tight">{aiOpt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </aside>
  );
}
