import { Cheat } from "@/types/cheat";

const RAW_API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_GTA_API_URL ||
  "http://localhost:5000"
).trim().replace(/\/+$/, "");

const API_BASE_URL =
  RAW_API_URL.startsWith("http://") || RAW_API_URL.startsWith("https://")
    ? RAW_API_URL
    : `http://${RAW_API_URL}`;

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || "";

const GAME_ALIASES: Record<string, string[]> = {
  "gta-5": ["gta-5", "gta-v"],
  "san-andreas": ["san-andreas", "gta-sa"],
  "gta-4": ["gta-4", "gta-iv"],
  "vice-city": ["vice-city", "gta-vice-city", "gta-vc"],
  "gta-3": ["gta-3", "gta-iii"],
  "gta-2": ["gta-2"],
  "gta-1": ["gta-1"],
  "gta-the-ballad-of-gay-tony": ["gta-the-ballad-of-gay-tony", "gta-tbogt"],
  "gta-chinatown-wars": ["gta-chinatown-wars", "gta-cw"],
  "gta-the-lost-and-damned": ["gta-the-lost-and-damned", "gta-tlad"],
  "vice-city-stories": ["vice-city-stories", "gta-vcs"],
  "liberty-city-stories": ["liberty-city-stories", "gta-lcs"],
};

const CANONICAL_BACKEND_GAME_ID: Record<string, string> = {
  "gta-5": "gta-v",
  "san-andreas": "gta-sa",
  "gta-4": "gta-iv",
  "vice-city": "gta-vc",
  "gta-3": "gta-iii",
  "gta-the-ballad-of-gay-tony": "gta-tbogt",
  "gta-chinatown-wars": "gta-cw",
  "gta-the-lost-and-damned": "gta-tlad",
  "vice-city-stories": "gta-vcs",
  "liberty-city-stories": "gta-lcs",
};

function getHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (ADMIN_KEY) {
    headers["x-admin-key"] = ADMIN_KEY;
  }
  return headers;
}

export async function fetchCheats(
  game?: string,
  category?: string,
  signal?: AbortSignal
): Promise<Cheat[]> {
  const targetGames = game && game !== "all"
    ? GAME_ALIASES[game] || [game]
    : [undefined];

  const results = await Promise.all(
    targetGames.map(async (g) => {
      const params = new URLSearchParams();
      if (g) params.append("game", g);
      if (category && category !== "all") params.append("category", category);

      const query = params.toString() ? `?${params.toString()}` : "";
      const res = await fetch(`${API_BASE_URL}/api/cheats${query}`, {
        headers: getHeaders(),
        signal,
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Falha ao carregar cheats (${res.status})`);
      }

      const data = await res.json();
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.cheats)) return data.cheats;
      return [];
    })
  );

  const unique = new Map<string, Cheat>();
  results.flat().forEach((cheat, index) => {
    const id = String(cheat.id ?? cheat._id ?? cheat.custom_id ?? index);
    unique.set(id, { ...cheat, id });
  });

  return Array.from(unique.values());
}

export async function createCheat(cheat: Partial<Cheat>): Promise<Cheat> {
  const payload = {
    ...cheat,
    game: cheat.game ? (CANONICAL_BACKEND_GAME_ID[cheat.game] || cheat.game) : cheat.game,
  };

  const res = await fetch(`${API_BASE_URL}/api/cheats`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Erro ao cadastrar cheat");
  }
  return data.cheat || data;
}

export async function updateCheat(id: string, cheat: Partial<Cheat>): Promise<Cheat> {
  const payload = {
    ...cheat,
    ...(cheat.game ? { game: CANONICAL_BACKEND_GAME_ID[cheat.game] || cheat.game } : {}),
  };

  const res = await fetch(`${API_BASE_URL}/api/cheats/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Erro ao atualizar cheat");
  }
  return data.cheat || data;
}

export async function deleteCheat(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/cheats/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Erro ao excluir cheat (${res.status})`);
  }
}
