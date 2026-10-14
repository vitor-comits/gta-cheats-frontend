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

const ADMIN_KEY_ENV = process.env.NEXT_PUBLIC_ADMIN_KEY || "";

export const BACKEND_TO_FRONTEND_GAME_ID: Record<string, string> = {
  "gta-v": "gta-5",
  "gta-5": "gta-5",
  "gta-sa": "san-andreas",
  "san-andreas": "san-andreas",
  "gta-iv": "gta-4",
  "gta-4": "gta-4",
  "gta-vc": "vice-city",
  "gta-vice-city": "vice-city",
  "vice-city": "vice-city",
  "gta-iii": "gta-3",
  "gta-3": "gta-3",
  "gta-2": "gta-2",
  "gta-1": "gta-1",
  "gta-tbogt": "gta-the-ballad-of-gay-tony",
  "gta-the-ballad-of-gay-tony": "gta-the-ballad-of-gay-tony",
  "gta-cw": "gta-chinatown-wars",
  "gta-chinatown-wars": "gta-chinatown-wars",
  "gta-tlad": "gta-the-lost-and-damned",
  "gta-the-lost-and-damned": "gta-the-lost-and-damned",
  "vice-city-stories": "vice-city-stories",
  "gta-vcs": "vice-city-stories",
  "liberty-city-stories": "liberty-city-stories",
  "gta-lcs": "liberty-city-stories",
};

export function normalizeGameId(gameId?: string): string {
  if (!gameId) return "gta-5";
  return BACKEND_TO_FRONTEND_GAME_ID[gameId] || gameId;
}

export const GAME_ALIASES: Record<string, string[]> = {
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

export const CANONICAL_BACKEND_GAME_ID: Record<string, string> = {
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

// Gerenciamento de Sessão do Administrador
export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("gta_admin_token");
}

export function getAdminUser(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("gta_admin_user");
}

export function setAdminSession(token: string, username: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("gta_admin_token", token);
  localStorage.setItem("gta_admin_user", username);
  window.dispatchEvent(new Event("auth-change"));
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("gta_admin_token");
  localStorage.removeItem("gta_admin_user");
  window.dispatchEvent(new Event("auth-change"));
}

export function isUserAdminLoggedIn(): boolean {
  return Boolean(getAdminToken());
}

export async function loginAdmin(
  username: string,
  password: string
): Promise<{ token: string; username: string }> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Credenciais inválidas");
  }

  setAdminSession(data.token, data.username || username);
  return { token: data.token, username: data.username || username };
}

export async function verifyAdminSession(): Promise<boolean> {
  const token = getAdminToken();
  if (!token) return false;

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/verify`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!res.ok) {
      clearAdminSession();
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function getHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = getAdminToken() || ADMIN_KEY_ENV;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    headers["x-admin-key"] = token;
  }
  return headers;
}

export async function fetchCheats(
  game?: string,
  category?: string,
  signal?: AbortSignal
): Promise<Cheat[]> {
  const targetGames =
    game && game !== "all" ? GAME_ALIASES[game] || [game] : [undefined];

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
    game: cheat.game
      ? CANONICAL_BACKEND_GAME_ID[cheat.game] || cheat.game
      : cheat.game,
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

export async function updateCheat(
  id: string,
  cheat: Partial<Cheat>
): Promise<Cheat> {
  const payload = {
    ...cheat,
    ...(cheat.game
      ? { game: CANONICAL_BACKEND_GAME_ID[cheat.game] || cheat.game }
      : {}),
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
