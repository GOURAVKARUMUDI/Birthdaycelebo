"use client";

import React from "react";
import { useEditorStore } from "@/lib/store/editorStore";
import { 
  Undo, Redo, Smartphone, Tablet, Monitor, CheckCircle, 
  RefreshCw, LogOut, ZoomIn, Globe, Shield, Archive, Eye
} from "lucide-react";

export default function Toolbar() {
  const {
    previewDevice, setPreviewDevice,
    canvasZoom, setCanvasZoom,
    undoStack, redoStack, undo, redo,
    isSaving, hasUnsavedChanges,
    projectId, recipientName, slug,
    updateProject,
    status = "draft" // from project configuration
  } = useEditorStore() as any;

  const devices = [
    { id: "mobile-15", label: "iPhone 15 Pro", icon: <Smartphone size={14} />, dims: "393x852" },
    { id: "mobile-se", label: "iPhone SE", icon: <Smartphone size={14} className="scale-90" />, dims: "320x568" },
    { id: "android", label: "Android", icon: <Smartphone size={14} className="text-emerald-500" />, dims: "360x740" },
    { id: "fold", label: "Fold Device", icon: <Smartphone size={14} className="rotate-90" />, dims: "712x653" },
    { id: "tablet-p", label: "Tablet Port", icon: <Tablet size={14} />, dims: "768x1024" },
    { id: "tablet-l", label: "Tablet Land", icon: <Tablet size={14} className="rotate-90" />, dims: "1024x768" },
    { id: "laptop", label: "Laptop", icon: <Monitor size={14} className="scale-90" />, dims: "1280x800" },
    { id: "desktop", label: "Desktop", icon: <Monitor size={14} />, dims: "1440x900" },
    { id: "ultrawide", label: "Ultra Wide", icon: <Monitor size={14} className="scale-105" />, dims: "1920x1080" },
  ] as const;

  const handleExit = () => {
    window.location.href = "/admin/projects";
  };

  return (
    <header className="h-14 border-b border-pink/20 bg-white px-6 flex justify-between items-center select-none shadow-sm z-30 font-sans">
      
      {/* Title & Status */}
      <div className="flex items-center gap-4">
        <button 
          onClick={handleExit}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-800 text-xs font-bold transition-all"
        >
          <LogOut size={12} className="rotate-180" /> Back
        </button>
        <div className="h-4 w-[1px] bg-gray-200" />
        <span className="font-poppins font-extrabold text-gray-800 tracking-tight text-xs md:text-sm">
          ✏️ Builder: {recipientName}
        </span>
        
        {/* Autosave badge */}
        <div className="flex items-center gap-1.5 text-[10px] font-nunito font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100">
          {isSaving ? (
            <>
              <RefreshCw size={10} className="animate-spin text-purple animate-duration-1000" />
              <span className="text-purple-600">Saving...</span>
            </>
          ) : hasUnsavedChanges ? (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-amber-600">Unsaved edits</span>
            </>
          ) : (
            <>
              <CheckCircle size={10} className="text-emerald-500" />
              <span className="text-emerald-600">Saved to Cloud</span>
            </>
          )}
        </div>
      </div>

      {/* Device Preset Switcher */}
      <div className="hidden lg:flex items-center bg-gray-100/80 rounded-full p-1 border border-gray-200 shadow-inner max-w-xl overflow-x-auto no-scrollbar">
        {devices.map((dev) => (
          <button
            key={dev.id}
            onClick={() => setPreviewDevice(dev.id)}
            title={`${dev.label} (${dev.dims})`}
            className={`p-1.5 rounded-full transition-all flex items-center justify-center ${
              previewDevice === dev.id 
                ? "bg-purple text-white shadow-md scale-105" 
                : "text-gray-400 hover:text-gray-700 hover:bg-gray-200/50"
            }`}
          >
            {dev.icon}
          </button>
        ))}
      </div>

      {/* Undo/Redo & Zoom & Publish status */}
      <div className="flex gap-3.5 items-center">
        {/* Undo Redo */}
        <div className="flex gap-1">
          <button
            disabled={undoStack.length === 0}
            onClick={undo}
            title="Undo (Cmd+Z)"
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-30 active:scale-95 transition-all"
          >
            <Undo size={14} />
          </button>
          <button
            disabled={redoStack.length === 0}
            onClick={redo}
            title="Redo (Cmd+Y)"
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-30 active:scale-95 transition-all"
          >
            <Redo size={14} />
          </button>
        </div>

        <div className="h-4 w-[1px] bg-gray-200" />

        {/* Zoom Level */}
        <div className="flex items-center gap-1 text-xs font-nunito font-bold text-gray-500">
          <ZoomIn size={12} className="text-gray-400" />
          <select
            value={canvasZoom}
            onChange={(e) => setCanvasZoom(Number(e.target.value))}
            className="bg-transparent border-0 focus:outline-none focus:ring-0 cursor-pointer py-0.5 text-xs text-gray-600 hover:text-gray-800"
          >
            <option value="0.25">25%</option>
            <option value="0.5">50%</option>
            <option value="0.75">75%</option>
            <option value="1">100%</option>
            <option value="1.25">125%</option>
            <option value="2">200%</option>
          </select>
        </div>

        <div className="h-4 w-[1px] bg-gray-200" />

        {/* Publish Dropdown */}
        <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200">
          <select
            value={status}
            onChange={(e) => updateProject({ status: e.target.value })}
            className="text-[10px] uppercase font-bold tracking-wider bg-transparent border-0 py-1 pl-2 pr-6 focus:outline-none focus:ring-0 text-gray-600 cursor-pointer"
          >
            <option value="draft">📁 Draft</option>
            <option value="preview">👁️ Preview</option>
            <option value="private">🔒 Private</option>
            <option value="published">🚀 Published</option>
            <option value="archived">📦 Archived</option>
          </select>
        </div>

        {/* Live Site external link */}
        <a
          href={`/project/${slug || recipientName.toLowerCase().replace(/\s+/g, "-")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-purple to-indigo-600 text-white text-xs font-bold rounded-full shadow hover:opacity-90 active:scale-95 transition-all select-none"
        >
          <Globe size={11} /> Live Site
        </a>
      </div>
    </header>
  );
}
