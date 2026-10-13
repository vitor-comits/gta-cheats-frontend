import { Cheat } from "@/types/cheat";

const DEFAULT_API_URL = "http://localhost:5000";

export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("gta_cheats_api_url") || process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
  }
  return process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
}

export function setApiBaseUrl(url: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("gta_cheats_api_url", url);
  }
}

export function getAdminKey(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("gta_cheats_admin_key") || "";
  }
  return "";
}

export function setAdminKey(key: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("gta_cheats_admin_key", key);
  }
}

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  const key = getAdminKey();
  if (key) {
    headers["x-admin-key"] = key;
  }
  return headers;
}

export async function fetchCheats(game?: string, category?: string): Promise<Cheat[]> {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const params = new URLSearchParams();
  if (game && game !== "all") params.append("game", game);
  if (category && category !== "all") params.append("category", category);

  const query = params.toString() ? `?${params.toString()}` : "";
  const res = await fetch(`${base}/api/cheats${query}`, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Falha ao carregar cheats: ${res.statusText}`);
  }

  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.cheats)) return data.cheats;
  return [];
}

export async function fetchCheatById(id: string): Promise<Cheat> {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const res = await fetch(`${base}/api/cheats/${id}`, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Falha ao obter cheat: ${res.statusText}`);
  }

  return await res.json();
}

export async function createCheat(cheat: Partial<Cheat>): Promise<Cheat> {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const res = await fetch(`${base}/api/cheats`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(cheat),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Erro ao cadastrar cheat");
  }
  return data;
}

export async function updateCheat(id: string, cheat: Partial<Cheat>): Promise<Cheat> {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const res = await fetch(`${base}/api/cheats/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(cheat),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Erro ao atualizar cheat");
  }
  return data.cheat || data;
}

export async function deleteCheat(id: string): Promise<void> {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const res = await fetch(`${base}/api/cheats/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Erro ao excluir cheat (${res.status})`);
  }
}

