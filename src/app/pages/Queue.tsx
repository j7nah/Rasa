import { useState } from 'react';
import { Link } from 'react-router';
import { User, Archive, ListPlus, Plus, X } from 'lucide-react';
import { journalService } from '../services/journalService';
import type { QueueItem } from '../services/journalService';

export default function Queue() {
  const [items, setItems] = useState<QueueItem[]>(() => journalService.getAllQueueItems());

  const handleRemove = (id: string) => {
    journalService.removeQueueItem(id);
    setItems(journalService.getAllQueueItems());
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

      {/* Queue Content */}
      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
            <h2 className="text-2xl">queue</h2>
            <Link to="/queue/new">
              <button className="text-gray-600 hover:text-gray-900 transition-colors">
                <Plus className="size-6" />
              </button>
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              no items in queue
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                  {item.coverUrl ? (
                    <img
                      src={item.coverUrl}
                      alt=""
                      className="size-12 object-cover rounded flex-shrink-0 bg-gray-100"
                    />
                  ) : (
                    <div className="size-12 rounded flex-shrink-0 bg-gray-100" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{item.title}</p>
                    {(item.creator || item.year || item.type) && (
                      <p className="text-sm text-gray-500 truncate">
                        {[item.type, item.creator, item.year].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-gray-300 hover:text-gray-600 transition-colors flex-shrink-0"
                  >
                    <X className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
