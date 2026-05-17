import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { User, Archive, ListPlus, Plus } from 'lucide-react';
import { journalService } from '../services/journalService';
import type { JournalEntry } from '../services/journalService';
import { LiminalEntrance } from '../components/LiminalEntrance';

const MEDIA_TYPES = ['movie', 'tv show', 'album', 'song', 'video game', 'book', 'podcast'];
const LIMIT_OPTIONS = [10, 25, 50, 100];
const RATING_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function Home() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [order, setOrder] = useState<'newest' | 'oldest'>('newest');
  const [limit, setLimit] = useState<number>(0); // 0 = all
  const [minRating, setMinRating] = useState<number>(0); // 0 = any

  useEffect(() => {
    setEntries(journalService.getAllEntries());
  }, []);

  const filtered = useMemo(() => {
    let result = [...entries];
    if (typeFilter) result = result.filter(e => e.type === typeFilter);
    if (minRating > 0) result = result.filter(e => (e.rating ?? 0) >= minRating);
    result = order === 'newest' ? result : result.reverse();
    if (limit > 0) result = result.slice(0, limit);
    return result;
  }, [entries, typeFilter, minRating, order, limit]);

  const cols = useMemo(() => Math.max(2, Math.ceil(Math.sqrt(filtered.length))), [filtered.length]);

  const selectClass = "text-xs text-gray-500 border-none bg-transparent cursor-pointer hover:text-gray-900 transition-colors outline-none appearance-none";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <LiminalEntrance />

      {/* Top Banner */}
      <header className="border-b border-gray-200 relative">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <h1 className="text-xl tracking-wide cursor-pointer hover:text-gray-600 transition-colors">
              rasa
            </h1>
          </Link>

          <div className="absolute left-1/2 -translate-x-1/2">
            <Link to="/new">
              <button className="text-gray-600 hover:text-gray-900 transition-colors">
                <Plus className="size-5" />
              </button>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/profile">
              <button className="text-gray-600 hover:text-gray-900 transition-colors flex items-center">
                <User className="size-5" />
              </button>
            </Link>
            <Link to="/queue">
              <button className="text-gray-600 hover:text-gray-900 transition-colors flex items-center">
                <ListPlus className="size-5" />
              </button>
            </Link>
            <Link to="/entries">
              <button className="text-gray-600 hover:text-gray-900 transition-colors flex items-center">
                <Archive className="size-5 relative top-[1px]" />
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Filters — upper left, below banner */}
      {entries.length > 0 && (
        <div className="flex items-center gap-4 px-6 py-2 border-b border-gray-100">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className={selectClass}
          >
            <option value="">all types</option>
            {MEDIA_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <span className="text-gray-200 text-xs">|</span>

          <select
            value={order}
            onChange={e => setOrder(e.target.value as 'newest' | 'oldest')}
            className={selectClass}
          >
            <option value="newest">newest first</option>
            <option value="oldest">oldest first</option>
          </select>

          <span className="text-gray-200 text-xs">|</span>

          <select
            value={minRating}
            onChange={e => setMinRating(Number(e.target.value))}
            className={selectClass}
          >
            <option value={0}>any rating</option>
            {RATING_OPTIONS.map(n => (
              <option key={n} value={n}>{n}+</option>
            ))}
          </select>

          <span className="text-gray-200 text-xs">|</span>

          <select
            value={limit}
            onChange={e => setLimit(Number(e.target.value))}
            className={selectClass}
          >
            <option value={0}>all entries</option>
            {LIMIT_OPTIONS.map(n => (
              <option key={n} value={n}>last {n}</option>
            ))}
          </select>
        </div>
      )}

      {/* Collage — masonry columns, centered */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-8">
        {filtered.length > 0 && (
          <div
            style={{
              columns: cols,
              columnGap: '3px',
              width: cols * 148,
            }}
          >
            {filtered.map((entry) => (
              <Link
                key={entry.id}
                to={`/entry/${entry.id}`}
                className="block group"
                style={{ breakInside: 'avoid', marginBottom: '3px' }}
              >
                {entry.coverUrl ? (
                  <img
                    src={entry.coverUrl}
                    alt={entry.title}
                    className="w-full group-hover:opacity-90 transition-opacity"
                    style={{ display: 'block' }}
                    draggable={false}
                  />
                ) : (
                  <div
                    className="w-full bg-gray-100 group-hover:bg-gray-200 transition-colors flex items-end p-2"
                    style={{ aspectRatio: '2 / 3' }}
                  >
                    <p className="text-xs text-gray-500 leading-snug line-clamp-3">{entry.title}</p>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
