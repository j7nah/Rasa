interface RatingDisplayProps {
  value: number;
}

export function RatingDisplay({ value }: RatingDisplayProps) {
  const renderDot = (index: number) => {
    const dotValue = index + 1;
    const isFull = value >= dotValue;
    const isHalf = value === dotValue - 0.5;

    return (
      <div
        key={index}
        className="relative size-5 rounded-full border border-gray-300"
      >
        {isFull && (
          <div className="absolute inset-0 rounded-full bg-[#4b4b4e]" />
        )}
        {isHalf && (
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1/2 bg-[#4b4b4e]" />
          </div>
        )}
      </div>
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