import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { User } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Banner */}
      <header className="border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl tracking-wide">rasa</h1>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <User className="size-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <DropdownMenuItem className="cursor-pointer">profile</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">settings</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">queue</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Empty Space with Centered Button */}
      <div className="flex-1 flex items-center justify-center">
        <Link to="/new">
          <Button
            variant="outline"
            className="px-8 py-6 text-base border-gray-300 hover:bg-gray-50 transition-colors"
          >
            log
          </Button>
        </Link>
      </div>
    </div>
  );
}