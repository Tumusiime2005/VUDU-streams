import React, { useState } from 'react';
import { History, Play, RotateCcw, Trash2, Clock, Film, Tv, Music, Sparkles, AlertCircle } from 'lucide-react';
import { WatchHistoryRecord } from '../types/userAndHistory';
import { MediaItem } from '../data/mediaData';

interface WatchHistoryPageProps {
  historyRecords: WatchHistoryRecord[];
  catalog: MediaItem[];
  onResume: (item: MediaItem, resumeTime: number) => void;
  onRemoveRecord: (id: string) => void;
  onClearHistory: () => void;
  onNavigateHome: () => void;
}

export const WatchHistoryPage: React.FC<WatchHistoryPageProps> = ({
  historyRecords,
  catalog,
  onResume,
  onRemoveRecord,
  onClearHistory,
  onNavigateHome,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'cartoon' | 'music'>('all');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const filteredRecords = historyRecords.filter((rec) => {
    if (filterType === 'all') return true;
    return rec.type === filterType;
  });

  const formatTimestamp = (ts: number) => {
    const diffMs = Date.now() - ts;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 2) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const remMins = mins % 60;
      return `${hrs}h ${remMins}m`;
    }
    return `${mins}m ${secs}s`;
  };

  const totalMinutesWatched = Math.floor(
    historyRecords.reduce((acc, curr) => acc + (curr.progressSeconds || 0), 0) / 60
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/[0.08] mb-8">
        <div>
          <div className="flex items-center gap-2 text-violet-400 mb-1">
            <History className="w-5 h-5 text-violet-400" />
            <span className="text-xs uppercase font-bold tracking-widest">Saved Viewing Progress</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-display text-white">
            Watch History & Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Never lose your place. Your exact viewing timeline is automatically recorded and ready to resume across all sessions.
          </p>
        </div>

        {/* Quick Stats & Clear Actions */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-right hidden md:block">
            <div className="text-[11px] text-slate-400">Total Watched</div>
            <div className="text-sm font-bold font-mono text-violet-300">
              {totalMinutesWatched > 60 ? `${(totalMinutesWatched / 60).toFixed(1)} hrs` : `${totalMinutesWatched} mins`}
            </div>
          </div>

          {historyRecords.length > 0 && (
            <button
              onClick={() => setShowConfirmClear(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-500/20 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Clearing History */}
      {showConfirmClear && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121218] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Clear All Watch History?</h3>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              This will erase all recorded playback timestamps and resume positions for your profile. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearHistory();
                  setShowConfirmClear(false);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-600/30"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      {historyRecords.length > 0 && (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto hide-scrollbar pb-1">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
            }`}
          >
            All Titles ({historyRecords.length})
          </button>
          <button
            onClick={() => setFilterType('movie')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'movie'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Movies</span>
          </button>
          <button
            onClick={() => setFilterType('cartoon')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'cartoon'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Cartoons</span>
          </button>
          <button
            onClick={() => setFilterType('music')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'music'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Music</span>
          </button>
        </div>
      )}

      {/* Records Content */}
      {filteredRecords.length > 0 ? (
        <div className="space-y-4">
          {filteredRecords.map((record) => {
            const mediaItem = catalog.find((c) => c.id === record.id);
            if (!mediaItem) return null;

            const remainingSeconds = Math.max(0, record.totalDurationSeconds - record.progressSeconds);

            return (
              <div
                key={record.id}
                className="group relative flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#121218] border border-white/[0.06] hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-600/10 transition-all"
              >
                {/* Media Thumbnail & Meta */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-28 sm:w-36 aspect-[16/10] rounded-xl overflow-hidden shrink-0 bg-[#181824] border border-white/10">
                    <img
                      src={record.posterUrl}
                      alt={record.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Progress Bar Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/70">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-indigo-400"
                        style={{ width: `${Math.min(100, record.progressPercent)}%` }}
                      />
                    </div>

                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-[10px] font-medium text-slate-300 uppercase">
                      {record.type}
                    </div>
                  </div>

                  <div className="min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                        {record.title}
                      </h3>
                      <span className="text-[10px] font-mono text-violet-400 px-1.5 py-0.5 rounded bg-violet-600/20 hidden sm:inline">
                        {record.badge}
                      </span>
                    </div>

                    {/* Genres & Ratings */}
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span>{record.genres.join(' / ')}</span>
                      <span>·</span>
                      <span className="text-amber-400">★ {record.rating}</span>
                    </div>

                    {/* Timeline Progress stats */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-2 font-mono">
                      <span className="text-violet-300 font-semibold">
                        {Math.round(record.progressPercent)}% completed
                      </span>
                      <span>·</span>
                      <span>Watched: {formatSeconds(record.progressSeconds)}</span>
                      <span>·</span>
                      <span className="text-slate-500">
                        {remainingSeconds > 0 ? `${formatSeconds(remainingSeconds)} left` : 'Completed'}
                      </span>
                    </div>

                    {/* Last Watched Date */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>Last played {formatTimestamp(record.lastWatchedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.04]">
                  {/* Resume Playback */}
                  <button
                    onClick={() => onResume(mediaItem, record.progressSeconds)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-violet-600/30 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Resume ({formatSeconds(record.progressSeconds)})</span>
                  </button>

                  {/* Restart from Beginning */}
                  <button
                    onClick={() => onResume(mediaItem, 0)}
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.06] transition-colors cursor-pointer"
                    title="Restart from beginning (0:00)"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {/* Remove Record */}
                  <button
                    onClick={() => onRemoveRecord(record.id)}
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-white/[0.06] hover:border-red-500/30 transition-colors cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-24 px-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl max-w-lg mx-auto">
          <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No watch records yet</h3>
          <p className="text-xs text-slate-400 mb-6">
            When you play movies, animated series, or music on VUDU, your progress is automatically bookmarked here so you can pick up exactly where you left off.
          </p>
          <button
            onClick={onNavigateHome}
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Start Watching Movies
          </button>
        </div>
      )}

    </div>
  );
};
