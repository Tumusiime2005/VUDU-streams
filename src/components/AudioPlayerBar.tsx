import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Maximize2,
  Minimize2,
  Music,
  ListMusic,
  X,
  Heart,
} from 'lucide-react';
import { MediaItem } from '../data/mediaData';
import { synthPlayer } from '../utils/audioEffects';

interface AudioPlayerBarProps {
  currentTrack: MediaItem | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onClosePlayer: () => void;
  isSaved: boolean;
  onToggleWatchlist: (id: string) => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onClosePlayer,
  isSaved,
  onToggleWatchlist,
}) => {
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [showLyricsModal, setShowLyricsModal] = useState(false);
  const [visualizerLevels, setVisualizerLevels] = useState<number[]>([15, 35, 60, 45, 80, 50, 65, 30, 75, 40]);

  const animationFrameRef = useRef<number | null>(null);

  // Sync synth player when playing or track changes
  useEffect(() => {
    if (!currentTrack) {
      synthPlayer.stop();
      return;
    }

    if (isPlaying) {
      synthPlayer.start(currentTrack.genres[0] || 'Electronic', isMuted ? 0 : volume);
    } else {
      synthPlayer.stop();
    }

    return () => {
      synthPlayer.stop();
    };
  }, [currentTrack, isPlaying]);

  // Volume synchronization
  useEffect(() => {
    synthPlayer.setVolume(isMuted ? 0 : volume);
  }, [volume, isMuted]);

  // Progress counter simulation & visualizer loop
  useEffect(() => {
    if (!isPlaying || !currentTrack) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 240) {
          if (isRepeat) return 0;
          onNextTrack();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    // Audio Visualizer frequency sampling
    const updateVisualizer = () => {
      const data = synthPlayer.getVisualizerData();
      if (data && data.length >= 10) {
        const levels = [];
        for (let i = 0; i < 10; i++) {
          levels.push(Math.max(12, Math.min(100, (data[i * 2] / 255) * 100)));
        }
        setVisualizerLevels(levels);
      } else {
        // Fallback procedural wave if audio context is quiet
        setVisualizerLevels((prev) =>
          prev.map(() => Math.floor(Math.random() * 65) + 20)
        );
      }
      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    };

    animationFrameRef.current = requestAnimationFrame(updateVisualizer);

    return () => {
      clearInterval(interval);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, currentTrack, isRepeat, onNextTrack]);

  if (!currentTrack) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const totalTrackSeconds = 240; // 4 mins standard

  return (
    <>
      {/* Bottom Sticky Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d0d12]/95 backdrop-blur-2xl border-t border-white/[0.08] shadow-[0_-10px_30px_rgba(0,0,0,0.5)] transition-all">
        
        {/* Top Slim Scrub Bar */}
        <div className="relative group/timeline w-full h-1 bg-white/10 cursor-pointer">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 relative transition-all"
            style={{ width: `${(progress / totalTrackSeconds) * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover/timeline:opacity-100 transition-opacity" />
          </div>
          <input
            type="range"
            min={0}
            max={totalTrackSeconds}
            value={progress}
            onChange={(e) => setProgress(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Left: Track Information & Album Art */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 max-w-[280px] sm:max-w-xs">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 bg-[#161622] border border-white/10 group cursor-pointer" onClick={() => setShowLyricsModal(true)}>
              <img
                src={currentTrack.posterUrl}
                alt={currentTrack.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Maximize2 className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-white truncate cursor-pointer hover:text-violet-300 transition-colors" onClick={() => setShowLyricsModal(true)}>
                  {currentTrack.title}
                </h4>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                {currentTrack.artist || 'VUDU Studio Artist'}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-violet-400 mt-0.5">
                <span className="font-mono">{currentTrack.badge}</span>
                <span>·</span>
                <span>{currentTrack.genres[0]}</span>
              </div>
            </div>

            {/* Like / Watchlist button */}
            <button
              onClick={() => onToggleWatchlist(currentTrack.id)}
              className="p-1.5 text-slate-400 hover:text-violet-400 transition-colors shrink-0 ml-1"
              title={isSaved ? 'Liked' : 'Like Track'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-violet-400 text-violet-400' : ''}`} />
            </button>
          </div>

          {/* Center: Playback Controls & Progress Bar */}
          <div className="flex flex-col items-center gap-1.5 max-w-md w-full">
            <div className="flex items-center gap-3 sm:gap-5">
              
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`p-1.5 transition-colors cursor-pointer hidden sm:block ${
                  isShuffle ? 'text-violet-400' : 'text-slate-400 hover:text-white'
                }`}
                title="Shuffle"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={onPrevTrack}
                className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Previous Track"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={onTogglePlay}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-violet-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-white" />
                ) : (
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                )}
              </button>

              <button
                onClick={onNextTrack}
                className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Next Track"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsRepeat(!isRepeat)}
                className={`p-1.5 transition-colors cursor-pointer hidden sm:block ${
                  isRepeat ? 'text-violet-400' : 'text-slate-400 hover:text-white'
                }`}
                title="Repeat"
              >
                <Repeat className="w-4 h-4" />
              </button>

            </div>

            {/* Time Indicators */}
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono tabular-nums text-slate-400">
              <span>{formatTime(progress)}</span>
              <span>/</span>
              <span>{formatTime(totalTrackSeconds)}</span>
            </div>
          </div>

          {/* Right: Audio Visualizer, Volume & Dismiss */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            
            {/* Live Audio Visualizer Bars */}
            <div
              onClick={() => setShowLyricsModal(true)}
              className="hidden lg:flex items-end gap-1 h-7 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] cursor-pointer hover:border-violet-500/30 transition-all"
              title="Open Stage Visualizer & Lyrics"
            >
              {visualizerLevels.map((lvl, idx) => (
                <div
                  key={idx}
                  className="w-1 bg-gradient-to-t from-violet-600 to-cyan-400 rounded-t-sm transition-all duration-100 ease-out"
                  style={{
                    height: isPlaying ? `${Math.max(15, lvl)}%` : '15%',
                    opacity: isPlaying ? 0.95 : 0.35,
                  }}
                />
              ))}
            </div>

            {/* Volume Control */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.02}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-16 lg:w-20 h-1 bg-white/20 rounded-lg cursor-pointer accent-violet-400"
              />
            </div>

            {/* Stage / Lyrics Modal Toggle */}
            <button
              onClick={() => setShowLyricsModal(true)}
              className="p-2 text-slate-400 hover:text-violet-300 transition-colors cursor-pointer"
              title="Lyrics & Visualizer"
            >
              <ListMusic className="w-4 h-4" />
            </button>

            {/* Close Audio Player */}
            <button
              onClick={onClosePlayer}
              className="p-1.5 text-slate-500 hover:text-white transition-colors cursor-pointer"
              title="Close Player"
            >
              <X className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>

      {/* Expanded Full-Screen Visualizer & Lyrics Modal */}
      {showLyricsModal && (
        <div className="fixed inset-0 z-50 bg-[#08080c]/98 backdrop-blur-3xl flex flex-col p-6 sm:p-10 select-none overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-600/30 flex items-center justify-center">
                <Music className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-violet-400 tracking-wider">
                  VUDU Soundstage & Lyrics
                </span>
                <h2 className="text-xl font-black text-white font-display">{currentTrack.title}</h2>
              </div>
            </div>

            <button
              onClick={() => setShowLyricsModal(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Split View (Cover + Stage Visualizer on left, Synced Lyrics on right) */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-8 overflow-y-auto">
            
            {/* Left: Huge Artwork + Frequency Stage */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden shadow-2xl shadow-violet-600/30 border border-white/10 mb-6">
                <img
                  src={currentTrack.posterUrl}
                  alt={currentTrack.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-2xl font-black text-white font-display">{currentTrack.title}</h3>
              <p className="text-sm text-slate-400 mt-1">{currentTrack.artist || 'VUDU Studio Artist'}</p>
              <p className="text-xs text-violet-400/90 font-mono mt-1">{currentTrack.badge} · Dolby Atmos 24-bit</p>

              {/* Large Soundstage Visualizer */}
              <div className="flex items-end justify-center gap-1.5 h-16 w-full max-w-sm mt-6">
                {visualizerLevels.map((lvl, idx) => (
                  <div
                    key={idx}
                    className="w-2.5 bg-gradient-to-t from-violet-600 via-indigo-400 to-cyan-300 rounded-t-md transition-all duration-75"
                    style={{
                      height: isPlaying ? `${Math.max(10, lvl)}%` : '10%',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Right: Real-Time Synced Lyrics */}
            <div className="flex flex-col justify-center space-y-6 sm:space-y-8 px-4 sm:px-8">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Interactive Lyrics & Vocals
              </div>

              {(currentTrack.lyrics && currentTrack.lyrics.length > 0
                ? currentTrack.lyrics
                : [
                    'Neon lights flashing across the skyline',
                    'Every beat syncs directly with your heartbeat',
                    'Electric frequencies reverberate through the floor',
                    'Lossless master stream from the VUDU sound lab',
                    'Infinite music across every dimension...'
                  ]
              ).map((line, idx) => (
                <p
                  key={idx}
                  className={`text-xl sm:text-2xl lg:text-3xl font-bold font-display transition-all duration-300 ${
                    idx === Math.floor((progress / 6) % (currentTrack.lyrics?.length || 5))
                      ? 'text-white scale-102 translate-x-2 text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-white to-cyan-300 drop-shadow-[0_0_20px_rgba(139,92,246,0.6)]'
                      : 'text-slate-600 hover:text-slate-400 cursor-pointer'
                  }`}
                >
                  {line}
                </p>
              ))}
            </div>

          </div>

          {/* Footer Navigation within Lyrics Modal */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onTogglePlay}
                className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs flex items-center gap-2 transition-all"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isPlaying ? 'Pause' : 'Resume'}</span>
              </button>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              {formatTime(progress)} / {formatTime(totalTrackSeconds)}
            </div>
          </div>

        </div>
      )}
    </>
  );
};
