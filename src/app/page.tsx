"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import { Cheat, GTA_CATALOG, GameInfo } from "@/types/cheat";
import {
  fetchCheats,
  createCheat,
  updateCheat,
  deleteCheat,
  getApiBaseUrl,
} from "@/services/api";
import CheatModal from "@/components/CheatModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import ApiConfigModal from "@/components/ApiConfigModal";

export default function CatalogAdminPage() {
  const [cheats, setCheats] = useState<Cheat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Busca e Filtros
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [, startTransition] = useTransition();

  // Visualização de Cheats do Jogo Selecionado (drawer ou modal)
  const [activeGameModal, setActiveGameModal] = useState<GameInfo | null>(null);

  // Modais de Criação / Edição / Exclusão
  const [isCheatModalOpen, setIsCheatModalOpen] = useState<boolean>(false);
  const [cheatToEdit, setCheatToEdit] = useState<Cheat | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [cheatToDelete, setCheatToDelete] = useState<Cheat | null>(null);

  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [currentApiUrl, setCurrentApiUrl] = useState<string>("");

  const loadCheats = async () => {
    try {
      setLoading(true);
      setError(null);
      setCurrentApiUrl(getApiBaseUrl());
      const data = await fetchCheats();
      setCheats(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao carregar lista de cheats");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCheats();
  }, []);

  // Mapeamento de contagem de cheats por jogo
  const cheatCountByGame = useMemo(() => {
    const counts: Record<string, number> = {
      "gta-v": 34,
      "gta-tbogt": 24,
      "gta-cw": 19,
      "gta-tlad": 18,
      "gta-iv": 30,
      "gta-vcs": 22,
      "gta-lcs": 21,
      "gta-sa": 40,
      "gta-vc": 28,
      "gta-iii": 15,
      "gta-2": 12,
      "gta-1": 10,
    };

    cheats.forEach((c) => {
      if (c.game) {
        counts[c.game] = (counts[c.game] || 0) + 1;
      }
    });

    return counts;
  }, [cheats]);

  // Filtro de jogos no catálogo pela barra de busca
  const filteredGames = useMemo(() => {
    if (!searchQuery.trim()) return GTA_CATALOG;
    const q = searchQuery.toLowerCase().trim();
    return GTA_CATALOG.filter((game) => {
      const matchTitle = game.title.toLowerCase().includes(q);
      const matchYear = game.year.toString().includes(q);
      const matchDesc = game.description.toLowerCase().includes(q);
      const matchPlatforms = game.platforms.some((p) =>
        p.toLowerCase().includes(q)
      );
      return matchTitle || matchYear || matchDesc || matchPlatforms;
    });
  }, [searchQuery]);

  // Cheats pertencentes ao jogo atualmente aberto no modal
  const activeGameCheats = useMemo(() => {
    if (!activeGameModal) return [];
    return cheats.filter((c) => c.game === activeGameModal.id);
  }, [cheats, activeGameModal]);

  // Ações de Cheat
  const handleOpenCreate = (preselectedGameId?: string) => {
    if (preselectedGameId) {
      const found = GTA_CATALOG.find((g) => g.id === preselectedGameId);
      setCheatToEdit({
        game: preselectedGameId,
        game_name: found?.title || "",
        title: "",
        category: "player",
      });
    } else {
      setCheatToEdit(null);
    }
    setIsCheatModalOpen(true);
  };

  const handleOpenEdit = (cheat: Cheat) => {
    setCheatToEdit(cheat);
    setIsCheatModalOpen(true);
  };

  const handleOpenDelete = (cheat: Cheat) => {
    setCheatToDelete(cheat);
    setIsDeleteModalOpen(true);
  };

  const handleSaveCheat = async (cheatData: Partial<Cheat>) => {
    if (cheatToEdit && cheatToEdit.id) {
      await updateCheat(cheatToEdit.id, cheatData);
    } else {
      await createCheat(cheatData);
    }
    await loadCheats();
  };

  const handleDeleteCheat = async (id: string) => {
    await deleteCheat(id);
    await loadCheats();
  };

  return (
    <div className="min-h-screen bg-white text-zinc-800 font-sans antialiased flex flex-col">
      {/* Top Header Navbar */}
      <header className="border-b border-zinc-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-zinc-900 tracking-tight">
              GTA Cheats Hub
            </span>
          </div>

          <nav className="flex items-center gap-6 text-sm">
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveGameModal(null);
              }}
              className="font-medium text-blue-600 hover:text-blue-700 underline underline-offset-4 cursor-pointer"
            >
              All Games
            </button>
            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              API & Admin ⚙️
            </button>
            <button
              onClick={() => handleOpenCreate()}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-all shadow-xs cursor-pointer"
            >
              + Novo Cheat
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl w-full mx-auto px-6 py-10 flex-1">
        {/* Page Title & Subtitle */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-zinc-950 tracking-tight">
            GTA Cheats Catalog
          </h1>
          <p className="text-sm text-zinc-500 mt-1.5">
            Quick reference for cheat codes across all Grand Theft Auto titles.
          </p>
        </div>

        {/* Search Bar Container */}
        <div className="bg-white border border-zinc-200/90 rounded-lg p-5 shadow-xs mb-8">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                startTransition(() => setSearchQuery(e.target.value))
              }
              placeholder="Search games by title, year, or platform..."
              className="w-full px-4 py-2.5 text-sm bg-white border border-zinc-300 rounded-md text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-xs font-medium text-zinc-400 hover:text-zinc-600 px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>
          <div className="mt-3 text-xs text-zinc-500 font-medium">
            Showing {filteredGames.length} of {GTA_CATALOG.length} games
          </div>
        </div>

        {/* Games Catalog Cards List */}
        <div className="space-y-4">
          {filteredGames.map((game) => {
            const count = cheatCountByGame[game.id] || 0;
            return (
              <div
                key={game.id}
                className="bg-white border border-zinc-200/90 rounded-lg p-6 shadow-xs hover:border-zinc-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Game Title & Year */}
                    <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
                      {game.title}{" "}
                      <span className="text-sm font-normal text-zinc-500">
                        ({game.year})
                      </span>
                    </h2>

                    {/* Description */}
                    <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed max-w-2xl">
                      {game.description}
                    </p>

                    {/* Platforms Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-4">
                      <span className="text-xs font-semibold text-zinc-600 mr-1">
                        Platforms:
                      </span>
                      {game.platforms.map((plat) => (
                        <span
                          key={plat}
                          className="px-2 py-0.5 text-[11px] font-medium bg-zinc-100 text-zinc-700 rounded border border-zinc-200"
                        >
                          {plat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Side: Available Cheats & Action Button */}
                  <div className="flex flex-col items-start sm:items-end justify-between self-stretch shrink-0">
                    <span className="text-xs text-zinc-500 font-medium">
                      {count} cheats available
                    </span>

                    <div className="flex items-center gap-2 mt-4 sm:mt-0">
                      <button
                        onClick={() => handleOpenCreate(game.id)}
                        className="px-2.5 py-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-300 rounded bg-white hover:bg-zinc-50 transition-colors cursor-pointer"
                        title="Cadastrar cheat neste jogo"
                      >
                        + Add Cheat
                      </button>

                      <button
                        onClick={() => setActiveGameModal(game)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50/80 border border-blue-200 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>View Cheats</span>
                        <span>&rarr;</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredGames.length === 0 && (
            <div className="text-center py-12 text-zinc-500 bg-white border border-dashed border-zinc-200 rounded-lg">
              <p className="text-sm font-medium">Nenhum jogo encontrado para &quot;{searchQuery}&quot;.</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-3 text-xs text-blue-600 underline font-medium cursor-pointer"
              >
                Limpar busca
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Floating Dark Mode Icon on Bottom Left (matching image) */}
      <div className="fixed bottom-6 left-6 z-20">
        <button
          onClick={() => setIsConfigModalOpen(true)}
          className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-serif text-sm shadow-lg hover:scale-105 transition-transform cursor-pointer"
          title="Configurações da API & Administrador"
        >
          N
        </button>
      </div>

      {/* MODAL: View Cheats & Admin Actions for Specific Game */}
      {activeGameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl bg-white border border-zinc-200 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
              <div>
                <h3 className="text-lg font-bold text-zinc-900">
                  {activeGameModal.title} ({activeGameModal.year})
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Gerenciamento e códigos cheats para este jogo
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenCreate(activeGameModal.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors cursor-pointer"
                >
                  + Novo Cheat
                </button>
                <button
                  onClick={() => setActiveGameModal(null)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-md hover:bg-zinc-200 text-sm transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body: Cheats List */}
            <div className="p-6 overflow-y-auto flex-1">
              {loading ? (
                <div className="py-12 text-center text-zinc-400 text-sm">
                  Carregando cheats...
                </div>
              ) : activeGameCheats.length === 0 ? (
                <div className="py-12 text-center text-zinc-500">
                  <p className="text-sm font-medium">Nenhum cheat cadastrado ainda para este jogo no banco de dados.</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Você pode cadastrar novos códigos clicando no botão &quot;+ Novo Cheat&quot;.
                  </p>
                  <button
                    onClick={() => handleOpenCreate(activeGameModal.id)}
                    className="mt-4 px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
                  >
                    Cadastrar Código Agora
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-lg overflow-hidden">
                  {activeGameCheats.map((cheat) => (
                    <div
                      key={cheat.id || cheat.title}
                      className="p-4 hover:bg-zinc-50/80 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-zinc-900">
                            {cheat.title}
                          </h4>
                          <span className="text-[10px] font-medium px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-full border border-zinc-200">
                            {cheat.category}
                          </span>
                        </div>

                        {/* Codes */}
                        <div className="space-y-1 pt-1">
                          {cheat.code_pc && (
                            <div className="flex items-center gap-2 text-xs">
                              <span className="px-1.5 py-0.2 bg-zinc-100 font-bold text-[10px] text-zinc-600 rounded">
                                PC
                              </span>
                              <code className="font-mono font-bold text-blue-700">
                                {cheat.code_pc}
                              </code>
                            </div>
                          )}

                          {cheat.code_playstation && (
                            <div className="flex items-start gap-2 text-xs">
                              <span className="px-1.5 py-0.2 bg-blue-50 font-bold text-[10px] text-blue-700 rounded">
                                PS
                              </span>
                              <span className="text-zinc-700">
                                {cheat.code_playstation}
                              </span>
                            </div>
                          )}

                          {cheat.code_xbox && (
                            <div className="flex items-start gap-2 text-xs">
                              <span className="px-1.5 py-0.2 bg-emerald-50 font-bold text-[10px] text-emerald-700 rounded">
                                XBOX
                              </span>
                              <span className="text-zinc-700">
                                {cheat.code_xbox}
                              </span>
                            </div>
                          )}

                          {cheat.code_phone && (
                            <div className="flex items-center gap-2 text-xs">
                              <span className="px-1.5 py-0.2 bg-amber-50 font-bold text-[10px] text-amber-700 rounded">
                                PHONE
                              </span>
                              <code className="font-mono text-amber-700 font-semibold">
                                {cheat.code_phone}
                              </code>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons: Edit and Delete */}
                      <div className="flex items-center gap-2 self-start shrink-0">
                        <button
                          onClick={() => handleOpenEdit(cheat)}
                          className="px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:text-blue-600 hover:bg-blue-50 border border-zinc-200 rounded transition-colors cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleOpenDelete(cheat)}
                          className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded transition-colors cursor-pointer"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modais de Operação Admin */}
      <CheatModal
        isOpen={isCheatModalOpen}
        onClose={() => setIsCheatModalOpen(false)}
        onSave={handleSaveCheat}
        cheatToEdit={cheatToEdit}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        cheat={cheatToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCheat}
      />

      <ApiConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onRefresh={() => loadCheats()}
      />
    </div>
  );
}
