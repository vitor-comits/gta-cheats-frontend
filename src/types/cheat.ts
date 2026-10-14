export interface Cheat {
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
  category: string;
  description?: string;
}

export const CATEGORIES = [
  { id: "all", name: "Todas as Categorias" },
  { id: "player", name: "Jogador / Personagem" },
  { id: "vehicles", name: "Veículos e Spawns" },
  { id: "weapons", name: "Armas e Munição" },
  { id: "weather", name: "Clima e Ambiente" },
  { id: "general", name: "Geral / Outros" },
];
