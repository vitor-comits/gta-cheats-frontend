import { GAMES } from "@/data/games";
import { GamesDirectory } from "@/components/GamesDirectory";

export default function HomePage() {
  return (
    <div className="page-container">
      <section className="page-header">
        <h1 className="page-title">Catálogo de Códigos GTA</h1>
        <p className="page-subtitle">
          Referência rápida de códigos e trapaças para todos os títulos da
          franquia Grand Theft Auto.
        </p>
      </section>

      <GamesDirectory games={GAMES} />
    </div>
  );
}
