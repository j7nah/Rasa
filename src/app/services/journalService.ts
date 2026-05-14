export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  rating?: number;
  type?: string;
  coverUrl?: string;
  creator?: string;
  year?: string;
  externalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QueueItem {
  id: string;
  title: string;
  type?: string;
  coverUrl?: string;
  creator?: string;
  year?: string;
  externalId?: string;
  createdAt: string;
}

const STORAGE_KEY = 'journal_entries';
const QUEUE_STORAGE_KEY = 'queue_items';

export const journalService = {
  getAllEntries(): JournalEntry[] {
    const entries = localStorage.getItem(STORAGE_KEY);
    return entries ? JSON.parse(entries) : [];
  },

  getEntry(id: string): JournalEntry | null {
    const entries = this.getAllEntries();
    return entries.find(entry => entry.id === id) || null;
  },

  createEntry(entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>): JournalEntry {
    const entries = this.getAllEntries();
    const now = new Date().toISOString();
    const newEntry: JournalEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    entries.unshift(newEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return newEntry;
  },

  updateEntry(id: string, updates: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>): JournalEntry | null {
    const entries = this.getAllEntries();
    const index = entries.findIndex(entry => entry.id === id);
    if (index === -1) return null;
    
    entries[index] = {
      ...entries[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return entries[index];
  },

  deleteEntry(id: string): boolean {
    const entries = this.getAllEntries();
    const filtered = entries.filter(entry => entry.id !== id);
    if (filtered.length === entries.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  getAllQueueItems(): QueueItem[] {
    const items = localStorage.getItem(QUEUE_STORAGE_KEY);
    return items ? JSON.parse(items) : [];
  },

  addQueueItem(item: Omit<QueueItem, 'id' | 'createdAt'>): QueueItem {
    const items = this.getAllQueueItems();
    const newItem: QueueItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    items.unshift(newItem);
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(items));
    return newItem;
  },

  removeQueueItem(id: string): boolean {
    const items = this.getAllQueueItems();
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length === items.length) return false;
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },
};