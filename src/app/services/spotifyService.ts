import type { SearchResult } from './tmdbService';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET as string;

interface TokenCache {
  token: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

async function getToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) throw new Error(`Spotify token error: ${res.status}`);
  const data = await res.json();

  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return tokenCache.token;
}

async function spotifySearch(
  query: string,
  type: 'album' | 'track',
  retries = 1
): Promise<any[]> {
  const token = await getToken();
  const url = new URL('https://api.spotify.com/v1/search');
  url.searchParams.set('q', query);
  url.searchParams.set('type', type);
  url.searchParams.set('limit', '10');

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 429 && retries > 0) {
    const retryAfter = parseInt(res.headers.get('Retry-After') ?? '1', 10);
    await new Promise((r) => setTimeout(r, retryAfter * 1000));
    return spotifySearch(query, type, retries - 1);
  }

  if (!res.ok) throw new Error(`Spotify search error: ${res.status}`);

  const data = await res.json();
  return type === 'album' ? data.albums.items : data.tracks.items;
}

export async function searchAlbums(query: string): Promise<SearchResult[]> {
  const items = await spotifySearch(query, 'album');
  return items
    .sort((a: any, b: any) => (b.popularity ?? 0) - (a.popularity ?? 0))
    .map((item: any) => ({
      id: item.id,
      title: item.name,
      subtitle: item.artists.map((a: any) => a.name).join(', '),
      year: item.release_date ? item.release_date.slice(0, 4) : undefined,
      coverUrl: item.images?.[1]?.url ?? item.images?.[0]?.url,
    }));
}

export async function searchTracks(query: string): Promise<SearchResult[]> {
  const items = await spotifySearch(query, 'track');
  return items
    .sort((a: any, b: any) => (b.popularity ?? 0) - (a.popularity ?? 0))
    .map((item: any) => ({
      id: item.id,
      title: item.name,
      subtitle: item.artists.map((a: any) => a.name).join(', '),
      year: item.album?.release_date ? item.album.release_date.slice(0, 4) : undefined,
      coverUrl: item.album?.images?.[1]?.url ?? item.album?.images?.[0]?.url,
    }));
}
