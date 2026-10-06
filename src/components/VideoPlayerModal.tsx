import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  X,
  RotateCcw,
  RotateCw,
  Settings,
  Sparkles,
  Subtitles,
  PictureInPicture,
  FastForward,
  Lock,
  Unlock,
  Radio,
  Layers,
  Check,
} from 'lucide-react';
import { MediaItem } from '../data/mediaData';

interface VideoPlayerModalProps {
  item: MediaItem;
  onClose: () => void;
  onNext?: () => void;
  initialTime?: number;
  onProgressUpdate?: (currentTime: number, duration: number) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  item,
  onClose,
  onNext,
  initialTime = 0,
  onProgressUpdate,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState('4K Ultra HD');
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showAudioSubtitleMenu, setShowAudioSubtitleMenu] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [selectedAudioTrack, setSelectedAudioTrack] = useState('English [Original]');
  const [selectedSubtitle, setSelectedSubtitle] = useState('English [CC]');
  const [spatialAudioEnabled, setSpatialAudioEnabled] = useState(true);
  const [isScreenLocked, setIsScreenLocked] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hasResumedAlert, setHasResumedAlert] = useState(Boolean(initialTime && initialTime > 5));
  const hideControlsTimerRef = useRef<number | null>(null);

  // Auto-play on mount & seek to initialTime
  useEffect(() => {
    if (videoRef.current) {
      if (initialTime > 0) {
        videoRef.current.currentTime = initialTime;
      }
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }

    if (initialTime && initialTime > 5) {
      const alertTimer = setTimeout(() => setHasResumedAlert(false), 3500);
      return () => clearTimeout(alertTimer);
    }
  }, [item, initialTime]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScreenLocked) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'ArrowLeft') {
        skipTime(-10);
      } else if (e.key === 'ArrowRight') {
        skipTime(10);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted, isScreenLocked]);

  // Activity timer to auto-hide controls
  const handleMouseMove = () => {
    if (isScreenLocked) return;
    setShowControls(true);
    if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    if (isPlaying) {
      hideControlsTimerRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3500);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
      setIsMuted(newVol === 0);
    }
  };

  const handleSeek = (newTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    }
  };

  // Skip Intro feature (VUDU standard)
  const handleSkipIntro = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 45);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const togglePiP = async () => {
    if (videoRef.current && document.pictureInPictureEnabled) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
        }
      } catch (err) {
        console.warn('PiP not available', err);
      }
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettingsMenu(false);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const videoSource = item.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';

  const showSkipIntroButton = currentTime >= 2 && currentTime <= 38;
  const isNearEnd = duration > 20 && duration - currentTime <= 12;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden"
      role="dialog"
      aria-label={`Playing ${item.title}`}
    >
      {/* Video Stream Element */}
      <video
        ref={videoRef}
        src={videoSource}
        poster={item.backdropUrl}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        playsInline
        onTimeUpdate={() => {
          if (videoRef.current) {
            const cur = videoRef.current.currentTime;
            setCurrentTime(cur);
            if (onProgressUpdate && videoRef.current.duration) {
              onProgressUpdate(cur, videoRef.current.duration);
            }
          }
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
            if (initialTime > 0) {
              videoRef.current.currentTime = initialTime;
            }
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          if (onProgressUpdate && duration) {
            onProgressUpdate(duration, duration);
          }
          if (onNext) onNext();
        }}
      />

      {/* Screen Lock Toggle Watermark (When locked) */}
      {isScreenLocked && (
        <button
          onClick={() => setIsScreenLocked(false)}
          className="absolute top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-black/80 border border-violet-400/60 text-white text-xs font-bold flex items-center gap-2 backdrop-blur-md cursor-pointer hover:bg-black/90 shadow-2xl"
        >
          <Lock className="w-4 h-4 text-violet-400" />
          <span>Screen Locked · Click to Unlock Controls</span>
        </button>
      )}

      {/* Resumed playback notification */}
      {hasResumedAlert && !isScreenLocked && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-xl bg-violet-900/90 border border-violet-400 text-white text-xs font-semibold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>Resumed playback from {formatTime(initialTime)}</span>
        </div>
      )}

      {/* VUDU SKIP INTRO BUTTON */}
      {showSkipIntroButton && !isScreenLocked && (
        <button
          onClick={handleSkipIntro}
          className="absolute bottom-24 right-6 sm:right-10 z-40 px-4 py-2 rounded-lg bg-black/80 hover:bg-white/20 border border-white/40 text-white text-xs font-bold tracking-wider uppercase backdrop-blur-md shadow-2xl transition-all cursor-pointer flex items-center gap-2 hover:scale-105"
        >
          <FastForward className="w-4 h-4 text-violet-400" />
          <span>Skip Intro</span>
        </button>
      )}

      {/* NEXT EPISODE COUNTDOWN OVERLAY */}
      {isNearEnd && onNext && !isScreenLocked && (
        <div className="absolute bottom-24 right-6 sm:right-10 z-40 p-4 rounded-2xl bg-black/90 border border-violet-500/40 text-white text-xs shadow-2xl backdrop-blur-md flex flex-col gap-2 animate-in slide-in-from-bottom-4">
          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            Up Next in {Math.max(1, Math.floor(duration - currentTime))}s
          </div>
          <button
            onClick={onNext}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Play Next Episode Now</span>
          </button>
        </div>
      )}

      {/* Simulated Subtitles */}
      {subtitlesEnabled && isPlaying && currentTime > 2 && (
        <div className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/75 rounded-md text-white text-xs sm:text-base font-medium tracking-wide shadow-lg pointer-events-none text-center max-w-xl">
          {currentTime < 6
            ? `[VUDU Spatial Audio 7.1.4: ${item.title}]`
            : `[Dialogue: ${selectedAudioTrack} · Subtitles: ${selectedSubtitle}]`}
        </div>
      )}

      {/* Top Header Overlay with Close Button */}
      {!isScreenLocked && (
        <div
          className={`absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-violet-400 tracking-wider">
                  VUDU Cinema · {item.type}
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-violet-600/30 text-violet-300 font-mono text-[10px]">
                  {selectedQuality}
                </span>
                {spatialAudioEnabled && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] flex items-center gap-1">
                    <Radio className="w-3 h-3 text-cyan-300" />
                    <span>Spatial Audio</span>
                  </span>
                )}
              </div>
              <h1 className="text-lg sm:text-2xl font-black text-white font-display tracking-tight">
                {item.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Lock Screen Button */}
            <button
              onClick={() => setIsScreenLocked(true)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white backdrop-blur-md transition-colors cursor-pointer"
              title="Lock Screen"
            >
              <Lock className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors cursor-pointer"
              title="Close Player (Esc)"
              aria-label="Close Player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Controls Overlay */}
      {!isScreenLocked && (
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Timeline Slider */}
          <div className="relative group/timeline flex items-center mb-3">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/20 hover:h-2.5 rounded-lg appearance-none cursor-pointer transition-all accent-violet-500"
            />
          </div>

          {/* Control Bar Actions */}
          <div className="flex items-center justify-between text-white">
            {/* Left Controls: Play/Pause, Replay/Skip, Volume, Time */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={togglePlay}
                className="p-2 rounded-full hover:bg-white/15 text-white transition-colors cursor-pointer"
                title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
              </button>

              <button
                onClick={() => skipTime(-10)}
                className="p-2 rounded-full hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Rewind 10s"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => skipTime(10)}
                className="p-2 rounded-full hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Fast Forward 10s"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Volume Control */}
              <div className="flex items-center gap-1.5 group/vol">
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-full hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
                </button>

                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-16 sm:w-24 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-violet-400"
                />
              </div>

              {/* Time Stamp */}
              <div className="text-xs text-slate-300 font-mono tabular-nums ml-1">
                <span>{formatTime(currentTime)}</span>
                <span className="text-slate-600 mx-1">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Spatial Audio Toggle */}
              <button
                onClick={() => setSpatialAudioEnabled(!spatialAudioEnabled)}
                className={`p-2 rounded-lg transition-colors cursor-pointer hidden md:flex items-center gap-1 text-xs font-semibold ${
                  spatialAudioEnabled ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                }`}
                title="VUDU Spatial Audio (3D Binaural)"
              >
                <Radio className="w-4 h-4" />
                <span className="hidden lg:inline">Spatial Audio</span>
              </button>

              {/* Audio & Subtitles Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowAudioSubtitleMenu(!showAudioSubtitleMenu)}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    showAudioSubtitleMenu ? 'text-violet-400 bg-white/10' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Audio & Subtitles"
                >
                  <Subtitles className="w-4 h-4" />
                </button>

                {showAudioSubtitleMenu && (
                  <div className="absolute right-0 bottom-12 w-64 py-3 bg-[#121218] border border-white/15 rounded-xl shadow-2xl z-50 text-xs">
                    <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/10">
                      Audio Stream
                    </div>
                    {['English [Original]', 'Spanish [Dubbed]', 'French [Dubbed]', 'Japanese [Original]'].map((audio) => (
                      <button
                        key={audio}
                        onClick={() => {
                          setSelectedAudioTrack(audio);
                        }}
                        className={`w-full text-left px-4 py-1.5 flex items-center justify-between transition-colors ${
                          selectedAudioTrack === audio ? 'text-violet-300 font-bold bg-violet-600/20' : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span>{audio}</span>
                        {selectedAudioTrack === audio && <Check className="w-3.5 h-3.5 text-violet-400" />}
                      </button>
                    ))}

                    <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-t border-white/10 mt-2">
                      Subtitles
                    </div>
                    {['Off', 'English [CC]', 'Spanish', 'French'].map((sub) => (
                      <button
                        key={sub}
                        onClick={() => {
                          setSelectedSubtitle(sub);
                          setSubtitlesEnabled(sub !== 'Off');
                        }}
                        className={`w-full text-left px-4 py-1.5 flex items-center justify-between transition-colors ${
                          selectedSubtitle === sub ? 'text-violet-300 font-bold bg-violet-600/20' : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span>{sub}</span>
                        {selectedSubtitle === sub && <Check className="w-3.5 h-3.5 text-violet-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* PiP */}
              <button
                onClick={togglePiP}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer hidden sm:block"
                title="Picture in Picture"
              >
                <PictureInPicture className="w-4 h-4" />
              </button>

              {/* Settings Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    showSettingsMenu ? 'bg-white/15 text-violet-400' : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                  title="Quality & Playback Speed"
                >
                  <Settings className="w-4 h-4" />
                </button>

                {showSettingsMenu && (
                  <div className="absolute right-0 bottom-12 w-52 py-2 bg-[#121218] border border-white/15 rounded-xl shadow-2xl z-50 text-xs">
                    <div className="px-3 py-1 font-semibold uppercase tracking-wider text-slate-400 border-b border-white/10 text-[10px]">
                      Video Resolution
                    </div>
                    {['4K Ultra HD', '1080p FHD', '720p HD', '480p SD'].map((quality) => (
                      <button
                        key={quality}
                        onClick={() => {
                          setSelectedQuality(quality);
                          setShowSettingsMenu(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 flex items-center justify-between transition-colors ${
                          selectedQuality === quality ? 'bg-violet-600/30 text-violet-300 font-bold' : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span>{quality}</span>
                        {selectedQuality === quality && <Sparkles className="w-3 h-3 text-violet-400" />}
                      </button>
                    ))}

                    <div className="px-3 py-1 font-semibold uppercase tracking-wider text-slate-400 border-b border-t border-white/10 text-[10px] mt-2">
                      Speed
                    </div>
                    {[0.5, 0.75, 1, 1.25, 1.5].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={`w-full text-left px-3 py-1.5 flex items-center justify-between transition-colors ${
                          playbackSpeed === speed ? 'bg-violet-600/30 text-violet-300 font-bold' : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span>{speed === 1 ? 'Normal (1x)' : `${speed}x`}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
