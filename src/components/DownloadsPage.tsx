import React from 'react';
import { Download, Play, Trash2, HardDrive, CheckCircle2, Film, Tv, Music } from 'lucide-react';
import { DownloadedItem } from '../types/userAndHistory';
import { MediaItem } from '../data/mediaData';

interface DownloadsPageProps {
  downloads: DownloadedItem[];
  catalog: MediaItem[];
  onPlayDownloaded: (item: MediaItem, episodeTitle?: string) => void;
  onDeleteDownload: (id: string) => void;
  onClearDownloads: () => void;
  onBrowse: () => void;
}

export const DownloadsPage: React.FC<DownloadsPageProps> = ({
  downloads,
  catalog,
  onPlayDownloaded,
  onDeleteDownload,
  onClearDownloads,
  onBrowse,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/[0.08] mb-8">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Download className="w-5 h-5 text-emerald-400" />
            <span className="text-xs uppercase font-bold tracking-widest">Offline Streaming Library</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-display text-white">
            Downloads ({downloads.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Watch your downloaded movies, cartoon episodes, and music tracks offline without an internet connection.
          </p>
        </div>

        {downloads.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-slate-300 flex items-center gap-2">
              <HardDrive className="w-3.5 h-3.5 text-violet-400" />
              <span>Offline Storage: Active</span>
            </div>

            <button
              onClick={onClearDownloads}
              className="px-3 py-1.5 rounded-xl bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-500/20 text-xs font-semibold transition-colors cursor-pointer"
            >
              Clear All Downloads
            </button>
          </div>
        )}
      </div>

      {/* Downloads List */}
      {downloads.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {downloads.map((item) => {
            const media = catalog.find((m) => m.id === item.mediaId);
            if (!media) return null;

            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-xl overflow-hidden bg-[#121218] border border-white/[0.06] hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-600/10 transition-all p-3"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-[#181824] mb-2.5">
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-400/40 text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Downloaded</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white truncate">{item.title}</h3>
                  {item.episodeTitle && (
                    <p className="text-xs text-violet-300 truncate mt-0.5">{item.episodeTitle}</p>
                  )}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
                    <span>{item.fileSize}</span>
                    <span>{new Date(item.downloadedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-2 border-t border-white/[0.06]">
                  <button
                    onClick={() => onPlayDownloaded(media, item.episodeTitle)}
                    className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Watch Offline</span>
                  </button>

                  <button
                    onClick={() => onDeleteDownload(item.id)}
                    className="p-2 rounded-lg bg-white/[0.04] hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-white/[0.06] transition-colors cursor-pointer"
                    title="Remove from offline downloads"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 px-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl max-w-lg mx-auto">
          <Download className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Offline Downloads</h3>
          <p className="text-xs text-slate-400 mb-6">
            Download movies, series episodes, and music to your device so you can watch without Wi-Fi or mobile data.
          </p>
          <button
            onClick={onBrowse}
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Browse Streaming Titles
          </button>
        </div>
      )}
    </div>
  );
};
