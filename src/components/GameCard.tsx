import Link from "next/link";
import type { Game } from "@/data/games";
import { Badge } from "@/components/Badge";

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <article className="game-card">
      <div className="game-card-body">
        <div className="game-card-info">
          <div className="game-card-header">
            <h2 className="game-card-title">
              <Link
                href={`/cheats/${game.id}`}
                className="game-card-title-link"
              >
                {game.title}
              </Link>
            </h2>
            <span className="game-card-year">({game.releaseYear})</span>
          </div>

          <p className="game-card-description">{game.description}</p>

          <div className="platform-list">
            <span className="platform-label">Plataformas:</span>
            {game.platforms.map((platform) => (
              <Badge key={platform}>{platform}</Badge>
            ))}
          </div>
        </div>

        <div className="game-card-actions">
          <Link href={`/cheats/${game.id}`} className="action-link">
            Ver Códigos &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}

