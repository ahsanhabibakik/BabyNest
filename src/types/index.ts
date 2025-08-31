export interface Baby {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  photoUrl?: string;
  currentWeight?: number;
  currentHeight?: number;
  currentHeadCircumference?: number;
  bloodType?: string;
  allergies?: string[];
  medicalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedingRecord {
  id: string;
  babyId: string;
  type: 'breast' | 'bottle' | 'solid';
  amount?: number; // ml for bottle/formula
  duration?: number; // minutes for breastfeeding
  side?: 'left' | 'right' | 'both'; // for breastfeeding
  foodItems?: string[]; // for solid foods
  notes?: string;
  timestamp: string;
  createdAt: string;
}

export interface SleepRecord {
  id: string;
  babyId: string;
  startTime: string;
  endTime?: string;
  duration?: number; // minutes
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  location: 'crib' | 'bed' | 'stroller' | 'carrier' | 'other';
  notes?: string;
  createdAt: string;
}

export interface DiaperRecord {
  id: string;
  babyId: string;
  type: 'wet' | 'dirty' | 'both';
  consistency?: 'liquid' | 'soft' | 'normal' | 'hard';
  color?: string;
  notes?: string;
  timestamp: string;
  createdAt: string;
}

export interface GrowthRecord {
  id: string;
  babyId: string;
  weight?: number; // kg
  height?: number; // cm
  headCircumference?: number; // cm
  measurementDate: string;
  notes?: string;
  createdAt: string;
}

export interface MilestoneRecord {
  id: string;
  babyId: string;
  title: string;
  description?: string;
  category: 'physical' | 'cognitive' | 'social' | 'language';
  achievedDate: string;
  photoUrl?: string;
  videoUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface VaccinationRecord {
  id: string;
  babyId: string;
  vaccineName: string;
  administeredDate: string;
  nextDueDate?: string;
  doctor?: string;
  clinic?: string;
  batchNumber?: string;
  reactions?: string;
  notes?: string;
  createdAt: string;
}

export interface MotherHealthRecord {
  id: string;
  type: 'postpartum' | 'menstrual' | 'mood' | 'weight' | 'breastfeeding';
  value?: string | number;
  notes?: string;
  timestamp: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isPremium: boolean;
  subscriptionType?: 'monthly' | 'yearly';
  subscriptionExpiry?: string;
  aiCredits: number;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'baby-care' | 'mother-care' | 'development' | 'health' | 'nutrition';
  ageRange?: string; // e.g., "0-3 months"
  tags: string[];
  imageUrl?: string;
  isPremium: boolean;
  readTime: number; // minutes
  publishedAt: string;
  updatedAt: string;
}

export interface AIInsight {
  id: string;
  type: 'feeding-schedule' | 'sleep-pattern' | 'growth-analysis' | 'milestone-prediction' | 'symptom-check';
  title: string;
  content: string;
  confidence: number; // 0-1
  recommendations?: string[];
  disclaimers: string[];
  babyId?: string;
  createdAt: string;
}

export interface Reminder {
  id: string;
  babyId?: string;
  type: 'feeding' | 'sleep' | 'diaper' | 'vaccination' | 'checkup' | 'medication';
  title: string;
  description?: string;
  scheduledTime: string;
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface NavigationParamList {
  OnboardingStack: undefined;
  MainTabs: undefined;
  Auth: undefined;
  BabyProfile: { babyId?: string };
  TrackingDetail: { type: 'feeding' | 'sleep' | 'diaper' | 'growth' };
  ArticleDetail: { articleId: string };
  AIInsight: { insightId: string };
  Settings: undefined;
  Paywall: { source?: string };
}

export type TrackingType = 'feeding' | 'sleep' | 'diaper' | 'growth' | 'milestone';