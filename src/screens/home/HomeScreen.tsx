import React, { useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '@/components/common/SafeScreen';
import { useBabyStore } from '@/store/babyStore';
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import { COLORS, TRACKING_TYPES } from '@/constants';
import { format, differenceInDays, differenceInMonths } from 'date-fns';

const QuickActionCard: React.FC<{
  icon: string;
  title: string;
  color: string;
  onPress: () => void;
}> = ({ icon, title, color, onPress }) => (
  <Pressable
    onPress={onPress}
    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-1 mx-1 items-center"
    style={{ elevation: 2 }}
  >
    <View 
      className="w-12 h-12 rounded-full items-center justify-center mb-2"
      style={{ backgroundColor: color + '20' }}
    >
      <Text className="text-2xl">{icon}</Text>
    </View>
    <Text className="text-sm font-medium text-gray-700 text-center">
      {title}
    </Text>
  </Pressable>
);

const RecentActivityItem: React.FC<{
  type: string;
  timestamp: string;
  data: any;
}> = ({ type, timestamp, data }) => {
  const getActivityInfo = () => {
    switch (type) {
      case 'feeding':
        return {
          icon: TRACKING_TYPES.feeding.icon,
          title: `Fed ${data.type} ${data.amount ? `${data.amount}ml` : ''}`,
          color: TRACKING_TYPES.feeding.color,
        };
      case 'sleep':
        return {
          icon: TRACKING_TYPES.sleep.icon,
          title: `Slept ${data.duration ? `${Math.round(data.duration / 60)}h ${data.duration % 60}m` : 'started'}`,
          color: TRACKING_TYPES.sleep.color,
        };
      case 'diaper':
        return {
          icon: TRACKING_TYPES.diaper.icon,
          title: `Diaper changed - ${data.type}`,
          color: TRACKING_TYPES.diaper.color,
        };
      case 'growth':
        return {
          icon: TRACKING_TYPES.growth.icon,
          title: `Growth recorded - ${data.weight ? `${data.weight}kg` : ''}`,
          color: TRACKING_TYPES.growth.color,
        };
      default:
        return {
          icon: '📝',
          title: 'Activity recorded',
          color: COLORS.neutral,
        };
    }
  };

  const activity = getActivityInfo();
  const timeAgo = format(new Date(timestamp), 'HH:mm');

  return (
    <View className="flex-row items-center py-3 px-4 bg-white rounded-xl mb-2 border border-gray-100">
      <View 
        className="w-10 h-10 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: activity.color + '20' }}
      >
        <Text className="text-lg">{activity.icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="font-medium text-gray-900">
          {activity.title}
        </Text>
        <Text className="text-sm text-gray-500">
          {timeAgo}
        </Text>
      </View>
    </View>
  );
};

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { babies, selectedBabyId, getSelectedBaby, getRecentRecords } = useBabyStore();
  const { isPremium, aiCredits } = useAppStore();
  
  const selectedBaby = getSelectedBaby();
  const recentRecords = selectedBaby ? getRecentRecords(selectedBaby.id, 5) : [];

  const getBabyAge = (dateOfBirth: string) => {
    const now = new Date();
    const birth = new Date(dateOfBirth);
    const months = differenceInMonths(now, birth);
    const days = differenceInDays(now, birth) % 30;
    
    if (months < 1) {
      return `${differenceInDays(now, birth)} days old`;
    } else if (months < 12) {
      return `${months} months ${days} days old`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''} old`;
    }
  };

  useEffect(() => {
    // If no baby selected and babies exist, select the first one
    if (!selectedBabyId && babies.length > 0) {
      const { selectBaby } = useBabyStore.getState();
      selectBaby(babies[0].id);
    }
  }, [selectedBabyId, babies]);

  return (
    <SafeScreen>
      <ScrollView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="px-6 pt-4 pb-6 bg-white">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-gray-900">
                Hello, {user?.displayName?.split(' ')[0] || 'Parent'}! 👋
              </Text>
              <Text className="text-gray-600 mt-1">
                {format(new Date(), 'EEEE, MMMM d')}
              </Text>
            </View>
            <Pressable
              onPress={() => navigation.navigate('Profile')}
              className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center"
            >
              {user?.photoURL ? (
                <Image 
                  source={{ uri: user.photoURL }} 
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <Ionicons name="person" size={24} color={COLORS.neutral} />
              )}
            </Pressable>
          </View>
        </View>

        {/* Baby Selection */}
        {babies.length === 0 ? (
          <View className="mx-6 my-4 p-6 bg-white rounded-2xl border border-gray-100 items-center">
            <Text className="text-6xl mb-4">👶</Text>
            <Text className="text-xl font-bold text-gray-900 mb-2">
              Add Your First Baby
            </Text>
            <Text className="text-gray-600 text-center mb-4">
              Start tracking your baby's daily activities, growth, and milestones
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
        ) : selectedBaby ? (
          <>
            {/* Current Baby Card */}
            <View className="mx-6 my-4 p-6 bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl border border-orange-100">
              <Pressable
                onPress={() => navigation.navigate('BabyProfile', { babyId: selectedBaby.id })}
                className="flex-row items-center"
              >
                <View className="w-16 h-16 bg-white rounded-full items-center justify-center mr-4 shadow-sm">
                  {selectedBaby.photoUrl ? (
                    <Image 
                      source={{ uri: selectedBaby.photoUrl }} 
                      className="w-16 h-16 rounded-full"
                    />
                  ) : (
                    <Text className="text-3xl">👶</Text>
                  )}
                </View>
                <View className="flex-1">
                  <Text className="text-xl font-bold text-gray-900">
                    {selectedBaby.name}
                  </Text>
                  <Text className="text-gray-600">
                    {getBabyAge(selectedBaby.dateOfBirth)}
                  </Text>
                  {babies.length > 1 && (
                    <Text className="text-sm text-orange-600 mt-1">
                      Tap to switch babies →
                    </Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
              </Pressable>
            </View>

            {/* Quick Actions */}
            <View className="mx-6 mb-4">
              <Text className="text-lg font-bold text-gray-900 mb-3">
                Quick Track
              </Text>
              <View className="flex-row">
                <QuickActionCard
                  icon={TRACKING_TYPES.feeding.icon}
                  title="Feeding"
                  color={TRACKING_TYPES.feeding.color}
                  onPress={() => navigation.navigate('TrackingDetail', { type: 'feeding' })}
                />
                <QuickActionCard
                  icon={TRACKING_TYPES.sleep.icon}
                  title="Sleep"
                  color={TRACKING_TYPES.sleep.color}
                  onPress={() => navigation.navigate('TrackingDetail', { type: 'sleep' })}
                />
                <QuickActionCard
                  icon={TRACKING_TYPES.diaper.icon}
                  title="Diaper"
                  color={TRACKING_TYPES.diaper.color}
                  onPress={() => navigation.navigate('TrackingDetail', { type: 'diaper' })}
                />
                <QuickActionCard
                  icon={TRACKING_TYPES.growth.icon}
                  title="Growth"
                  color={TRACKING_TYPES.growth.color}
                  onPress={() => navigation.navigate('TrackingDetail', { type: 'growth' })}
                />
              </View>
            </View>

            {/* Recent Activity */}
            <View className="mx-6 mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-3">
                Recent Activity
              </Text>
              {recentRecords.length > 0 ? (
                <View>
                  {recentRecords.map((record) => (
                    <RecentActivityItem
                      key={record.id}
                      type={record.type}
                      timestamp={record.timestamp}
                      data={record.data}
                    />
                  ))}
                  <Pressable
                    onPress={() => navigation.navigate('Tracking')}
                    className="mt-2 py-3 items-center"
                  >
                    <Text className="font-medium" style={{ color: COLORS.primary }}>
                      View All Activities →
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <View className="bg-white rounded-xl p-6 items-center border border-gray-100">
                  <Text className="text-4xl mb-2">📊</Text>
                  <Text className="text-gray-600 text-center">
                    No activities yet. Start tracking your baby's daily routine!
                  </Text>
                </View>
              )}
            </View>

            {/* AI Insights Teaser */}
            <View className="mx-6 mb-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl border border-purple-200">
              <View className="flex-row items-center mb-2">
                <Text className="text-2xl mr-2">🤖</Text>
                <Text className="text-lg font-bold text-gray-900">
                  AI Insights
                </Text>
                <View className="ml-2 px-2 py-1 bg-purple-500 rounded-full">
                  <Text className="text-xs text-white font-medium">
                    {aiCredits} credits
                  </Text>
                </View>
              </View>
              <Text className="text-gray-600 mb-3">
                Get personalized insights about {selectedBaby.name}'s patterns and development
              </Text>
              <Pressable
                onPress={() => {
                  if (aiCredits > 0) {
                    navigation.navigate('AIInsight');
                  } else {
                    navigation.navigate('Paywall', { source: 'ai-insights' });
                  }
                }}
                className="py-2 px-4 bg-purple-500 rounded-full self-start"
              >
                <Text className="text-white font-medium text-sm">
                  {aiCredits > 0 ? 'Get Insights' : 'Upgrade for AI'}
                </Text>
              </Pressable>
            </View>
          </>
        )}

        {/* Premium Upgrade Card */}
        {!isPremium && (
          <View className="mx-6 mb-6 p-4 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl border border-orange-200">
            <View className="flex-row items-center mb-2">
              <Text className="text-2xl mr-2">⭐</Text>
              <Text className="text-lg font-bold text-gray-900">
                Upgrade to Pro
              </Text>
            </View>
            <Text className="text-gray-600 mb-3">
              Unlimited babies, AI insights, growth charts, and more!
            </Text>
            <Pressable
              onPress={() => navigation.navigate('Paywall')}
              className="py-2 px-4 rounded-full self-start"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Text className="text-white font-medium text-sm">
                Try 7 Days Free
              </Text>
            </Pressable>
          </View>
        )}

        <View className="h-20" />
      </ScrollView>
    </SafeScreen>
  );
};