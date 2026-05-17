import type { SearchResult } from './tmdbService';

const API_KEY = import.meta.env.VITE_PODCAST_INDEX_KEY as string;
const API_SECRET = import.meta.env.VITE_PODCAST_INDEX_SECRET as string;

async function buildHeaders(): Promise<HeadersInit> {
  const epoch = Math.floor(Date.now() / 1000);
  const data = new TextEncoder().encode(`${API_KEY}${API_SECRET}${epoch}`);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return {
    'X-Auth-Key': API_KEY,
    'X-Auth-Date': String(epoch),
    'Authorization': hash,
    'User-Agent': 'rasa/1.0',
  };
}

export async function searchPodcasts(query: string): Promise<SearchResult[]> {
  const url = new URL('https://api.podcastindex.org/api/1.0/search/byterm');
  url.searchParams.set('q', query);
  url.searchParams.set('max', '10');

  const headers = await buildHeaders();
  const res = await fetch(url.toString(), { headers });
  if (!res.ok) throw new Error(`Podcast Index error: ${res.status}`);
  const data = await res.json();

  return (data.feeds as any[]).map((feed) => ({
    id: String(feed.id),
    title: feed.title,
    subtitle: feed.author ?? undefined,
    year: undefined,
    coverUrl: feed.image ?? feed.artwork ?? undefined,
  }));
}
