import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from './ui/input';
import type { SearchResult } from '../services/tmdbService';
import { searchMovies, searchTV } from '../services/tmdbService';
import { searchAlbums, searchTracks } from '../services/spotifyService';
import { searchBooks } from '../services/openLibraryService';
import { searchVideoGames } from '../services/gameBrainService';
import { searchAnime, searchManga } from '../services/jikanService';
import { searchPodcasts } from '../services/podcastIndexService';

interface SearchAutocompleteProps {
  type: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (result: SearchResult) => void;
}

function interleave<T>(a: T[], b: T[]): T[] {
  const out: T[] = [];
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (i < a.length) out.push(a[i]);
    if (i < b.length) out.push(b[i]);
  }
  return out;
}

async function runSearch(type: string, query: string): Promise<SearchResult[]> {
  switch (type) {
    case 'movie':
      return searchMovies(query);
    case 'tv show': {
      const [tv, anime] = await Promise.allSettled([searchTV(query), searchAnime(query)]);
      return interleave(
        tv.status === 'fulfilled' ? tv.value : [],
        anime.status === 'fulfilled' ? anime.value : [],
      );
    }
    case 'album':
      return searchAlbums(query);
    case 'song':
      return searchTracks(query);
    case 'book': {
      const [books, manga] = await Promise.allSettled([searchBooks(query), searchManga(query)]);
      return interleave(
        books.status === 'fulfilled' ? books.value : [],
        manga.status === 'fulfilled' ? manga.value : [],
      );
    }
    case 'video game':
      return searchVideoGames(query);
    case 'podcast':
      return searchPodcasts(query);
    default:
      return [];
  }
}

const SEARCHABLE_TYPES = new Set(['movie', 'tv show', 'album', 'song', 'book', 'video game', 'podcast']);

export function SearchAutocomplete({ type, value, onChange, onSelect }: SearchAutocompleteProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSearchable = SEARCHABLE_TYPES.has(type);

  const doSearch = useCallback(
    async (query: string) => {
      if (!query.trim() || query.length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }
      setIsLoading(true);
      try {
        const data = await runSearch(type, query);
        setResults(data.slice(0, 8));
        setIsOpen(data.length > 0);
        setActiveIndex(-1);
      } catch {
        setResults([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    },
    [type]
  );

  useEffect(() => {
    if (!isSearchable) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => doSearch(value), 300);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [value, isSearchable, doSearch]);

  useEffect(() => {
    setResults([]);
    setIsOpen(false);
  }, [type]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (result: SearchResult) => {
    onSelect(result);
    // Don't call onChange here — onSelect already sets the title in the parent,
    // and calling onChange would trigger handleTitleChange which clears coverUrl/creator/year.
    setIsOpen(false);
    setResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        type="text"
        placeholder="untitled"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setIsOpen(true)}
        required
        className="border-gray-300"
        autoComplete="off"
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="size-3 rounded-full border border-gray-400 border-t-transparent animate-spin" />
        </div>
      )}
      {isOpen && results.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-md max-h-72 overflow-y-auto">
          {results.map((result, i) => (
            <li key={result.id}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(result)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                  i === activeIndex ? 'bg-gray-50' : ''
                }`}
              >
                {result.coverUrl ? (
                  <img
                    src={result.coverUrl}
                    alt=""
                    className="size-10 object-cover rounded flex-shrink-0 bg-gray-100"
                  />
                ) : (
                  <div className="size-10 rounded flex-shrink-0 bg-gray-100" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{result.title}</p>
                  {(result.subtitle || result.year) && (
                    <p className="text-xs text-gray-500 truncate">
                      {[result.subtitle, result.year].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
