import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '@/components/common/SafeScreen';
import { useAppStore } from '@/store/appStore';
import { COLORS } from '@/constants';

const SettingItem: React.FC<{
  icon: string;
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
}> = ({ icon, title, subtitle, rightElement, onPress, showChevron = false }) => (
  <Pressable
    onPress={onPress}
    disabled={!onPress}
    className="bg-white rounded-xl p-4 mb-3 flex-row items-center border border-gray-100"
  >
    <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
      <Ionicons name={icon as any} size={20} color={COLORS.neutral} />
    </View>
    <View className="flex-1">
      <Text className="font-semibold text-gray-900">
        {title}
      </Text>
      {subtitle && (
        <Text className="text-sm text-gray-600 mt-1">
          {subtitle}
        </Text>
      )}
    </View>
    {rightElement}
    {showChevron && (
      <Ionicons name="chevron-forward" size={20} color={COLORS.neutral} />
    )}
  </Pressable>
);

export const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { 
    theme, 
    setTheme, 
    notifications, 
    updateNotificationSettings,
    language,
    setLanguage 
  } = useAppStore();

  const [localNotifications, setLocalNotifications] = useState(notifications);

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    const updated = { ...localNotifications, [key]: !localNotifications[key] };
    setLocalNotifications(updated);
    updateNotificationSettings({ [key]: !localNotifications[key] });
  };

  const handleThemeChange = () => {
    Alert.alert(
      'Choose Theme',
      'Select your preferred theme',
      [
        { text: 'Light', onPress: () => setTheme('light') },
        { text: 'Dark', onPress: () => setTheme('dark') },
        { text: 'Auto', onPress: () => setTheme('auto') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleLanguageChange = () => {
    Alert.alert(
      'Choose Language',
      'Select your preferred language',
      [
        { text: 'English', onPress: () => setLanguage('en') },
        { text: 'Spanish', onPress: () => setLanguage('es') },
        { text: 'French', onPress: () => setLanguage('fr') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeScreen>
      <ScrollView className="flex-1 bg-gray-50">
        {/* Appearance */}
        <View className="px-6 py-4">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Appearance
          </Text>

          <SettingItem
            icon="color-palette"
            title="Theme"
            subtitle={`Current: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
            onPress={handleThemeChange}
            showChevron
          />

          <SettingItem
            icon="language"
            title="Language"
            subtitle={`Current: English`}
            onPress={handleLanguageChange}
            showChevron
          />
        </View>

        {/* Notifications */}
        <View className="px-6 py-4">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Notifications
          </Text>

          <SettingItem
            icon="notifications"
            title="Push Notifications"
            subtitle="Enable all notifications"
            rightElement={
              <Switch
                value={localNotifications.enabled}
                onValueChange={() => handleNotificationToggle('enabled')}
                trackColor={{ false: '#f3f4f6', true: COLORS.primary + '50' }}
                thumbColor={localNotifications.enabled ? COLORS.primary : '#9ca3af'}
              />
            }
          />

          {localNotifications.enabled && (
            <>
              <SettingItem
                icon="restaurant"
                title="Feeding Reminders"
                subtitle="Get reminded when it's time to feed"
                rightElement={
                  <Switch
                    value={localNotifications.feeding}
                    onValueChange={() => handleNotificationToggle('feeding')}
                    trackColor={{ false: '#f3f4f6', true: COLORS.primary + '50' }}
                    thumbColor={localNotifications.feeding ? COLORS.primary : '#9ca3af'}
                  />
                }
              />

              <SettingItem
                icon="bed"
                title="Sleep Reminders"
                subtitle="Get reminded about nap time"
                rightElement={
                  <Switch
                    value={localNotifications.sleep}
                    onValueChange={() => handleNotificationToggle('sleep')}
                    trackColor={{ false: '#f3f4f6', true: COLORS.primary + '50' }}
                    thumbColor={localNotifications.sleep ? COLORS.primary : '#9ca3af'}
                  />
                }
              />

              <SettingItem
                icon="medical"
                title="Vaccination Reminders"
                subtitle="Never miss a vaccination appointment"
                rightElement={
                  <Switch
                    value={localNotifications.vaccination}
                    onValueChange={() => handleNotificationToggle('vaccination')}
                    trackColor={{ false: '#f3f4f6', true: COLORS.primary + '50' }}
                    thumbColor={localNotifications.vaccination ? COLORS.primary : '#9ca3af'}
                  />
                }
              />

              <SettingItem
                icon="trophy"
                title="Milestone Reminders"
                subtitle="Celebrate important milestones"
                rightElement={
                  <Switch
                    value={localNotifications.milestones}
                    onValueChange={() => handleNotificationToggle('milestones')}
                    trackColor={{ false: '#f3f4f6', true: COLORS.primary + '50' }}
                    thumbColor={localNotifications.milestones ? COLORS.primary : '#9ca3af'}
                  />
                }
              />
            </>
          )}
        </View>

        {/* Data & Privacy */}
        <View className="px-6 py-4">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Data & Privacy
          </Text>

          <SettingItem
            icon="analytics"
            title="Usage Analytics"
            subtitle="Help improve BabyNest by sharing anonymous usage data"
            rightElement={
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: '#f3f4f6', true: COLORS.primary + '50' }}
                thumbColor={COLORS.primary}
              />
            }
          />

          <SettingItem
            icon="download"
            title="Auto Backup"
            subtitle="Automatically backup your data to the cloud"
            rightElement={
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: '#f3f4f6', true: COLORS.primary + '50' }}
                thumbColor={COLORS.primary}
              />
            }
          />

          <SettingItem
            icon="trash"
            title="Clear Cache"
            subtitle="Free up storage space"
            onPress={() => Alert.alert('Cache Cleared', 'App cache has been cleared')}
            showChevron
          />
        </View>

        {/* Support */}
        <View className="px-6 py-4">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Support
          </Text>

          <SettingItem
            icon="help-circle"
            title="Help Center"
            subtitle="Get answers to common questions"
            onPress={() => Alert.alert('Help Center', 'Visit babynest.com/help')}
            showChevron
          />

          <SettingItem
            icon="chatbubble"
            title="Contact Support"
            subtitle="Get in touch with our team"
            onPress={() => Alert.alert('Contact Support', 'Email: support@babynest.com')}
            showChevron
          />

          <SettingItem
            icon="bug"
            title="Report Bug"
            subtitle="Help us fix issues you encounter"
            onPress={() => Alert.alert('Bug Report', 'Thank you! Bug report submitted.')}
            showChevron
          />
        </View>

        {/* About */}
        <View className="px-6 py-4">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            About
          </Text>

          <SettingItem
            icon="information-circle"
            title="App Version"
            subtitle="1.0.0 (Build 1)"
          />

          <SettingItem
            icon="document-text"
            title="Terms of Service"
            onPress={() => Alert.alert('Terms', 'View terms at babynest.com/terms')}
            showChevron
          />

          <SettingItem
            icon="shield-checkmark"
            title="Privacy Policy"
            onPress={() => Alert.alert('Privacy', 'View privacy policy at babynest.com/privacy')}
            showChevron
          />
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeScreen>
  );
};