export interface WatchHistoryRecord {
  id: string;
  title: string;
  type: 'movie' | 'cartoon' | 'music';
  posterUrl: string;
  backdropUrl: string;
  progressSeconds: number;
  totalDurationSeconds: number;
  progressPercent: number;
  lastWatchedAt: number;
  genres: string[];
  durationText: string;
  rating: number;
  badge: string;
  seasonNumber?: number;
  episodeNumber?: number;
  episodeTitle?: string;
}

export type SubscriptionPlanId = 'mobile' | 'basic' | 'standard' | 'premium';
export type PaymentMethodType = 'mtn' | 'airtel' | 'card';

export interface PlanDefinition {
  id: SubscriptionPlanId;
  name: string;
  priceMonthly: number;
  priceFormatted: string;
  resolution: string;
  screens: number;
  downloadDevices: number;
  features: string[];
  badge?: string;
  highlight?: boolean;
}

export const VUDU_PLANS: PlanDefinition[] = [
  {
    id: 'mobile',
    name: 'Mobile',
    priceMonthly: 2.99,
    priceFormatted: '$2.99 / month',
    resolution: '480p (SD)',
    screens: 1,
    downloadDevices: 1,
    features: [
      'Unlimited ad-free movies, TV shows, and games',
      'Watch on 1 phone or tablet at a time',
      'Watch in 480p (SD)',
      'Download on 1 phone or tablet at a time',
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    priceMonthly: 3.99,
    priceFormatted: '$3.99 / month',
    resolution: '720p (HD)',
    screens: 1,
    downloadDevices: 1,
    features: [
      'Unlimited ad-free movies, TV shows, and games',
      'Watch on 1 supported device at a time',
      'Watch in 720p (HD)',
      'Download on 1 supported device at a time',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    priceMonthly: 7.99,
    priceFormatted: '$7.99 / month',
    resolution: '1080p (Full HD)',
    screens: 2,
    downloadDevices: 2,
    badge: 'Popular',
    features: [
      'Unlimited ad-free movies, TV shows, and games',
      'Watch on 2 supported devices at a time',
      'Watch in 1080p (Full HD)',
      'Download on 2 supported devices at a time',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    priceMonthly: 9.99,
    priceFormatted: '$9.99 / month',
    resolution: '4K (Ultra HD) + HDR',
    screens: 4,
    downloadDevices: 6,
    badge: 'Best Value',
    highlight: true,
    features: [
      'Unlimited ad-free movies, TV shows, and games',
      'Watch on 4 supported devices at a time',
      'Watch in 4K (Ultra HD) + HDR',
      'Download on 6 supported devices at a time',
      'VUDU spatial audio',
    ],
  },
];

export interface SubscriptionDetails {
  planId: SubscriptionPlanId;
  planName: string;
  priceFormatted: string;
  paymentMethod: PaymentMethodType;
  paymentIdentifier: string;
  subscribedAt: string;
  nextBillingDate: string;
  transactionReference: string;
  active: boolean;
}

export interface UserProfileSlot {
  id: string;
  name: string;
  avatarBg: string;
  isKids: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  subscription: SubscriptionDetails | null;
  isLoggedIn: boolean;
  activeProfileId?: string;
  profiles?: UserProfileSlot[];
  isKidsMode?: boolean;
}

export interface WatchSuggestion {
  mediaId: string;
  score: number;
  reason: string;
}

export interface ReviewItem {
  id: string;
  mediaId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: number;
  likes: number;
  verifiedSubscriber: boolean;
}

export interface DownloadedItem {
  id: string;
  mediaId: string;
  title: string;
  episodeTitle?: string;
  seasonNumber?: number;
  episodeNumber?: number;
  type: 'movie' | 'cartoon' | 'music';
  fileSize: string;
  downloadedAt: number;
  posterUrl: string;
  videoUrl: string;
}

export interface UpcomingTitle {
  id: string;
  title: string;
  releaseDate: string;
  synopsis: string;
  backdropUrl: string;
  type: 'movie' | 'series';
  badge: string;
  genres: string[];
}
