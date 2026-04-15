export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  rating?: number;
  type?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'journal_entries';

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
};