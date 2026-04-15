import { useState, useRef } from 'react';

interface RatingDotsProps {
  value: number;
  onChange: (rating: number) => void;
}

export function RatingDots({ value, onChange }: RatingDotsProps) {
  const [lastClicked, setLastClicked] = useState<number | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  const handleMouseDown = () => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      onChange(0);
      setLastClicked(null);
    }, 500);
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleDotClick = (index: number) => {
    // Don't process click if it was a long press
    if (isLongPress.current) {
      isLongPress.current = false;
      return;
    }

    const clickedValue = index + 1;
    
    // If clicking the same dot again, make it half
    if (lastClicked === index && value === clickedValue) {
      onChange(clickedValue - 0.5);
      setLastClicked(null);
    } else {
      onChange(clickedValue);
      setLastClicked(index);
    }
  };

  const renderDot = (index: number) => {
    const dotValue = index + 1;
    const isFull = value >= dotValue;
    const isHalf = value === dotValue - 0.5;

    return (
      <button
        key={index}
        type="button"
        onClick={() => handleDotClick(index)}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative size-5 rounded-full border border-gray-300 transition-all hover:border-gray-400"
      >
        {isFull && (
          <div className="absolute inset-0 rounded-full bg-[#4b4b4e]" />
        )}
        {isHalf && (
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1/2 bg-[#4b4b4e]" />
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="flex items-center gap-3">
      {Array.from({ length: 10 }, (_, i) => renderDot(i))}
      <span className="ml-4 text-sm text-gray-600 w-14">
        {value > 0 ? value : 0} / 10
      </span>
    </div>
  );
}