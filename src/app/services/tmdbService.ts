export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  year?: string;
  coverUrl?: string;
}

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w185';

async function search(endpoint: string, query: string): Promise<SearchResult[]> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('query', query);
  url.searchParams.set('include_adult', 'false');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDb error: ${res.status}`);
  const data = await res.json();
  return data.results;
}

export async function searchMovies(query: string): Promise<SearchResult[]> {
  const results = await search('/search/movie', query);
  return results.map((r: any) => ({
    id: String(r.id),
    title: r.title,
    subtitle: r.director ?? undefined,
    year: r.release_date ? r.release_date.slice(0, 4) : undefined,
    coverUrl: r.poster_path ? `${IMAGE_BASE}${r.poster_path}` : undefined,
  }));
}

export async function searchTV(query: string): Promise<SearchResult[]> {
  const results = await search('/search/tv', query);
  return results.map((r: any) => ({
    id: String(r.id),
    title: r.name,
    year: r.first_air_date ? r.first_air_date.slice(0, 4) : undefined,
    coverUrl: r.poster_path ? `${IMAGE_BASE}${r.poster_path}` : undefined,
  }));
}
