export interface Game {
  id: string;
  title: string;
  shortTitle: string;
  releaseYear: number;
  platforms: string[];
  description: string;
  cheatCount: number;
}

export const GAMES: Game[] = [
  {
    id: "gta-5",
    title: "Grand Theft Auto V",
    shortTitle: "GTA V",
    releaseYear: 2013,
    platforms: [
      "PC",
      "PS5",
      "PS4",
      "PS3",
      "Xbox Series X/S",
      "Xbox One",
      "Xbox 360",
    ],
    description:
      "Números de celular, combinações de botões e comandos de console no PC para Los Santos e Blaine County.",
    cheatCount: 34,
  },
  {
    id: "gta-the-ballad-of-gay-tony",
    title: "Grand Theft Auto: The Ballad of Gay Tony",
    shortTitle: "GTA: TBoGT",
    releaseYear: 2009,
    platforms: ["PC", "PS3", "Xbox 360"],
    description:
      "Veículos exclusivos, munição explosiva, paraquedas e códigos de jogador digitados pelo celular do jogo.",
    cheatCount: 24,
  },
  {
    id: "gta-chinatown-wars",
    title: "Grand Theft Auto: Chinatown Wars",
    shortTitle: "GTA: Chinatown Wars",
    releaseYear: 2009,
    platforms: ["PSP", "Nintendo DS", "Mobile"],
    description:
      "Letras magnéticas no quadro de missões e sequências de botões para armas, clima e nível de procurado.",
    cheatCount: 19,
  },
  {
    id: "gta-the-lost-and-damned",
    title: "Grand Theft Auto: The Lost and Damned",
    shortTitle: "GTA: TLAD",
    releaseYear: 2009,
    platforms: ["PC", "PS3", "Xbox 360"],
    description:
      "Motos da gangue, vans, armas e códigos de vida discados diretamente no celular de Johnny Klebitz.",
    cheatCount: 22,
  },
  {
    id: "gta-4",
    title: "Grand Theft Auto IV",
    shortTitle: "GTA IV",
    releaseYear: 2008,
    platforms: ["PC", "PS3", "Xbox 360"],
    description:
      "Códigos por telefone para Niko Bellic em Liberty City incluindo armas, vida, clima e carros esportivos.",
    cheatCount: 16,
  },
  {
    id: "vice-city-stories",
    title: "Grand Theft Auto: Vice City Stories",
    shortTitle: "GTA: Vice City Stories",
    releaseYear: 2006,
    platforms: ["PS2", "PSP"],
    description:
      "Sequências de botões para pacotes de armas, tanque Rhino, comportamento de pedestres e trânsito.",
    cheatCount: 38,
  },
  {
    id: "liberty-city-stories",
    title: "Grand Theft Auto: Liberty City Stories",
    shortTitle: "GTA: Liberty City Stories",
    releaseYear: 2005,
    platforms: ["PS2", "PSP", "Mobile"],
    description:
      "Combinações clássicas de controle para colete, dinheiro, pacotes de armas e física de veículos em Liberty City.",
    cheatCount: 41,
  },
  {
    id: "san-andreas",
    title: "Grand Theft Auto: San Andreas",
    shortTitle: "GTA: San Andreas",
    releaseYear: 2004,
    platforms: [
      "PC",
      "PS4",
      "PS3",
      "PS2",
      "Xbox One",
      "Xbox 360",
      "Xbox",
      "Nintendo Switch",
      "Mobile",
    ],
    description:
      "Catálogo completo de palavras no teclado e sequências de controle incluindo HESOYAM, Jetpack, Hydra e atributos.",
    cheatCount: 88,
  },
  {
    id: "vice-city",
    title: "Grand Theft Auto: Vice City",
    shortTitle: "GTA: Vice City",
    releaseYear: 2002,
    platforms: [
      "PC",
      "PS4",
      "PS3",
      "PS2",
      "Xbox",
      "Nintendo Switch",
      "Mobile",
    ],
    description:
      "Códigos clássicos de teclado e comandos de controle para Tommy Vercetti, pacotes de armas, tanque Panzer e carros voadores.",
    cheatCount: 62,
  },
  {
    id: "gta-3",
    title: "Grand Theft Auto III",
    shortTitle: "GTA III",
    releaseYear: 2001,
    platforms: [
      "PC",
      "PS4",
      "PS3",
      "PS2",
      "Xbox",
      "Nintendo Switch",
      "Mobile",
    ],
    description:
      "Códigos originais da era 3D no teclado e controle para todas as armas, vida, colete e tanque Rhino.",
    cheatCount: 27,
  },
  {
    id: "gta-2",
    title: "Grand Theft Auto 2",
    shortTitle: "GTA 2",
    releaseYear: 1999,
    platforms: ["PC", "PS1", "Dreamcast"],
    description:
      "Códigos inseridos no nome do jogador (GOURANGA) para seleção de fases, vidas infinitas, todas as armas e respeito das gangues.",
    cheatCount: 25,
  },
  {
    id: "gta-1",
    title: "Grand Theft Auto",
    shortTitle: "GTA 1",
    releaseYear: 1997,
    platforms: ["PC", "PS1"],
    description:
      "Códigos clássicos no nome do personagem para desbloquear todas as cidades, pontuação máxima, vidas infinitas e sem polícia.",
    cheatCount: 15,
  },
];
