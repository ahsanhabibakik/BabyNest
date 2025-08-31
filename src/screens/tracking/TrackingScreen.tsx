import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '@/components/common/SafeScreen';
import { useBabyStore } from '@/store/babyStore';
import { COLORS, TRACKING_TYPES } from '@/constants';
import { format } from 'date-fns';

const TrackingCard: React.FC<{
  icon: string;
  title: string;
  color: string;
  count: number;
  lastEntry?: string;
  onPress: () => void;
}> = ({ icon, title, color, count, lastEntry, onPress }) => (
  <Pressable
    onPress={onPress}
    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 m-2 flex-1"
    style={{ elevation: 2 }}
  >
    <View className="flex-row items-center justify-between mb-3">
      <View 
        className="w-12 h-12 rounded-full items-center justify-center"
        style={{ backgroundColor: color + '20' }}
      >
        <Text className="text-2xl">{icon}</Text>
      </View>
      <Ionicons name="add-circle" size={24} color={color} />
    </View>
    
    <Text className="text-lg font-bold text-gray-900 mb-1">
      {title}
    </Text>
    
    <Text className="text-sm text-gray-600 mb-2">
      {count} entries today
    </Text>
    
    {lastEntry && (
      <Text className="text-xs text-gray-500">
        Last: {lastEntry}
      </Text>
    )}
  </Pressable>
);

export const TrackingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { getSelectedBaby, getBabyRecords } = useBabyStore();
  const selectedBaby = getSelectedBaby();

  if (!selectedBaby) {
    return (
      <SafeScreen>
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-6xl mb-4">👶</Text>
          <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
            No Baby Selected
          </Text>
          <Text className="text-gray-600 text-center mb-4">
            Please add a baby profile to start tracking activities
          </Text>
          <Pressable
            onPress={() => navigation.navigate('BabyProfile')}
            className="py-3 px-6 rounded-full"
            style={{ backgroundColor: COLORS.primary }}
          >
            <Text className="text-white font-semibold">
              Add Baby Profile
            </Text>
          </Pressable>
        </View>
      </SafeScreen>
    );
  }

  const records = getBabyRecords(selectedBaby.id);
  const today = format(new Date(), 'yyyy-MM-dd');

  // Count today's entries
  const todayCounts = {
    feeding: records.feeding.filter(r => format(new Date(r.timestamp), 'yyyy-MM-dd') === today).length,
    sleep: records.sleep.filter(r => format(new Date(r.startTime), 'yyyy-MM-dd') === today).length,
    diaper: records.diaper.filter(r => format(new Date(r.timestamp), 'yyyy-MM-dd') === today).length,
    growth: records.growth.filter(r => format(new Date(r.measurementDate), 'yyyy-MM-dd') === today).length,
  };

  // Get last entries
  const lastEntries = {
    feeding: records.feeding[0] ? format(new Date(records.feeding[0].timestamp), 'HH:mm') : undefined,
    sleep: records.sleep[0] ? format(new Date(records.sleep[0].startTime), 'HH:mm') : undefined,
    diaper: records.diaper[0] ? format(new Date(records.diaper[0].timestamp), 'HH:mm') : undefined,
    growth: records.growth[0] ? format(new Date(records.growth[0].measurementDate), 'MM/dd') : undefined,
  };

  return (
    <SafeScreen>
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="px-6 pt-4 pb-6 bg-white">
          <Text className="text-2xl font-bold text-gray-900">
            Track Activity
          </Text>
          <Text className="text-gray-600 mt-1">
            Recording for {selectedBaby.name}
          </Text>
        </View>

        <ScrollView className="flex-1 px-4 pt-4">
          {/* Quick Track Cards */}
          <View className="flex-row flex-wrap">
            <TrackingCard
              icon={TRACKING_TYPES.feeding.icon}
              title="Feeding"
              color={TRACKING_TYPES.feeding.color}
              count={todayCounts.feeding}
              lastEntry={lastEntries.feeding}
              onPress={() => navigation.navigate('TrackingDetail', { type: 'feeding' })}
            />
            
            <TrackingCard
              icon={TRACKING_TYPES.sleep.icon}
              title="Sleep"
              color={TRACKING_TYPES.sleep.color}
              count={todayCounts.sleep}
              lastEntry={lastEntries.sleep}
              onPress={() => navigation.navigate('TrackingDetail', { type: 'sleep' })}
            />
          </View>

          <View className="flex-row flex-wrap">
            <TrackingCard
              icon={TRACKING_TYPES.diaper.icon}
              title="Diaper"
              color={TRACKING_TYPES.diaper.color}
              count={todayCounts.diaper}
              lastEntry={lastEntries.diaper}
              onPress={() => navigation.navigate('TrackingDetail', { type: 'diaper' })}
            />
            
            <TrackingCard
              icon={TRACKING_TYPES.growth.icon}
              title="Growth"
              color={TRACKING_TYPES.growth.color}
              count={todayCounts.growth}
              lastEntry={lastEntries.growth}
              onPress={() => navigation.navigate('TrackingDetail', { type: 'growth' })}
            />
          </View>

          {/* Milestones */}
          <Pressable
            onPress={() => navigation.navigate('TrackingDetail', { type: 'milestone' })}
            className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-5 mx-2 mt-4 border border-purple-200"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-full items-center justify-center bg-purple-200 mr-3">
                  <Text className="text-2xl">🎯</Text>
                </View>
                <View>
                  <Text className="text-lg font-bold text-gray-900">
                    Record Milestone
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Capture special moments
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
            </View>
          </Pressable>

          {/* Recent Activity Summary */}
          <View className="mx-2 mt-6 mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Today's Summary
            </Text>
            
            <View className="bg-white rounded-xl p-4 border border-gray-100">
              <View className="flex-row justify-between py-2">
                <Text className="text-gray-600">Feedings</Text>
                <Text className="font-semibold text-gray-900">{todayCounts.feeding}</Text>
              </View>
              <View className="flex-row justify-between py-2">
                <Text className="text-gray-600">Sleep Sessions</Text>
                <Text className="font-semibold text-gray-900">{todayCounts.sleep}</Text>
              </View>
              <View className="flex-row justify-between py-2">
                <Text className="text-gray-600">Diaper Changes</Text>
                <Text className="font-semibold text-gray-900">{todayCounts.diaper}</Text>
              </View>
              <View className="flex-row justify-between py-2">
                <Text className="text-gray-600">Growth Measurements</Text>
                <Text className="font-semibold text-gray-900">{todayCounts.growth}</Text>
              </View>
            </View>
          </View>

          <View className="h-20" />
        </ScrollView>
      </View>
    </SafeScreen>
  );
};