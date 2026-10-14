import Link from "next/link";
import { notFound } from "next/navigation";
import { GAMES } from "@/data/games";
import { CheatsDirectory } from "@/components/CheatsDirectory";

interface CheatsPageProps {
  params: Promise<{
    gameId: string;
  }>;
}

export function generateStaticParams() {
  return GAMES.map((game) => ({
    gameId: game.id,
  }));
}

export default async function CheatsPage({
  params,
}: CheatsPageProps) {
  const { gameId } = await params;

  const game = GAMES.find((item) => item.id === gameId);

  if (!game) {
    notFound();
  }

  const isVercel = Boolean(
    process.env.VERCEL === "1" ||
    process.env.NEXT_PUBLIC_VERCEL_ENV ||
    process.env.NEXT_PUBLIC_IS_VERCEL === "1"
  );

  return (
    <div className="page-container">
      <nav className="breadcrumb" aria-label="Navegação">
        <Link href="/" className="breadcrumb-link">
          Início
        </Link>
        <span aria-hidden="true">/</span>
        <span>{game.shortTitle}</span>
      </nav>

      <header className="page-header">
        <h1 className="page-title">
          Cheats de {game.shortTitle}
        </h1>

        <p className="page-subtitle">
          {game.description}
        </p>

        <div className="platform-list">
          <span className="platform-label">Plataformas:</span>
          {game.platforms.map((platform) => (
            <span className="platform-badge" key={platform}>
              {platform}
            </span>
          ))}
        </div>
      </header>

      <CheatsDirectory game={game} isReadOnly={isVercel} />
    </div>
  );
}
