"use client";

import React, { useState } from "react";
import { getApiBaseUrl, setApiBaseUrl, getAdminKey, setAdminKey } from "@/services/api";

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export default function ApiConfigModal({
  isOpen,
  onClose,
  onRefresh,
}: ApiConfigModalProps) {
  const [apiUrl, setUrl] = useState(getApiBaseUrl());
  const [adminKey, setKey] = useState(getAdminKey());
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setApiBaseUrl(apiUrl.trim());
    setAdminKey(adminKey.trim());
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
      onRefresh();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">
          Configuração da API Backend
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
          Defina o endpoint do servidor Node.js/Python e a chave de administrador (x-admin-key).
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Base URL da API
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="http://localhost:5000 ou https://gta-cheats-backend.vercel.app"
              className="w-full text-sm px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-100 font-mono"
              required
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setUrl("http://localhost:5000")}
                className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
              >
                Localhost (5000)
              </button>
              <button
                type="button"
                onClick={() => setUrl("https://gta-cheats-backend.vercel.app")}
                className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
              >
                Vercel Backend
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Chave de Admin (Header: x-admin-key)
            </label>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Deixe em branco se rodando localmente"
              className="w-full text-sm px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-100"
            />
            <p className="text-[11px] text-zinc-400 mt-1">
              Necessário quando o deploy da Vercel bloqueia alterações sem autenticação.
            </p>
          </div>

          {savedNotice && (
            <p className="text-xs text-green-600 dark:text-green-400 font-semibold text-center">
              Configurações salvas com sucesso!
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
            >
              Fechar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

