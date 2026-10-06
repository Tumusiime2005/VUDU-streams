import React, { useState } from 'react';
import {
  Search,
  X,
  Zap,
  Film,
  Music,
  Tv,
  Bookmark,
  History,
  Download,
  SlidersHorizontal,
  User,
  RefreshCw,
  Crown,
  LogIn,
  LogOut,
  CreditCard,
  Check,
  Users,
} from 'lucide-react';
import { GENRE_LIST } from '../data/mediaData';
import { UserAccount } from '../types/userAndHistory';

export type NavTabType = 'all' | 'movie' | 'cartoon' | 'music' | 'watchlist' | 'history' | 'downloads';

interface NavbarProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  watchlistCount: number;
  historyCount: number;
  downloadsCount: number;
  user: UserAccount;
  onOpenAuth: () => void;
  onOpenSubscription: () => void;
  onLogout: () => void;
  onReplaySplash: () => void;
  onOpenWhoIsWatching?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  selectedGenre,
  setSelectedGenre,
  watchlistCount,
  historyCount,
  downloadsCount,
  user,
  onOpenAuth,
  onOpenSubscription,
  onLogout,
  onReplaySplash,
  onOpenWhoIsWatching,
}) => {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showGenreMenu, setShowGenreMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0b0b0e]/85 border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setActiveTab('all');
              setSelectedGenre('All Genres');
              setSearchQuery('');
            }}
            className="group flex items-center gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-lg p-1 cursor-pointer"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 p-0.5 shadow-md shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all">
              <div className="w-full h-full bg-[#0d0d14] rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-violet-400 group-hover:text-cyan-300 transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl sm:text-2xl tracking-wider text-white bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-200 to-white">
                VUDU
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Filter Tabs (No top pills, clean nav links) */}
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('movie')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'movie'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Movies</span>
          </button>
          <button
            onClick={() => setActiveTab('cartoon')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'cartoon'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Cartoons</span>
          </button>
          <button
            onClick={() => setActiveTab('music')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'music'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Music</span>
          </button>

          {/* Downloads / Offline Tab */}
          <button
            onClick={() => setActiveTab('downloads')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'downloads'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Downloads</span>
            {downloadsCount > 0 && (
              <span className="px-1.5 py-0.2 bg-emerald-500/30 text-emerald-300 text-[10px] font-bold rounded-full">
                {downloadsCount}
              </span>
            )}
          </button>

          {/* Watch History & Record Tab */}
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <History className="w-3.5 h-3.5 text-violet-400" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 bg-violet-500/30 text-violet-200 text-[10px] font-bold rounded-full">
                {historyCount}
              </span>
            )}
          </button>

          {/* Watchlist Tab */}
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'watchlist'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Watchlist</span>
            {watchlistCount > 0 && (
              <span className="px-1.5 py-0.2 bg-violet-500/30 text-violet-200 text-[10px] font-bold rounded-full">
                {watchlistCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Search, Genre Dropdown Selector, Subscription & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Dynamic Search Box */}
          <div className="relative flex items-center">
            <div
              className={`flex items-center transition-all duration-300 rounded-xl bg-white/[0.05] border border-white/[0.08] focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500 ${
                showSearchInput
                  ? 'w-44 sm:w-60 px-3 py-1.5'
                  : 'w-9 sm:w-10 h-9 sm:h-10 justify-center cursor-pointer hover:bg-white/[0.08]'
              }`}
              onClick={() => {
                if (!showSearchInput) setShowSearchInput(true);
              }}
            >
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              {showSearchInput ? (
                <>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search titles..."
                    className="w-full bg-transparent px-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchQuery('');
                      }}
                      className="p-1 hover:text-white text-slate-400 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSearchInput(false);
                      setSearchQuery('');
                    }}
                    className="ml-1 text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    Esc
                  </button>
                </>
              ) : null}
            </div>
          </div>

          {/* GENRE DROPDOWN SELECTOR (Provides dropdown list of all available genres, not top pills) */}
          <div className="relative">
            <button
              onClick={() => setShowGenreMenu(!showGenreMenu)}
              className={`flex items-center gap-1.5 h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                selectedGenre !== 'All Genres'
                  ? 'bg-violet-600/30 border-violet-500 text-violet-300'
                  : 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:bg-white/[0.08]'
              }`}
              title="Select Genre from Dropdown"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-violet-400" />
              <span className="max-w-[85px] truncate">
                {selectedGenre === 'All Genres' ? 'Genres' : selectedGenre}
              </span>
            </button>

            {/* Dropdown Menu of all available genres */}
            {showGenreMenu && (
              <div
                className="absolute right-0 mt-2 w-52 py-2 bg-[#121218] border border-white/[0.1] rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setShowGenreMenu(false)}
              >
                <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-white/[0.06] flex items-center justify-between">
                  <span>Available Genres</span>
                  {selectedGenre !== 'All Genres' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGenre('All Genres');
                        setShowGenreMenu(false);
                      }}
                      className="text-[10px] text-violet-400 hover:text-violet-300"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto hide-scrollbar py-1">
                  {GENRE_LIST.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        selectedGenre === genre
                          ? 'bg-violet-600/30 text-violet-300 font-semibold'
                          : 'text-slate-300 hover:bg-white/[0.05]'
                      }`}
                    >
                      <span>{genre}</span>
                      {selectedGenre === genre && <Check className="w-3.5 h-3.5 text-violet-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Subscription Action Button */}
          <button
            onClick={onOpenSubscription}
            className={`hidden sm:flex items-center gap-1.5 h-9 sm:h-10 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              user.subscription?.active
                ? 'bg-gradient-to-r from-violet-600/20 to-indigo-600/20 hover:from-violet-600/30 hover:to-indigo-600/30 border-violet-500/30 text-violet-200'
                : 'bg-gradient-to-r from-amber-600 to-violet-600 text-white border-amber-400 shadow-md shadow-amber-600/20 animate-pulse'
            }`}
            title="Subscription & Membership"
          >
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            <span className="uppercase tracking-wider font-mono text-[11px] font-bold">
              {user.subscription?.active ? `${user.subscription.planName} Plan` : 'Subscribe'}
            </span>
          </button>

          {/* User Sign In / Profile Avatar */}
          <div className="relative">
            {user.isLoggedIn ? (
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 h-9 sm:h-10 px-2.5 rounded-xl bg-gradient-to-tr from-violet-600/30 to-indigo-600/30 border border-violet-500/30 hover:border-violet-400 transition-all cursor-pointer focus:outline-none"
                title="Account Menu"
              >
                <div className="w-6 h-6 rounded-lg bg-violet-600/50 flex items-center justify-center text-xs font-bold text-white uppercase">
                  {user.name.charAt(0)}
                </div>
                <span className="text-xs font-semibold text-slate-200 max-w-[75px] truncate hidden md:inline">
                  {user.name}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 h-9 sm:h-10 px-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md shadow-violet-600/30 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Profile Menu Dropdown */}
            {showProfileMenu && user.isLoggedIn && (
              <div
                className="absolute right-0 mt-2 w-72 py-2 bg-[#13131a] border border-white/[0.1] rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setShowProfileMenu(false)}
              >
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <span
                      className={`px-1.5 py-0.5 rounded font-mono text-[9px] uppercase font-bold ${
                        user.subscription?.active
                          ? 'bg-violet-600/30 text-violet-300'
                          : 'bg-red-950 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {user.subscription?.active ? `${user.subscription.planName} Plan` : 'No Subscription'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.email}</p>

                  {user.subscription?.active && (
                    <div className="mt-2 pt-2 border-t border-white/[0.04] text-[10px] text-slate-400 space-y-0.5">
                      <div>
                        Paid with:{' '}
                        <span className="text-white font-medium uppercase">
                          {user.subscription.paymentMethod === 'mtn'
                            ? 'MTN Mobile Money'
                            : user.subscription.paymentMethod === 'airtel'
                            ? 'Airtel Money'
                            : 'Card'}
                        </span>
                      </div>
                      <div className="text-violet-300 truncate">
                        {user.subscription.paymentIdentifier}
                      </div>
                    </div>
                  )}
                </div>

                <div className="py-1 text-xs">
                  <button
                    onClick={() => setActiveTab('downloads')}
                    className="w-full text-left px-4 py-2 text-slate-300 hover:bg-white/[0.06] flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Offline Downloads ({downloadsCount})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('history')}
                    className="w-full text-left px-4 py-2 text-slate-300 hover:bg-white/[0.06] flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5 text-violet-400" />
                    <span>Watch Records & History ({historyCount})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('watchlist')}
                    className="w-full text-left px-4 py-2 text-slate-300 hover:bg-white/[0.06] flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-violet-400" />
                    <span>My Watchlist ({watchlistCount})</span>
                  </button>

                  {onOpenWhoIsWatching && (
                    <button
                      onClick={onOpenWhoIsWatching}
                      className="w-full text-left px-4 py-2 text-slate-300 hover:bg-white/[0.06] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Switch Profile (Who&apos;s Watching?)</span>
                    </button>
                  )}

                  <button
                    onClick={onOpenSubscription}
                    className="w-full text-left px-4 py-2 text-slate-300 hover:bg-white/[0.06] flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-violet-400" />
                    <span>{user.subscription?.active ? 'Manage Subscription' : 'Subscribe to VUDU'}</span>
                  </button>

                  <button
                    onClick={onReplaySplash}
                    className="w-full text-left px-4 py-2 text-slate-300 hover:bg-white/[0.06] flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-violet-400" />
                    <span>Replay VUDU Intro Splash</span>
                  </button>

                  <div className="border-t border-white/[0.06] mt-1 pt-1">
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-950/30 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center gap-1 px-3 py-2 border-t border-white/[0.05] bg-[#0c0c10]/95 overflow-x-auto hide-scrollbar text-xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1 font-medium rounded-lg shrink-0 ${
            activeTab === 'all' ? 'text-violet-400 font-bold' : 'text-slate-400'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab('movie')}
          className={`px-3 py-1 font-medium rounded-lg shrink-0 ${
            activeTab === 'movie' ? 'text-violet-400 font-bold' : 'text-slate-400'
          }`}
        >
          Movies
        </button>
        <button
          onClick={() => setActiveTab('cartoon')}
          className={`px-3 py-1 font-medium rounded-lg shrink-0 ${
            activeTab === 'cartoon' ? 'text-violet-400 font-bold' : 'text-slate-400'
          }`}
        >
          Cartoons
        </button>
        <button
          onClick={() => setActiveTab('music')}
          className={`px-3 py-1 font-medium rounded-lg shrink-0 ${
            activeTab === 'music' ? 'text-violet-400 font-bold' : 'text-slate-400'
          }`}
        >
          Music
        </button>
        <button
          onClick={() => setActiveTab('downloads')}
          className={`px-3 py-1 font-medium rounded-lg shrink-0 ${
            activeTab === 'downloads' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          Downloads ({downloadsCount})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-3 py-1 font-medium rounded-lg shrink-0 ${
            activeTab === 'history' ? 'text-violet-400 font-bold' : 'text-slate-400'
          }`}
        >
          History ({historyCount})
        </button>
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`px-3 py-1 font-medium rounded-lg shrink-0 ${
            activeTab === 'watchlist' ? 'text-violet-400 font-bold' : 'text-slate-400'
          }`}
        >
          Watchlist ({watchlistCount})
        </button>
      </div>
    </header>
  );
};
