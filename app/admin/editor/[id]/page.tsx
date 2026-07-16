"use client";

import React, { useEffect, useState, use } from "react";
import { useEditorStore } from "@/lib/store/editorStore";
import { loadProjectData, saveProjectData } from "@/lib/supabase/editorDb";
import Toolbar from "@/components/editor/Toolbar";
import LeftSidebar from "@/components/editor/LeftSidebar";
import Canvas from "@/components/editor/Canvas";
import RightPanel from "@/components/editor/RightPanel";
import { Sparkles } from "lucide-react";

export default function VisualEditorWorkspace({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    initStore,
    hasUnsavedChanges,
    setSaving,
    setUnsaved,
    recipientName,
    countdownDate,
    bgMusicUrl,
    passwords,
    occasion,
    theme,
    mascot,
    pages,
    status
  } = useEditorStore();

  // 1. Load initial project data from Supabase
  useEffect(() => {
    async function loadData() {
      try {
        const data = await loadProjectData(projectId);
        if (data) {
          initStore(data);
        } else {
          setError("Failed to load project details or project not found.");
        }
      } catch (err) {
        setError("An error occurred while loading this workspace.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [projectId]);

  // 2. Debounced Autosave (2 seconds after last modification)
  useEffect(() => {
    if (!hasUnsavedChanges || loading) return;

    const timer = setTimeout(async () => {
      setSaving(true);
      
      const payload = {
        recipientName,
        countdownDate,
        bgMusicUrl,
        passwords,
        occasion,
        theme,
        mascot,
        pages,
        status: status || "draft",
      };

      try {
        const result = await saveProjectData(projectId, payload);
        if (result.success) {
          setUnsaved(false);
        } else {
          console.error("Autosave database sync failed:", result.error);
        }
      } catch (err) {
        console.error("Autosave network error:", err);
      } finally {
        setSaving(false);
      }
    }, 2000); // 2s debounce

    return () => clearTimeout(timer);
  }, [
    hasUnsavedChanges,
    recipientName,
    countdownDate,
    bgMusicUrl,
    passwords,
    occasion,
    theme,
    mascot,
    pages,
    status,
    loading
  ]);

  // 3. Beforeunload warning for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "You have unsaved layout modifications. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  if (loading) {
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-[#F7F5F2] font-sans gap-3.5 select-none">
        <div className="w-12 h-12 rounded-2xl bg-purple flex items-center justify-center text-white shadow-lg animate-bounce">
          <Sparkles size={20} />
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-sm font-black text-gray-700">Loading Visual Canvas</h2>
          <p className="text-[10px] text-gray-400 font-nunito font-semibold uppercase tracking-wider mt-1">
            Reconstructing page blocks and themes...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-[#F7F5F2] font-sans gap-3 select-none px-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 shadow-sm mb-2">
          ⚠️
        </div>
        <h2 className="text-sm font-black text-gray-800">Workspace Load Error</h2>
        <p className="text-xs text-gray-500 max-w-sm leading-relaxed">{error}</p>
        <button 
          onClick={() => window.location.href = "/admin/projects"}
          className="mt-4 px-5 py-2 bg-purple text-white text-xs font-bold rounded-xl shadow hover:bg-purple/90 transition-all"
        >
          Return to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-[#F5F4F0] flex flex-col overflow-hidden relative">
      <Toolbar />
      <div className="flex-1 flex overflow-hidden relative">
        <LeftSidebar />
        <Canvas />
        <RightPanel />
      </div>
    </div>
  );
}
