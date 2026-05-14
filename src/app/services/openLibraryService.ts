import type { SearchResult } from './tmdbService';

const COVER_BASE = 'https://covers.openlibrary.org/b/id';

export async function searchBooks(query: string): Promise<SearchResult[]> {
  const url = new URL('https://openlibrary.org/search.json');
  url.searchParams.set('q', query);
  url.searchParams.set('limit', '10');
  url.searchParams.set('sort', 'editions');
  url.searchParams.set('fields', 'key,title,author_name,first_publish_year,cover_i,edition_count');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Open Library error: ${res.status}`);
  const data = await res.json();

  return (data.docs as any[]).map((doc) => ({
    id: doc.key,
    title: doc.title,
    subtitle: doc.author_name ? doc.author_name.slice(0, 2).join(', ') : undefined,
    year: doc.first_publish_year ? String(doc.first_publish_year) : undefined,
    coverUrl: doc.cover_i ? `${COVER_BASE}/${doc.cover_i}-M.jpg` : undefined,
  }));
}
