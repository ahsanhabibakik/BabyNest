import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '@/components/common/SafeScreen';
import { useAppStore } from '@/store/appStore';
import { COLORS, SUBSCRIPTION_TIERS } from '@/constants';

const FeatureItem: React.FC<{
  icon: string;
  title: string;
  description: string;
  isPro?: boolean;
}> = ({ icon, title, description, isPro = false }) => (
  <View className="flex-row items-start mb-4">
    <View 
      className="w-8 h-8 rounded-full items-center justify-center mr-3 mt-1"
      style={{ backgroundColor: isPro ? COLORS.primary + '20' : '#f3f4f6' }}
    >
      <Ionicons 
        name={icon as any} 
        size={16} 
        color={isPro ? COLORS.primary : COLORS.neutral} 
      />
    </View>
    <View className="flex-1">
      <Text className="font-semibold text-gray-900 mb-1">
        {title}
      </Text>
      <Text className="text-sm text-gray-600 leading-5">
        {description}
      </Text>
    </View>
  </View>
);

const PlanCard: React.FC<{
  title: string;
  price: string;
  period: string;
  isPopular?: boolean;
  isSelected: boolean;
  onSelect: () => void;
  savings?: string;
}> = ({ title, price, period, isPopular, isSelected, onSelect, savings }) => (
  <Pressable
    onPress={onSelect}
    className={`rounded-2xl p-4 border-2 mb-4 ${
      isSelected 
        ? 'border-orange-500 bg-orange-50' 
        : 'border-gray-200 bg-white'
    }`}
  >
    {isPopular && (
      <View className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <View className="bg-orange-500 px-3 py-1 rounded-full">
          <Text className="text-white text-xs font-medium">
            Most Popular
          </Text>
        </View>
      </View>
    )}
    
    <View className="flex-row items-center justify-between">
      <View className="flex-1">
        <Text className="text-lg font-bold text-gray-900">
          {title}
        </Text>
        <Text className="text-gray-600">
          ${price}/{period}
        </Text>
        {savings && (
          <Text className="text-sm text-green-600 font-medium mt-1">
            Save {savings}
          </Text>
        )}
      </View>
      <View 
        className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
          isSelected 
            ? 'border-orange-500 bg-orange-500' 
            : 'border-gray-300'
        }`}
      >
        {isSelected && (
          <Ionicons name="checkmark" size={12} color="white" />
        )}
      </View>
    </View>
  </Pressable>
);

export const PaywallScreen: React.FC<{ navigation: any; route: any }> = ({ 
  navigation, 
  route 
}) => {
  const { setPremium } = useAppStore();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [isLoading, setIsLoading] = useState(false);
  
  const source = route.params?.source || 'general';

  const getHeaderContent = () => {
    switch (source) {
      case 'baby-limit':
        return {
          title: 'Track More Babies',
          subtitle: 'Upgrade to track unlimited babies and their development',
        };
      case 'ai-insights':
        return {
          title: 'Unlock AI Insights',
          subtitle: 'Get personalized recommendations powered by AI',
        };
      case 'premium-article':
        return {
          title: 'Access Premium Content',
          subtitle: 'Read expert articles and guides',
        };
      default:
        return {
          title: 'Upgrade to BabyNest Pro',
          subtitle: 'Unlock all features and get the most out of BabyNest',
        };
    }
  };

  const headerContent = getHeaderContent();

  const handleSubscribe = async () => {
    setIsLoading(true);
    
    // Mock subscription process
    setTimeout(() => {
      setPremium(true, selectedPlan, new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString());
      setIsLoading(false);
      Alert.alert(
        'Welcome to Pro!',
        'Your subscription is now active. Enjoy all premium features!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 2000);
  };

  const handleStartTrial = async () => {
    setIsLoading(true);
    
    // Mock trial process
    setTimeout(() => {
      setPremium(true, selectedPlan, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());
      setIsLoading(false);
      Alert.alert(
        '7-Day Free Trial Started!',
        'You now have access to all Pro features. Cancel anytime before the trial ends.',
        [
          {
            text: 'Start Exploring',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 2000);
  };

  return (
    <SafeScreen>
      <ScrollView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="px-6 pt-8 pb-6 bg-gradient-to-br from-orange-50 to-pink-50">
          <View className="items-center mb-6">
            <View className="w-20 h-20 bg-orange-100 rounded-full items-center justify-center mb-4">
              <Text className="text-4xl">⭐</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
              {headerContent.title}
            </Text>
            <Text className="text-gray-600 text-center leading-6">
              {headerContent.subtitle}
            </Text>
          </View>
        </View>

        {/* Features Comparison */}
        <View className="px-6 py-6 bg-white">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            What's included in Pro
          </Text>

          <FeatureItem
            icon="people"
            title="Unlimited Baby Profiles"
            description="Track as many babies as you need without limits"
            isPro
          />

          <FeatureItem
            icon="sparkles"
            title="AI-Powered Insights"
            description="Get personalized recommendations and pattern analysis"
            isPro
          />

          <FeatureItem
            icon="trending-up"
            title="Growth Charts & Analytics"
            description="WHO standard growth charts and detailed analytics"
            isPro
          />

          <FeatureItem
            icon="library"
            title="Premium Articles"
            description="Access to expert parenting guides and exclusive content"
            isPro
          />

          <FeatureItem
            icon="notifications"
            title="Smart Reminders"
            description="Intelligent reminders based on your baby's patterns"
            isPro
          />

          <FeatureItem
            icon="cloud-download"
            title="Data Export & Backup"
            description="Export your data and automatic cloud backup"
            isPro
          />

          <FeatureItem
            icon="headset"
            title="Priority Support"
            description="Get priority customer support and early access to features"
            isPro
          />
        </View>

        {/* Pricing Plans */}
        <View className="px-6 py-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Choose Your Plan
          </Text>

          <PlanCard
            title="Yearly Plan"
            price="6.67"
            period="month"
            savings="33%"
            isPopular
            isSelected={selectedPlan === 'yearly'}
            onSelect={() => setSelectedPlan('yearly')}
          />

          <PlanCard
            title="Monthly Plan"
            price="9.99"
            period="month"
            isSelected={selectedPlan === 'monthly'}
            onSelect={() => setSelectedPlan('monthly')}
          />

          <Text className="text-center text-sm text-gray-600 mb-6">
            7-day free trial • Cancel anytime • No commitment
          </Text>

          {/* Subscribe Buttons */}
          <Pressable
            onPress={handleStartTrial}
            disabled={isLoading}
            className={`py-4 px-6 rounded-full items-center mb-3 ${
              isLoading ? 'bg-gray-300' : 'bg-orange-500'
            }`}
          >
            <Text className="text-white font-bold text-lg">
              {isLoading ? 'Processing...' : 'Start 7-Day Free Trial'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.goBack()}
            className="py-3 px-6 rounded-full items-center border border-gray-300"
          >
            <Text className="text-gray-700 font-semibold">
              Maybe Later
            </Text>
          </Pressable>

          {/* Fine Print */}
          <Text className="text-center text-xs text-gray-500 mt-4 leading-4">
            Free trial automatically converts to a {selectedPlan} subscription. 
            You can cancel at any time in your account settings. 
            Terms and privacy policy apply.
          </Text>
        </View>

        {/* Trust Indicators */}
        <View className="px-6 py-4 bg-gray-50">
          <View className="flex-row items-center justify-center space-x-6">
            <View className="items-center">
              <Ionicons name="shield-checkmark" size={24} color={COLORS.success} />
              <Text className="text-xs text-gray-600 mt-1">Secure</Text>
            </View>
            <View className="items-center">
              <Ionicons name="refresh" size={24} color={COLORS.success} />
              <Text className="text-xs text-gray-600 mt-1">Cancel Anytime</Text>
            </View>
            <View className="items-center">
              <Ionicons name="people" size={24} color={COLORS.success} />
              <Text className="text-xs text-gray-600 mt-1">1000+ Parents</Text>
            </View>
          </View>
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeScreen>
  );
};