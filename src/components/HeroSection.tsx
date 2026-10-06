import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Plus, Check, Info, ChevronLeft, ChevronRight, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { MediaItem } from '../data/mediaData';

interface HeroSectionProps {
  featuredItems: MediaItem[];
  onPlayMedia: (item: MediaItem) => void;
  onOpenDetails: (item: MediaItem) => void;
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredItems,
  onPlayMedia,
  onOpenDetails,
  watchlist,
  onToggleWatchlist,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(true);

  const currentItem = featuredItems[currentIndex] || featuredItems[0];
  const isSaved = currentItem ? watchlist.includes(currentItem.id) : false;

  // Auto-advance carousel every 9 seconds
  useEffect(() => {
    if (featuredItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [featuredItems.length]);

  if (!currentItem) return null;

  return (
    <div className="relative w-full h-[520px] sm:h-[620px] lg:h-[700px] overflow-hidden select-none bg-[#0b0b0e]">
      
      {/* Background Media Banner with Smooth Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src={currentItem.backdropUrl}
            alt={currentItem.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />

          {/* Fallback gradient if image loading */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-950/40 via-transparent to-black/60 mix-blend-multiply" />
        </motion.div>
      </AnimatePresence>

      {/* Measured Contrast Scrims (Ensures WCAG AA Legibility) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0e] via-[#0b0b0e]/70 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0e] via-[#0b0b0e]/60 to-transparent pointer-events-none w-full lg:w-3/4" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-2xl">
          
          {/* Category kicker & Match Score (Zero-Pill clean typography) */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-300 mb-3 tracking-wide">
            <span className="text-violet-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Featured {currentItem.type === 'movie' ? 'Blockbuster' : currentItem.type === 'cartoon' ? 'Animation' : 'Live Concert'}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400 font-semibold tabular-nums">{currentItem.matchScore}% Match</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300 font-medium">{currentItem.badge}</span>
          </div>

          {/* Cinematic Title */}
          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-display tracking-tight leading-[1.08] mb-3 text-balance"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
          >
            {currentItem.title}
          </h1>

          {/* Clean Unboxed Metadata Line with typographic separators */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm text-slate-400 mb-4">
            <span className="text-slate-200 font-semibold tabular-nums">{currentItem.year}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-200 tabular-nums">{currentItem.duration}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300">{currentItem.ageRating}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-violet-300 font-medium">{currentItem.genres.join(' / ')}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-amber-400 font-bold tabular-nums">★ {currentItem.rating}</span>
          </div>

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed line-clamp-3 mb-6 font-normal max-w-xl text-balance">
            {currentItem.synopsis}
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Play Now CTA */}
            <button
              onClick={() => onPlayMedia(currentItem)}
              className="group flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
              <span>{currentItem.type === 'music' ? 'Listen Now' : currentItem.isSeries ? 'Browse Seasons' : 'Play Now'}</span>
            </button>

            {/* Watchlist Toggle CTA */}
            <button
              onClick={() => onToggleWatchlist(currentItem.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isSaved
                  ? 'bg-violet-950/60 border-violet-500 text-violet-300 hover:bg-violet-900/60'
                  : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-violet-400" />
                  <span>In Watchlist</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add to Watchlist</span>
                </>
              )}
            </button>

            {/* Details & Specs Modal */}
            <button
              onClick={() => onOpenDetails(currentItem)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-slate-200 text-sm font-medium transition-all cursor-pointer whitespace-nowrap"
              title="More Details & Audio Specs"
            >
              <Info className="w-4 h-4 text-slate-300" />
              <span className="hidden sm:inline">Details</span>
            </button>

          </div>
        </div>
      </div>

      {/* Floating Carousel Navigation & Audio Toggle */}
      <div className="absolute right-4 sm:right-8 bottom-12 sm:bottom-16 z-20 flex items-center gap-3">
        
        {/* Audio Mute Preview Control */}
        <button
          onClick={() => setIsAudioMuted(!isAudioMuted)}
          className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-slate-300 hover:text-white backdrop-blur-md transition-all cursor-pointer"
          title={isAudioMuted ? 'Unmute Ambient Sound' : 'Mute Sound'}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-violet-400" />}
        </button>

        {/* Carousel Prev/Next Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-black/40 border border-white/10 rounded-full backdrop-blur-md">
          <button
            onClick={() => setCurrentIndex((prev) => (prev === 0 ? featuredItems.length - 1 : prev - 1))}
            className="p-2 rounded-full hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Previous Featured"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {/* Indicators */}
          <div className="flex items-center gap-1 px-1">
            {featuredItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx ? 'w-5 bg-violet-400' : 'w-1.5 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % featuredItems.length)}
            className="p-2 rounded-full hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Next Featured"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
