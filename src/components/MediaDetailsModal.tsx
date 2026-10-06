import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Plus,
  Check,
  Star,
  Download,
  Film,
  User,
  Clapperboard,
  Tv,
  MessageSquare,
  ThumbsUp,
  Sparkles,
  Send,
  Layers,
} from 'lucide-react';
import { MediaItem, EpisodeData, MEDIA_CATALOG } from '../data/mediaData';
import { ReviewItem, UserAccount } from '../types/userAndHistory';

interface MediaDetailsModalProps {
  item: MediaItem;
  currentUser: UserAccount;
  onClose: () => void;
  onPlay: (item: MediaItem, resumeTime?: number, episodeTitle?: string) => void;
  isSaved: boolean;
  onToggleWatchlist: (id: string) => void;
  onDownload: (item: MediaItem, episode?: EpisodeData, seasonNum?: number) => void;
  isDownloaded: boolean;
  reviews: ReviewItem[];
  onAddReview: (review: Omit<ReviewItem, 'id' | 'createdAt' | 'likes'>) => void;
}

export const MediaDetailsModal: React.FC<MediaDetailsModalProps> = ({
  item,
  currentUser,
  onClose,
  onPlay,
  isSaved,
  onToggleWatchlist,
  onDownload,
  isDownloaded,
  reviews,
  onAddReview,
}) => {
  // ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Tab: 'overview' | 'episodes' | 'reviews'
  const [activeTab, setActiveTab] = useState<'overview' | 'episodes' | 'reviews'>(
    item.isSeries && item.seasons ? 'episodes' : 'overview'
  );

  // Selected Season
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number>(
    item.seasons?.[0]?.seasonNumber || 1
  );

  // User review state
  const [userRating, setUserRating] = useState<number>(5);
  const [userComment, setUserComment] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  // Filter reviews for this item
  const itemReviews = reviews.filter((r) => r.mediaId === item.id);

  // Current Season Data
  const currentSeason = item.seasons?.find((s) => s.seasonNumber === selectedSeasonNumber) || item.seasons?.[0];

  // Recommendations: "You May Also Watch"
  const recommendedItems = MEDIA_CATALOG.filter(
    (other) => other.id !== item.id && (other.type === item.type || other.genres.some((g) => item.genres.includes(g)))
  ).slice(0, 4);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;

    onAddReview({
      mediaId: item.id,
      userId: currentUser.id,
      userName: currentUser.name || 'VUDU Subscriber',
      userAvatar: currentUser.avatarUrl,
      rating: userRating,
      comment: userComment.trim(),
      verifiedSubscriber: Boolean(currentUser.subscription?.active),
    });

    setUserComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#101017] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-violet-950/40 my-auto text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/15 backdrop-blur-md transition-colors cursor-pointer"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Backdrop Banner */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#161624]">
          <img
            src={item.backdropUrl}
            alt={item.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101017] via-[#101017]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101017] via-transparent to-transparent w-2/3" />

          {/* Floating Actions on Backdrop */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 mb-1.5">
                <span className="uppercase tracking-widest">{item.isSeries ? 'Series' : item.type}</span>
                <span>·</span>
                <span className="text-emerald-400 tabular-nums">{item.matchScore}% Match</span>
                {item.isSeries && (
                  <>
                    <span>·</span>
                    <span className="text-cyan-300 font-mono">{item.seasons?.length} Seasons</span>
                  </>
                )}
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-display tracking-tight text-balance">
                {item.title}
              </h2>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Play Main Button */}
              <button
                onClick={() => {
                  onClose();
                  onPlay(item);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 transition-all cursor-pointer whitespace-nowrap"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{item.isSeries ? 'Play S1:E1' : item.type === 'music' ? 'Listen Now' : 'Play Movie'}</span>
              </button>

              {/* Download for Offline Button */}
              <button
                onClick={() => onDownload(item)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isDownloaded
                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                    : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
                }`}
                title={isDownloaded ? 'Downloaded Offline' : 'Download Title for Offline Streaming'}
              >
                {isDownloaded ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
              </button>

              {/* Watchlist Toggle */}
              <button
                onClick={() => onToggleWatchlist(item.id)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-violet-900/60 border-violet-400 text-violet-300'
                    : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
                }`}
                title={isSaved ? 'In Watchlist' : 'Add to Watchlist'}
              >
                {isSaved ? <Check className="w-4 h-4 text-violet-400" /> : <Plus className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 border-b border-white/[0.08] bg-[#12121a]">
          {item.isSeries && item.seasons && (
            <button
              onClick={() => setActiveTab('episodes')}
              className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'episodes'
                  ? 'border-violet-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-violet-400" />
              <span>Seasons & Episodes</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'border-violet-500 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Overview & Specs
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-violet-500 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-violet-400" />
            <span>Subscriber Reviews ({itemReviews.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[55vh] overflow-y-auto">
          
          {/* TAB 1: SEASONS & EPISODES SELECTOR (For Series) */}
          {activeTab === 'episodes' && item.isSeries && item.seasons && (
            <div className="space-y-5">
              {/* Season Selection Row */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold text-slate-400">Select Season:</span>
                  <div className="flex items-center gap-1.5">
                    {item.seasons.map((season) => (
                      <button
                        key={season.seasonNumber}
                        onClick={() => setSelectedSeasonNumber(season.seasonNumber)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          selectedSeasonNumber === season.seasonNumber
                            ? 'bg-violet-600 text-white shadow-sm'
                            : 'bg-white/[0.04] text-slate-400 hover:text-white'
                        }`}
                      >
                        Season {season.seasonNumber}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-400">
                  {currentSeason?.episodes.length} Episodes available
                </div>
              </div>

              {/* Episode List */}
              <div className="space-y-3">
                {currentSeason?.episodes.map((ep) => (
                  <div
                    key={ep.id}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-violet-500/40 hover:bg-white/[0.04] transition-all"
                  >
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      <div className="relative w-28 sm:w-32 aspect-[16/10] rounded-lg overflow-hidden shrink-0 bg-[#161622] border border-white/10">
                        <img
                          src={ep.thumbnailUrl}
                          alt={ep.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-5 h-5 fill-white text-white" />
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-violet-400 font-bold">
                            E{ep.episodeNumber}
                          </span>
                          <h4 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                            {ep.title}
                          </h4>
                          <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                            {ep.duration}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {ep.synopsis}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0">
                      {/* Play Episode */}
                      <button
                        onClick={() => {
                          onClose();
                          onPlay(item, 0, `S${selectedSeasonNumber}:E${ep.episodeNumber} - ${ep.title}`);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Play Episode</span>
                      </button>

                      {/* Download Episode */}
                      <button
                        onClick={() => onDownload(item, ep, selectedSeasonNumber)}
                        className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.06] transition-colors cursor-pointer"
                        title="Download Episode for Offline Watching"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: OVERVIEW & SPECS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Metadata Row */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-400 border-b border-white/[0.06] pb-4">
                <span className="text-slate-100 font-semibold tabular-nums">{item.year}</span>
                <span>·</span>
                <span className="tabular-nums">{item.duration}</span>
                <span>·</span>
                <span className="text-slate-200">{item.ageRating}</span>
                <span>·</span>
                <span className="text-violet-300 font-medium">{item.genres.join(' / ')}</span>
                <span>·</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {item.rating}
                </span>
                <span>·</span>
                <span className="text-cyan-400 font-mono">{item.badge}</span>
              </div>

              {/* Synopsis & Credits Split */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-slate-400">
                    Synopsis
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{item.synopsis}</p>

                  <div className="pt-2">
                    <h4 className="text-xs uppercase tracking-widest font-semibold text-slate-400 mb-2.5">
                      Audio & Video Master Specifications
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                        <span className="text-[10px] text-slate-500 uppercase block">Resolution</span>
                        <span className="text-slate-200 font-mono font-medium">3840 × 2160 UHD</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                        <span className="text-[10px] text-slate-500 uppercase block">Sound Format</span>
                        <span className="text-slate-200 font-mono font-medium">Dolby Atmos Spatial</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                        <span className="text-[10px] text-slate-500 uppercase block">Downloadable</span>
                        <span className="text-emerald-400 font-mono font-medium">Yes · Offline Mode</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-t md:border-t-0 md:border-l border-white/[0.06] md:pl-6 pt-4 md:pt-0 text-xs">
                  {item.director && (
                    <div>
                      <span className="text-slate-500 block mb-1">Director</span>
                      <p className="text-slate-200 font-medium">{item.director}</p>
                    </div>
                  )}
                  {item.artist && (
                    <div>
                      <span className="text-slate-500 block mb-1">Artist</span>
                      <p className="text-slate-200 font-medium">{item.artist}</p>
                    </div>
                  )}
                  {item.cast && item.cast.length > 0 && (
                    <div>
                      <span className="text-slate-500 block mb-1">Starring Cast</span>
                      <p className="text-slate-200">{item.cast.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REVIEWS DATABASE */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Add a Review Form */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <h4 className="text-xs uppercase font-bold text-slate-300 tracking-wider mb-2 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-violet-400" />
                  <span>Write a Subscriber Review</span>
                </h4>

                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Your Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          className="p-1 cursor-pointer"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= userRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-600 hover:text-amber-400'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    placeholder="Share your review of the plot, audio mastering, cinematography..."
                    rows={2}
                    className="w-full bg-[#151520] border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Posting as <strong className="text-white">{currentUser.name}</strong> (Verified Subscriber)
                    </span>

                    <button
                      type="submit"
                      disabled={!userComment.trim()}
                      className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Review</span>
                    </button>
                  </div>
                </form>

                {reviewSubmitted && (
                  <div className="mt-2 text-xs text-emerald-400 font-semibold animate-in fade-in">
                    Review submitted to VUDU database!
                  </div>
                )}
              </div>

              {/* Reviews List */}
              <div className="space-y-3">
                <div className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Community Reviews Database ({itemReviews.length})
                </div>

                {itemReviews.length > 0 ? (
                  itemReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{rev.userName}</span>
                          {rev.verifiedSubscriber && (
                            <span className="px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-300 text-[10px] font-mono">
                              Verified Subscriber
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>

                      <div className="text-[10px] text-slate-500 pt-1 flex items-center justify-between">
                        <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                        <div className="flex items-center gap-1 text-slate-400">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{rev.likes || 12} found helpful</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-slate-500">
                    No community reviews yet. Be the first subscriber to review this title!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* "YOU MAY ALSO WATCH" SECTION */}
          {recommendedItems.length > 0 && (
            <div className="pt-6 border-t border-white/[0.06]">
              <h4 className="text-xs uppercase tracking-widest font-semibold text-slate-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span>You May Also Watch</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {recommendedItems.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      onClose();
                      onPlay(rel);
                    }}
                    className="group cursor-pointer rounded-lg overflow-hidden bg-white/[0.02] border border-white/[0.06] hover:border-violet-500/40 transition-all p-2"
                  >
                    <div className="aspect-[16/10] w-full rounded overflow-hidden mb-2 bg-[#1b1b26]">
                      <img
                        src={rel.posterUrl}
                        alt={rel.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="text-xs font-bold text-white truncate group-hover:text-violet-300">
                      {rel.title}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                      <span>{rel.year}</span>
                      <span>·</span>
                      <span className="text-violet-400">{rel.genres[0]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
