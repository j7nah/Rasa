import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { journalService, JournalEntry } from '../services/journalService';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { X, User, Archive, ListPlus } from 'lucide-react';
import { RatingDots } from '../components/RatingDots';
import { SearchAutocomplete } from '../components/SearchAutocomplete';
import type { SearchResult } from '../services/tmdbService';

export default function EditEntry() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [type, setType] = useState<string>('');
  const [coverUrl, setCoverUrl] = useState<string | undefined>();
  const [creator, setCreator] = useState<string | undefined>();
  const [year, setYear] = useState<string | undefined>();
  const [externalId, setExternalId] = useState<string | undefined>();

  useEffect(() => {
    if (id) {
      const foundEntry = journalService.getEntry(id);
      if (foundEntry) {
        setEntry(foundEntry);
        setTitle(foundEntry.title);
        setContent(foundEntry.content);
        setRating(foundEntry.rating || 0);
        setType(foundEntry.type || '');
        setCoverUrl(foundEntry.coverUrl);
        setCreator(foundEntry.creator);
        setYear(foundEntry.year);
        setExternalId(foundEntry.externalId);
      }
    }
  }, [id]);

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
    if (!id || !title.trim() || !content.trim()) return;

    journalService.updateEntry(id, {
      title: title.trim(),
      content: content.trim(),
      rating: rating > 0 ? rating : undefined,
      type: type || undefined,
      coverUrl,
      creator,
      year,
      externalId,
    });

    navigate(`/entry/${id}`);
  };

  if (!entry) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl tracking-wide">rasa</h1>
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
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">entry not found</p>
            <Link to="/">
              <Button variant="outline" className="border-gray-300">return home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Banner */}
      <header className="border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl tracking-wide">rasa</h1>
          <Link to={`/entry/${id}`}>
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              <X className="size-5" />
            </button>
          </Link>
        </div>
      </header>

      {/* Form Content */}
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
                  <SelectItem value="podcast">podcast</SelectItem>
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

            <div className="space-y-2">
              <Label className="text-sm text-gray-600">rating</Label>
              <div className="h-9 w-full rounded-md border border-gray-300 bg-input-background px-3 flex items-center justify-center">
                <RatingDots value={rating} onChange={setRating} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm text-gray-600">entry</Label>
              <Textarea
                id="content"
                placeholder="start writing..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="min-h-[300px] resize-none border-gray-300"
              />
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                variant="outline"
                className="px-8 border-gray-300 hover:bg-gray-50"
                disabled={!title.trim() || !content.trim()}
              >
                save
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
