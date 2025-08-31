import React from 'react';
import { View, Text, ScrollView, Pressable, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '@/components/common/SafeScreen';
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import { useBabyStore } from '@/store/babyStore';
import { authService } from '@/services/auth/authService';
import { COLORS } from '@/constants';

const ProfileOption: React.FC<{
  icon: string;
  title: string;
  subtitle?: string;
  showChevron?: boolean;
  onPress: () => void;
  color?: string;
  isPremium?: boolean;
}> = ({ icon, title, subtitle, showChevron = true, onPress, color = COLORS.neutral, isPremium = false }) => (
  <Pressable
    onPress={onPress}
    className="bg-white rounded-xl p-4 mb-3 flex-row items-center border border-gray-100"
  >
    <View 
      className="w-10 h-10 rounded-full items-center justify-center mr-3"
      style={{ backgroundColor: color + '20' }}
    >
      <Ionicons name={icon as any} size={20} color={color} />
    </View>
    <View className="flex-1">
      <View className="flex-row items-center">
        <Text className="font-semibold text-gray-900">
          {title}
        </Text>
        {isPremium && (
          <View className="ml-2 bg-orange-100 px-2 py-0.5 rounded-full">
            <Text className="text-orange-600 text-xs font-medium">PRO</Text>
          </View>
        )}
      </View>
      {subtitle && (
        <Text className="text-sm text-gray-600 mt-1">
          {subtitle}
        </Text>
      )}
    </View>
    {showChevron && (
      <Ionicons name="chevron-forward" size={20} color={COLORS.neutral} />
    )}
  </Pressable>
);

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: string;
  color: string;
}> = ({ title, value, icon, color }) => (
  <View className="bg-white rounded-xl p-4 flex-1 mr-3 last:mr-0 border border-gray-100">
    <View className="flex-row items-center justify-between mb-2">
      <Text className="text-sm font-medium text-gray-600">
        {title}
      </Text>
      <Text className="text-lg" style={{ color }}>
        {icon}
      </Text>
    </View>
    <Text className="text-2xl font-bold text-gray-900">
      {value}
    </Text>
  </View>
);

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, signOut } = useAuthStore();
  const { isPremium, subscriptionType, aiCredits } = useAppStore();
  const { babies } = useBabyStore();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!user?.id.startsWith('guest-')) {
                await authService.signOut();
              }
              signOut();
            } catch (error) {
              console.error('Sign out error:', error);
            }
          },
        },
      ]
    );
  };

  const isGuestUser = user?.id.startsWith('guest-');

  return (
    <SafeScreen>
      <ScrollView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="px-6 pt-4 pb-6 bg-white">
          <View className="flex-row items-center">
            <View className="w-16 h-16 bg-gray-200 rounded-full items-center justify-center mr-4">
              {user?.photoURL ? (
                <Image 
                  source={{ uri: user.photoURL }} 
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <Ionicons name="person" size={32} color={COLORS.neutral} />
              )}
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900">
                {user?.displayName || 'User'}
              </Text>
              <Text className="text-gray-600">
                {user?.email}
              </Text>
              {isPremium && (
                <View className="mt-1 flex-row items-center">
                  <View className="bg-orange-500 px-2 py-1 rounded-full mr-2">
                    <Text className="text-white text-xs font-medium">PRO</Text>
                  </View>
                  <Text className="text-sm text-gray-600">
                    {subscriptionType === 'yearly' ? 'Annual' : 'Monthly'} Plan
                  </Text>
                </View>
              )}
              {isGuestUser && (
                <View className="mt-1 bg-gray-100 px-2 py-1 rounded-full self-start">
                  <Text className="text-gray-600 text-xs font-medium">Guest User</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Stats */}
        <View className="px-6 py-4">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Your Stats
          </Text>
          <View className="flex-row">
            <StatCard
              title="Babies"
              value={babies.length.toString()}
              icon="👶"
              color={COLORS.primary}
            />
            <StatCard
              title="AI Credits"
              value={aiCredits.toString()}
              icon="🤖"
              color="#8b5cf6"
            />
            <StatCard
              title="Days Active"
              value="1"
              icon="📅"
              color={COLORS.success}
            />
          </View>
        </View>

        {/* Account Section */}
        <View className="px-6 py-4">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Account
          </Text>

          {isGuestUser && (
            <ProfileOption
              icon="person-add"
              title="Create Account"
              subtitle="Save your data and sync across devices"
              onPress={() => navigation.navigate('SignUp')}
              color={COLORS.primary}
            />
          )}

          {!isPremium && (
            <ProfileOption
              icon="star"
              title="Upgrade to Pro"
              subtitle="Unlock unlimited babies, AI insights, and more"
              onPress={() => navigation.navigate('Paywall')}
              color={COLORS.primary}
              isPremium
            />
          )}

          <ProfileOption
            icon="people"
            title="Manage Babies"
            subtitle={`${babies.length} baby profile${babies.length !== 1 ? 's' : ''}`}
            onPress={() => navigation.navigate('BabyProfile')}
            color="#10b981"
          />

          <ProfileOption
            icon="settings"
            title="Settings"
            subtitle="Notifications, privacy, and more"
            onPress={() => navigation.navigate('Settings')}
            color={COLORS.neutral}
          />
        </View>

        {/* Data Section */}
        <View className="px-6 py-4">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Data & Privacy
          </Text>

          <ProfileOption
            icon="download"
            title="Export Data"
            subtitle="Download your tracking data"
            onPress={() => {
              if (isPremium) {
                Alert.alert('Export Data', 'Your data export will be ready shortly');
              } else {
                navigation.navigate('Paywall', { source: 'data-export' });
              }
            }}
            color="#06b6d4"
            isPremium={!isPremium}
          />

          <ProfileOption
            icon="shield-checkmark"
            title="Privacy Policy"
            subtitle="How we protect your data"
            onPress={() => Alert.alert('Privacy Policy', 'View our privacy policy at babynest.com/privacy')}
            color="#22c55e"
          />

          <ProfileOption
            icon="document-text"
            title="Terms of Service"
            subtitle="Terms and conditions"
            onPress={() => Alert.alert('Terms of Service', 'View our terms at babynest.com/terms')}
            color={COLORS.neutral}
          />
        </View>

        {/* Support Section */}
        <View className="px-6 py-4">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Support
          </Text>

          <ProfileOption
            icon="help-circle"
            title="Help & FAQ"
            subtitle="Get answers to common questions"
            onPress={() => Alert.alert('Help', 'Visit babynest.com/help for support')}
            color="#8b5cf6"
          />

          <ProfileOption
            icon="mail"
            title="Contact Us"
            subtitle="Get in touch with our support team"
            onPress={() => Alert.alert('Contact', 'Email us at support@babynest.com')}
            color="#06b6d4"
          />

          <ProfileOption
            icon="star-outline"
            title="Rate BabyNest"
            subtitle="Help us improve with your feedback"
            onPress={() => Alert.alert('Rate App', 'Thank you! Redirecting to app store...')}
            color="#f59e0b"
          />
        </View>

        {/* Sign Out */}
        <View className="px-6 py-4 mb-6">
          <ProfileOption
            icon="log-out"
            title="Sign Out"
            subtitle=""
            onPress={handleSignOut}
            color="#ef4444"
            showChevron={false}
          />
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeScreen>
  );
};