"use client";

import React, { useEffect, useState } from "react";
import { createProject, logoutAction, fetchProjects, fetchAuditLogs, deleteProject } from "@/lib/supabase/projectActions";
import { 
  Folder, Plus, Settings, Sparkles, LogOut, Layout, 
  Trash2, Globe, Edit, ShieldAlert, FileText, Search, ImageIcon
} from "lucide-react";

interface Project {
  id: string;
  recipient_name: string;
  slug: string;
  status: string;
  occasion: string;
  created_at: string;
}

interface AuditLog {
  id: string;
  action: string;
  details: string;
  created_at: string;
  ip_address: string;
}

export default function ProjectsDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load projects and logs
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const projs = await fetchProjects();
      const logs = await fetchAuditLogs();
      setProjects(projs);
      setAuditLogs(logs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName || !slug) return;
    setError(null);
    setActionLoading(true);

    const result = await createProject(recipientName, slug);
    if (result.success) {
      // Redirect directly to the new editor
      window.location.href = `/admin/editor/${result.id}`;
    } else {
      setError(result.error || "Failed to create project");
      setActionLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutAction();
  };

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this scrapbook project? This cannot be undone.")) return;
    
    const result = await deleteProject(id);
    if (result.success) {
      loadDashboardData();
    } else {
      alert("Failed to delete project: " + result.error);
    }
  };

  // Sync slug field based on recipient name typing
  const handleNameChange = (name: string) => {
    setRecipientName(name);
    setSlug(name.toLowerCase().replace(/[^a-z0-9]/g, "-"));
  };

  return (
    <div className="min-h-screen w-screen bg-[#F7F5F2] flex font-sans overflow-hidden select-none">
      
      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <aside className="w-64 border-r border-gray-200 bg-white flex flex-col justify-between shrink-0">
        <div className="p-6 space-y-8">
          {/* Logo brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple flex items-center justify-center text-white shadow-md">
              <Sparkles size={16} />
            </div>
            <span className="font-poppins font-extrabold text-gray-800 text-sm tracking-tight">
              Scrapbook SaaS
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <a href="/admin/projects" className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-purple/10 text-purple text-xs font-bold transition-all shadow-sm">
              <Folder size={14} /> Projects
            </a>
            <a href="/admin/media" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 text-gray-500 hover:text-gray-800 text-xs font-bold transition-all">
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

        {/* User logout footer */}
        <div className="p-6 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </aside>

      {/* 2. MAIN PROJECTS CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-y-auto p-8 max-w-6xl mx-auto no-scrollbar">
        
        {/* Header toolbar */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-poppins font-extrabold text-2xl text-gray-800 tracking-tight">
              Scrapbook Projects
            </h1>
            <p className="text-xs text-gray-400 font-nunito font-semibold uppercase tracking-wider mt-1">
              Create and manage interactive digital surprises
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-purple text-white text-xs font-bold rounded-xl shadow-md hover:bg-purple/90 active:scale-95 transition-all select-none"
          >
            <Plus size={14} /> Create Scrapbook
          </button>
        </header>

        {loading ? (
          <div className="flex-1 flex flex-col justify-center items-center py-24 gap-3">
            <div className="w-8 h-8 border-4 border-purple border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-gray-400">Loading your project dashboards...</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Projects Cards Grid */}
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all hover:scale-[1.01] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          proj.status === "published" 
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                            : "bg-amber-50 text-amber-600 border border-amber-100"
                        }`}>
                          {proj.status}
                        </span>
                        
                        {/* Delete project */}
                        <button 
                          onClick={(e) => handleDeleteProject(proj.id, e)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      <h3 className="font-poppins font-black text-gray-800 text-sm leading-tight">
                        {proj.recipient_name}'s Scrapbook
                      </h3>
                      <p className="text-[10px] font-mono text-purple mt-1 truncate">
                        /{proj.slug}
                      </p>
                      
                      <div className="flex gap-1.5 mt-3">
                        <span className="text-[9px] bg-gray-50 text-gray-400 font-bold uppercase px-2 py-0.5 rounded-md">
                          Occasion: {proj.occasion}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-6">
                      <a
                        href={`/admin/editor/${proj.id}`}
                        className="flex items-center justify-center gap-1 py-2 bg-purple/10 text-purple text-xs font-bold rounded-xl hover:bg-purple/20 transition-all text-center"
                      >
                        <Edit size={11} /> Edit
                      </a>
                      <a
                        href={`/project/${proj.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 py-2 border border-gray-100 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-50 transition-all text-center"
                      >
                        <Globe size={11} /> Live View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center max-w-md mx-auto flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple/10 flex items-center justify-center text-purple text-xl">
                  📁
                </div>
                <h3 className="font-poppins font-extrabold text-sm text-gray-700">No projects yet</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Start building custom scrapbook layouts for birthdays, anniversaries, proposals, and more!
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-2 px-5 py-2 bg-purple text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Create Your First Project
                </button>
              </div>
            )}

            {/* 3. AUDIT LOGS TIMELINE PANEL */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-poppins font-extrabold text-sm text-gray-800 tracking-tight flex items-center gap-2 mb-4">
                <FileText size={16} className="text-purple" /> Security Audit Log
              </h3>
              
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse text-xs text-gray-500 font-nunito">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="py-2.5">Timestamp</th>
                      <th className="py-2.5">Action Event</th>
                      <th className="py-2.5">Details</th>
                      <th className="py-2.5">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50/50">
                        <td className="py-3 font-mono text-[10px]">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wide ${
                            log.action.includes("FAILED") 
                              ? "bg-red-50 text-red-600" 
                              : log.action.includes("SUCCESSFUL") 
                              ? "bg-emerald-50 text-emerald-600" 
                              : "bg-gray-100 text-gray-500"
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 max-w-xs truncate">{log.details}</td>
                        <td className="py-3 font-mono text-[10px]">{log.ip_address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* CREATE PROJECT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl border border-pink-100 p-6 shadow-2xl relative">
            <h2 className="font-poppins font-black text-lg text-gray-800 mb-2">Create New Scrapbook</h2>
            <p className="text-xs text-gray-400 mb-6">Initialize a clean scrapbook workspace layout presets.</p>

            <form onSubmit={handleCreate} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 text-xs font-bold flex items-center gap-2">
                  <ShieldAlert size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="E.g. Sarah"
                  className="w-full px-3 py-2.5 border border-pink-100 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-purple font-nunito"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Custom URL Slug</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs text-gray-400 font-mono">/project/</span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"))}
                    placeholder="sarah"
                    className="w-full pl-16 pr-3 py-2.5 border border-pink-100 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-purple font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2.5 bg-purple text-white rounded-xl text-xs font-bold hover:bg-purple/90 transition-all flex items-center justify-center gap-1.5 shadow"
                >
                  {actionLoading ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Start Building"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
