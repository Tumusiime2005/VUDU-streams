import React, { useState } from 'react';
import {
  X,
  Check,
  Zap,
  ShieldCheck,
  CreditCard,
  Phone,
  ArrowRight,
  Lock,
  Sparkles,
  Smartphone,
  Tv,
  Monitor,
  Flame,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import {
  SubscriptionPlanId,
  PaymentMethodType,
  VUDU_PLANS,
  UserAccount,
  SubscriptionDetails,
} from '../types/userAndHistory';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onSubscriptionSuccess: (details: SubscriptionDetails) => void;
  requiredToStreamMessage?: string;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSubscriptionSuccess,
  requiredToStreamMessage,
}) => {
  // Wizard steps: 'select-plan' | 'payment-details' | 'ussd-prompt' | 'success'
  const [step, setStep] = useState<'select-plan' | 'payment-details' | 'ussd-prompt' | 'success'>('select-plan');
  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionPlanId>(
    currentUser.subscription?.planId || 'premium'
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('mtn');

  // Form fields
  const [countryCode, setCountryCode] = useState('+256');
  const [phoneNumber, setPhoneNumber] = useState('772 849 321');
  const [accountName, setAccountName] = useState(currentUser.name || 'Marvin Elton');
  const [momoPin, setMomoPin] = useState('12345');

  // Card fields
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('883');
  const [cardholderName, setCardholderName] = useState(currentUser.name || 'Marvin Elton');

  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedRef, setGeneratedRef] = useState('');

  if (!isOpen) return null;

  const selectedPlan = VUDU_PLANS.find((p) => p.id === selectedPlanId) || VUDU_PLANS[3];

  // Continue to Payment Details
  const handleProceedToPayment = () => {
    setStep('payment-details');
  };

  // Submit Payment
  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const ref =
      paymentMethod === 'mtn'
        ? `MTN-MOMO-${Math.floor(100000 + Math.random() * 900000)}`
        : paymentMethod === 'airtel'
        ? `AIR-MONEY-${Math.floor(100000 + Math.random() * 900000)}`
        : `CARD-AUTH-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedRef(ref);

    // If mobile money, simulate USSD push prompt
    if (paymentMethod === 'mtn' || paymentMethod === 'airtel') {
      setTimeout(() => {
        setIsProcessing(false);
        setStep('ussd-prompt');
      }, 1000);
    } else {
      // Direct card checkout
      setTimeout(() => {
        completeSubscription(ref, `Card ending in ${cardNumber.slice(-4) || '4242'}`);
      }, 1500);
    }
  };

  // Authorize Mobile Money PIN in USSD prompt
  const handleAuthorizeMobileMoney = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const identifier = `${paymentMethod.toUpperCase()} (${countryCode} ${phoneNumber})`;
      completeSubscription(generatedRef, identifier);
    }, 1200);
  };

  // Complete subscription
  const completeSubscription = (ref: string, identifier: string) => {
    setIsProcessing(false);
    const now = new Date();
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const details: SubscriptionDetails = {
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      priceFormatted: selectedPlan.priceFormatted,
      paymentMethod,
      paymentIdentifier: identifier,
      subscribedAt: now.toLocaleDateString(),
      nextBillingDate: nextMonth.toLocaleDateString(),
      transactionReference: ref,
      active: true,
    };

    onSubscriptionSuccess(details);
    setStep('success');
  };

  // Quick 1-Click Fill Helpers for ease of testing
  const handleQuickPreset = (method: PaymentMethodType) => {
    setPaymentMethod(method);
    if (method === 'mtn') {
      setCountryCode('+256');
      setPhoneNumber('772 555 123');
      setAccountName(currentUser.name || 'MTN MoMo Subscriber');
    } else if (method === 'airtel') {
      setCountryCode('+256');
      setPhoneNumber('752 444 789');
      setAccountName(currentUser.name || 'Airtel Money Subscriber');
    } else {
      setCardNumber('4000 1234 5678 9010');
      setCardExpiry('09/29');
      setCardCvv('921');
      setCardholderName(currentUser.name || 'VUDU Cardholder');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#101018] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-violet-950/40 p-5 sm:p-8 text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Alert if user was blocked from free streaming */}
        {requiredToStreamMessage && step === 'select-plan' && (
          <div className="mb-6 p-3 rounded-xl bg-violet-950/60 border border-violet-500/40 text-violet-200 text-xs flex items-center gap-2">
            <Lock className="w-4 h-4 text-violet-400 shrink-0" />
            <span>{requiredToStreamMessage}</span>
          </div>
        )}

        {/* STEP 1: SELECT PLAN */}
        {step === 'select-plan' && (
          <div>
            <div className="text-center max-w-xl mx-auto mb-7">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-2">
                <Zap className="w-3.5 h-3.5 text-violet-400" />
                <span>No Free Streaming · Membership Required</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
                Choose Your VUDU Subscription
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                Stream movies, cartoons & music with unlimited ad-free access. Supported payments: MTN Mobile Money, Airtel Money, or Credit/Debit Card.
              </p>
            </div>

            {/* Plans Grid (4 Plans) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
              {VUDU_PLANS.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                const isCurrent = currentUser.subscription?.planId === plan.id && currentUser.subscription.active;

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`relative flex flex-col justify-between rounded-xl p-4 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-b from-[#1c172d] to-[#12111c] border-2 border-violet-500 shadow-lg shadow-violet-600/20 ring-1 ring-violet-500'
                        : 'bg-[#14141e] border border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    {/* Badge */}
                    {plan.badge && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-violet-600 text-white text-[9px] font-bold uppercase tracking-wider">
                        {plan.badge}
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-base font-bold font-display text-white">{plan.name}</h3>
                        {isCurrent && (
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded">
                            Active
                          </span>
                        )}
                      </div>

                      {/* Price */}
                      <div className="my-2.5">
                        <span className="text-2xl font-black font-display text-white">
                          ${plan.priceMonthly.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-400 ml-1">/ month</span>
                      </div>

                      <div className="text-[11px] font-semibold text-violet-400 mb-3 flex items-center gap-1">
                        <Monitor className="w-3.5 h-3.5" />
                        <span>Resolution: {plan.resolution}</span>
                      </div>

                      {/* Features */}
                      <ul className="space-y-2 text-xs text-slate-300">
                        {plan.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-[11px] leading-snug">
                            <Check className="w-3 h-3 text-violet-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.06]">
                      <div
                        className={`w-full py-1.5 rounded-lg text-center text-xs font-semibold ${
                          isSelected ? 'bg-violet-600 text-white' : 'bg-white/[0.04] text-slate-400'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Select Plan'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Proceed CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-violet-400" />
                <span>Pay securely via MTN MoMo, Airtel Money, or Credit/Debit Card</span>
              </div>

              <button
                onClick={handleProceedToPayment}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Continue to Payment ({selectedPlan.priceFormatted})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PAYMENT METHOD & RESOURCES INPUT */}
        {step === 'payment-details' && (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
              <div>
                <button
                  onClick={() => setStep('select-plan')}
                  className="text-xs text-violet-400 hover:text-violet-300 mb-1 flex items-center gap-1"
                >
                  ← Back to Plans
                </button>
                <h2 className="text-xl sm:text-2xl font-black font-display text-white">
                  Checkout: {selectedPlan.name} Plan ({selectedPlan.priceFormatted})
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Total Due Today</span>
                <div className="text-lg font-black font-mono text-white">
                  ${selectedPlan.priceMonthly.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Select Your Payment Option
              </label>
              <div className="grid grid-cols-3 gap-3">
                {/* MTN Mobile Money */}
                <button
                  type="button"
                  onClick={() => handleQuickPreset('mtn')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'mtn'
                      ? 'bg-amber-950/40 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                      : 'bg-[#151520] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-[#ffcc00] flex items-center justify-center font-black text-black text-[11px]">
                    MTN
                  </div>
                  <span className="text-xs font-bold">MTN MoMo</span>
                </button>

                {/* Airtel Money */}
                <button
                  type="button"
                  onClick={() => handleQuickPreset('airtel')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'airtel'
                      ? 'bg-red-950/40 border-red-500 text-red-300 ring-1 ring-red-500'
                      : 'bg-[#151520] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-[#e60000] flex items-center justify-center font-black text-white text-[11px]">
                    airtel
                  </div>
                  <span className="text-xs font-bold">Airtel Money</span>
                </button>

                {/* Credit / Debit Card */}
                <button
                  type="button"
                  onClick={() => handleQuickPreset('card')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-violet-950/40 border-violet-500 text-violet-300 ring-1 ring-violet-500'
                      : 'bg-[#151520] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold">Credit / Debit Card</span>
                </button>
              </div>
            </div>

            {/* Payment Details Form */}
            <form onSubmit={handleInitiatePayment} className="space-y-4">
              
              {/* Form A: MTN Mobile Money */}
              {paymentMethod === 'mtn' && (
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                      <Smartphone className="w-4 h-4" />
                      <span>MTN Mobile Money Resource Information</span>
                    </div>
                    <span className="text-[10px] text-amber-300/80 font-mono">Instant MoMo Push</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">Country</label>
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-full bg-[#161622] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="+256">Uganda (+256)</option>
                        <option value="+233">Ghana (+233)</option>
                        <option value="+234">Nigeria (+234)</option>
                        <option value="+250">Rwanda (+250)</option>
                        <option value="+27">South Africa (+27)</option>
                        <option value="+254">Kenya (+254)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-slate-300 mb-1">MTN Phone Number</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-xs text-slate-400 font-mono">{countryCode}</span>
                        <input
                          type="text"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="772 123 456"
                          required
                          className="w-full bg-[#161622] border border-white/10 rounded-xl pl-16 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Account Holder Full Name</label>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="e.g. Marvin Elton"
                      required
                      className="w-full bg-[#161622] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <p className="text-[11px] text-slate-400">
                    A USSD prompt of <strong className="text-white">${selectedPlan.priceMonthly.toFixed(2)}</strong> will be sent to your phone. You will enter your MTN MoMo PIN to complete.
                  </p>
                </div>
              )}

              {/* Form B: Airtel Money */}
              {paymentMethod === 'airtel' && (
                <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-red-500/20">
                    <div className="flex items-center gap-2 text-red-400 text-xs font-bold">
                      <Smartphone className="w-4 h-4" />
                      <span>Airtel Money Resource Information</span>
                    </div>
                    <span className="text-[10px] text-red-300/80 font-mono">USSD Push</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">Country</label>
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-full bg-[#161622] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                      >
                        <option value="+256">Uganda (+256)</option>
                        <option value="+254">Kenya (+254)</option>
                        <option value="+234">Nigeria (+234)</option>
                        <option value="+250">Rwanda (+250)</option>
                        <option value="+255">Tanzania (+255)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-slate-300 mb-1">Airtel Phone Number</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-xs text-slate-400 font-mono">{countryCode}</span>
                        <input
                          type="text"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="752 987 654"
                          required
                          className="w-full bg-[#161622] border border-white/10 rounded-xl pl-16 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Account Holder Full Name</label>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="e.g. Marvin Elton"
                      required
                      className="w-full bg-[#161622] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Your registered Airtel SIM will receive an authorization popup to verify with your 4-digit PIN.
                  </p>
                </div>
              )}

              {/* Form C: Credit / Debit Card */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/30 space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-violet-500/20">
                    <div className="flex items-center gap-2 text-violet-400 text-xs font-bold">
                      <CreditCard className="w-4 h-4" />
                      <span>Card Resource & Security Information</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Visa · Mastercard · Amex</span>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      placeholder="Marvin Elton"
                      required
                      className="w-full bg-[#161622] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      required
                      className="w-full bg-[#161622] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        required
                        className="w-full bg-[#161622] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        maxLength={4}
                        required
                        className="w-full bg-[#161622] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Encrypted 256-Bit Gateway</span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all cursor-pointer flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>
                      Pay ${selectedPlan.priceMonthly.toFixed(2)} with{' '}
                      {paymentMethod === 'mtn'
                        ? 'MTN MoMo'
                        : paymentMethod === 'airtel'
                        ? 'Airtel Money'
                        : 'Card'}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: INTERACTIVE USSD PUSH PROMPT (For MTN & Airtel Mobile Money) */}
        {step === 'ussd-prompt' && (
          <div className="py-6 px-4 max-w-md mx-auto text-center space-y-5">
            <div
              className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-xl ${
                paymentMethod === 'mtn' ? 'bg-[#ffcc00] text-black' : 'bg-[#e60000] text-white'
              }`}
            >
              <Smartphone className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <span
                className={`text-xs uppercase font-bold tracking-widest ${
                  paymentMethod === 'mtn' ? 'text-amber-400' : 'text-red-400'
                }`}
              >
                {paymentMethod === 'mtn' ? 'MTN Mobile Money' : 'Airtel Money'} USSD Push
              </span>
              <h3 className="text-xl font-black font-display text-white mt-1">
                Approve Payment on Your Phone
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                We sent an authorization request for <strong className="text-white">${selectedPlan.priceMonthly.toFixed(2)}</strong> to{' '}
                <strong className="text-white font-mono">
                  {countryCode} {phoneNumber}
                </strong>
                .
              </p>
            </div>

            {/* Simulated Phone Prompt Box */}
            <div className="p-4 rounded-xl bg-black/80 border border-white/20 text-left space-y-3 font-mono text-xs">
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Ref: {generatedRef}</span>
                <span className="text-emerald-400 animate-pulse">● Waiting for PIN</span>
              </div>
              <div className="p-2.5 rounded bg-white/5 border border-white/10 text-slate-200">
                &quot;Do you approve payment of ${selectedPlan.priceMonthly.toFixed(2)} to VUDU Streaming?&quot;
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Enter Mobile Money PIN:</label>
                <input
                  type="password"
                  value={momoPin}
                  onChange={(e) => setMomoPin(e.target.value)}
                  maxLength={5}
                  className="w-full bg-[#1a1a26] border border-white/20 rounded-lg px-3 py-2 text-center text-lg tracking-widest text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <button
                type="button"
                onClick={handleAuthorizeMobileMoney}
                disabled={isProcessing}
                className={`w-full py-2.5 rounded-lg font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  paymentMethod === 'mtn'
                    ? 'bg-[#ffcc00] hover:bg-[#e6b800] text-black'
                    : 'bg-[#e60000] hover:bg-[#cc0000] text-white'
                }`}
              >
                {isProcessing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>Verifying PIN with Network...</span>
                  </>
                ) : (
                  <span>Authorize & Complete Subscription</span>
                )}
              </button>
            </div>

            <p className="text-[10px] text-slate-500">
              Did not receive the prompt? Check that your phone is unlocked or retry with another payment method.
            </p>
          </div>
        )}

        {/* STEP 4: SUCCESS / UNLOCKED */}
        {step === 'success' && (
          <div className="py-8 px-4 max-w-lg mx-auto text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                Payment Authorized & Verified
              </span>
              <h3 className="text-2xl font-black font-display text-white mt-1">
                Welcome to VUDU {selectedPlan.name}!
              </h3>
              <p className="text-xs text-slate-300 mt-2">
                Your subscription has been successfully activated. You now have unlimited ad-free access to all movies, cartoons, and music in {selectedPlan.resolution}.
              </p>
            </div>

            {/* Receipt Summary */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-left space-y-2">
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Plan</span>
                <span className="font-bold text-white">VUDU {selectedPlan.name} ({selectedPlan.priceFormatted})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Payment Option</span>
                <span className="font-semibold text-white uppercase">
                  {paymentMethod === 'mtn' ? 'MTN Mobile Money' : paymentMethod === 'airtel' ? 'Airtel Money' : 'Card'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Transaction Ref</span>
                <span className="font-mono text-violet-300">{generatedRef}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Status</span>
                <span className="text-emerald-400 font-bold">Active · Unlimited Access</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
            >
              Start Streaming Now
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
