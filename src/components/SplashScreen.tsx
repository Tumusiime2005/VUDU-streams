import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap } from 'lucide-react';
import { playThunderboltSound } from '../utils/audioEffects';

interface SplashScreenProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, onSkip }) => {
  const [typedText, setTypedText] = useState<string>('');
  const [isTypingComplete, setIsTypingComplete] = useState<boolean>(false);
  const [isLightningActive, setIsLightningActive] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const audioTriggeredRef = useRef(false);

  // VUDU characters
  const targetWord = 'VUDU';

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      currentIndex++;
      setTypedText(targetWord.slice(0, currentIndex));

      if (currentIndex >= targetWord.length) {
        clearInterval(typingInterval);
        setIsTypingComplete(true);
      }
    }, 240);

    return () => clearInterval(typingInterval);
  }, []);

  // When typing completes, trigger Thunderbolt Audio & Visual Flash
  useEffect(() => {
    if (!isTypingComplete || audioTriggeredRef.current) return;
    audioTriggeredRef.current = true;

    // 1. Thunderbolt Audio
    playThunderboltSound();

    // Also attempt optional thunder sound if audio file present
    try {
      const thunderAudio = new Audio('/sounds/thunder.mp3');
      thunderAudio.volume = 0.85;
      thunderAudio.play().catch(() => {
        // Handled silently by our reliable Web Audio synthesized thunderclap
      });
    } catch {
      // Handled by Web Audio
    }

    // 2. Visual Lightning Flash trigger
    setIsLightningActive(true);

    const flashTimer = setTimeout(() => {
      setIsLightningActive(false);
    }, 650);

    // 3. Transition: seamlessly fade out after 1.5 seconds
    const transitionTimer = setTimeout(() => {
      setIsFadingOut(true);
      const finishTimer = setTimeout(() => {
        onComplete();
      }, 700); // Allow fade animation to complete smoothly
      return () => clearTimeout(finishTimer);
    }, 1500);

    return () => {
      clearTimeout(flashTimer);
      clearTimeout(transitionTimer);
    };
  }, [isTypingComplete, onComplete]);

  return (
    <AnimatePresence>
      {!isFadingOut && (
        <motion.div
          key="vudu-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#07070a] select-none overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="VUDU Loading Experience"
        >
          {/* Ambient Dark Neon Gradients */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-violet-900/20 via-purple-600/15 to-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px]" />
          </div>

          {/* Lightning Flash Overlay */}
          {isLightningActive && (
            <div
              className="absolute inset-0 z-20 pointer-events-none animate-lightning bg-gradient-to-b from-white/95 via-violet-200/80 to-purple-500/30 mix-blend-screen"
              style={{
                boxShadow: 'inset 0 0 120px 40px rgba(168, 85, 247, 0.9)',
              }}
            />
          )}

          {/* Brand Logo & Typing Container */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Electric Bolt Icon Accent */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: isTypingComplete ? [1, 1.25, 1] : 1,
                opacity: 1,
              }}
              transition={{ duration: 0.4 }}
              className="mb-4 relative"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 p-0.5 shadow-lg shadow-purple-500/30">
                <div className="w-full h-full bg-[#0d0d12] rounded-[14px] flex items-center justify-center">
                  <Zap
                    className={`w-7 h-7 transition-colors duration-200 ${
                      isLightningActive ? 'text-white fill-white' : 'text-violet-400 fill-violet-400'
                    }`}
                  />
                </div>
              </div>
              {isLightningActive && (
                <div className="absolute inset-0 bg-violet-400 rounded-2xl blur-md opacity-80 animate-ping" />
              )}
            </motion.div>

            {/* Typing letters: V... U... D... U */}
            <div className="flex items-center justify-center text-7xl sm:text-8xl md:text-9xl font-black tracking-widest font-display text-white">
              <span
                className={`bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-200 to-white transition-all duration-300 ${
                  isTypingComplete ? 'neon-glow' : ''
                }`}
                style={{
                  textShadow: isLightningActive
                    ? '0 0 40px rgba(255,255,255,0.9), 0 0 80px rgba(139,92,246,0.9)'
                    : '0 0 24px rgba(124,58,237,0.5)',
                }}
              >
                {typedText}
              </span>

              {/* Blinking glowing cursor */}
              {!isTypingComplete && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                  className="inline-block w-2 sm:w-3 md:w-3.5 h-[0.85em] ml-1 bg-violet-400 rounded-sm shadow-[0_0_12px_#a855f7]"
                />
              )}
            </div>

            {/* Cinematic Subtitle & Electric State */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isTypingComplete ? 1 : 0.4, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mt-6 text-xs sm:text-sm tracking-[0.28em] uppercase text-violet-300/80 font-medium"
            >
              Cinema · Animation · Sound
            </motion.p>
          </div>

          {/* Skip CTA */}
          <button
            onClick={() => {
              if (onSkip) onSkip();
              else onComplete();
            }}
            className="absolute bottom-8 text-xs text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest px-4 py-2 rounded-full border border-white/5 hover:border-white/15 bg-white/[0.02]"
          >
            Skip Intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
