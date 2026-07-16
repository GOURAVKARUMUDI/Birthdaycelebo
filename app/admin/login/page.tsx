"use client";

import type { Metadata } from "next";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User, AlertCircle, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        setIsLoading(false);
      } else {
        router.push("/admin/projects");
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-tr from-[#FFF5F5] via-[#FFFDF9] to-[#E8DEF8] px-4 font-sans select-none overflow-hidden relative">
      
      {/* Background abstract ambient blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-pink-100/40 filter blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-purple-100/40 filter blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md bg-white/70 backdrop-blur-md rounded-3xl border border-pink-100 p-8 shadow-xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-12 h-12 rounded-2xl bg-purple flex items-center justify-center text-white mb-3 shadow-md"
            role="img"
            aria-label="Admin portal sparkle icon"
          >
            <Sparkles size={20} aria-hidden="true" />
          </div>
          <h1 className="font-poppins font-extrabold text-2xl text-gray-800 tracking-tight">
            Admin Portal Access
          </h1>
          <p className="text-xs text-gray-600 font-nunito font-semibold uppercase tracking-wider mt-1">
            Visual Scrapbook Builder
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              role="alert"
              aria-live="assertive"
              className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 text-xs font-nunito font-bold shadow-sm"
            >
              <AlertCircle size={14} className="shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="space-y-1">
            <label
              htmlFor="admin-username"
              className="text-[10px] font-bold text-gray-600 uppercase tracking-widest block pl-1"
            >
              Username
            </label>
            <div className="relative flex items-center">
              <User size={14} className="absolute left-3 text-gray-400" aria-hidden="true" />
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                disabled={isLoading}
                placeholder="Enter username"
                className="w-full pl-9 pr-4 py-2.5 border border-pink-100 rounded-xl text-xs bg-white/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple focus:border-purple font-nunito transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="admin-password"
              className="text-[10px] font-bold text-gray-600 uppercase tracking-widest block pl-1"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <Lock size={14} className="absolute left-3 text-gray-400" aria-hidden="true" />
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={isLoading}
                placeholder="Enter password"
                className="w-full pl-9 pr-4 py-2.5 border border-pink-100 rounded-xl text-xs bg-white/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple focus:border-purple font-nunito transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-purple hover:bg-purple/90 active:scale-98 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all select-none disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] text-gray-500 font-nunito font-semibold uppercase tracking-wider">
          Secure JWT Authentication System
        </p>
      </motion.div>
    </div>
  );
}
