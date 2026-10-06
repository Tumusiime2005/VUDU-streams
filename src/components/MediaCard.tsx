import React, { useState, useRef, useEffect } from 'react';
import { Play, Plus, Check, Info, Film, Music, Tv, Star, Volume2, VolumeX, Sparkles, Download } from 'lucide-react';
import { MediaItem } from '../data/mediaData';

interface MediaCardProps {
  item: MediaItem;
  onPlay: (item: MediaItem, resumeTime?: number) => void;
  onDetails: (item: MediaItem) => void;
  isSaved: boolean;
  onToggleWatchlist: (id: string) => void;
  onDownload?: (item: MediaItem) => void;
  isDownloaded?: boolean;
  watchProgress?: {
    progressPercent: number;
    progressSeconds: number;
    totalSeconds: number;
  };
  suggestionReason?: string;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  onPlay,
  onDetails,
  isSaved,
  onToggleWatchlist,
  onDownload,
  isDownloaded,
  watchProgress,
  suggestionReason,
}) => {
  const [imgError, setImgError] = useState(false);
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [isPreviewMuted, setIsPreviewMuted] = useState(true);

  const hoverTimerRef = useRef<number | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  // 3-SECOND SILENT BACKGROUND TRIGGER (No countdown displayed on screen)
  const PREVIEW_TRIGGER_MS = 3000;

  const handleMouseEnter = () => {
    if (!item.videoUrl && item.type === 'music') return;

    // Silent background 3-second timer
    hoverTimerRef.current = window.setTimeout(() => {
      setIsPreviewActive(true);
    }, PREVIEW_TRIGGER_MS);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setIsPreviewActive(false);

    if (videoPreviewRef.current) {
      videoPreviewRef.current.pause();
    }
  };

  useEffect(() => {
    if (isPreviewActive && videoPreviewRef.current) {
      videoPreviewRef.current.currentTime = 5;
      videoPreviewRef.current.play().catch(() => {});
    }
  }, [isPreviewActive]);

  const getMediaIcon = () => {
    switch (item.type) {
      case 'movie':
        return <Film className="w-3.5 h-3.5 text-violet-400" />;
      case 'cartoon':
        return <Tv className="w-3.5 h-3.5 text-cyan-400" />;
      case 'music':
        return <Music className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex-none w-[200px] sm:w-[240px] md:w-[260px] select-none rounded-xl overflow-hidden bg-[#121218] border border-white/[0.06] hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-600/15 transition-all duration-300"
    >
      {/* Aspect Ratio Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#181824]">
        
        {/* Active 3-Second Video Preview */}
        {isPreviewActive && item.videoUrl ? (
          <div className="relative w-full h-full bg-black animate-in fade-in duration-300">
            <video
              ref={videoPreviewRef}
              src={item.videoUrl}
              muted={isPreviewMuted}
              loop
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Video Preview Overlay Controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between p-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-violet-600/90 text-white text-[10px] font-bold tracking-wider uppercase animate-pulse">
                  <Sparkles className="w-2.5 h-2.5" />
                  Live Preview
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPreviewMuted(!isPreviewMuted);
                  }}
                  className="p-1 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
                  title={isPreviewMuted ? 'Unmute Preview' : 'Mute Preview'}
                >
                  {isPreviewMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-violet-400" />}
                </button>
              </div>

              {/* Click to open full theater / episode selector */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    if (item.isSeries) {
                      onDetails(item);
                    } else {
                      onPlay(item, watchProgress?.progressSeconds);
                    }
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/90 hover:bg-white text-slate-950 text-[11px] font-bold transition-all shadow-md"
                >
                  <Play className="w-3 h-3 fill-slate-950" />
                  <span>{item.isSeries ? 'Seasons & Episodes' : 'Full Cinema'}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDetails(item);
                  }}
                  className="p-1 rounded-md bg-black/60 text-white text-[11px] hover:bg-black/90"
                  title="Details"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Normal Poster Image (No visible countdown text, silent 3s timer in background) */
          <>
            {!imgError ? (
              <img
                src={item.posterUrl}
                alt={item.title}
                onError={() => setImgError(true)}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-violet-950 via-[#161622] to-slate-900 text-center">
                {getMediaIcon()}
                <span className="mt-2 text-xs font-semibold text-slate-300 line-clamp-1">{item.title}</span>
                <span className="text-[10px] text-violet-400 mt-0.5">{item.genres[0]}</span>
              </div>
            )}

            {/* Dark Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#121218] via-transparent to-black/20 opacity-80 group-hover:opacity-90 transition-opacity" />

            {/* Media Type & Series Indicator */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-medium text-slate-300 border border-white/10">
              {getMediaIcon()}
              <span className="capitalize">{item.isSeries ? 'Series' : item.type}</span>
            </div>

            {/* Match / Rating Badge (Top Right) */}
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-bold text-amber-400 border border-white/10 tabular-nums">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{item.rating}</span>
            </div>

            {/* Hover Quick Action Overlay */}
            <div className="absolute inset-0 flex items-center justify-center gap-2.5 bg-black/50 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {/* Quick Play Button */}
              <button
                onClick={() => {
                  if (item.isSeries) {
                    onDetails(item);
                  } else {
                    onPlay(item, watchProgress?.progressSeconds);
                  }
                }}
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-violet-600/40 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                title={item.isSeries ? 'Browse Seasons & Episodes' : watchProgress ? 'Resume Playback' : item.type === 'music' ? 'Play Track' : 'Play Video'}
                aria-label={`Play ${item.title}`}
              >
                <Play className="w-4 h-4 fill-white text-white ml-0.5" />
              </button>

              {/* Watchlist Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWatchlist(item.id);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center border backdrop-blur-md transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-violet-900/80 border-violet-400 text-violet-300'
                    : 'bg-black/60 hover:bg-black/80 border-white/20 text-white'
                }`}
                title={isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}
                aria-label={isSaved ? 'In Watchlist' : 'Add to Watchlist'}
              >
                {isSaved ? <Check className="w-3.5 h-3.5 text-violet-300" /> : <Plus className="w-3.5 h-3.5" />}
              </button>

              {/* Download for Offline Button */}
              {onDownload && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(item);
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center border backdrop-blur-md transition-all cursor-pointer ${
                    isDownloaded
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                      : 'bg-black/60 hover:bg-black/80 border-white/20 text-white'
                  }`}
                  title={isDownloaded ? 'Downloaded Offline' : 'Download for Offline Watching'}
                >
                  {isDownloaded ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
                </button>
              )}

              {/* More Info */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDetails(item);
                }}
                className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
                title="Details & Seasons"
                aria-label={`Details for ${item.title}`}
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}

        {/* Watch History Progress Bar */}
        {watchProgress && watchProgress.progressPercent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/80 z-10">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 transition-all"
              style={{ width: `${Math.min(100, watchProgress.progressPercent)}%` }}
            />
          </div>
        )}
      </div>

      {/* Suggestion Note: "You may also watch" */}
      {suggestionReason && (
        <div className="px-3 py-1 bg-violet-950/40 border-b border-violet-500/10 text-[10px] text-violet-300 font-medium truncate flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-violet-400 shrink-0" />
          <span className="truncate">You may also watch · {suggestionReason}</span>
        </div>
      )}

      {/* Card Body Metadata */}
      <div className="p-3.5">
        <h3
          className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors truncate cursor-pointer"
          onClick={() => onDetails(item)}
        >
          {item.title}
        </h3>

        {/* Secondary Title / Artist / Seasons */}
        <p className="text-xs text-slate-400 truncate mt-0.5">
          {item.artist ? item.artist : item.isSeries && item.seasons ? `${item.seasons.length} Seasons available` : item.genres[0]}
        </p>

        {/* Clean Unboxed Metadata */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2">
          <span className="tabular-nums">{item.year}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="tabular-nums">{item.duration}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-violet-400/90 font-medium truncate">{item.genres[0]}</span>
        </div>

        {/* Watch Progress or Audio/Video Specification */}
        <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-slate-500">
          {watchProgress ? (
            <>
              <span className="text-violet-300 font-medium tabular-nums">
                {Math.round(watchProgress.progressPercent)}% watched
              </span>
              <span
                className="text-slate-400 hover:text-white cursor-pointer"
                onClick={() => onPlay(item, watchProgress.progressSeconds)}
              >
                Resume
              </span>
            </>
          ) : (
            <>
              <span className="font-mono text-slate-400">{item.badge}</span>
              <span className="text-emerald-400/90 font-semibold">{item.matchScore}% Match</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
