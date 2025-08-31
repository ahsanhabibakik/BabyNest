import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Article, AIInsight, Reminder } from '@/types';

interface AppState {
  // UI State
  isOnboarded: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  
  // Premium Features
  isPremium: boolean;
  subscriptionType: 'monthly' | 'yearly' | null;
  subscriptionExpiry: string | null;
  aiCredits: number;
  
  // Content
  articles: Article[];
  aiInsights: AIInsight[];
  reminders: Reminder[];
  
  // Settings
  notifications: {
    enabled: boolean;
    feeding: boolean;
    sleep: boolean;
    diaper: boolean;
    vaccination: boolean;
    milestones: boolean;
  };
  
  // Actions
  setOnboarded: (onboarded: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setLanguage: (language: string) => void;
  setPremium: (isPremium: boolean, subscriptionType?: 'monthly' | 'yearly', expiry?: string) => void;
  updateAICredits: (credits: number) => void;
  useAICredit: () => boolean;
  
  // Content actions
  setArticles: (articles: Article[]) => void;
  addAIInsight: (insight: AIInsight) => void;
  addReminder: (reminder: Reminder) => void;
  updateReminder: (reminderId: string, updates: Partial<Reminder>) => void;
  deleteReminder: (reminderId: string) => void;
  
  // Settings actions
  updateNotificationSettings: (settings: Partial<AppState['notifications']>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // UI State
      isOnboarded: false,
      theme: 'auto',
      language: 'en',
      
      // Premium Features
      isPremium: false,
      subscriptionType: null,
      subscriptionExpiry: null,
      aiCredits: 5, // Free tier starts with 5 credits
      
      // Content
      articles: [],
      aiInsights: [],
      reminders: [],
      
      // Settings
      notifications: {
        enabled: true,
        feeding: true,
        sleep: true,
        diaper: true,
        vaccination: true,
        milestones: true,
      },
      
      // Actions
      setOnboarded: (isOnboarded) => set({ isOnboarded }),
      
      setTheme: (theme) => set({ theme }),
      
      setLanguage: (language) => set({ language }),
      
      setPremium: (isPremium, subscriptionType, subscriptionExpiry) => set({
        isPremium,
        subscriptionType: subscriptionType || null,
        subscriptionExpiry: subscriptionExpiry || null,
        aiCredits: isPremium ? 100 : 5, // Premium gets 100 credits
      }),
      
      updateAICredits: (aiCredits) => set({ aiCredits }),
      
      useAICredit: () => {
        const state = get();
        if (state.aiCredits > 0) {
          set({ aiCredits: state.aiCredits - 1 });
          return true;
        }
        return false;
      },
      
      // Content actions
      setArticles: (articles) => set({ articles }),
      
      addAIInsight: (insight) => set((state) => ({
        aiInsights: [insight, ...state.aiInsights],
      })),
      
      addReminder: (reminder) => set((state) => ({
        reminders: [...state.reminders, reminder],
      })),
      
      updateReminder: (reminderId, updates) => set((state) => ({
        reminders: state.reminders.map(reminder =>
          reminder.id === reminderId
            ? { ...reminder, ...updates }
            : reminder
        ),
      })),
      
      deleteReminder: (reminderId) => set((state) => ({
        reminders: state.reminders.filter(reminder => reminder.id !== reminderId),
      })),
      
      // Settings actions
      updateNotificationSettings: (settings) => set((state) => ({
        notifications: { ...state.notifications, ...settings },
      })),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isOnboarded: state.isOnboarded,
        theme: state.theme,
        language: state.language,
        isPremium: state.isPremium,
        subscriptionType: state.subscriptionType,
        subscriptionExpiry: state.subscriptionExpiry,
        aiCredits: state.aiCredits,
        notifications: state.notifications,
      }),
    }
  )
);