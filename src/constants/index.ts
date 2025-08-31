export const COLORS = {
  primary: '#f27318',
  primaryDark: '#e3590e',
  secondary: '#0ea5e9',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  neutral: '#6b7280',
  white: '#ffffff',
  black: '#000000',
  background: '#f9fafb',
  surface: '#ffffff',
  border: '#e5e7eb',
} as const;

export const FONTS = {
  inter: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  poppins: {
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    semiBold: 'Poppins-SemiBold',
    bold: 'Poppins-Bold',
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

export const TRACKING_TYPES = {
  feeding: {
    icon: '🍼',
    title: 'Feeding',
    color: COLORS.primary,
  },
  sleep: {
    icon: '😴',
    title: 'Sleep',
    color: COLORS.secondary,
  },
  diaper: {
    icon: '🍼',
    title: 'Diaper',
    color: COLORS.warning,
  },
  growth: {
    icon: '📏',
    title: 'Growth',
    color: COLORS.success,
  },
  milestone: {
    icon: '🎯',
    title: 'Milestone',
    color: COLORS.error,
  },
} as const;

export const MILESTONE_CATEGORIES = {
  physical: {
    title: 'Physical',
    color: '#ef4444',
    icon: '🤸',
  },
  cognitive: {
    title: 'Cognitive',
    color: '#8b5cf6',
    icon: '🧠',
  },
  social: {
    title: 'Social',
    color: '#06b6d4',
    icon: '👥',
  },
  language: {
    title: 'Language',
    color: '#f59e0b',
    icon: '💬',
  },
} as const;

export const FEEDING_TYPES = {
  breast: {
    title: 'Breast',
    icon: '🤱',
    color: COLORS.primary,
  },
  bottle: {
    title: 'Bottle',
    icon: '🍼',
    color: COLORS.secondary,
  },
  solid: {
    title: 'Solid Food',
    icon: '🥄',
    color: COLORS.success,
  },
} as const;

export const SLEEP_QUALITY = {
  poor: {
    title: 'Poor',
    color: '#ef4444',
    icon: '😫',
  },
  fair: {
    title: 'Fair',
    color: '#f59e0b',
    icon: '😐',
  },
  good: {
    title: 'Good',
    color: '#22c55e',
    icon: '😊',
  },
  excellent: {
    title: 'Excellent',
    color: '#10b981',
    icon: '😴',
  },
} as const;

export const DIAPER_TYPES = {
  wet: {
    title: 'Wet',
    color: COLORS.secondary,
    icon: '💧',
  },
  dirty: {
    title: 'Dirty',
    color: '#a16207',
    icon: '💩',
  },
  both: {
    title: 'Both',
    color: COLORS.warning,
    icon: '💧💩',
  },
} as const;

export const SUBSCRIPTION_TIERS = {
  free: {
    title: 'Free',
    maxBabies: 1,
    aiCredits: 5,
    features: ['Basic tracking', 'Limited articles', 'Basic reminders'],
  },
  pro: {
    title: 'Pro',
    maxBabies: -1, // unlimited
    aiCredits: 100,
    features: [
      'Unlimited babies',
      'AI insights',
      'Premium articles',
      'Growth charts',
      'Advanced reminders',
      'Data export',
      'Priority support',
    ],
    prices: {
      monthly: 9.99,
      yearly: 79.99,
    },
  },
} as const;

export const IAP_PRODUCTS = {
  ai_credits_small: {
    productId: 'babynest_ai_credits_25',
    title: 'AI Credits Pack (25)',
    description: '25 additional AI insights',
    credits: 25,
    price: 2.99,
  },
  ai_credits_large: {
    productId: 'babynest_ai_credits_100',
    title: 'AI Credits Pack (100)',
    description: '100 additional AI insights',
    credits: 100,
    price: 9.99,
  },
  premium_articles: {
    productId: 'babynest_premium_articles',
    title: 'Premium Articles Bundle',
    description: 'Unlock all premium parenting articles',
    price: 4.99,
  },
} as const;

export const WHO_GROWTH_PERCENTILES = [3, 15, 50, 85, 97] as const;

export const VACCINATION_SCHEDULE = {
  '0-2months': [
    'Hepatitis B',
    'BCG',
  ],
  '2months': [
    'DPT',
    'IPV',
    'Hib',
    'PCV',
    'Rotavirus',
  ],
  '4months': [
    'DPT',
    'IPV',
    'Hib',
    'PCV',
    'Rotavirus',
  ],
  '6months': [
    'DPT',
    'IPV',
    'Hib',
    'PCV',
    'Hepatitis B',
  ],
  '12months': [
    'MMR',
    'Varicella',
    'PCV',
    'Hib',
  ],
  '15months': [
    'DPT',
    'IPV',
  ],
  '18months': [
    'Hepatitis A',
  ],
} as const;

export const DEFAULT_REMINDERS = {
  feeding: {
    intervals: [2, 3, 4], // hours
    title: 'Feeding Time',
  },
  sleep: {
    intervals: [1, 2], // hours for naps
    title: 'Nap Time',
  },
  diaper: {
    intervals: [2, 3], // hours
    title: 'Diaper Check',
  },
} as const;