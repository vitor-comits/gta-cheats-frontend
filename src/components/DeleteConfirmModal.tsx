"use client";

import React, { useState } from "react";
import { Cheat } from "@/types/cheat";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  cheat: Cheat | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export default function DeleteConfirmModal({
  isOpen,
  cheat,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !cheat) return null;

  const handleConfirm = async () => {
    if (!cheat.id) return;
    try {
      setLoading(true);
      setError("");
      await onConfirm(cheat.id);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao tentar remover cheat.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          ⚠️
        </div>

        <h3 className="text-lg font-bold text-center text-zinc-900 dark:text-zinc-100 mb-2">
          Excluir Código Cheat?
        </h3>

        <p className="text-sm text-center text-zinc-600 dark:text-zinc-400 mb-4">
          Tem certeza de que deseja remover o cheat{" "}
          <strong className="text-zinc-900 dark:text-zinc-200">
            &quot;{cheat.title}&quot;
          </strong>
          ? Esta operação é irreversível no banco de dados.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-lg text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Excluindo...
              </>
            ) : (
              "Sim, Excluir"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

