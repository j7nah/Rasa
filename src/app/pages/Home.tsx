import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { User, Archive, ListPlus, PenLine } from 'lucide-react';
import { journalService } from '../services/journalService';
import type { JournalEntry } from '../services/journalService';
import { LiminalEntrance } from '../components/LiminalEntrance';


export default function Home() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    setEntries(journalService.getAllEntries());
  }, []);

  const cols = useMemo(() => Math.max(2, Math.ceil(Math.sqrt(entries.length))), [entries.length]);

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
                <PenLine className="size-5" />
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

      {/* Collage — masonry columns, centered */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-8">
        {entries.length > 0 && (
          <div
            style={{
              columns: cols,
              columnGap: '3px',
              width: cols * 148,
            }}
          >
            {entries.map((entry, i) => (
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
