import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useAppStore } from '@/store/appStore';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { notifications } = useAppStore();

  useEffect(() => {
    if (notifications.enabled) {
      registerForPushNotifications();
    }
  }, [notifications.enabled]);

  const registerForPushNotifications = async () => {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }

      // Get the token for push notifications
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Push token:', token);
    } catch (error) {
      console.error('Error getting notification permissions:', error);
    }
  };

  // Schedule feeding reminder
  const scheduleFeedingReminder = async (babyName: string, intervalHours: number = 3) => {
    if (!notifications.feeding) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${babyName} Feeding Time 🍼`,
        body: `It's been ${intervalHours} hours since the last feeding`,
        sound: true,
      },
      trigger: {
        seconds: intervalHours * 3600,
        repeats: true,
      },
    });
  };

  // Schedule sleep reminder  
  const scheduleSleepReminder = async (babyName: string) => {
    if (!notifications.sleep) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${babyName} Nap Time 😴`,
        body: 'Time for a nap to maintain healthy sleep patterns',
        sound: true,
      },
      trigger: {
        seconds: 2 * 3600, // 2 hours
        repeats: true,
      },
    });
  };

  // Schedule vaccination reminder
  const scheduleVaccinationReminder = async (vaccineName: string, dueDate: Date) => {
    if (!notifications.vaccination) return;

    const now = new Date();
    const timeDiff = dueDate.getTime() - now.getTime();
    
    if (timeDiff > 0) {
      // Remind 1 day before
      const reminderTime = timeDiff - (24 * 60 * 60 * 1000);
      
      if (reminderTime > 0) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Vaccination Reminder 💉`,
            body: `${vaccineName} vaccination is due tomorrow`,
            sound: true,
          },
          trigger: {
            seconds: Math.floor(reminderTime / 1000),
          },
        });
      }
    }
  };

  return <>{children}</>;
};