import type { SearchResult } from './tmdbService';

const API_KEY = import.meta.env.VITE_GAMEBRAIN_API_KEY as string;

export async function searchVideoGames(query: string): Promise<SearchResult[]> {
  const url = new URL('https://api.gamebrain.co/v1/games');
  url.searchParams.set('query', query);
  url.searchParams.set('limit', '10');
  url.searchParams.set('sort', 'computed_rating');
  url.searchParams.set('sort-order', 'desc');
  url.searchParams.set('api-key', API_KEY);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`GameBrain error: ${res.status}`);
  const data = await res.json();

  return (data.results as any[]).map((game) => ({
    id: String(game.id),
    title: game.name,
    subtitle: game.genre ?? undefined,
    year: game.year ? String(game.year) : undefined,
    coverUrl: game.image ?? undefined,
  }));
}
