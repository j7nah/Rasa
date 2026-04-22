import { Link } from 'react-router';
import { journalService } from '../services/journalService';
import { User, Archive, ListPlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { JournalEntry } from '../services/journalService';

export default function Entries() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    setEntries(journalService.getAllEntries());
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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

      {/* Entries List */}
      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          {entries.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              no entries yet
            </div>
          ) : (
            <div className="space-y-1">
              {entries.map((entry) => (
                <Link key={entry.id} to={`/entry/${entry.id}`}>
                  <div className="border-b border-gray-200 py-4 hover:bg-gray-50 transition-colors px-4 -mx-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base truncate">{entry.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          {entry.type && <span>{entry.type}</span>}
                          {entry.rating && (
                            <span>{entry.rating} / 10</span>
                          )}
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
