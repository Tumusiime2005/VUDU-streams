/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Navbar, NavTabType } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MediaRail } from './components/MediaRail';
import { MediaCard } from './components/MediaCard';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { MediaDetailsModal } from './components/MediaDetailsModal';
import { WatchHistoryPage } from './components/WatchHistoryPage';
import { DownloadsPage } from './components/DownloadsPage';
import { AuthModal } from './components/AuthModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { Top10Rail } from './components/Top10Rail';
import { ComingSoonSection } from './components/ComingSoonSection';
import { WhoIsWatchingModal } from './components/WhoIsWatchingModal';
import { MEDIA_CATALOG, MediaItem, EpisodeData } from './data/mediaData';
import {
  WatchHistoryRecord,
  UserAccount,
  SubscriptionDetails,
  ReviewItem,
  DownloadedItem,
  UserProfileSlot,
} from './types/userAndHistory';
import { generateWatchSuggestions } from './utils/suggestionEngine';
import {
  Film,
  Music,
  Tv,
  Bookmark,
  Sparkles,
  Zap,
  RefreshCw,
  History,
  Crown,
  FilterX,
  Lock,
  ArrowRight,
  Download,
  Smartphone,
  Laptop,
  AlertTriangle,
} from 'lucide-react';

export default function App() {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Navigation & Filtering State
  const [activeTab, setActiveTab] = useState<NavTabType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All Genres');

  // User Authentication State
  const [user, setUser] = useState<UserAccount>(() => {
    try {
      const saved = localStorage.getItem('vudu_user_account');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      id: 'usr_marvin',
      name: 'Marvin Elton',
      email: 'tumusiimeeltonmarvin@gmail.com',
      avatarUrl: '',
      subscription: {
        planId: 'premium',
        planName: 'Premium',
        priceFormatted: '$9.99 / month',
        paymentMethod: 'mtn',
        paymentIdentifier: 'MTN Mobile Money (+256 772 849 321)',
        subscribedAt: 'Oct 5, 2026',
        nextBillingDate: 'Nov 5, 2026',
        transactionReference: 'MTN-MOMO-849201',
        active: true,
      },
      isLoggedIn: true,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('vudu_user_account', JSON.stringify(user));
    } catch {}
  }, [user]);

  // Auth & Subscription Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [subscriptionBlockMessage, setSubscriptionBlockMessage] = useState<string>('');
  const [pendingPlayItem, setPendingPlayItem] = useState<{
    item: MediaItem;
    resumeTime?: number;
    episodeTitle?: string;
  } | null>(null);

  // Mobile Plan Device Restriction Modal
  const [isMobileRestrictionOpen, setIsMobileRestrictionOpen] = useState(false);
  const [simulatedMobileMode, setSimulatedMobileMode] = useState(false);

  // Who's Watching Profile Switcher Modal
  const [isWhoIsWatchingOpen, setIsWhoIsWatchingOpen] = useState(false);

  const handleSelectProfile = (profile: UserProfileSlot) => {
    setUser((prev) => ({
      ...prev,
      activeProfileId: profile.id,
      name: profile.name,
      isKidsMode: profile.isKids,
    }));
  };

  // Reviews Database (Persisted in localStorage)
  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem('vudu_reviews_db');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'rev-1',
        mediaId: 'cyberfall-2099',
        userId: 'usr_sarah',
        userName: 'Sarah Jenkins',
        rating: 5,
        comment: 'The cyberpunk visuals and Dolby Atmos spatial mix are breathtaking! Best sci-fi blockbuster of the year.',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
        likes: 34,
        verifiedSubscriber: true,
      },
      {
        id: 'rev-2',
        mediaId: 'chronicles-of-aetheria',
        userId: 'usr_dave',
        userName: 'David Miller',
        rating: 5,
        comment: 'Season 2 Episode 3 was an emotional rollercoaster. The flying sequences in HDR look mesmerizing.',
        createdAt: Date.now() - 1000 * 60 * 60 * 12,
        likes: 19,
        verifiedSubscriber: true,
      },
      {
        id: 'rev-3',
        mediaId: 'electric-symphony-live',
        userId: 'usr_alex',
        userName: 'Alex Chen',
        rating: 5,
        comment: 'Incredible bass drops and stadium synth energy. Sounds glorious on home speakers.',
        createdAt: Date.now() - 1000 * 60 * 60 * 5,
        likes: 28,
        verifiedSubscriber: true,
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('vudu_reviews_db', JSON.stringify(reviews));
    } catch {}
  }, [reviews]);

  const handleAddReview = (newRev: Omit<ReviewItem, 'id' | 'createdAt' | 'likes'>) => {
    const item: ReviewItem = {
      ...newRev,
      id: 'rev_' + Date.now(),
      createdAt: Date.now(),
      likes: 1,
    };
    setReviews((prev) => [item, ...prev]);
  };

  // Offline Downloads Storage
  const [downloads, setDownloads] = useState<DownloadedItem[]>(() => {
    try {
      const saved = localStorage.getItem('vudu_downloads');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'dl-1',
        mediaId: 'cyberfall-2099',
        title: 'Cyberfall 2099',
        type: 'movie',
        fileSize: '2.1 GB',
        downloadedAt: Date.now() - 1000 * 60 * 60 * 8,
        posterUrl: MEDIA_CATALOG[0].posterUrl,
        videoUrl: MEDIA_CATALOG[0].videoUrl || '',
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('vudu_downloads', JSON.stringify(downloads));
    } catch {}
  }, [downloads]);

  const handleDownload = (item: MediaItem, episode?: EpisodeData, seasonNum?: number) => {
    // Check if user has active subscription
    if (!user.subscription || !user.subscription.active) {
      setSubscriptionBlockMessage('Subscription required to download movies and series for offline viewing.');
      setIsSubscriptionOpen(true);
      return;
    }

    const downloadId = episode ? `dl-${item.id}-${episode.id}` : `dl-${item.id}`;
    const exists = downloads.some((d) => d.id === downloadId);

    if (exists) {
      // Remove download
      setDownloads((prev) => prev.filter((d) => d.id !== downloadId));
    } else {
      // Add download
      const newDl: DownloadedItem = {
        id: downloadId,
        mediaId: item.id,
        title: item.title,
        episodeTitle: episode ? `S${seasonNum || 1}:E${episode.episodeNumber} - ${episode.title}` : undefined,
        seasonNumber: seasonNum,
        episodeNumber: episode?.episodeNumber,
        type: item.type,
        fileSize: episode ? '680 MB' : '1.8 GB',
        downloadedAt: Date.now(),
        posterUrl: episode ? episode.thumbnailUrl : item.posterUrl,
        videoUrl: episode ? episode.videoUrl : item.videoUrl || '',
      };
      setDownloads((prev) => [newDl, ...prev]);
    }
  };

  // Watch History Records
  const [watchHistory, setWatchHistory] = useState<WatchHistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem('vudu_watch_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'cyberfall-2099',
        title: 'Cyberfall 2099',
        type: 'movie',
        posterUrl: MEDIA_CATALOG[0].posterUrl,
        backdropUrl: MEDIA_CATALOG[0].backdropUrl,
        progressSeconds: 3840,
        totalDurationSeconds: 8040,
        progressPercent: 47.7,
        lastWatchedAt: Date.now() - 1000 * 60 * 35,
        genres: ['Action', 'Sci-Fi'],
        durationText: '2h 14m',
        rating: 4.9,
        badge: '4K Ultra HD',
      },
      {
        id: 'chronicles-of-aetheria',
        title: 'Chronicles of Aetheria',
        type: 'cartoon',
        posterUrl: MEDIA_CATALOG[1].posterUrl,
        backdropUrl: MEDIA_CATALOG[1].backdropUrl,
        progressSeconds: 780,
        totalDurationSeconds: 2400,
        progressPercent: 32.5,
        lastWatchedAt: Date.now() - 1000 * 60 * 60 * 3,
        genres: ['Animation', 'Fantasy'],
        durationText: 'Season 1 · Ep 1',
        rating: 4.9,
        badge: 'HDR10+',
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('vudu_watch_history', JSON.stringify(watchHistory));
    } catch {}
  }, [watchHistory]);

  const handleProgressUpdate = (currentTime: number, duration: number) => {
    if (!activeVideoItem || duration <= 0) return;

    setWatchHistory((prev) => {
      const percent = (currentTime / duration) * 100;
      const existingIndex = prev.findIndex((h) => h.id === activeVideoItem.id);

      const record: WatchHistoryRecord = {
        id: activeVideoItem.id,
        title: activeVideoItem.title,
        type: activeVideoItem.type,
        posterUrl: activeVideoItem.posterUrl,
        backdropUrl: activeVideoItem.backdropUrl,
        progressSeconds: Math.floor(currentTime),
        totalDurationSeconds: Math.floor(duration),
        progressPercent: percent,
        lastWatchedAt: Date.now(),
        genres: activeVideoItem.genres,
        durationText: activeVideoItem.duration,
        rating: activeVideoItem.rating,
        badge: activeVideoItem.badge,
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = record;
        return updated;
      } else {
        return [record, ...prev];
      }
    });
  };

  // Watchlist State
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vudu_watchlist');
      if (saved) return JSON.parse(saved);
    } catch {
      return ['cyberfall-2099', 'chronicles-of-aetheria'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('vudu_watchlist', JSON.stringify(watchlist));
    } catch {}
  }, [watchlist]);

  const toggleWatchlist = (id: string) => {
    setWatchlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Players & Modals State
  const [activeVideoItem, setActiveVideoItem] = useState<MediaItem | null>(null);
  const [videoResumeTime, setVideoResumeTime] = useState<number>(0);
  const [currentMusicTrack, setCurrentMusicTrack] = useState<MediaItem | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [detailItem, setDetailItem] = useState<MediaItem | null>(null);

  // PLAY HANDLER ENFORCING:
  // 1. Must be logged in
  // 2. No Free Streaming (Subscription required)
  // 3. Mobile Plan Device Restriction: Mobile plan cannot be used on laptop/tv
  const handlePlayMedia = (item: MediaItem, resumeTime?: number, episodeTitle?: string) => {
    // 1. Must first login/create account
    if (!user.isLoggedIn) {
      setIsAuthOpen(true);
      return;
    }

    // 2. Subscription Check (No Free Streaming)
    if (!user.subscription || !user.subscription.active) {
      setSubscriptionBlockMessage(
        `Subscription Required: No free streaming is available on VUDU. Subscribe to Mobile ($2.99), Basic ($3.99), Standard ($7.99), or Premium ($9.99) using MTN Mobile Money, Airtel Money, or Credit/Debit Card to watch "${item.title}".`
      );
      setPendingPlayItem({ item, resumeTime, episodeTitle });
      setIsSubscriptionOpen(true);
      return;
    }

    // 3. Mobile Plan Device Restriction Check:
    // If user has 'mobile' plan ($2.99) and is on a laptop/desktop/tv (innerWidth >= 768) without simulated mobile mode
    const isDesktopOrLaptop = typeof window !== 'undefined' && window.innerWidth >= 768 && !simulatedMobileMode;
    if (user.subscription.planId === 'mobile' && isDesktopOrLaptop) {
      setPendingPlayItem({ item, resumeTime, episodeTitle });
      setIsMobileRestrictionOpen(true);
      return;
    }

    // 4. Series check: If user selects a series and hasn't chosen an episode yet:
    // First display all seasons it has, let user select from them, then choose the episode!
    if (item.isSeries && item.seasons && item.seasons.length > 0 && !episodeTitle) {
      setDetailItem(item);
      return;
    }

    // Launch playback!
    if (item.type === 'music') {
      setCurrentMusicTrack(item);
      setIsMusicPlaying(true);
    } else {
      if (isMusicPlaying) setIsMusicPlaying(false);
      setVideoResumeTime(resumeTime || 0);

      // If playing an episode, override title briefly
      if (episodeTitle) {
        setActiveVideoItem({
          ...item,
          title: `${item.title} (${episodeTitle})`,
        });
      } else {
        setActiveVideoItem(item);
      }
    }
  };

  // Play teaser trailer for Coming Soon section
  const handlePlayTrailer = (trailerTitle: string, videoUrl: string) => {
    setActiveVideoItem({
      id: 'trailer_' + Date.now(),
      title: trailerTitle,
      type: 'movie',
      genres: ['Preview', 'Upcoming'],
      year: 2026,
      duration: '2m 15s',
      rating: 5.0,
      ageRating: 'PG-13',
      badge: '4K Teaser',
      matchScore: 99,
      synopsis: 'Official teaser preview for upcoming VUDU cinema premiere.',
      posterUrl: MEDIA_CATALOG[0].posterUrl,
      backdropUrl: MEDIA_CATALOG[0].backdropUrl,
      videoUrl,
    });
  };

  // Subscription completed successfully
  const handleSubscriptionSuccess = (details: SubscriptionDetails) => {
    setUser((prev) => ({
      ...prev,
      subscription: details,
    }));
    setSubscriptionBlockMessage('');

    if (pendingPlayItem) {
      const { item, resumeTime, episodeTitle } = pendingPlayItem;
      setPendingPlayItem(null);
      handlePlayMedia(item, resumeTime, episodeTitle);
    }
  };

  // History mapping for quick card lookups
  const historyMap = useMemo(() => {
    const map: Record<
      string,
      { progressPercent: number; progressSeconds: number; totalSeconds: number }
    > = {};
    watchHistory.forEach((h) => {
      map[h.id] = {
        progressPercent: h.progressPercent,
        progressSeconds: h.progressSeconds,
        totalSeconds: h.totalDurationSeconds,
      };
    });
    return map;
  }, [watchHistory]);

  // Dynamic Watch Suggestions: Runs in background and powers "You May Also Watch"
  const suggestedMedia = useMemo(() => {
    return generateWatchSuggestions(MEDIA_CATALOG, watchHistory);
  }, [watchHistory]);

  const suggestionReasonMap = useMemo(() => {
    const map: Record<string, string> = {};
    suggestedMedia.forEach((s) => {
      map[s.id] = s.suggestionReason;
    });
    return map;
  }, [suggestedMedia]);

  // Music Player Next/Prev Handlers
  const musicCatalog = useMemo(
    () => MEDIA_CATALOG.filter((item) => item.type === 'music'),
    []
  );

  const handleNextMusicTrack = () => {
    if (!currentMusicTrack || musicCatalog.length === 0) return;
    const currentIndex = musicCatalog.findIndex((m) => m.id === currentMusicTrack.id);
    const nextIndex = (currentIndex + 1) % musicCatalog.length;
    setCurrentMusicTrack(musicCatalog[nextIndex]);
    setIsMusicPlaying(true);
  };

  const handlePrevMusicTrack = () => {
    if (!currentMusicTrack || musicCatalog.length === 0) return;
    const currentIndex = musicCatalog.findIndex((m) => m.id === currentMusicTrack.id);
    const prevIndex = (currentIndex - 1 + musicCatalog.length) % musicCatalog.length;
    setCurrentMusicTrack(musicCatalog[prevIndex]);
    setIsMusicPlaying(true);
  };

  // Filtered Media Catalog
  const filteredCatalog = useMemo(() => {
    return MEDIA_CATALOG.filter((item) => {
      if (activeTab === 'movie' && item.type !== 'movie') return false;
      if (activeTab === 'cartoon' && item.type !== 'cartoon') return false;
      if (activeTab === 'music' && item.type !== 'music') return false;
      if (activeTab === 'watchlist' && !watchlist.includes(item.id)) return false;

      if (selectedGenre !== 'All Genres' && !item.genres.includes(selectedGenre)) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesGenre = item.genres.some((g) => g.toLowerCase().includes(query));
        const matchesArtist = item.artist?.toLowerCase().includes(query);
        const matchesCast = item.cast?.some((c) => c.toLowerCase().includes(query));
        const matchesSynopsis = item.synopsis.toLowerCase().includes(query);
        return matchesTitle || matchesGenre || matchesArtist || matchesCast || matchesSynopsis;
      }

      return true;
    });
  }, [activeTab, selectedGenre, searchQuery, watchlist]);

  // Segmented Catalog Rails
  const featuredMedia = useMemo(
    () => MEDIA_CATALOG.filter((item) => item.featured),
    []
  );

  const trendingMovies = useMemo(
    () => MEDIA_CATALOG.filter((item) => item.type === 'movie'),
    []
  );

  const popularCartoons = useMemo(
    () => MEDIA_CATALOG.filter((item) => item.type === 'cartoon'),
    []
  );

  const topMusicTracks = useMemo(
    () => MEDIA_CATALOG.filter((item) => item.type === 'music'),
    []
  );

  const watchlistItems = useMemo(
    () => MEDIA_CATALOG.filter((item) => watchlist.includes(item.id)),
    [watchlist]
  );

  const continueWatchingItems = useMemo(() => {
    const ids = watchHistory.map((h) => h.id);
    return ids
      .map((id) => MEDIA_CATALOG.find((m) => m.id === id))
      .filter((m): m is MediaItem => m !== undefined);
  }, [watchHistory]);

  const isSearchOrGenreActive =
    searchQuery.trim().length > 0 || (selectedGenre !== 'All Genres' && activeTab === 'all');

  return (
    <div
      className={`min-h-screen bg-[#0b0b0e] text-slate-100 flex flex-col font-sans selection:bg-violet-600 selection:text-white ${
        simulatedMobileMode ? 'max-w-md mx-auto border-x border-violet-500/40 shadow-2xl' : ''
      }`}
    >
      {/* Simulated Mobile Device Header when enabled */}
      {simulatedMobileMode && (
        <div className="bg-violet-950 px-4 py-2 border-b border-violet-500/40 text-[11px] text-violet-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold">
            <Smartphone className="w-3.5 h-3.5 text-cyan-300" />
            <span>Simulated Mobile Phone Viewport (Mobile Plan Enabled)</span>
          </div>
          <button
            onClick={() => setSimulatedMobileMode(false)}
            className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
          >
            Exit Phone Mode
          </button>
        </div>
      )}

      {/* 1. Animated Splash Screen on Load / Replay */}
      {showSplash && (
        <SplashScreen
          onComplete={() => setShowSplash(false)}
          onSkip={() => setShowSplash(false)}
        />
      )}

      {/* 2. Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        watchlistCount={watchlist.length}
        historyCount={watchHistory.length}
        downloadsCount={downloads.length}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSubscription={() => {
          setSubscriptionBlockMessage('');
          setIsSubscriptionOpen(true);
        }}
        onLogout={() => {
          setUser({
            id: 'unsubscribed_guest',
            name: 'Guest Viewer',
            email: 'guest@vudu.tv',
            avatarUrl: '',
            subscription: null,
            isLoggedIn: false,
          });
        }}
        onReplaySplash={() => setShowSplash(true)}
        onOpenWhoIsWatching={() => setIsWhoIsWatchingOpen(true)}
      />

      {/* Kids Profile Mode Banner */}
      {user.isKidsMode && (
        <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-amber-600 border-b border-amber-400/40 px-4 py-2 text-xs font-bold text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-base">🐣</span>
            <span>Kids Profile Active · Filtering catalog for family-friendly animations and cartoons</span>
          </div>
          <button
            onClick={() => setIsWhoIsWatchingOpen(true)}
            className="text-[11px] bg-black/40 hover:bg-black/60 px-3 py-1 rounded-lg text-amber-200 transition-colors cursor-pointer border border-white/10"
          >
            Switch Profile
          </button>
        </div>
      )}

      {/* NO FREE STREAMING BANNER: Alert when subscription is inactive */}
      {!user.subscription?.active && (
        <div className="bg-gradient-to-r from-amber-700 via-violet-900 to-amber-700 border-b border-amber-400/40 py-2.5 px-4 text-xs text-white">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-300 shrink-0" />
              <span>
                <strong>Subscription Required:</strong> No free streaming on VUDU. Choose from{' '}
                <strong>Mobile ($2.99)</strong>, <strong>Basic ($3.99)</strong>,{' '}
                <strong>Standard ($7.99)</strong>, or <strong>Premium ($9.99)</strong> with MTN Mobile Money, Airtel Money, or Card.
              </span>
            </div>
            <button
              onClick={() => {
                setSubscriptionBlockMessage('Select a plan to unlock full streaming access.');
                setIsSubscriptionOpen(true);
              }}
              className="px-3.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <span>Subscribe & Pay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-28">
        
        {/* VIEW A: Dedicated Offline Downloads Page */}
        {activeTab === 'downloads' ? (
          <DownloadsPage
            downloads={downloads}
            catalog={MEDIA_CATALOG}
            onPlayDownloaded={(item, epTitle) => handlePlayMedia(item, 0, epTitle)}
            onDeleteDownload={(id) => setDownloads((prev) => prev.filter((d) => d.id !== id))}
            onClearDownloads={() => setDownloads([])}
            onBrowse={() => setActiveTab('all')}
          />
        ) : activeTab === 'history' ? (
          
          /* VIEW B: Dedicated Watch History & Records Page */
          <WatchHistoryPage
            historyRecords={watchHistory}
            catalog={MEDIA_CATALOG}
            onResume={handlePlayMedia}
            onRemoveRecord={(id) => {
              setWatchHistory((prev) => prev.filter((r) => r.id !== id));
            }}
            onClearHistory={() => setWatchHistory([])}
            onNavigateHome={() => setActiveTab('all')}
          />
        ) : activeTab === 'watchlist' ? (
          
          /* VIEW C: Dedicated Watchlist Page */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center gap-2 text-violet-400 mb-1">
                  <Bookmark className="w-5 h-5 fill-violet-400/20" />
                  <span className="text-xs uppercase font-bold tracking-widest">My Collection</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black font-display text-white">
                  Your Watchlist ({watchlistItems.length})
                </h1>
              </div>
            </div>

            {watchlistItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {watchlistItems.map((item) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    onPlay={handlePlayMedia}
                    onDetails={(it) => setDetailItem(it)}
                    isSaved={true}
                    onToggleWatchlist={toggleWatchlist}
                    onDownload={handleDownload}
                    isDownloaded={downloads.some((d) => d.mediaId === item.id)}
                    watchProgress={historyMap[item.id]}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 px-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl max-w-lg mx-auto">
                <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">Your Watchlist is empty</h3>
                <p className="text-xs text-slate-400 mb-6">
                  Explore trending movies, series, and music tracks and add them to your watchlist for instant access.
                </p>
                <button
                  onClick={() => setActiveTab('all')}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Browse Streaming Catalog
                </button>
              </div>
            )}
          </div>
        ) : isSearchOrGenreActive ? (
          
          /* VIEW D: Filtered Search / Genre Results Grid */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/[0.08]">
              <div>
                <span className="text-xs uppercase font-bold text-violet-400 tracking-wider">
                  Catalog Results
                </span>
                <h2 className="text-2xl font-black text-white font-display mt-0.5">
                  {searchQuery ? `Searching for "${searchQuery}"` : `Genre: ${selectedGenre}`}
                </h2>
              </div>
              <div className="text-xs text-slate-400">
                Found {filteredCatalog.length} {filteredCatalog.length === 1 ? 'title' : 'titles'}
              </div>
            </div>

            {filteredCatalog.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mt-6">
                {filteredCatalog.map((item) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    onPlay={handlePlayMedia}
                    onDetails={(it) => setDetailItem(it)}
                    isSaved={watchlist.includes(item.id)}
                    onToggleWatchlist={toggleWatchlist}
                    onDownload={handleDownload}
                    isDownloaded={downloads.some((d) => d.mediaId === item.id)}
                    watchProgress={historyMap[item.id]}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 px-4 max-w-md mx-auto">
                <FilterX className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No matching titles found</h3>
                <p className="text-xs text-slate-400 mb-6">
                  Try selecting another genre from the dropdown or clear your search term.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedGenre('All Genres');
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        ) : (
          
          /* VIEW E: Standard Streaming Dashboard */
          <>
            {/* Hero Carousel Banner */}
            <HeroSection
              featuredItems={
                activeTab === 'movie'
                  ? trendingMovies.slice(0, 3)
                  : activeTab === 'cartoon'
                  ? popularCartoons.slice(0, 3)
                  : activeTab === 'music'
                  ? topMusicTracks.slice(0, 3)
                  : featuredMedia
              }
              onPlayMedia={handlePlayMedia}
              onOpenDetails={(it) => setDetailItem(it)}
              watchlist={watchlist}
              onToggleWatchlist={toggleWatchlist}
            />

            {/* CONTINUE WATCHING RAIL (Saved Progress from History) */}
            {continueWatchingItems.length > 0 && activeTab === 'all' && (
              <MediaRail
                title="Continue Watching"
                subtitle="Resume directly where you paused across previous sessions"
                items={continueWatchingItems}
                onPlay={handlePlayMedia}
                onDetails={(it) => setDetailItem(it)}
                watchlist={watchlist}
                onToggleWatchlist={toggleWatchlist}
                historyMap={historyMap}
                icon={<History className="w-5 h-5 text-violet-400" />}
              />
            )}

            {/* TOP 10 ON VUDU TODAY RAIL */}
            {activeTab === 'all' && (
              <Top10Rail
                items={MEDIA_CATALOG}
                onPlay={handlePlayMedia}
                onDetails={(it) => setDetailItem(it)}
                watchlist={watchlist}
                onToggleWatchlist={toggleWatchlist}
              />
            )}

            {/* "YOU MAY ALSO WATCH" RAIL (Intelligent Background Suggestions) */}
            {activeTab === 'all' && (
              <MediaRail
                title="You May Also Watch"
                subtitle="Calibrated recommendations based on your viewing tastes"
                items={suggestedMedia.slice(0, 6)}
                onPlay={handlePlayMedia}
                onDetails={(it) => setDetailItem(it)}
                watchlist={watchlist}
                onToggleWatchlist={toggleWatchlist}
                historyMap={historyMap}
                suggestionMap={suggestionReasonMap}
                icon={<Sparkles className="w-5 h-5 text-amber-400" />}
              />
            )}

            {/* CATEGORIZED MEDIA RAILS */}
            {(activeTab === 'all' || activeTab === 'movie') && (
              <MediaRail
                title="Trending Blockbuster Movies"
                subtitle="High-octane action, neo-noir thrillers, and deep-space odysseys in 4K UHD"
                items={trendingMovies}
                onPlay={handlePlayMedia}
                onDetails={(it) => setDetailItem(it)}
                watchlist={watchlist}
                onToggleWatchlist={toggleWatchlist}
                historyMap={historyMap}
                icon={<Film className="w-5 h-5 text-violet-400" />}
              />
            )}

            {(activeTab === 'all' || activeTab === 'cartoon') && (
              <MediaRail
                title="Popular Cartoons & Animated Series"
                subtitle="Select series to browse all seasons and choose specific episodes"
                items={popularCartoons}
                onPlay={handlePlayMedia}
                onDetails={(it) => setDetailItem(it)}
                watchlist={watchlist}
                onToggleWatchlist={toggleWatchlist}
                historyMap={historyMap}
                icon={<Tv className="w-5 h-5 text-cyan-400" />}
              />
            )}

            {(activeTab === 'all' || activeTab === 'music') && (
              <MediaRail
                title="Top Music Tracks & Live Stage Concerts"
                subtitle="Dolby Atmos stadium performances, synthwave anthems, and bass-heavy tracks"
                items={topMusicTracks}
                onPlay={handlePlayMedia}
                onDetails={(it) => setDetailItem(it)}
                watchlist={watchlist}
                onToggleWatchlist={toggleWatchlist}
                historyMap={historyMap}
                icon={<Music className="w-5 h-5 text-purple-400" />}
              />
            )}

            {/* Saved Watchlist Rail */}
            {activeTab === 'all' && watchlistItems.length > 0 && (
              <MediaRail
                title="My Saved Watchlist"
                subtitle="Titles marked for later viewing"
                items={watchlistItems}
                onPlay={handlePlayMedia}
                onDetails={(it) => setDetailItem(it)}
                watchlist={watchlist}
                onToggleWatchlist={toggleWatchlist}
                historyMap={historyMap}
                icon={<Bookmark className="w-5 h-5 text-violet-400" />}
              />
            )}

            {/* COMING SOON SECTION (Upcoming cinema releases with reminder alerts) */}
            {activeTab === 'all' && (
              <ComingSoonSection onPlayTrailer={handlePlayTrailer} />
            )}
          </>
        )}

      </main>

      {/* 3. Integrated Video Player Modal with Resume & Progress Tracking */}
      {activeVideoItem && (
        <VideoPlayerModal
          item={activeVideoItem}
          initialTime={videoResumeTime}
          onProgressUpdate={handleProgressUpdate}
          onClose={() => setActiveVideoItem(null)}
          onNext={() => {
            const currentIdx = MEDIA_CATALOG.findIndex((m) => m.id === activeVideoItem.id);
            const nextItem = MEDIA_CATALOG[(currentIdx + 1) % MEDIA_CATALOG.length];
            setVideoResumeTime(0);
            setActiveVideoItem(nextItem);
          }}
        />
      )}

      {/* 4. Integrated Persistent Bottom Audio Player Bar */}
      {currentMusicTrack && (
        <AudioPlayerBar
          currentTrack={currentMusicTrack}
          isPlaying={isMusicPlaying}
          onTogglePlay={() => setIsMusicPlaying(!isMusicPlaying)}
          onNextTrack={handleNextMusicTrack}
          onPrevTrack={handlePrevMusicTrack}
          onClosePlayer={() => {
            setIsMusicPlaying(false);
            setCurrentMusicTrack(null);
          }}
          isSaved={watchlist.includes(currentMusicTrack.id)}
          onToggleWatchlist={toggleWatchlist}
        />
      )}

      {/* 5. Media Details & Specs Modal (With Seasons, Episodes, Reviews Database, Downloads) */}
      {detailItem && (
        <MediaDetailsModal
          item={detailItem}
          currentUser={user}
          onClose={() => setDetailItem(null)}
          onPlay={handlePlayMedia}
          isSaved={watchlist.includes(detailItem.id)}
          onToggleWatchlist={toggleWatchlist}
          onDownload={handleDownload}
          isDownloaded={downloads.some((d) => d.mediaId === detailItem.id)}
          reviews={reviews}
          onAddReview={handleAddReview}
        />
      )}

      {/* 6. Account Login & Sign In Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={user}
        onLoginSuccess={(loggedUser, needsSubscriptionRedirect) => {
          setUser(loggedUser);
          if (needsSubscriptionRedirect) {
            setSubscriptionBlockMessage('Choose your plan to start streaming movies and music on VUDU.');
            setIsSubscriptionOpen(true);
          }
        }}
      />

      {/* 7. Subscription & Upgrade Modal (MTN MoMo, Airtel Money, Card) */}
      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => {
          setIsSubscriptionOpen(false);
          setSubscriptionBlockMessage('');
        }}
        currentUser={user}
        onSubscriptionSuccess={handleSubscriptionSuccess}
        requiredToStreamMessage={subscriptionBlockMessage}
      />

      {/* 8. Who's Watching? Profile Switcher Modal */}
      <WhoIsWatchingModal
        isOpen={isWhoIsWatchingOpen}
        onClose={() => setIsWhoIsWatchingOpen(false)}
        currentUser={user}
        onSelectProfile={handleSelectProfile}
      />

      {/* 9. Mobile Plan Device Restriction Modal */}
      {isMobileRestrictionOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121218] border border-amber-500/40 rounded-2xl p-6 shadow-2xl text-slate-100">
            <div className="flex items-center gap-2.5 text-amber-400 mb-3">
              <Laptop className="w-6 h-6 text-amber-400" />
              <h3 className="text-lg font-bold font-display text-white">
                Mobile Plan Device Restriction
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Your <strong>VUDU Mobile Plan ($2.99 / month)</strong> is strictly licensed for streaming on{' '}
              <strong>1 mobile phone or tablet</strong> at a time. Streaming on laptops, desktop computers, or Smart TVs is not supported on this plan.
            </p>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs space-y-1 mb-5">
              <div className="text-slate-400">Current Plan:</div>
              <div className="font-bold text-white">Mobile Plan ($2.99/mo) · Phone & Tablet Only</div>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setIsMobileRestrictionOpen(false);
                  setIsSubscriptionOpen(true);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
              >
                Upgrade to Standard ($7.99) or Premium ($9.99)
              </button>

              <button
                onClick={() => {
                  setIsMobileRestrictionOpen(false);
                  setSimulatedMobileMode(true);
                  if (pendingPlayItem) {
                    const { item, resumeTime, episodeTitle } = pendingPlayItem;
                    setPendingPlayItem(null);
                    handlePlayMedia(item, resumeTime, episodeTitle);
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-200 font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Smartphone className="w-3.5 h-3.5 text-cyan-300" />
                <span>Simulate Phone Screen (Test Mobile Playback)</span>
              </button>

              <button
                onClick={() => setIsMobileRestrictionOpen(false)}
                className="w-full py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#08080c] py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-violet-600/30 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-violet-400" />
            </div>
            <span className="font-display font-bold text-white">VUDU Streaming</span>
            <span className="text-slate-600">·</span>
            <span>No Free Streaming · Membership Required</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                setSubscriptionBlockMessage('');
                setIsSubscriptionOpen(true);
              }}
              className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>
                {user.subscription?.active
                  ? `Plan: ${user.subscription.planName} (${user.subscription.priceFormatted})`
                  : 'Subscribe with MTN / Airtel / Card'}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('downloads')}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Downloads ({downloads.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <History className="w-3.5 h-3.5" />
              <span>Watch Records</span>
            </button>
            <button
              onClick={() => setShowSplash(true)}
              className="flex items-center gap-1.5 text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replay Intro</span>
            </button>
            <span className="text-slate-700">·</span>
            <span>MTN MoMo</span>
            <span className="text-slate-700">·</span>
            <span>Airtel Money</span>
            <span className="text-slate-700">·</span>
            <span>Cards</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
