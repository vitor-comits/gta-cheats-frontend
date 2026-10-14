"use client";

import React, { useState, useEffect, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { Cheat, CATEGORIES } from "@/types/cheat";
import { GAMES, Game } from "@/data/games";
import {
  fetchCheats,
  createCheat,
  updateCheat,
  deleteCheat,
  loginAdmin,
  clearAdminSession,
  normalizeGameId,
} from "@/services/api";
import CheatModal from "@/components/CheatModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import Toast from "@/components/Toast";

function subscribeToAuth(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("auth-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("auth-change", callback);
  };
}

function getAuthSnapshot() {
  return localStorage.getItem("gta_admin_token") || "";
}

function getServerAuthSnapshot() {
  return "";
}

function getUserSnapshot() {
  return localStorage.getItem("gta_admin_user") || "admin";
}

function getServerUserSnapshot() {
  return "admin";
}

const PLATFORMS = [
  { key: "code_pc", label: "PC" },
  { key: "code_playstation", label: "PlayStation" },
  { key: "code_xbox", label: "Xbox" },
  { key: "code_phone", label: "Celular" },
] as const;

export default function AdminPage() {
  // Sincronização de Autenticação com External Store (React 19 / Next.js)
  const authToken = useSyncExternalStore(subscribeToAuth, getAuthSnapshot, getServerAuthSnapshot);
  const adminUsername = useSyncExternalStore(subscribeToAuth, getUserSnapshot, getServerUserSnapshot);
  const isAuthenticated = Boolean(authToken);

  // Formulário de Login
  const [usernameInput, setUsernameInput] = useState<string>("admin");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Estado dos Cheats
  const [cheats, setCheats] = useState<Cheat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string>("");
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Modais de Criação, Edição e Exclusão
  const [isCheatModalOpen, setIsCheatModalOpen] = useState<boolean>(false);
  const [cheatToEdit, setCheatToEdit] = useState<Cheat | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [cheatToDelete, setCheatToDelete] = useState<Cheat | null>(null);

  // Notificações Toast
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  // Carrega lista de cheats quando autenticado
  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;
    const controller = new AbortController();

    const gameParam = selectedGame === "all" ? undefined : selectedGame;
    const categoryParam = selectedCategory === "all" ? undefined : selectedCategory;

    fetchCheats(gameParam, categoryParam, controller.signal)
      .then((data) => {
        if (isMounted) {
          setCheats(data);
          setFetchError("");
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
        if (isMounted) {
          setFetchError(
            err instanceof Error ? err.message : "Erro ao carregar lista de cheats."
          );
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [isAuthenticated, selectedGame, selectedCategory, refreshTrigger]);

  // Ação de Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim() || !passwordInput.trim()) {
      setLoginError("Informe o usuário e a senha.");
      return;
    }

    try {
      setIsLoggingIn(true);
      setLoginError("");
      await loginAdmin(usernameInput.trim(), passwordInput.trim());
      setPasswordInput("");
      setLoading(true);
      showToast("Autenticado como administrador com sucesso!", "success");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setLoginError(err.message);
      } else {
        setLoginError("Falha na autenticação. Verifique suas credenciais.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Ação de Logout
  const handleLogout = () => {
    clearAdminSession();
    setCheats([]);
    showToast("Sessão encerrada com sucesso.", "info");
  };

  // Ações CRUD
  const handleOpenCreate = () => {
    const defaultGame = selectedGame !== "all" ? selectedGame : "gta-5";
    const gameObj = GAMES.find((g) => g.id === defaultGame);
    setCheatToEdit({
      game: defaultGame,
      game_name: gameObj?.title || "",
      title: "",
      category: "player",
    });
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
    if (cheatToEdit?.id) {
      await updateCheat(cheatToEdit.id, cheatData);
      showToast("Cheat atualizado com sucesso!", "success");
    } else {
      await createCheat(cheatData);
      showToast("Cheat cadastrado com sucesso!", "success");
    }
    setLoading(true);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleDeleteCheat = async (id: string) => {
    await deleteCheat(id);
    showToast("Cheat excluído com sucesso!", "success");
    setLoading(true);
    setRefreshTrigger((prev) => prev + 1);
  };

  // Filtra cheats exibidos na interface
  const filteredCheats = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();
    return cheats.filter((cheat) => {
      // Filtro de Jogo (quando selectedGame != 'all')
      if (selectedGame !== "all") {
        const normCheatGame = normalizeGameId(cheat.game);
        if (normCheatGame !== selectedGame && cheat.game !== selectedGame) {
          return false;
        }
      }

      // Filtro de Categoria
      if (selectedCategory !== "all" && cheat.category !== selectedCategory) {
        return false;
      }

      // Busca por texto
      if (!search) return true;
      const matchesTitle = cheat.title.toLowerCase().includes(search);
      const matchesCategory = (cheat.category || "").toLowerCase().includes(search);
      const matchesGameName = (cheat.game_name || "").toLowerCase().includes(search);
      const matchesCode = PLATFORMS.some(({ key }) => {
        const code = cheat[key];
        return typeof code === "string" && code.toLowerCase().includes(search);
      });

      return matchesTitle || matchesCategory || matchesGameName || matchesCode;
    });
  }, [cheats, selectedGame, selectedCategory, searchQuery]);

  // TELA DE LOGIN (Se não autenticado)
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-xl p-8">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h1 className="text-xl font-bold text-center text-zinc-900 mb-1">
            Painel do Administrador
          </h1>
          <p className="text-xs text-center text-zinc-500 mb-6">
            Área restrita para cadastro e gerenciamento de cheats.
          </p>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Usuário
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="admin"
                className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </>
              ) : (
                "Acessar Painel"
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-zinc-100 flex flex-col items-center gap-2 text-xs text-zinc-400">
            <p>Acesso exclusivo para administradores cadastrados.</p>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              ← Voltar para o catálogo público
            </Link>
          </div>
        </div>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    );
  }

  // TELA DO PAINEL ADMINISTRATIVO (Usuário logado)
  return (
    <div className="page-container">
      {/* Barra superior de status do Administrador */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-zinc-900 text-white rounded-xl shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500 text-white uppercase tracking-wider">
            Admin
          </span>
          <span className="text-xs text-zinc-300">
            Sessão ativa como <strong className="text-white">{adminUsername}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="px-3 py-1 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
          >
            Ver site público
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-1 text-xs font-semibold text-red-300 hover:text-red-100 bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 rounded-md transition-colors cursor-pointer"
          >
            Sair do Painel
          </button>
        </div>
      </div>

      {/* Cabeçalho do Painel */}
      <header className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Gerenciador de Cheats</h1>
          <p className="page-subtitle">
            Cadastre, edite e remova códigos para qualquer título do Grand Theft Auto.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="self-start sm:self-auto px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Novo Cheat</span>
        </button>
      </header>

      {/* Barra de Filtros e Busca */}
      <div className="filter-bar flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Filtrar por Jogo
            </label>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900"
            >
              <option value="all">Todos os Jogos (Geral)</option>
              {GAMES.map((game: Game) => (
                <option key={game.id} value={game.id}>
                  {game.shortTitle} - {game.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Filtrar por Categoria
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Buscar Código ou Efeito
            </label>
            <input
              type="search"
              placeholder="Ex: HESOYAM, Vida, Jetpack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-200 text-xs text-zinc-500">
          <span>
            {loading
              ? "Carregando catálogo..."
              : `Exibindo ${filteredCheats.length} de ${cheats.length} cheats cadastrados`}
          </span>

          {(selectedGame !== "all" || selectedCategory !== "all" || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedGame("all");
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Estado de Carregamento */}
      {loading && (
        <div className="empty-state">
          <p className="empty-state-text">Carregando cheats do banco de dados...</p>
        </div>
      )}

      {/* Estado de Erro */}
      {!loading && fetchError && (
        <div className="empty-state" role="alert">
          <p className="empty-state-text text-red-600 font-medium">{fetchError}</p>
          <button
            className="btn-reset"
            type="button"
            onClick={() => {
              setLoading(true);
              setRefreshTrigger((prev) => prev + 1);
            }}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Lista Vazia */}
      {!loading && !fetchError && filteredCheats.length === 0 && (
        <div className="empty-state">
          <p className="empty-state-text">
            {cheats.length === 0
              ? "Nenhum cheat encontrado no banco de dados."
              : "Nenhum cheat corresponde aos filtros selecionados."}
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            + Cadastrar Cheat
          </button>
        </div>
      )}

      {/* Lista de Cheats com Ações de Edição e Exclusão */}
      {!loading && !fetchError && filteredCheats.length > 0 && (
        <div className="cheats-list">
          {filteredCheats.map((cheat, index) => {
            const id = String(cheat.id ?? cheat._id ?? cheat.custom_id ?? index);
            const normGame = normalizeGameId(cheat.game);
            const gameObj = GAMES.find((g) => g.id === normGame);
            const gameDisplay = gameObj?.shortTitle || cheat.game_name || cheat.game;

            const availableCodes = PLATFORMS.filter(({ key }) => {
              const code = cheat[key];
              return typeof code === "string" && Boolean(code.trim());
            });

            return (
              <article className="cheat-card" key={id}>
                <div className="cheat-card-heading">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-zinc-100 text-zinc-700 border border-zinc-200">
                        {gameDisplay}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-medium">
                        {cheat.category || "Geral"}
                      </span>
                    </div>
                    <h2 className="cheat-title">{cheat.title}</h2>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(cheat)}
                      className="px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:text-blue-600 bg-zinc-50 hover:bg-blue-50 border border-zinc-200 hover:border-blue-300 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenDelete(cheat)}
                      className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50/50 hover:bg-red-50 border border-red-200 hover:border-red-300 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Excluir</span>
                    </button>
                  </div>
                </div>

                {availableCodes.length > 0 ? (
                  <div className="cheat-codes">
                    {availableCodes.map(({ key, label }) => {
                      const code = cheat[key]!;
                      return (
                        <div className="cheat-code-row" key={key}>
                          <div className="cheat-code-info">
                            <span className="cheat-platform">{label}</span>
                            <code className="cheat-code">{code}</code>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="cheat-no-code">
                    Nenhum código de plataforma cadastrado para este cheat.
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Modal de Criação / Edição */}
      <CheatModal
        isOpen={isCheatModalOpen}
        onClose={() => setIsCheatModalOpen(false)}
        onSave={handleSaveCheat}
        cheatToEdit={cheatToEdit}
        defaultGameId={selectedGame !== "all" ? selectedGame : "gta-5"}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        cheat={cheatToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCheat}
      />

      {/* Notificações Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
