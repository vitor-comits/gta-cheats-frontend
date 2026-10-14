"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import type { Game } from "@/data/games";
import { Cheat } from "@/types/cheat";
import {
  fetchCheats,
  createCheat,
  updateCheat,
  deleteCheat,
} from "@/services/api";
import CheatModal from "@/components/CheatModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import Toast from "@/components/Toast";

interface CheatsDirectoryProps {
  game: Game;
  isReadOnly?: boolean;
}

function checkIsVercel(): boolean {
  if (process.env.NEXT_PUBLIC_IS_VERCEL === "1") return true;
  if (process.env.VERCEL === "1") return true;
  if (Boolean(process.env.NEXT_PUBLIC_VERCEL_ENV)) return true;
  if (
    typeof window !== "undefined" &&
    (window.location.hostname.endsWith(".vercel.app") ||
      window.location.hostname.includes("vercel"))
  ) {
    return true;
  }
  return false;
}

const PLATFORMS = [
  { key: "code_pc", label: "PC" },
  { key: "code_playstation", label: "PlayStation" },
  { key: "code_xbox", label: "Xbox" },
  { key: "code_phone", label: "Celular" },
] as const;

export function CheatsDirectory({
  game,
  isReadOnly: isReadOnlyProp,
}: CheatsDirectoryProps) {
  const isReadOnly = isReadOnlyProp ?? checkIsVercel();
  const [cheats, setCheats] = useState<Cheat[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState("");

  // Modais de Criação / Edição / Exclusão
  const [isCheatModalOpen, setIsCheatModalOpen] = useState(false);
  const [cheatToEdit, setCheatToEdit] = useState<Cheat | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cheatToDelete, setCheatToDelete] = useState<Cheat | null>(null);

  // Toast Feedback State
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

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshCheats = useCallback(() => {
    setLoading(true);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    fetchCheats(game.id, undefined, controller.signal)
      .then((data) => {
        if (isMounted) {
          setCheats(data);
          setError("");
        }
      })
      .catch((err) => {
        if (err instanceof Error && err.name === "AbortError") return;
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Não foi possível carregar os cheats."
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [game.id, refreshTrigger]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        cheats
          .map((cheat) => cheat.category?.trim())
          .filter((value): value is string => Boolean(value))
      )
    ).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [cheats]);

  const filteredCheats = useMemo(() => {
    const search = query.trim().toLocaleLowerCase("pt-BR");

    return cheats.filter((cheat) => {
      const matchesQuery =
        !search ||
        cheat.title.toLocaleLowerCase("pt-BR").includes(search) ||
        (cheat.category || "").toLocaleLowerCase("pt-BR").includes(search) ||
        PLATFORMS.some(({ key }) => {
          const code = cheat[key];
          return (
            typeof code === "string" &&
            code.toLocaleLowerCase("pt-BR").includes(search)
          );
        });

      const matchesCategory =
        category === "all" || cheat.category === category;

      return matchesQuery && matchesCategory;
    });
  }, [cheats, query, category]);

  async function copyCode(code: string, id: string) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }

      setCopiedId(id);
      window.setTimeout(() => {
        setCopiedId((current) => (current === id ? "" : current));
      }, 1800);
    } catch {
      showToast("Não foi possível copiar automaticamente.", "error");
    }
  }

  // Ações CRUD
  const handleOpenCreate = () => {
    setCheatToEdit({
      game: game.id,
      game_name: game.title,
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
    refreshCheats();
  };

  const handleDeleteCheat = async (id: string) => {
    await deleteCheat(id);
    showToast("Cheat excluído com sucesso!", "success");
    refreshCheats();
  };

  return (
    <section className="page-container">
      <div className="cheats-toolbar">
        <div className="filter-controls">
          <label className="sr-only" htmlFor="cheat-search">
            Buscar cheats
          </label>
          <input
            id="cheat-search"
            className="search-input"
            type="search"
            placeholder="Buscar por nome ou código..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <label className="sr-only" htmlFor="cheat-category">
            Filtrar por categoria
          </label>
          <select
            id="cheat-category"
            className="category-select"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="all">Todas as categorias</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            className="btn-clear"
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
            disabled={!query && category === "all"}
          >
            Limpar
          </button>
        </div>

        <div className="flex items-center gap-3">
          <p className="filter-meta">
            <span>
              {loading
                ? "Carregando códigos..."
                : `${filteredCheats.length} de ${cheats.length} códigos`}
            </span>
          </p>

          {!isReadOnly && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors cursor-pointer flex items-center gap-1 shrink-0"
            >
              + Novo Cheat
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="empty-state" role="status">
          <p className="empty-state-text">
            Carregando cheats de {game.shortTitle}...
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="empty-state" role="alert">
          <p className="empty-state-text">{error}</p>
          <button
            className="btn-reset"
            type="button"
            onClick={() => refreshCheats()}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && filteredCheats.length === 0 && (
        <div className="empty-state">
          <p className="empty-state-text">
            {cheats.length === 0
              ? `Nenhum cheat cadastrado para ${game.shortTitle}.`
              : "Nenhum cheat corresponde à sua busca."}
          </p>
          {cheats.length === 0 ? (
            !isReadOnly && (
              <button
                onClick={handleOpenCreate}
                className="mt-2 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
              >
                Cadastrar primeiro cheat
              </button>
            )
          ) : (
            <button
              className="btn-reset"
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
            >
              Limpar filtros
            </button>
          )}
        </div>
      )}

      {!loading && !error && filteredCheats.length > 0 && (
        <div className="cheats-list">
          {filteredCheats.map((cheat, index) => {
            const id = String(
              cheat.id ?? cheat._id ?? cheat.custom_id ?? index
            );

            const availableCodes = PLATFORMS.filter(({ key }) => {
              const code = cheat[key];
              return typeof code === "string" && Boolean(code.trim());
            });

            return (
              <article className="cheat-card" key={id}>
                <div className="cheat-card-heading">
                  <div>
                    <h2 className="cheat-title">{cheat.title}</h2>
                    <p className="cheat-category">
                      {cheat.category || "Geral"}
                    </p>
                  </div>

                  {!isReadOnly && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(cheat)}
                        className="px-2 py-0.5 text-[11px] font-semibold text-zinc-600 hover:text-blue-600 border border-zinc-200 hover:border-blue-300 rounded transition-colors cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenDelete(cheat)}
                        className="px-2 py-0.5 text-[11px] font-semibold text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded transition-colors cursor-pointer"
                      >
                        Excluir
                      </button>
                    </div>
                  )}
                </div>

                {availableCodes.length > 0 ? (
                  <div className="cheat-codes">
                    {availableCodes.map(({ key, label }) => {
                      const code = cheat[key]!;
                      const copyKey = `${id}-${key}`;

                      return (
                        <div className="cheat-code-row" key={key}>
                          <div className="cheat-code-info">
                            <span className="cheat-platform">{label}</span>
                            <code className="cheat-code">{code}</code>
                          </div>

                          <button
                            className="btn-copy"
                            type="button"
                            onClick={() => copyCode(code, copyKey)}
                            aria-label={`Copiar código para ${label}: ${cheat.title}`}
                          >
                            {copiedId === copyKey ? "Copiado!" : "Copiar"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="cheat-no-code">
                    Nenhum código de plataforma cadastrado.
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Modais de Cheat */}
      <CheatModal
        isOpen={isCheatModalOpen}
        onClose={() => setIsCheatModalOpen(false)}
        onSave={handleSaveCheat}
        cheatToEdit={cheatToEdit}
        defaultGameId={game.id}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        cheat={cheatToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCheat}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
}