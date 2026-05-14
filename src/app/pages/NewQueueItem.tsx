import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { journalService } from '../services/journalService';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { User, Archive, ListPlus } from 'lucide-react';
import { SearchAutocomplete } from '../components/SearchAutocomplete';
import type { SearchResult } from '../services/tmdbService';

export default function NewQueueItem() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<string>('');
  const [coverUrl, setCoverUrl] = useState<string | undefined>();
  const [creator, setCreator] = useState<string | undefined>();
  const [year, setYear] = useState<string | undefined>();
  const [externalId, setExternalId] = useState<string | undefined>();

  const handleSelect = (result: SearchResult) => {
    setTitle(result.title);
    setCoverUrl(result.coverUrl);
    setCreator(result.subtitle);
    setYear(result.year);
    setExternalId(result.id);
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (coverUrl || creator || year) {
      setCoverUrl(undefined);
      setCreator(undefined);
      setYear(undefined);
      setExternalId(undefined);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    journalService.addQueueItem({
      title: title.trim(),
      type: type || undefined,
      coverUrl,
      creator,
      year,
      externalId,
    });

    navigate('/queue');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <h1 className="text-xl tracking-wide cursor-pointer hover:text-gray-600 transition-colors">rasa</h1>
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

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm text-gray-600">type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type" className="border-gray-300">
                  <SelectValue placeholder="optional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="movie">movie</SelectItem>
                  <SelectItem value="album">album</SelectItem>
                  <SelectItem value="song">song</SelectItem>
                  <SelectItem value="video game">video game</SelectItem>
                  <SelectItem value="book">book</SelectItem>
                  <SelectItem value="tv show">tv show</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm text-gray-600">title</Label>
              <SearchAutocomplete
                type={type}
                value={title}
                onChange={handleTitleChange}
                onSelect={handleSelect}
              />
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                variant="outline"
                className="px-8 border-gray-300 hover:bg-gray-50"
                disabled={!title.trim()}
              >
                add to queue
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
