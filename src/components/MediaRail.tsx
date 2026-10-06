import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from '../data/mediaData';
import { MediaCard } from './MediaCard';

interface MediaRailProps {
  title: string;
  subtitle?: string;
  items: MediaItem[];
  onPlay: (item: MediaItem, resumeTime?: number) => void;
  onDetails: (item: MediaItem) => void;
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
  icon?: React.ReactNode;
  historyMap?: Record<
    string,
    { progressPercent: number; progressSeconds: number; totalSeconds: number }
  >;
  suggestionMap?: Record<string, string>;
}

export const MediaRail: React.FC<MediaRailProps> = ({
  title,
  subtitle,
  items,
  onPlay,
  onDetails,
  watchlist,
  onToggleWatchlist,
  icon,
  historyMap,
  suggestionMap,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [items]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="relative my-8 sm:my-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Rail Header */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            {icon && <span className="text-violet-400">{icon}</span>}
            <h2 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Scroll Controls */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`p-2 rounded-lg border border-white/10 transition-colors cursor-pointer ${
              canScrollLeft
                ? 'bg-white/5 hover:bg-white/15 text-white'
                : 'bg-white/[0.02] text-slate-600 cursor-not-allowed border-transparent'
            }`}
            aria-label={`Scroll ${title} left`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`p-2 rounded-lg border border-white/10 transition-colors cursor-pointer ${
              canScrollRight
                ? 'bg-white/5 hover:bg-white/15 text-white'
                : 'bg-white/[0.02] text-slate-600 cursor-not-allowed border-transparent'
            }`}
            aria-label={`Scroll ${title} right`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Area */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto hide-scrollbar pb-3 pt-1 scroll-smooth"
      >
        {items.map((item) => (
          <MediaCard
            key={item.id}
            item={item}
            onPlay={onPlay}
            onDetails={onDetails}
            isSaved={watchlist.includes(item.id)}
            onToggleWatchlist={onToggleWatchlist}
            watchProgress={historyMap ? historyMap[item.id] : undefined}
            suggestionReason={suggestionMap ? suggestionMap[item.id] : undefined}
          />
        ))}
      </div>
    </section>
  );
};
