import type { SearchResult } from './tmdbService';

const BASE = 'https://api.jikan.moe/v4';

async function jikanSearch(endpoint: string, query: string): Promise<SearchResult[]> {
  const url = new URL(`${BASE}${endpoint}`);
  url.searchParams.set('q', query);
  url.searchParams.set('limit', '10');
  url.searchParams.set('sfw', 'true');
  url.searchParams.set('order_by', 'members');
  url.searchParams.set('sort', 'desc');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Jikan error: ${res.status}`);
  const data = await res.json();

  return (data.data as any[]).map((item) => ({
    id: String(item.mal_id),
    title: item.title_english ?? item.title,
    subtitle: item.studios?.[0]?.name ?? item.authors?.[0]?.name ?? undefined,
    year: item.year ? String(item.year)
      : item.published?.prop?.from?.year ? String(item.published.prop.from.year)
      : item.aired?.prop?.from?.year ? String(item.aired.prop.from.year)
      : undefined,
    coverUrl: item.images?.jpg?.large_image_url ?? item.images?.jpg?.image_url ?? undefined,
  }));
}

export function searchAnime(query: string): Promise<SearchResult[]> {
  return jikanSearch('/anime', query);
}

export function searchManga(query: string): Promise<SearchResult[]> {
  return jikanSearch('/manga', query);
}
