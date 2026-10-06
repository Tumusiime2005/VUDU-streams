import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Zap, ShieldCheck } from 'lucide-react';
import { UserAccount, SubscriptionPlanId, SubscriptionDetails } from '../types/userAndHistory';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onLoginSuccess: (user: UserAccount, needsSubscriptionRedirect?: boolean) => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  initialMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must contain at least 4 characters.');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // New registered user starts without a subscription, requiring payment setup
      const newUser: UserAccount = {
        id: 'usr_' + Date.now(),
        name: mode === 'signup' ? name.trim() : email.split('@')[0],
        email: email.trim(),
        avatarUrl: '',
        subscription: null,
        isLoggedIn: true,
      };

      onLoginSuccess(newUser, true);
      onClose();
    }, 600);
  };

  // Quick Demo Profiles for instant testing
  const handleQuickLogin = (
    demoName: string,
    demoEmail: string,
    demoPlanId: SubscriptionPlanId | null,
    paymentMethod: 'mtn' | 'airtel' | 'card' = 'mtn'
  ) => {
    let sub: SubscriptionDetails | null = null;
    if (demoPlanId) {
      const planPrices = {
        mobile: '$2.99 / month',
        basic: '$3.99 / month',
        standard: '$7.99 / month',
        premium: '$9.99 / month',
      };
      sub = {
        planId: demoPlanId,
        planName: demoPlanId.charAt(0).toUpperCase() + demoPlanId.slice(1),
        priceFormatted: planPrices[demoPlanId],
        paymentMethod,
        paymentIdentifier:
          paymentMethod === 'mtn'
            ? 'MTN MoMo (+256 772 849 321)'
            : paymentMethod === 'airtel'
            ? 'Airtel Money (+256 752 987 654)'
            : 'Card ending in 4242',
        subscribedAt: 'Oct 1, 2026',
        nextBillingDate: 'Nov 1, 2026',
        transactionReference: `DEMO-${paymentMethod.toUpperCase()}-749201`,
        active: true,
      };
    }

    const user: UserAccount = {
      id: 'demo_' + (demoPlanId || 'unsubscribed'),
      name: demoName,
      email: demoEmail,
      avatarUrl: '',
      subscription: sub,
      isLoggedIn: true,
    };
    onLoginSuccess(user, demoPlanId === null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#111118] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-violet-950/50 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 p-0.5 shadow-lg shadow-violet-600/30 mb-3">
            <div className="w-full h-full bg-[#0d0d14] rounded-[14px] flex items-center justify-center">
              <Zap className="w-6 h-6 text-violet-400" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            {mode === 'signin' ? 'Sign In to VUDU' : 'Create Your Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Unlimited ad-free movies, TV shows, and games across mobile, web, and TV.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 bg-white/[0.04] rounded-xl border border-white/[0.06] mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'signin' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'signup' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Marvin Elton"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-9 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : mode === 'signin' ? (
              'Sign In'
            ) : (
              'Continue to Plan Selection'
            )}
          </button>
        </form>

        {/* Demo Fast Login Presets */}
        <div className="mt-6 pt-5 border-t border-white/[0.08]">
          <div className="text-[11px] uppercase font-semibold tracking-wider text-slate-500 text-center mb-3">
            Quick 1-Click Testing Profiles
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('Marvin Elton', 'marvin@vudu.tv', 'premium', 'mtn')}
              className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-violet-600/20 border border-white/[0.06] hover:border-violet-500/30 text-left transition-colors cursor-pointer"
            >
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>Marvin</span>
                <span className="text-[9px] px-1 bg-amber-500/20 text-amber-300 rounded font-mono">MTN MoMo</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Premium Plan ($9.99)</div>
            </button>

            <button
              onClick={() => handleQuickLogin('Airtel Member', 'airtel.member@vudu.tv', 'standard', 'airtel')}
              className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-violet-600/20 border border-white/[0.06] hover:border-violet-500/30 text-left transition-colors cursor-pointer"
            >
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>Alex</span>
                <span className="text-[9px] px-1 bg-red-500/20 text-red-300 rounded font-mono">Airtel</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Standard ($7.99)</div>
            </button>

            <button
              onClick={() => handleQuickLogin('Sarah Mobile', 'sarah@vudu.tv', 'mobile', 'card')}
              className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-violet-600/20 border border-white/[0.06] hover:border-violet-500/30 text-left transition-colors cursor-pointer"
            >
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>Sarah</span>
                <span className="text-[9px] px-1 bg-violet-500/20 text-violet-300 rounded font-mono">Card</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Mobile ($2.99)</div>
            </button>

            <button
              onClick={() => handleQuickLogin('Unsubscribed User', 'new.user@vudu.tv', null)}
              className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-red-600/20 border border-white/[0.06] hover:border-red-500/30 text-left transition-colors cursor-pointer"
            >
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>Guest / New</span>
                <span className="text-[9px] px-1 bg-red-500/30 text-red-300 rounded font-mono">No Sub</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Paywall Test</div>
            </button>
          </div>
        </div>

        {/* Security Trust */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>MTN MoMo · Airtel Money · Credit/Debit Card</span>
        </div>
      </div>
    </div>
  );
};
