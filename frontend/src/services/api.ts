const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:4000/api";


export type Movie = {
  _id: string;
  title: string;
  genre: string;
  releaseYear: number;
  watched: boolean;
  rating: number;
  owner?: string;
};

export type LoginResponse = {
  error: null | string;
  data?: { userId: string; token: string };
};

export type RegisterResponse = {
  error: null | string;
  data?: { userId: string };
};

function getToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  if (isTokenExpired(token)) {
    logout();
    return null;
  }

  return token;
}

export function isLoggedIn() {
  return Boolean(getToken());
}

export function hasValidToken() {
  return Boolean(getToken());
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  window.dispatchEvent(new Event("auth-changed"));
}

type FavoritesResponse<T> = {
  error: null | string;
  data?: T;
};

function getNameFromToken(token: string): string | null {
  try {
    const payload = decodeJwtPayload(token) as { name?: string } | null;
    if (!payload) return null;
    return typeof payload?.name === "string" ? payload.name : null;
  } catch {
    return null;
  }
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    const payloadPart = parts[1];
    if (!payloadPart) return null;
    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  const exp = typeof payload?.exp === "number" ? payload.exp : null;
  if (!exp) return false;
  return Date.now() >= exp * 1000;
}

async function parseResponse(res: Response) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { error: text };
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as any),
  };

  if (token) {
    headers["auth-token"] = token;

  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await parseResponse(res);

  if (!res.ok) {
    if (res.status === 401) {
      logout();
      throw new Error("Session expired. Please login again.");
    }
    throw new Error(data?.error || `Request failed (${res.status})`);
  }

  return data as T;
}

export async function registerUser(name: string, email: string, password: string) {
  return apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function loginUser(email: string, password: string) {
  const res = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (res?.data?.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userId", res.data.userId);
    localStorage.setItem("userEmail", email);
    const userName = getNameFromToken(res.data.token);
    if (userName) {
      localStorage.setItem("userName", userName);
    }
    window.dispatchEvent(new Event("auth-changed"));
  }

  return res;
}

export async function getAllMovies() {
  return apiFetch<Movie[]>("/movies", { method: "GET" });
}

export async function getFavoriteMovieIds() {
  const res = await apiFetch<FavoritesResponse<string[]>>("/movies/favorites/ids", {
    method: "GET",
  });
  return res?.data ?? [];
}

export async function getFavoriteMovies() {
  const res = await apiFetch<FavoritesResponse<Movie[]>>("/movies/favorites", {
    method: "GET",
  });
  return res?.data ?? [];
}

export async function addFavoriteMovie(movieId: string) {
  const res = await apiFetch<FavoritesResponse<string[]>>(`/movies/${movieId}/favorite`, {
    method: "POST",
  });
  window.dispatchEvent(new Event("favorites-changed"));
  return res?.data ?? [];
}

export async function removeFavoriteMovie(movieId: string) {
  const res = await apiFetch<FavoritesResponse<string[]>>(`/movies/${movieId}/favorite`, {
    method: "DELETE",
  });
  window.dispatchEvent(new Event("favorites-changed"));
  return res?.data ?? [];
}

export async function createMovie(movie: Partial<Movie>) {
  return apiFetch<Movie>("/movies", {
    method: "POST",
    body: JSON.stringify(movie),
  });
}
