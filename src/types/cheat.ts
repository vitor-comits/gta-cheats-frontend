export interface Cheat {
  id?: string;
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

export interface GameInfo {
  id: string;
  title: string;
  year: number;
  description: string;
  platforms: string[];
  aliases?: string[];
}

export const GTA_CATALOG: GameInfo[] = [
  {
    id: "gta-v",
    title: "Grand Theft Auto V",
    year: 2013,
    description: "Cell phone numbers, button combinations, and PC console commands for Los Santos and Blaine County.",
    platforms: ["PC", "PS5", "PS4", "PS3", "Xbox Series X/S", "Xbox One", "Xbox 360"],
    aliases: ["gta 5", "gta v", "gtav", "gta5", "five"],
  },
  {
    id: "gta-tbogt",
    title: "Grand Theft Auto: The Ballad of Gay Tony",
    year: 2009,
    description: "Exclusive vehicles, explosive ammo, parachute, and player cheats entered via the in-game cell phone.",
    platforms: ["PC", "PS3", "Xbox 360"],
    aliases: ["tbogt", "ballad of gay tony", "gay tony", "gta gay tony", "gta 4 gay tony", "gta iv gay tony"],
  },
  {
    id: "gta-cw",
    title: "Grand Theft Auto: Chinatown Wars",
    year: 2009,
    description: "Replay board magnetic letters and handheld button sequences for weapons, weather, and wanted levels.",
    platforms: ["PSP", "Nintendo DS", "Mobile"],
    aliases: ["chinatown", "chinatown wars", "gta cw", "cw", "gta chinatown"],
  },
  {
    id: "gta-tlad",
    title: "Grand Theft Auto: The Lost and Damned",
    year: 2009,
    description: "Biker gang assistance, weapons, bikes and health codes through Niko and Johnny's mobile phone.",
    platforms: ["PC", "PS3", "Xbox 360"],
    aliases: ["tlad", "the lost and damned", "lost and damned", "gta tlad", "gta 4 lost and damned"],
  },
  {
    id: "gta-iv",
    title: "Grand Theft Auto IV",
    year: 2008,
    description: "Cell phone dialing cheats for Liberty City spanning health, weapons, Annihilator helicopter and vehicles.",
    platforms: ["PC", "PS3", "Xbox 360"],
    aliases: ["gta 4", "gta iv", "gta4", "gtaiv", "four"],
  },
  {
    id: "gta-vcs",
    title: "Grand Theft Auto: Vice City Stories",
    year: 2006,
    description: "Controller combinations for 1984 Vice City health, weapons, weather, money and vehicle spawns.",
    platforms: ["PS2", "PSP"],
    aliases: ["vcs", "vice city stories", "gta vcs", "gta vice city stories"],
  },
  {
    id: "gta-lcs",
    title: "Grand Theft Auto: Liberty City Stories",
    year: 2005,
    description: "Codes for Toni Cipriani including weapon packs, tank spawns, and pedestrian riot modes.",
    platforms: ["PS2", "PSP", "Mobile"],
    aliases: ["lcs", "liberty city stories", "gta lcs", "gta liberty city stories"],
  },
  {
    id: "gta-sa",
    title: "Grand Theft Auto: San Andreas",
    year: 2004,
    description: "HESOYAM, JETPACK, infinite ammo, flying cars and full controller sequences across San Andreas.",
    platforms: ["PC", "PS2", "PS3", "PS4", "Xbox", "Xbox 360", "Mobile"],
    aliases: ["gta sa", "gtasa", "san andreas", "gta san andreas", "gta san"],
  },
  {
    id: "gta-vc",
    title: "Grand Theft Auto: Vice City",
    year: 2002,
    description: "Classic neon 80s cheats: ASPIRINE, PRECIOUSPROTECTION, PANZER tank, and weapons packs.",
    platforms: ["PC", "PS2", "Xbox", "Mobile"],
    aliases: ["gta vc", "gtavc", "vice city", "gta vice city", "gta vice"],
  },
  {
    id: "gta-iii",
    title: "Grand Theft Auto III",
    year: 2001,
    description: "The groundbreaking 3D Liberty City codes for health, guns, tank Rhino and flying dodo.",
    platforms: ["PC", "PS2", "Xbox"],
    aliases: ["gta 3", "gta iii", "gta3", "gtaiii", "three"],
  },
  {
    id: "gta-2",
    title: "Grand Theft Auto 2",
    year: 1999,
    description: "Top-down retro cheats entered via player name in the Anywhere City district selector.",
    platforms: ["PC", "PS1", "Dreamcast"],
    aliases: ["gta 2", "gta ii", "gta2", "two"],
  },
  {
    id: "gta-1",
    title: "Grand Theft Auto",
    year: 1997,
    description: "The original 1997 top-down crime classic player name cheat codes and level select.",
    platforms: ["PC", "PS1"],
    aliases: ["gta 1", "gta1", "gta original", "gta classic", "one"],
  },
];

export const CATEGORIES = [
  { id: "all", name: "Todas as Categorias" },
  { id: "player", name: "Jogador / Personagem (Player)" },
  { id: "vehicles", name: "Veículos e Spawns" },
  { id: "weapons", name: "Armas e Munição" },
  { id: "weather", name: "Clima e Ambiente" },
  { id: "general", name: "Geral / Outros" },
];
