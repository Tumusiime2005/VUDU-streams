import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Plus, Check, Info, Flame } from 'lucide-react';
import { MediaItem } from '../data/mediaData';

interface Top10RailProps {
  items: MediaItem[];
  onPlay: (item: MediaItem) => void;
  onDetails: (item: MediaItem) => void;
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
}

export const Top10Rail: React.FC<Top10RailProps> = ({
  items,
  onPlay,
  onDetails,
  watchlist,
  onToggleWatchlist,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const top10List = items.slice(0, 10);

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

  if (!top10List || top10List.length === 0) return null;

  return (
    <section className="relative my-8 sm:my-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none">
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-red-600 to-violet-600 flex items-center justify-center text-white">
              <Flame className="w-3.5 h-3.5 fill-white text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight flex items-center gap-2">
              <span>Top 10 on VUDU Today</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            The most watched blockbuster movies, cartoons, and music tracks right now
          </p>
        </div>

        {/* Scroll Arrows */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`p-2 rounded-lg border border-white/10 transition-colors cursor-pointer ${
              canScrollLeft
                ? 'bg-white/5 hover:bg-white/15 text-white'
                : 'bg-white/[0.02] text-slate-600 cursor-not-allowed border-transparent'
            }`}
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
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top 10 Horizontal Rail */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex gap-4 sm:gap-6 overflow-x-auto hide-scrollbar pb-4 pt-1 scroll-smooth"
      >
        {top10List.map((item, index) => {
          const rank = index + 1;
          const isSaved = watchlist.includes(item.id);

          return (
            <div
              key={item.id}
              className="group relative flex-none flex items-center w-[230px] sm:w-[260px] cursor-pointer"
            >
              {/* Giant Stylized Rank Number (VUDU Hallmark Style) */}
              <div
                className="relative -mr-6 z-0 select-none text-[120px] sm:text-[145px] font-black font-display leading-none text-[#1b1b26] group-hover:text-violet-500/80 transition-colors tracking-tighter"
                style={{
                  WebkitTextStroke: '3px rgba(255, 255, 255, 0.25)',
                  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.8))',
                }}
              >
                {rank}
              </div>

              {/* Poster Card */}
              <div className="relative z-10 w-[140px] sm:w-[160px] aspect-[2/3] rounded-xl overflow-hidden bg-[#151520] border border-white/10 group-hover:border-violet-500/50 group-hover:shadow-2xl group-hover:shadow-violet-600/30 group-hover:-translate-y-1 transition-all duration-300">
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* VUDU Top 10 Badge */}
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-violet-600 text-white font-mono font-black text-[9px] uppercase tracking-wider shadow-md">
                  TOP {rank}
                </div>

                {/* Gradient Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

                {/* Title & Metadata on Card Bottom */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <h3 className="text-xs font-bold text-white truncate leading-tight">{item.title}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-violet-300 mt-0.5">
                    <span>{item.genres[0]}</span>
                    <span>·</span>
                    <span className="text-amber-400">★ {item.rating}</span>
                  </div>
                </div>

                {/* Hover Quick Action Buttons */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => onPlay(item)}
                    className="w-9 h-9 rounded-full bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                    title="Play Now"
                  >
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist(item.id);
                    }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center border backdrop-blur-md transition-all cursor-pointer ${
                      isSaved
                        ? 'bg-violet-900 border-violet-400 text-violet-300'
                        : 'bg-black/60 hover:bg-black/80 border-white/20 text-white'
                    }`}
                    title={isSaved ? 'In Watchlist' : 'Add to Watchlist'}
                  >
                    {isSaved ? <Check className="w-3.5 h-3.5 text-violet-300" /> : <Plus className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDetails(item);
                    }}
                    className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center cursor-pointer"
                    title="Details"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
