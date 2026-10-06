import React from 'react';
import { X, Plus, Check, ShieldCheck, User, Sparkles } from 'lucide-react';
import { UserAccount, UserProfileSlot } from '../types/userAndHistory';

interface WhoIsWatchingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onSelectProfile: (profile: UserProfileSlot) => void;
}

export const WhoIsWatchingModal: React.FC<WhoIsWatchingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectProfile,
}) => {
  if (!isOpen) return null;

  const defaultProfiles: UserProfileSlot[] = currentUser.profiles && currentUser.profiles.length > 0
    ? currentUser.profiles
    : [
        {
          id: 'prof-1',
          name: currentUser.name || 'Marvin',
          avatarBg: 'from-violet-600 to-indigo-600',
          isKids: false,
        },
        {
          id: 'prof-2',
          name: 'Sarah',
          avatarBg: 'from-cyan-500 to-blue-600',
          isKids: false,
        },
        {
          id: 'prof-3',
          name: 'Kids',
          avatarBg: 'from-amber-400 to-emerald-500',
          isKids: true,
        },
        {
          id: 'prof-4',
          name: 'Alex',
          avatarBg: 'from-rose-500 to-purple-600',
          isKids: false,
        },
      ];

  const activeId = currentUser.activeProfileId || defaultProfiles[0].id;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#08080c]/95 backdrop-blur-2xl flex items-center justify-center p-4 select-none animate-in fade-in zoom-in-95 duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-3xl sm:text-5xl font-black font-display text-white mb-2">
          Who&apos;s Watching?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mb-8 sm:mb-12">
          Select your profile to continue with your personalised recommendations, watchlist, and watch records.
        </p>

        {/* Profiles Grid */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
          {defaultProfiles.map((prof) => {
            const isActive = prof.id === activeId;

            return (
              <div
                key={prof.id}
                onClick={() => {
                  onSelectProfile(prof);
                  onClose();
                }}
                className="group flex flex-col items-center gap-3 cursor-pointer"
              >
                <div
                  className={`relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr ${prof.avatarBg} p-1 shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:ring-4 group-hover:ring-violet-400 ${
                    isActive ? 'ring-2 ring-white scale-102' : ''
                  }`}
                >
                  <div className="w-full h-full bg-[#12121a]/60 backdrop-blur-xs rounded-[14px] flex flex-col items-center justify-center text-white font-display font-black text-2xl sm:text-3xl">
                    {prof.isKids ? '🐣' : prof.name.charAt(0)}
                  </div>

                  {prof.isKids && (
                    <div className="absolute -bottom-2 -right-2 px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow">
                      Kids
                    </div>
                  )}

                  {isActive && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>

                <span className="text-xs sm:text-sm font-bold text-slate-300 group-hover:text-white transition-colors">
                  {prof.name}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.08] flex items-center justify-center gap-4 text-xs text-slate-400">
          <span>Active Plan: <strong className="text-white">{currentUser.subscription?.planName || 'Premium'}</strong></span>
          <span>·</span>
          <span>Up to 4 Simultaneous Household Screens</span>
        </div>
      </div>
    </div>
  );
};
