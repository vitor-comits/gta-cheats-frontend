"use client";

import React from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export default function Toast({ message, type = "success", onClose }: ToastProps) {
  if (!message) return null;

  const bgStyles = {
    success: "bg-emerald-600 text-white shadow-emerald-600/20",
    error: "bg-red-600 text-white shadow-red-600/20",
    info: "bg-blue-600 text-white shadow-blue-600/20",
  }[type];

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  }[type];

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg font-medium text-sm ${bgStyles}`}
      >
        <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
          {icons}
        </span>
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white/70 hover:text-white text-xs font-bold cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

