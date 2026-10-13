"use client";

import React, { useState, useEffect } from "react";
import { Cheat, GTA_CATALOG, CATEGORIES } from "@/types/cheat";

interface CheatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cheatData: Partial<Cheat>) => Promise<void>;
  cheatToEdit: Cheat | null;
}

export default function CheatModal({
  isOpen,
  onClose,
  onSave,
  cheatToEdit,
}: CheatModalProps) {
  const [formData, setFormData] = useState<Partial<Cheat>>({
    game: "gta-sa",
    game_name: "Grand Theft Auto: San Andreas",
    title: "",
    code_pc: "",
    code_playstation: "",
    code_xbox: "",
    code_phone: "",
    category: "player",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (cheatToEdit) {
      setFormData({
        game: cheatToEdit.game || "gta-sa",
        game_name:
          cheatToEdit.game_name ||
          GTA_CATALOG.find((g) => g.id === cheatToEdit.game)?.title ||
          "",
        title: cheatToEdit.title || "",
        code_pc: cheatToEdit.code_pc || "",
        code_playstation: cheatToEdit.code_playstation || "",
        code_xbox: cheatToEdit.code_xbox || "",
        code_phone: cheatToEdit.code_phone || "",
        category: cheatToEdit.category || "player",
      });
    } else {
      setFormData({
        game: "gta-sa",
        game_name: "Grand Theft Auto: San Andreas",
        title: "",
        code_pc: "",
        code_playstation: "",
        code_xbox: "",
        code_phone: "",
        category: "player",
      });
    }
    setErrorMessage("");
  }, [cheatToEdit, isOpen]);

  if (!isOpen) return null;

  const handleGameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const gameObj = GTA_CATALOG.find((g) => g.id === selectedId);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {cheatToEdit ? "Editar Código Cheat" : "Cadastrar Novo Cheat"}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {cheatToEdit
                ? `Editando identificador: ${cheatToEdit.id || "(Sem ID)"}`
                : "Preencha as informações do cheat e os códigos por plataforma"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-lg text-sm text-red-600 dark:text-red-400">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Jogo (Game) *
              </label>
              <select
                value={formData.game}
                onChange={handleGameChange}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-100"
                required
              >
                {GTA_CATALOG.map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Categoria *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-100"
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
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Título / Efeito do Cheat *
            </label>
            <input
              type="text"
              placeholder="Ex: Saúde, Colete e $250.000 ou Jetpack"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-100"
              required
            />
          </div>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
              Códigos por Plataforma
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  💻 Código PC (Teclado)
                </label>
                <input
                  type="text"
                  placeholder="Ex: HESOYAM ou ASPIRINE"
                  value={formData.code_pc || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, code_pc: e.target.value }))
                  }
                  className="w-full font-mono text-sm px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-100 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  🎮 Código PlayStation (PS2 / PS3 / PS4 / PS5)
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
                  className="w-full text-sm px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  🎮 Código Xbox (Xbox 360 / Xbox One / Series X|S)
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
                  className="w-full text-sm px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  📱 Código Telefone / Celular (GTA IV, GTA V)
                </label>
                <input
                  type="text"
                  placeholder="Ex: 1-999-526-42766 ou 482-555-0100"
                  value={formData.code_phone || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      code_phone: e.target.value,
                    }))
                  }
                  className="w-full font-mono text-sm px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-100"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Salvando...
                </>
              ) : cheatToEdit ? (
                "Atualizar Cheat"
              ) : (
                "Salvar Cheat"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

