import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { journalService, JournalEntry } from '../services/journalService';
import { Button } from '../components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import { ArrowLeft, Edit, Trash2, User, Archive, ListPlus } from 'lucide-react';
import { format } from 'date-fns';
import { RatingDisplay } from '../components/RatingDisplay';

export default function ViewEntry() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    if (id) {
      const foundEntry = journalService.getEntry(id);
      setEntry(foundEntry);
    }
  }, [id]);

  const handleDelete = () => {
    if (id && journalService.deleteEntry(id)) {
      navigate('/entries');
    }
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
            <Link to="/entries">
              <Button variant="outline" className="border-gray-300">return to archive</Button>
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
          <div className="flex items-center gap-4">
            <Link to="/entries">
              <button className="text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="size-5" />
              </button>
            </Link>
            <h1 className="text-xl tracking-wide">rasa</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to={`/edit/${entry.id}`} className="flex items-center">
              <button className="text-gray-600 hover:text-gray-900 transition-colors flex items-center">
                <Edit className="size-5" />
              </button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="text-gray-600 hover:text-gray-900 transition-colors flex items-center">
                  <Trash2 className="size-5" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>delete this entry?</AlertDialogTitle>
                  <AlertDialogDescription>
                    this action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-black hover:bg-gray-800"
                  >
                    delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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

      {/* Entry Content */}
      <div className="flex-1 p-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex gap-6 items-start">
            {entry.coverUrl && (
              <img
                src={entry.coverUrl}
                alt={entry.title}
                className="w-24 rounded shadow-sm flex-shrink-0 object-cover"
              />
            )}
            <div className="space-y-2 flex-1">
              {entry.rating && entry.rating > 0 && (
                <div className="mb-4">
                  <RatingDisplay value={entry.rating} />
                </div>
              )}
              {entry.type && (
                <div className="text-sm text-gray-500">{entry.type}</div>
              )}
              <h2 className="text-3xl">{entry.title}</h2>
              {(entry.creator || entry.year) && (
                <p className="text-sm text-gray-500">
                  {[entry.creator, entry.year].filter(Boolean).join(' · ')}
                </p>
              )}
              <p className="text-sm text-gray-400">
                {format(new Date(entry.createdAt), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>

          <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
            {entry.content}
          </div>
        </div>
      </div>
    </div>
  );
}