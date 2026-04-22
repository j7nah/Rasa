import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { journalService } from '../services/journalService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { User, Archive, ListPlus } from 'lucide-react';
import { RatingDots } from '../components/RatingDots';

export default function NewEntry() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [type, setType] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    journalService.createEntry({
      title: title.trim(),
      content: content.trim(),
      rating: rating > 0 ? rating : undefined,
      type: type || undefined,
    });

    navigate('/entries');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Banner */}
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

      {/* Form Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm text-gray-600">title</Label>
              <Input
                id="title"
                type="text"
                placeholder="untitled"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
                className="border-gray-300"
              />
            </div>

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