import { Link } from 'react-router';
import { journalService } from '../services/journalService';
import { User, Archive, ListPlus } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import type { JournalEntry } from '../services/journalService';

const MEDIA_TYPES = ['movie', 'tv show', 'album', 'song', 'video game', 'book', 'podcast'];
const LIMIT_OPTIONS = [10, 25, 50, 100];
const RATING_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const selectClass = "text-xs text-gray-500 border-none bg-transparent cursor-pointer hover:text-gray-900 transition-colors outline-none appearance-none";

export default function Entries() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [order, setOrder] = useState<'newest' | 'oldest'>('newest');
  const [limit, setLimit] = useState<number>(0);
  const [minRating, setMinRating] = useState<number>(0);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Banner */}
      <header className="border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <h1 className="text-xl tracking-wide cursor-pointer hover:text-gray-600 transition-colors">
              rasa
            </h1>
          </Link>
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

      {/* Filters */}
      {entries.length > 0 && (
        <div className="flex items-center gap-4 px-6 py-2 border-b border-gray-100">
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className={selectClass}>
            <option value="">all types</option>
            {MEDIA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <span className="text-gray-200 text-xs">|</span>

          <select value={order} onChange={e => setOrder(e.target.value as 'newest' | 'oldest')} className={selectClass}>
            <option value="newest">newest first</option>
            <option value="oldest">oldest first</option>
          </select>

          <span className="text-gray-200 text-xs">|</span>

          <select value={minRating} onChange={e => setMinRating(Number(e.target.value))} className={selectClass}>
            <option value={0}>any rating</option>
            {RATING_OPTIONS.map(n => <option key={n} value={n}>{n}+</option>)}
          </select>

          <span className="text-gray-200 text-xs">|</span>

          <select value={limit} onChange={e => setLimit(Number(e.target.value))} className={selectClass}>
            <option value={0}>all entries</option>
            {LIMIT_OPTIONS.map(n => <option key={n} value={n}>last {n}</option>)}
          </select>
        </div>
      )}

      {/* Entries List */}
      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          {entries.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              no entries yet
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              no entries match these filters
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((entry) => (
                <Link key={entry.id} to={`/entry/${entry.id}`}>
                  <div className="border-b border-gray-200 py-4 hover:bg-gray-50 transition-colors px-4 -mx-4">
                    <div className="flex items-center gap-4">
                      {entry.coverUrl ? (
                        <img
                          src={entry.coverUrl}
                          alt={entry.title}
                          className="size-10 rounded object-cover flex-shrink-0 bg-gray-100"
                        />
                      ) : (
                        <div className="size-10 rounded flex-shrink-0 bg-gray-100" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base truncate">{entry.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          {entry.type && <span>{entry.type}</span>}
                          {entry.creator && <span>{entry.creator}</span>}
                          {entry.rating && <span>{entry.rating} / 10</span>}
                          <span>{formatDate(entry.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
