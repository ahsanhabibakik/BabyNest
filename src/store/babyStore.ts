import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Baby, FeedingRecord, SleepRecord, DiaperRecord, GrowthRecord, MilestoneRecord, VaccinationRecord } from '@/types';

interface BabyState {
  babies: Baby[];
  selectedBabyId: string | null;
  feedingRecords: FeedingRecord[];
  sleepRecords: SleepRecord[];
  diaperRecords: DiaperRecord[];
  growthRecords: GrowthRecord[];
  milestoneRecords: MilestoneRecord[];
  vaccinationRecords: VaccinationRecord[];
  
  // Actions
  addBaby: (baby: Baby) => void;
  updateBaby: (babyId: string, updates: Partial<Baby>) => void;
  deleteBaby: (babyId: string) => void;
  selectBaby: (babyId: string | null) => void;
  getSelectedBaby: () => Baby | null;
  
  // Tracking actions
  addFeedingRecord: (record: FeedingRecord) => void;
  addSleepRecord: (record: SleepRecord) => void;
  addDiaperRecord: (record: DiaperRecord) => void;
  addGrowthRecord: (record: GrowthRecord) => void;
  addMilestoneRecord: (record: MilestoneRecord) => void;
  addVaccinationRecord: (record: VaccinationRecord) => void;
  
  // Get records for baby
  getBabyRecords: (babyId: string) => {
    feeding: FeedingRecord[];
    sleep: SleepRecord[];
    diaper: DiaperRecord[];
    growth: GrowthRecord[];
    milestones: MilestoneRecord[];
    vaccinations: VaccinationRecord[];
  };
  
  // Get recent records
  getRecentRecords: (babyId: string, limit?: number) => Array<{
    id: string;
    type: 'feeding' | 'sleep' | 'diaper' | 'growth' | 'milestone' | 'vaccination';
    timestamp: string;
    data: any;
  }>;
}

export const useBabyStore = create<BabyState>()(
  persist(
    (set, get) => ({
      babies: [],
      selectedBabyId: null,
      feedingRecords: [],
      sleepRecords: [],
      diaperRecords: [],
      growthRecords: [],
      milestoneRecords: [],
      vaccinationRecords: [],
      
      addBaby: (baby) => set((state) => ({
        babies: [...state.babies, baby],
        selectedBabyId: state.babies.length === 0 ? baby.id : state.selectedBabyId,
      })),
      
      updateBaby: (babyId, updates) => set((state) => ({
        babies: state.babies.map(baby =>
          baby.id === babyId 
            ? { ...baby, ...updates, updatedAt: new Date().toISOString() }
            : baby
        ),
      })),
      
      deleteBaby: (babyId) => set((state) => ({
        babies: state.babies.filter(baby => baby.id !== babyId),
        selectedBabyId: state.selectedBabyId === babyId ? 
          (state.babies.length > 1 ? state.babies.find(b => b.id !== babyId)?.id || null : null) : 
          state.selectedBabyId,
        feedingRecords: state.feedingRecords.filter(r => r.babyId !== babyId),
        sleepRecords: state.sleepRecords.filter(r => r.babyId !== babyId),
        diaperRecords: state.diaperRecords.filter(r => r.babyId !== babyId),
        growthRecords: state.growthRecords.filter(r => r.babyId !== babyId),
        milestoneRecords: state.milestoneRecords.filter(r => r.babyId !== babyId),
        vaccinationRecords: state.vaccinationRecords.filter(r => r.babyId !== babyId),
      })),
      
      selectBaby: (babyId) => set({ selectedBabyId: babyId }),
      
      getSelectedBaby: () => {
        const state = get();
        return state.babies.find(baby => baby.id === state.selectedBabyId) || null;
      },
      
      addFeedingRecord: (record) => set((state) => ({
        feedingRecords: [...state.feedingRecords, record],
      })),
      
      addSleepRecord: (record) => set((state) => ({
        sleepRecords: [...state.sleepRecords, record],
      })),
      
      addDiaperRecord: (record) => set((state) => ({
        diaperRecords: [...state.diaperRecords, record],
      })),
      
      addGrowthRecord: (record) => set((state) => ({
        growthRecords: [...state.growthRecords, record],
      })),
      
      addMilestoneRecord: (record) => set((state) => ({
        milestoneRecords: [...state.milestoneRecords, record],
      })),
      
      addVaccinationRecord: (record) => set((state) => ({
        vaccinationRecords: [...state.vaccinationRecords, record],
      })),
      
      getBabyRecords: (babyId) => {
        const state = get();
        return {
          feeding: state.feedingRecords.filter(r => r.babyId === babyId),
          sleep: state.sleepRecords.filter(r => r.babyId === babyId),
          diaper: state.diaperRecords.filter(r => r.babyId === babyId),
          growth: state.growthRecords.filter(r => r.babyId === babyId),
          milestones: state.milestoneRecords.filter(r => r.babyId === babyId),
          vaccinations: state.vaccinationRecords.filter(r => r.babyId === babyId),
        };
      },
      
      getRecentRecords: (babyId, limit = 10) => {
        const state = get();
        const records = [
          ...state.feedingRecords.filter(r => r.babyId === babyId).map(r => ({
            id: r.id,
            type: 'feeding' as const,
            timestamp: r.timestamp,
            data: r,
          })),
          ...state.sleepRecords.filter(r => r.babyId === babyId).map(r => ({
            id: r.id,
            type: 'sleep' as const,
            timestamp: r.startTime,
            data: r,
          })),
          ...state.diaperRecords.filter(r => r.babyId === babyId).map(r => ({
            id: r.id,
            type: 'diaper' as const,
            timestamp: r.timestamp,
            data: r,
          })),
          ...state.growthRecords.filter(r => r.babyId === babyId).map(r => ({
            id: r.id,
            type: 'growth' as const,
            timestamp: r.measurementDate,
            data: r,
          })),
          ...state.milestoneRecords.filter(r => r.babyId === babyId).map(r => ({
            id: r.id,
            type: 'milestone' as const,
            timestamp: r.achievedDate,
            data: r,
          })),
          ...state.vaccinationRecords.filter(r => r.babyId === babyId).map(r => ({
            id: r.id,
            type: 'vaccination' as const,
            timestamp: r.administeredDate,
            data: r,
          })),
        ];
        
        return records
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, limit);
      },
    }),
    {
      name: 'baby-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);