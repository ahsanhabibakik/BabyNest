import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import { COLORS } from '@/constants';

// Auth Screens
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { SignUpScreen } from '@/screens/auth/SignUpScreen';
import { OnboardingScreen } from '@/screens/onboarding/OnboardingScreen';

// Main Tab Screens
import { HomeScreen } from '@/screens/home/HomeScreen';
import { TrackingScreen } from '@/screens/tracking/TrackingScreen';
import { KnowledgeScreen } from '@/screens/knowledge/KnowledgeScreen';
import { MotherCareScreen } from '@/screens/mothercare/MotherCareScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';

// Modal/Stack Screens
import { BabyProfileScreen } from '@/screens/baby/BabyProfileScreen';
import { TrackingDetailScreen } from '@/screens/tracking/TrackingDetailScreen';
import { ArticleDetailScreen } from '@/screens/knowledge/ArticleDetailScreen';
import { AIInsightScreen } from '@/screens/ai/AIInsightScreen';
import { SettingsScreen } from '@/screens/settings/SettingsScreen';
import { PaywallScreen } from '@/screens/paywall/PaywallScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      gestureEnabled: true,
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        switch (route.name) {
          case 'Home':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Tracking':
            iconName = focused ? 'add-circle' : 'add-circle-outline';
            break;
          case 'Knowledge':
            iconName = focused ? 'book' : 'book-outline';
            break;
          case 'MotherCare':
            iconName = focused ? 'heart' : 'heart-outline';
            break;
          case 'Profile':
            iconName = focused ? 'person' : 'person-outline';
            break;
          default:
            iconName = 'help-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.neutral,
      tabBarStyle: {
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingBottom: 5,
        paddingTop: 5,
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
      },
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeScreen}
      options={{ tabBarLabel: 'Home' }}
    />
    <Tab.Screen 
      name="Tracking" 
      component={TrackingScreen}
      options={{ tabBarLabel: 'Track' }}
    />
    <Tab.Screen 
      name="Knowledge" 
      component={KnowledgeScreen}
      options={{ tabBarLabel: 'Learn' }}
    />
    <Tab.Screen 
      name="MotherCare" 
      component={MotherCareScreen}
      options={{ tabBarLabel: 'Mom Care' }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{ tabBarLabel: 'Profile' }}
    />
  </Tab.Navigator>
);

const MainStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="MainTabs" component={MainTabs} />
    
    {/* Modal Screens */}
    <Stack.Screen 
      name="BabyProfile" 
      component={BabyProfileScreen}
      options={{
        presentation: 'modal',
        headerShown: true,
        headerTitle: 'Baby Profile',
        headerTitleStyle: {
          fontWeight: '600',
          color: COLORS.black,
        },
        headerBackTitleVisible: false,
        headerTintColor: COLORS.primary,
      }}
    />
    <Stack.Screen 
      name="TrackingDetail" 
      component={TrackingDetailScreen}
      options={{
        presentation: 'modal',
        headerShown: true,
        headerTitle: 'Add Entry',
        headerTitleStyle: {
          fontWeight: '600',
          color: COLORS.black,
        },
        headerBackTitleVisible: false,
        headerTintColor: COLORS.primary,
      }}
    />
    <Stack.Screen 
      name="ArticleDetail" 
      component={ArticleDetailScreen}
      options={{
        headerShown: true,
        headerTitle: '',
        headerTransparent: true,
        headerBackTitleVisible: false,
        headerTintColor: COLORS.white,
      }}
    />
    <Stack.Screen 
      name="AIInsight" 
      component={AIInsightScreen}
      options={{
        presentation: 'modal',
        headerShown: true,
        headerTitle: 'AI Insight',
        headerTitleStyle: {
          fontWeight: '600',
          color: COLORS.black,
        },
        headerBackTitleVisible: false,
        headerTintColor: COLORS.primary,
      }}
    />
    <Stack.Screen 
      name="Settings" 
      component={SettingsScreen}
      options={{
        headerShown: true,
        headerTitle: 'Settings',
        headerTitleStyle: {
          fontWeight: '600',
          color: COLORS.black,
        },
        headerBackTitleVisible: false,
        headerTintColor: COLORS.primary,
      }}
    />
    <Stack.Screen 
      name="Paywall" 
      component={PaywallScreen}
      options={{
        presentation: 'modal',
        headerShown: true,
        headerTitle: 'BabyNest Pro',
        headerTitleStyle: {
          fontWeight: '600',
          color: COLORS.black,
        },
        headerBackTitleVisible: false,
        headerTintColor: COLORS.primary,
      }}
    />
  </Stack.Navigator>
);

export const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { isOnboarded } = useAppStore();

  // Show onboarding for new users
  if (!isOnboarded) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      </Stack.Navigator>
    );
  }

  // Show auth flow for unauthenticated users
  if (!isAuthenticated) {
    return <AuthStack />;
  }

  // Show main app for authenticated users
  return <MainStack />;
};