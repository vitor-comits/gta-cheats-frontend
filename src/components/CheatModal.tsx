"use client";

import React, { useState } from "react";
import { Cheat, CATEGORIES } from "@/types/cheat";
import { GAMES } from "@/data/games";
import { normalizeGameId } from "@/services/api";

interface CheatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cheatData: Partial<Cheat>) => Promise<void>;
  cheatToEdit: Cheat | null;
  defaultGameId?: string;
}

interface CheatFormProps {
  cheatToEdit: Cheat | null;
  defaultGameId: string;
  onClose: () => void;
  onSave: (cheatData: Partial<Cheat>) => Promise<void>;
}

function CheatForm({
  cheatToEdit,
  defaultGameId,
  onClose,
  onSave,
}: CheatFormProps) {
  const [formData, setFormData] = useState<Partial<Cheat>>(() => {
    if (cheatToEdit) {
      const normalizedGame = normalizeGameId(cheatToEdit.game) || defaultGameId;
      return {
        game: normalizedGame,
        game_name:
          cheatToEdit.game_name ||
          GAMES.find((g) => g.id === normalizedGame)?.title ||
          "",
        title: cheatToEdit.title || "",
        code_pc: cheatToEdit.code_pc || "",
        code_playstation: cheatToEdit.code_playstation || "",
        code_xbox: cheatToEdit.code_xbox || "",
        code_phone: cheatToEdit.code_phone || "",
        category: cheatToEdit.category || "player",
      };
    }
    const gameObj = GAMES.find((g) => g.id === defaultGameId);
    return {
      game: defaultGameId,
      game_name: gameObj?.title || "",
      title: "",
      code_pc: "",
      code_playstation: "",
      code_xbox: "",
      code_phone: "",
      category: "player",
    };
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const gameObj = GAMES.find((g) => g.id === selectedId);
    setFormData((prev) => ({
      ...prev,
      game: selectedId,
      game_name: gameObj ? gameObj.title : prev.game_name,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      setErrorMessage("O campo Título é obrigatório.");
      return;
    }
    if (!formData.game?.trim()) {
      setErrorMessage("Selecione um jogo válido.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      await onSave(formData);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Erro desconhecido ao salvar o cheat.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Jogo *
          </label>
          <select
            value={formData.game}
            onChange={handleGameChange}
            className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900"
            required
          >
            {GAMES.map((game) => (
              <option key={game.id} value={game.id}>
                {game.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Categoria *
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, category: e.target.value }))
            }
            className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900"
            required
          >
            {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-zinc-700 mb-1">
          Título / Efeito do Cheat *
        </label>
        <input
          type="text"
          placeholder="Ex: Saúde, Colete e $250.000 ou Jetpack"
          value={formData.title || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900"
          required
        />
      </div>

      <div className="pt-2 border-t border-zinc-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
          Códigos por Plataforma
        </h3>

        <div className="space-y-3">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 mb-1">
              <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Código PC (Teclado)</span>
            </label>
            <input
              type="text"
              placeholder="Ex: HESOYAM ou ASPIRINE"
              value={formData.code_pc || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, code_pc: e.target.value }))
              }
              className="w-full font-mono text-sm px-3 py-2 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900 uppercase"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 mb-1">
              <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12h.01M12 12h.01M9 12h.01M6 12h.01M18 12h.01M7 9v6m-3-3h6m8-3v6m-3-3h6" />
              </svg>
              <span>Código PlayStation (PS2 / PS3 / PS4 / PS5)</span>
            </label>
            <input
              type="text"
              placeholder="Ex: R1, R2, L1, X, Esquerda, Baixo, Direita, Cima..."
              value={formData.code_playstation || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  code_playstation: e.target.value,
                }))
              }
              className="w-full text-sm px-3 py-2 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 mb-1">
              <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12h.01M12 12h.01M9 12h.01M6 12h.01M18 12h.01M7 9v6m-3-3h6m8-3v6m-3-3h6" />
              </svg>
              <span>Código Xbox (Xbox 360 / Xbox One / Series X|S)</span>
            </label>
            <input
              type="text"
              placeholder="Ex: RT, RB, LT, A, Esquerda, Baixo, Direita, Cima..."
              value={formData.code_xbox || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  code_xbox: e.target.value,
                }))
              }
              className="w-full text-sm px-3 py-2 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 mb-1">
              <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>Código Telefone / Celular (GTA IV, GTA V)</span>
            </label>
            <input
              type="text"
              placeholder="Ex: 1-999-724-654-5537 ou 482-555-0100"
              value={formData.code_phone || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  code_phone: e.target.value,
                }))
              }
              className="w-full font-mono text-sm px-3 py-2 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
        >
          {loading ? "Salvando..." : "Salvar Cheat"}
        </button>
      </div>
    </form>
  );
}

export default function CheatModal({
  isOpen,
  onClose,
  onSave,
  cheatToEdit,
  defaultGameId = "gta-5",
}: CheatModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h2 className="text-lg font-bold text-zinc-900">
            {cheatToEdit && cheatToEdit.id ? "Editar Cheat" : "Novo Cheat"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar janela"
            className="text-zinc-400 hover:text-zinc-600 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <CheatForm
          key={`${cheatToEdit?.id ?? "new"}-${defaultGameId}`}
          cheatToEdit={cheatToEdit}
          defaultGameId={defaultGameId}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
}
