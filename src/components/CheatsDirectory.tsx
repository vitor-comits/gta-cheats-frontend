"use client";

import { useEffect, useMemo, useState } from "react";
import type { Game } from "@/data/games";

interface Cheat {
  id?: string;
  _id?: string;
  custom_id?: number;
  game: string;
  game_name?: string;
  title: string;
  code_pc?: string | null;
  code_playstation?: string | null;
  code_xbox?: string | null;
  code_phone?: string | null;
  category?: string;
}

interface CheatsResponse {
  count: number;
  cheats: Cheat[];
}

interface CheatsDirectoryProps {
  game: Game;
}

const API_URL = (
  process.env.NEXT_PUBLIC_GTA_API_URL ||
  "https://gta-cheats-backend.vercel.app"
).replace(/\/+$/, "");

const GAME_ID_ALIASES: Record<string, string[]> = {
  "gta-5": ["gta-5", "gta-v"],
  "san-andreas": ["san-andreas", "gta-sa"],
  "gta-4": ["gta-4", "gta-iv"],
  "vice-city": ["vice-city", "gta-vice-city"],
  "gta-3": ["gta-3", "gta-iii"],
  "gta-2": ["gta-2"],
  "gta-1": ["gta-1"],
  "gta-the-ballad-of-gay-tony": [
    "gta-the-ballad-of-gay-tony",
    "gta-tbogt",
  ],
  "gta-chinatown-wars": ["gta-chinatown-wars"],
  "gta-the-lost-and-damned": [
    "gta-the-lost-and-damned",
    "gta-tlad",
  ],
  "vice-city-stories": ["vice-city-stories", "gta-vcs"],
  "liberty-city-stories": ["liberty-city-stories", "gta-lcs"],
};

const PLATFORMS = [
  { key: "code_pc", label: "PC" },
  { key: "code_playstation", label: "PlayStation" },
  { key: "code_xbox", label: "Xbox" },
  { key: "code_phone", label: "Celular" },
] as const;

export function CheatsDirectory({ game }: CheatsDirectoryProps) {
  const [cheats, setCheats] = useState<Cheat[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const [copyError, setCopyError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadCheats() {
      setLoading(true);
      setError("");
      setCheats([]);

      try {
        const gameIds = GAME_ID_ALIASES[game.id] ?? [game.id];
        const results = await Promise.all(
          gameIds.map(async (gameId) => {
            const url = new URL(`${API_URL}/api/cheats`);
            url.searchParams.set("game", gameId);

            const response = await fetch(url.toString(), {
              cache: "no-store",
              signal: controller.signal,
            });

            if (!response.ok) {
              throw new Error(
                `A API respondeu com o status ${response.status}.`
              );
            }

            const data: CheatsResponse = await response.json();

            if (!Array.isArray(data.cheats)) {
              throw new Error(
                "A resposta da API não contém uma lista válida."
              );
            }

            return data.cheats;
          })
        );

        const uniqueCheats = new Map<string, Cheat>();

        results.flat().forEach((cheat, index) => {
          const id = String(
            cheat.id ?? cheat._id ?? cheat.custom_id ?? `${cheat.game}-${cheat.title}-${index}`
          );
          uniqueCheats.set(id, cheat);
        });

        setCheats(Array.from(uniqueCheats.values()));
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar os cheats."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadCheats();

    return () => controller.abort();
  }, [game.id]);

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
        (cheat.category || "")
          .toLocaleLowerCase("pt-BR")
          .includes(search) ||
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
    setCopyError("");

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.readOnly = true;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";

        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        const copied = document.execCommand("copy");
        textarea.remove();

        if (!copied) {
          throw new Error("O navegador não permitiu copiar o código.");
        }
      }

      setCopiedId(id);

      window.setTimeout(() => {
        setCopiedId((current) => (current === id ? "" : current));
      }, 1800);
    } catch (err) {
      console.error("Erro ao copiar cheat:", err);
      setCopiedId("");
      setCopyError(
        "Não foi possível copiar automaticamente. Selecione e copie o código manualmente."
      );
    }
  }

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

        <p className="filter-meta">
          <span>
            {loading
              ? "Carregando códigos..."
              : `${filteredCheats.length} de ${cheats.length} códigos`}
          </span>
        </p>
      </div>

      {copyError && (
        <p className="empty-state-text" role="status">
          {copyError}
        </p>
      )}

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
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && filteredCheats.length === 0 && (
        <div className="empty-state">
          <p className="empty-state-text">
            {cheats.length === 0
              ? `Nenhum cheat encontrado para ${game.shortTitle}.`
              : "Nenhum cheat corresponde à sua busca."}
          </p>

          {(query || category !== "all") && (
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
    </section>
  );
}