// frontend/services/api.ts
const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/$/, "") || "http://localhost:4000/api";

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
  return localStorage.getItem("token");
}

export function isLoggedIn() {
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
    const parts = token.split(".");
    const payloadPart = parts[1];
    if (!payloadPart) return null;
    const payload = JSON.parse(atob(payloadPart)) as { name?: string };
    return typeof payload?.name === "string" ? payload.name : null;
  } catch {
    return null;
  }
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

/**
 * Generic fetch that automatically:
 * - sets Content-Type JSON
 * - attaches auth-token if available
 * - throws a readable Error when request fails
 */
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
    // matches your backend middleware
    headers["auth-token"] = token;
    // if you also support Bearer in backend, you can enable this instead:
    // headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await parseResponse(res);

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }

  return data as T;
}

// ---------- AUTH ----------
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

  // save token if backend returned it
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

// ---------- MOVIES ----------
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

// protected create (if your backend uses verifyToken on POST /movies)
export async function createMovie(movie: Partial<Movie>) {
  return apiFetch<Movie>("/movies", {
    method: "POST",
    body: JSON.stringify(movie),
  });
}
