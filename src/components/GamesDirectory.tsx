"use client";

import { useState, useMemo } from "react";
import type { Game } from "@/data/games";
import { SearchBar } from "@/components/SearchBar";
import { GameCard } from "@/components/GameCard";
import { EmptyState } from "@/components/EmptyState";

interface GamesDirectoryProps {
  games: Game[];
}

export function GamesDirectory({ games }: GamesDirectoryProps) {
  const [query, setQuery] = useState("");

  const filteredGames = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return games;

    return games.filter(
      (game) =>
        game.title.toLowerCase().includes(q) ||
        game.shortTitle.toLowerCase().includes(q) ||
        String(game.releaseYear).includes(q) ||
        game.platforms.some((platform) => platform.toLowerCase().includes(q))
    );
  }, [games, query]);

  return (
    <div className="page-container">
      <SearchBar
        value={query}
        onChange={setQuery}
        onClear={() => setQuery("")}
        placeholder="Buscar jogos por título, ano ou plataforma..."
        totalCount={games.length}
        filteredCount={filteredGames.length}
        itemLabel="jogos"
      />

      {filteredGames.length > 0 ? (
        <div className="games-list" role="list">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <EmptyState
          message="Nenhum jogo encontrado para a sua busca."
          onReset={() => setQuery("")}
        />
      )}
    </div>
  );
}
