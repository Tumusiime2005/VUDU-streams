import React from 'react';
import { GENRE_LIST } from '../data/mediaData';
import { Sparkles, X } from 'lucide-react';

interface GenreFilterBarProps {
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
}

export const GenreFilterBar: React.FC<GenreFilterBarProps> = ({
  selectedGenre,
  onSelectGenre,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mr-1 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          Genres:
        </span>

        {GENRE_LIST.map((genre) => {
          const isSelected = selectedGenre === genre;
          return (
            <button
              key={genre}
              onClick={() => onSelectGenre(genre)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/30'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.05]'
              }`}
            >
              {genre}
            </button>
          );
        })}

        {selectedGenre !== 'All Genres' && (
          <button
            onClick={() => onSelectGenre('All Genres')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
