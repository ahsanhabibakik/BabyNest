import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert, Image, Modal, Animated, Dimensions, Share, Switch, FlatList, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

interface Activity {
  id: string;
  type: 'feeding' | 'sleep' | 'diaper' | 'growth' | 'milestone' | 'medication' | 'photo' | 'appointment';
  time: Date;
  notes?: string;
  duration?: number;
  weight?: number;
  height?: number;
  milestone?: string;
  medication?: string;
  photo?: string;
  appointmentType?: string;
  babyId?: string;
}

interface BabyProfile {
  id: string;
  name: string;
  birthDate: Date;
  photo?: string;
  gender: 'boy' | 'girl' | 'other';
  bloodType?: string;
  allergies?: string[];
  emergencyContact?: string;
}

interface Reminder {
  id: string;
  type: 'medication' | 'appointment' | 'feeding' | 'sleep';
  title: string;
  date: Date;
  completed: boolean;
  recurring?: boolean;
  babyId: string;
}

interface Routine {
  id: string;
  name: string;
  activities: { type: string; time: string; notes?: string }[];
  babyId: string;
  active: boolean;
}

interface AppSettings {
  darkMode: boolean;
  notifications: boolean;
  remindersBefore: number;
  units: 'metric' | 'imperial';
}

const { width, height } = Dimensions.get('window');

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'feeding' | 'sleep' | 'diaper' | 'growth' | 'milestones' | 'gallery' | 'routines' | 'reminders' | 'babies' | 'settings'>('dashboard');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [milestone, setMilestone] = useState('');
  const [medication, setMedication] = useState('');
  const [babies, setBabies] = useState<BabyProfile[]>([{ id: '1', name: 'My Baby', birthDate: new Date(), gender: 'other' }]);
  const [activeBaby, setActiveBaby] = useState('1');
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ darkMode: false, notifications: true, remindersBefore: 15, units: 'metric' });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showBabyModal, setShowBabyModal] = useState(false);
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [newBabyName, setNewBabyName] = useState('');
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(1));
  const timerRef = useRef<NodeJS.Timeout>();

  // Comprehensive data loading and saving
  useEffect(() => {
    loadAllData();
    startAnimations();
    registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {
    // Timer effect
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive]);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const pulseAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const registerForPushNotificationsAsync = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
    }
  };

  const loadAllData = async () => {
    try {
      const [activitiesData, babiesData, remindersData, routinesData, settingsData] = await Promise.all([
        AsyncStorage.getItem('activities'),
        AsyncStorage.getItem('babies'),
        AsyncStorage.getItem('reminders'),
        AsyncStorage.getItem('routines'),
        AsyncStorage.getItem('settings')
      ]);
      
      if (activitiesData) {
        const parsedActivities = JSON.parse(activitiesData).map((a: any) => ({
          ...a,
          time: new Date(a.time)
        }));
        setActivities(parsedActivities);
      }
      
      if (babiesData) {
        const parsedBabies = JSON.parse(babiesData).map((b: any) => ({
          ...b,
          birthDate: new Date(b.birthDate)
        }));
        setBabies(parsedBabies);
      }
      
      if (remindersData) {
        const parsedReminders = JSON.parse(remindersData).map((r: any) => ({
          ...r,
          date: new Date(r.date)
        }));
        setReminders(parsedReminders);
      }

      if (routinesData) {
        setRoutines(JSON.parse(routinesData));
      }

      if (settingsData) {
        setSettings(JSON.parse(settingsData));
      }
    } catch (error) {
      console.log('Error loading data:', error);
    }
  };

  const saveAllData = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem('activities', JSON.stringify(activities)),
        AsyncStorage.setItem('babies', JSON.stringify(babies)),
        AsyncStorage.setItem('reminders', JSON.stringify(reminders)),
        AsyncStorage.setItem('routines', JSON.stringify(routines)),
        AsyncStorage.setItem('settings', JSON.stringify(settings))
      ]);
    } catch (error) {
      console.log('Error saving data:', error);
    }
  };

  useEffect(() => {
    saveAllData();
  }, [activities, babies, reminders, routines, settings]);

  const addActivity = (type: Activity['type']) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      type,
      time: selectedDate,
      notes: notes || undefined,
      duration: duration ? parseInt(duration) : timerSeconds || undefined,
      weight: weight ? parseFloat(weight) : undefined,
      height: height ? parseFloat(height) : undefined,
      milestone: milestone || undefined,
      medication: medication || undefined,
      babyId: activeBaby,
    };
    
    setActivities([newActivity, ...activities]);
    clearForm();
    pulseAnimation();
    
    // Schedule reminder if needed
    if (type === 'feeding' || type === 'medication') {
      scheduleNextReminder(type);
    }
    
    Alert.alert('Success! 🎉', `${type.charAt(0).toUpperCase() + type.slice(1)} activity added for ${getCurrentBaby().name}!`);
  };

  const scheduleNextReminder = async (type: string) => {
    if (!settings.notifications) return;
    
    const nextTime = new Date();
    nextTime.setHours(nextTime.getHours() + (type === 'feeding' ? 3 : 8));
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${type === 'feeding' ? '🍼' : '💊'} BabyNest Reminder`,
        body: `Time for ${getCurrentBaby().name}'s ${type}!`,
        sound: true,
      },
      trigger: nextTime,
    });
  };

  const clearForm = () => {
    setNotes('');
    setDuration('');
    setWeight('');
    setHeight('');
    setMilestone('');
    setMedication('');
    setTimerSeconds(0);
    setTimerActive(false);
  };

  const getCurrentBaby = () => babies.find(b => b.id === activeBaby) || babies[0];

  const calculateAge = (baby: BabyProfile) => {
    const today = new Date();
    const birth = baby.birthDate;
    const ageInDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    
    if (ageInDays < 7) return `${ageInDays} days`;
    if (ageInDays < 30) return `${Math.floor(ageInDays / 7)} weeks`;
    if (ageInDays < 365) return `${Math.floor(ageInDays / 30)} months`;
    return `${Math.floor(ageInDays / 365)} years`;
  };

  const pickImage = async (forGallery = false) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: forGallery ? undefined : [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      if (forGallery) {
        addActivity('photo');
        const photoActivity: Activity = {
          id: Date.now().toString(),
          type: 'photo',
          time: new Date(),
          photo: result.assets[0].uri,
          notes,
          babyId: activeBaby,
        };
        setActivities([photoActivity, ...activities]);
        clearForm();
      } else {
        const updatedBabies = babies.map(b => 
          b.id === activeBaby ? { ...b, photo: result.assets[0].uri } : b
        );
        setBabies(updatedBabies);
      }
    }
  };

  const exportData = async () => {
    const data = {
      babies,
      activities: activities.filter(a => a.babyId === activeBaby),
      reminders: reminders.filter(r => r.babyId === activeBaby),
      routines: routines.filter(r => r.babyId === activeBaby),
      exportDate: new Date().toISOString(),
      babyName: getCurrentBaby().name
    };
    
    try {
      await Share.share({
        message: `${getCurrentBaby().name}'s BabyNest Data Export\n\nGenerated on: ${new Date().toLocaleDateString()}\n\nData:\n${JSON.stringify(data, null, 2)}`,
        title: `${getCurrentBaby().name} - BabyNest Export`
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      feeding: '🍼',
      sleep: '😴',
      diaper: '👶',
      growth: '📏',
      milestone: '🎉',
      medication: '💊',
      photo: '📷',
      appointment: '🏥'
    };
    return icons[type as keyof typeof icons] || '📝';
  };

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Chart data generation
  const getChartData = () => {
    const baby = getCurrentBaby();
    const babyActivities = activities.filter(a => a.babyId === baby.id);
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toDateString();
    }).reverse();

    const feedingData = last7Days.map(day => 
      babyActivities.filter(a => a.type === 'feeding' && a.time.toDateString() === day).length
    );

    const sleepData = last7Days.map(day => {
      const sleepActivities = babyActivities.filter(a => a.type === 'sleep' && a.time.toDateString() === day);
      return sleepActivities.reduce((total, activity) => total + (activity.duration || 0), 0) / 60; // Convert to hours
    });

    const growthData = babyActivities
      .filter(a => a.type === 'growth' && a.weight)
      .slice(-10)
      .map(a => a.weight || 0);

    return { feedingData, sleepData, growthData, labels: last7Days.map(d => new Date(d).toLocaleDateString().slice(0, 5)) };
  };

  const renderAdvancedDashboard = () => {
    const baby = getCurrentBaby();
    const today = new Date().toDateString();
    const babyActivities = activities.filter(a => a.babyId === baby.id);
    const todayActivities = babyActivities.filter(a => a.time.toDateString() === today);
    const thisWeek = babyActivities.filter(a => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return a.time >= weekAgo;
    });

    return (
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Baby Selector */}
          {babies.length > 1 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.babySelector}>
              {babies.map(baby => (
                <TouchableOpacity
                  key={baby.id}
                  style={[styles.babyChip, activeBaby === baby.id && styles.activeBabyChip]}
                  onPress={() => setActiveBaby(baby.id)}
                >
                  <Text style={[styles.babyChipText, activeBaby === baby.id && styles.activeBabyChipText]}>
                    {baby.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Welcome Card with Enhanced Info */}
          <LinearGradient
            colors={settings.darkMode ? ['#2d3748', '#4a5568'] : ['#667eea', '#764ba2']}
            style={styles.welcomeCard}
          >
            <View style={styles.profileSection}>
              {baby.photo ? (
                <Image source={{ uri: baby.photo }} style={styles.babyPhoto} />
              ) : (
                <View style={styles.placeholderPhoto}>
                  <Text style={styles.placeholderText}>👶</Text>
                </View>
              )}
              <View style={styles.babyInfo}>
                <Text style={styles.babyName}>{baby.name}</Text>
                <Text style={styles.babyAge}>{calculateAge(baby)} old</Text>
                <Text style={styles.babyStats}>
                  Today: {todayActivities.length} activities • Week: {thisWeek.length} total
                </Text>
              </View>
              <TouchableOpacity style={styles.addBabyButton} onPress={() => setShowBabyModal(true)}>
                <Text style={styles.addBabyButtonText}>👶+</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Live Timer */}
          {timerActive && (
            <Animated.View style={[styles.timerCard, { transform: [{ scale: scaleAnim }] }]}>
              <LinearGradient colors={['#ff9a9e', '#fecfef']} style={styles.timerGradient}>
                <Text style={styles.timerLabel}>Activity Timer</Text>
                <Text style={styles.timerDisplay}>{formatTimer(timerSeconds)}</Text>
                <TouchableOpacity 
                  style={styles.stopTimerButton}
                  onPress={() => setTimerActive(false)}
                >
                  <Text style={styles.stopTimerText}>⏹️ Stop</Text>
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>
          )}

          {/* Enhanced Summary Grid */}
          <Text style={[styles.title, settings.darkMode && styles.darkText]}>Today's Summary</Text>
          <Animated.View 
            style={[
              styles.summaryGrid, 
              { 
                transform: [{ 
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0]
                  })
                }]
              }
            ]}
          >
            {[
              { type: 'feeding', label: 'Feeds', color: ['#ff9a9e', '#fecfef'] },
              { type: 'sleep', label: 'Sleep', color: ['#a8edea', '#fed6e3'] },
              { type: 'diaper', label: 'Diapers', color: ['#ffecd2', '#fcb69f'] },
            ].map((item, index) => {
              const count = todayActivities.filter(a => a.type === item.type).length;
              const totalDuration = todayActivities
                .filter(a => a.type === item.type)
                .reduce((sum, a) => sum + (a.duration || 0), 0);
              
              return (
                <TouchableOpacity 
                  key={item.type}
                  onPress={() => setActiveTab(item.type as any)}
                  style={styles.summaryCardContainer}
                >
                  <LinearGradient colors={item.color} style={styles.summaryCard}>
                    <Text style={styles.summaryIcon}>{getActivityIcon(item.type)}</Text>
                    <Text style={styles.summaryNumber}>{count}</Text>
                    <Text style={styles.summaryLabel}>{item.label}</Text>
                    {item.type === 'sleep' && totalDuration > 0 && (
                      <Text style={styles.summarySubtext}>{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </Animated.View>

          {/* Advanced Statistics */}
          <View style={styles.statsSection}>
            <Text style={[styles.sectionTitle, settings.darkMode && styles.darkText]}>Weekly Overview</Text>
            <View style={styles.statsRow}>
              <LinearGradient colors={['#667eea', '#764ba2']} style={styles.statCard}>
                <Text style={styles.statNumber}>{thisWeek.length}</Text>
                <Text style={styles.statLabel}>Total Activities</Text>
              </LinearGradient>
              <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.statCard}>
                <Text style={styles.statNumber}>{babyActivities.filter(a => a.type === 'milestone').length}</Text>
                <Text style={styles.statLabel}>Milestones</Text>
              </LinearGradient>
              <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.statCard}>
                <Text style={styles.statNumber}>{babyActivities.filter(a => a.type === 'photo').length}</Text>
                <Text style={styles.statLabel}>Photos</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Upcoming Reminders */}
          <View style={styles.remindersSection}>
            <Text style={[styles.sectionTitle, settings.darkMode && styles.darkText]}>Upcoming Reminders</Text>
            {reminders.filter(r => r.babyId === activeBaby && !r.completed && r.date > new Date()).slice(0, 3).map(reminder => (
              <View key={reminder.id} style={[styles.reminderItem, settings.darkMode && styles.darkCard]}>
                <Text style={styles.reminderIcon}>{getActivityIcon(reminder.type)}</Text>
                <View style={styles.reminderContent}>
                  <Text style={[styles.reminderTitle, settings.darkMode && styles.darkText]}>{reminder.title}</Text>
                  <Text style={styles.reminderTime}>{reminder.date.toLocaleString()}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Recent Activities with Photos */}
          <Text style={[styles.sectionTitle, settings.darkMode && styles.darkText]}>Recent Activities</Text>
          {babyActivities.slice(0, 10).map(activity => (
            <Animated.View key={activity.id} style={[styles.activityItem, { opacity: fadeAnim }, settings.darkMode && styles.darkCard]}>
              <Text style={styles.activityIcon}>{getActivityIcon(activity.type)}</Text>
              <View style={styles.activityContent}>
                <Text style={[styles.activityType, settings.darkMode && styles.darkText]}>{activity.type.toUpperCase()}</Text>
                <Text style={styles.activityTime}>{activity.time.toLocaleString()}</Text>
                {activity.notes && <Text style={styles.activityNotes}>{activity.notes}</Text>}
                {activity.weight && <Text style={styles.activityDetails}>Weight: {activity.weight}kg</Text>}
                {activity.height && <Text style={styles.activityDetails}>Height: {activity.height}cm</Text>}
                {activity.milestone && <Text style={styles.activityDetails}>🎉 {activity.milestone}</Text>}
                {activity.duration && <Text style={styles.activityDetails}>Duration: {Math.floor(activity.duration / 60)}h {activity.duration % 60}m</Text>}
              </View>
              {activity.photo && (
                <Image source={{ uri: activity.photo }} style={styles.activityPhoto} />
              )}
            </Animated.View>
          ))}
        </ScrollView>
      </Animated.View>
    );
  };

  const renderAnalytics = () => {
    const { feedingData, sleepData, growthData, labels } = getChartData();
    
    return (
      <ScrollView style={[styles.content, settings.darkMode && styles.darkBackground]}>
        <Text style={[styles.title, settings.darkMode && styles.darkText]}>Analytics Dashboard</Text>
        
        {/* Feeding Chart */}
        <View style={[styles.chartContainer, settings.darkMode && styles.darkCard]}>
          <Text style={[styles.chartTitle, settings.darkMode && styles.darkText]}>📊 Feeding Frequency (7 Days)</Text>
          <LineChart
            data={{
              labels,
              datasets: [{ data: feedingData }]
            }}
            width={width - 60}
            height={200}
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: settings.darkMode ? '#2d3748' : '#667eea',
              backgroundGradientFrom: settings.darkMode ? '#2d3748' : '#667eea',
              backgroundGradientTo: settings.darkMode ? '#4a5568' : '#764ba2',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726'
              }
            }}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Sleep Chart */}
        <View style={[styles.chartContainer, settings.darkMode && styles.darkCard]}>
          <Text style={[styles.chartTitle, settings.darkMode && styles.darkText]}>😴 Sleep Duration (Hours)</Text>
          <BarChart
            data={{
              labels,
              datasets: [{ data: sleepData.length > 0 ? sleepData : [0] }]
            }}
            width={width - 60}
            height={200}
            yAxisLabel=""
            yAxisSuffix="h"
            chartConfig={{
              backgroundColor: settings.darkMode ? '#2d3748' : '#a8edea',
              backgroundGradientFrom: settings.darkMode ? '#2d3748' : '#a8edea',
              backgroundGradientTo: settings.darkMode ? '#4a5568' : '#fed6e3',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: { borderRadius: 16 }
            }}
            style={styles.chart}
          />
        </View>

        {/* Growth Chart */}
        {growthData.length > 0 && (
          <View style={[styles.chartContainer, settings.darkMode && styles.darkCard]}>
            <Text style={[styles.chartTitle, settings.darkMode && styles.darkText]}>📏 Growth Tracking (Weight)</Text>
            <LineChart
              data={{
                labels: growthData.map((_, i) => `${i + 1}`),
                datasets: [{ data: growthData }]
              }}
              width={width - 60}
              height={200}
              yAxisSuffix="kg"
              chartConfig={{
                backgroundColor: settings.darkMode ? '#2d3748' : '#ffecd2',
                backgroundGradientFrom: settings.darkMode ? '#2d3748' : '#ffecd2',
                backgroundGradientTo: settings.darkMode ? '#4a5568' : '#fcb69f',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#ffa726'
                }
              }}
              bezier
              style={styles.chart}
            />
          </View>
        )}

        {/* Activity Distribution */}
        <View style={[styles.chartContainer, settings.darkMode && styles.darkCard]}>
          <Text style={[styles.chartTitle, settings.darkMode && styles.darkText]}>📈 Activity Distribution</Text>
          <PieChart
            data={[
              { name: 'Feeding', population: activities.filter(a => a.type === 'feeding' && a.babyId === activeBaby).length, color: '#ff9a9e', legendFontColor: settings.darkMode ? '#fff' : '#333' },
              { name: 'Sleep', population: activities.filter(a => a.type === 'sleep' && a.babyId === activeBaby).length, color: '#a8edea', legendFontColor: settings.darkMode ? '#fff' : '#333' },
              { name: 'Diaper', population: activities.filter(a => a.type === 'diaper' && a.babyId === activeBaby).length, color: '#ffecd2', legendFontColor: settings.darkMode ? '#fff' : '#333' },
              { name: 'Growth', population: activities.filter(a => a.type === 'growth' && a.babyId === activeBaby).length, color: '#667eea', legendFontColor: settings.darkMode ? '#fff' : '#333' },
            ]}
            width={width - 60}
            height={200}
            chartConfig={{
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
          />
        </View>
      </ScrollView>
    );
  };

  const renderEnhancedTrackingForm = (type: Activity['type']) => (
    <ScrollView style={[styles.content, settings.darkMode && styles.darkBackground]}>
      <LinearGradient
        colors={settings.darkMode ? ['#2d3748', '#4a5568'] : ['#ffecd2', '#fcb69f']}
        style={styles.formHeader}
      >
        <Text style={styles.formTitle}>{getActivityIcon(type)} Track {type.charAt(0).toUpperCase() + type.slice(1)}</Text>
        <Text style={styles.formSubtitle}>For {getCurrentBaby().name}</Text>
      </LinearGradient>
      
      <View style={styles.form}>
        {/* Timer Section for Sleep/Feeding */}
        {(type === 'sleep' || type === 'feeding') && (
          <View style={[styles.formGroup, styles.timerSection]}>
            <Text style={[styles.label, settings.darkMode && styles.darkText]}>Activity Timer</Text>
            <View style={styles.timerControls}>
              <Text style={[styles.timerDisplay, settings.darkMode && styles.darkText]}>{formatTimer(timerSeconds)}</Text>
              <TouchableOpacity
                style={[styles.timerButton, timerActive && styles.timerButtonActive]}
                onPress={() => setTimerActive(!timerActive)}
              >
                <Text style={styles.timerButtonText}>{timerActive ? '⏸️' : '▶️'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.timerResetButton}
                onPress={() => {
                  setTimerSeconds(0);
                  setTimerActive(false);
                }}
              >
                <Text style={styles.timerButtonText}>🔄</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Date/Time Picker */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, settings.darkMode && styles.darkText]}>Date & Time</Text>
          <TouchableOpacity 
            style={[styles.input, styles.dateInput]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.dateText, settings.darkMode && styles.darkText]}>
              📅 {selectedDate.toLocaleString()}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="datetime"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) setSelectedDate(date);
            }}
          />
        )}

        <View style={styles.formGroup}>
          <Text style={[styles.label, settings.darkMode && styles.darkText]}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea, settings.darkMode && styles.darkInput]}
            value={notes}
            onChangeText={setNotes}
            placeholder={`Add notes about ${type}...`}
            placeholderTextColor={settings.darkMode ? '#a0aec0' : '#718096'}
            multiline
            numberOfLines={4}
          />
        </View>

        {type === 'sleep' && (
          <View style={styles.formGroup}>
            <Text style={[styles.label, settings.darkMode && styles.darkText]}>Manual Duration (minutes)</Text>
            <TextInput
              style={[styles.input, settings.darkMode && styles.darkInput]}
              value={duration}
              onChangeText={setDuration}
              placeholder="Or enter duration manually"
              placeholderTextColor={settings.darkMode ? '#a0aec0' : '#718096'}
              keyboardType="numeric"
            />
          </View>
        )}

        {type === 'growth' && (
          <>
            <View style={styles.formRow}>
              <View style={styles.formHalf}>
                <Text style={[styles.label, settings.darkMode && styles.darkText]}>Weight ({settings.units === 'metric' ? 'kg' : 'lbs'})</Text>
                <TextInput
                  style={[styles.input, settings.darkMode && styles.darkInput]}
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="0.0"
                  placeholderTextColor={settings.darkMode ? '#a0aec0' : '#718096'}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.formHalf}>
                <Text style={[styles.label, settings.darkMode && styles.darkText]}>Height ({settings.units === 'metric' ? 'cm' : 'in'})</Text>
                <TextInput
                  style={[styles.input, settings.darkMode && styles.darkInput]}
                  value={height}
                  onChangeText={setHeight}
                  placeholder="0.0"
                  placeholderTextColor={settings.darkMode ? '#a0aec0' : '#718096'}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </>
        )}

        {type === 'milestone' && (
          <View style={styles.formGroup}>
            <Text style={[styles.label, settings.darkMode && styles.darkText]}>Milestone Achievement 🎉</Text>
            <TextInput
              style={[styles.input, settings.darkMode && styles.darkInput]}
              value={milestone}
              onChangeText={setMilestone}
              placeholder="What milestone was reached?"
              placeholderTextColor={settings.darkMode ? '#a0aec0' : '#718096'}
            />
          </View>
        )}

        {type === 'medication' && (
          <View style={styles.formGroup}>
            <Text style={[styles.label, settings.darkMode && styles.darkText]}>Medication Details 💊</Text>
            <TextInput
              style={[styles.input, settings.darkMode && styles.darkInput]}
              value={medication}
              onChangeText={setMedication}
              placeholder="Medication name and dosage"
              placeholderTextColor={settings.darkMode ? '#a0aec0' : '#718096'}
            />
          </View>
        )}

        {type === 'photo' && (
          <TouchableOpacity style={styles.photoButton} onPress={() => pickImage(true)}>
            <Text style={styles.photoButtonText}>📷 Add Photo</Text>
          </TouchableOpacity>
        )}

        <LinearGradient
          colors={settings.darkMode ? ['#4a5568', '#2d3748'] : ['#667eea', '#764ba2']}
          style={styles.addButton}
        >
          <TouchableOpacity style={styles.addButtonInner} onPress={() => addActivity(type)}>
            <Text style={styles.addButtonText}>✨ Add {type.charAt(0).toUpperCase() + type.slice(1)}</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </ScrollView>
  );

  const renderPhotoGallery = () => {
    const babyActivities = activities.filter(a => a.babyId === activeBaby);
    const photos = babyActivities.filter(a => a.photo);

    return (
      <View style={[styles.content, settings.darkMode && styles.darkBackground]}>
        <View style={styles.galleryHeader}>
          <Text style={[styles.title, settings.darkMode && styles.darkText]}>📷 Photo Gallery</Text>
          <TouchableOpacity style={styles.addPhotoButton} onPress={() => pickImage(true)}>
            <Text style={styles.addPhotoButtonText}>+ Add Photo</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={photos}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.galleryItem}>
              <Image source={{ uri: item.photo }} style={styles.galleryImage} />
              <View style={styles.galleryOverlay}>
                <Text style={styles.galleryDate}>{item.time.toLocaleDateString()}</Text>
                {item.notes && <Text style={styles.galleryNotes}>{item.notes}</Text>}
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.galleryGrid}
        />
      </View>
    );
  };

  const renderRoutinesTab = () => {
    const babyRoutines = routines.filter(r => r.babyId === activeBaby);

    return (
      <ScrollView style={[styles.content, settings.darkMode && styles.darkBackground]}>
        <View style={styles.routinesHeader}>
          <Text style={[styles.title, settings.darkMode && styles.darkText]}>⏰ Daily Routines</Text>
          <TouchableOpacity style={styles.addRoutineButton} onPress={() => setShowRoutineModal(true)}>
            <Text style={styles.addRoutineButtonText}>+ Add Routine</Text>
          </TouchableOpacity>
        </View>

        {babyRoutines.map(routine => (
          <View key={routine.id} style={[styles.routineCard, settings.darkMode && styles.darkCard]}>
            <View style={styles.routineHeader}>
              <Text style={[styles.routineName, settings.darkMode && styles.darkText]}>{routine.name}</Text>
              <Switch
                value={routine.active}
                onValueChange={(value) => {
                  const updatedRoutines = routines.map(r =>
                    r.id === routine.id ? { ...r, active: value } : r
                  );
                  setRoutines(updatedRoutines);
                }}
              />
            </View>
            <View style={styles.routineActivities}>
              {routine.activities.map((activity, index) => (
                <Text key={index} style={styles.routineActivity}>
                  {activity.time} - {getActivityIcon(activity.type)} {activity.type}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderSettings = () => (
    <ScrollView style={[styles.content, settings.darkMode && styles.darkBackground]}>
      <Text style={[styles.title, settings.darkMode && styles.darkText]}>⚙️ Settings</Text>
      
      <View style={[styles.settingsCard, settings.darkMode && styles.darkCard]}>
        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, settings.darkMode && styles.darkText]}>🌙 Dark Mode</Text>
          <Switch
            value={settings.darkMode}
            onValueChange={(value) => setSettings({ ...settings, darkMode: value })}
          />
        </View>
        
        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, settings.darkMode && styles.darkText]}>🔔 Notifications</Text>
          <Switch
            value={settings.notifications}
            onValueChange={(value) => setSettings({ ...settings, notifications: value })}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, settings.darkMode && styles.darkText]}>📏 Units</Text>
          <TouchableOpacity
            style={styles.unitsButton}
            onPress={() => setSettings({ 
              ...settings, 
              units: settings.units === 'metric' ? 'imperial' : 'metric' 
            })}
          >
            <Text style={styles.unitsButtonText}>{settings.units === 'metric' ? 'Metric' : 'Imperial'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.exportButton} onPress={exportData}>
        <Text style={styles.exportButtonText}>📤 Export Baby Data</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>BabyNest v2.0 - Advanced Baby Tracking</Text>
    </ScrollView>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderAdvancedDashboard();
      case 'analytics':
        return renderAnalytics();
      case 'feeding':
        return renderEnhancedTrackingForm('feeding');
      case 'sleep':
        return renderEnhancedTrackingForm('sleep');
      case 'diaper':
        return renderEnhancedTrackingForm('diaper');
      case 'growth':
        return renderEnhancedTrackingForm('growth');
      case 'milestones':
        return renderEnhancedTrackingForm('milestone');
      case 'gallery':
        return renderPhotoGallery();
      case 'routines':
        return renderRoutinesTab();
      case 'settings':
        return renderSettings();
      default:
        return renderAdvancedDashboard();
    }
  };

  return (
    <View style={[styles.container, settings.darkMode && styles.darkContainer]}>
      <LinearGradient
        colors={settings.darkMode ? ['#2d3748', '#4a5568'] : ['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>🍼 BabyNest Pro</Text>
        <Text style={styles.headerSubtitle}>Advanced Baby Tracking & Analytics</Text>
      </LinearGradient>
      
      {renderContent()}

      {/* Enhanced Tab Bar */}
      <View style={[styles.tabBar, settings.darkMode && styles.darkTabBar]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { key: 'dashboard', icon: '🏠', label: 'Home' },
            { key: 'analytics', icon: '📊', label: 'Charts' },
            { key: 'feeding', icon: '🍼', label: 'Feed' },
            { key: 'sleep', icon: '😴', label: 'Sleep' },
            { key: 'diaper', icon: '👶', label: 'Diaper' },
            { key: 'growth', icon: '📏', label: 'Growth' },
            { key: 'milestones', icon: '🎉', label: 'Milestones' },
            { key: 'gallery', icon: '📷', label: 'Photos' },
            { key: 'routines', icon: '⏰', label: 'Routines' },
            { key: 'settings', icon: '⚙️', label: 'Settings' }
          ].map((tab) => (
            <TouchableOpacity 
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key as any)}
            >
              <Text style={[styles.tabIcon, activeTab === tab.key && styles.activeTabIcon]}>
                {tab.icon}
              </Text>
              <Text style={[
                styles.tabText, 
                activeTab === tab.key && styles.activeTabText,
                settings.darkMode && styles.darkTabText
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* New Baby Modal */}
      <Modal visible={showBabyModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, settings.darkMode && styles.darkCard]}>
            <Text style={[styles.modalTitle, settings.darkMode && styles.darkText]}>Add New Baby</Text>
            <TextInput
              style={[styles.input, settings.darkMode && styles.darkInput]}
              value={newBabyName}
              onChangeText={setNewBabyName}
              placeholder="Baby's name"
              placeholderTextColor={settings.darkMode ? '#a0aec0' : '#718096'}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  if (newBabyName.trim()) {
                    const newBaby: BabyProfile = {
                      id: Date.now().toString(),
                      name: newBabyName.trim(),
                      birthDate: new Date(),
                      gender: 'other'
                    };
                    setBabies([...babies, newBaby]);
                    setActiveBaby(newBaby.id);
                    setNewBabyName('');
                    setShowBabyModal(false);
                  }
                }}
              >
                <Text style={styles.modalButtonText}>Add Baby</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setNewBabyName('');
                  setShowBabyModal(false);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      <StatusBar style={settings.darkMode ? "light" : "dark"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  darkContainer: {
    backgroundColor: '#1a202c',
  },
  darkBackground: {
    backgroundColor: '#1a202c',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  babySelector: {
    marginVertical: 10,
  },
  babyChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeBabyChip: {
    backgroundColor: '#667eea',
    borderColor: '#764ba2',
  },
  babyChipText: {
    color: '#333',
    fontWeight: '600',
  },
  activeBabyChipText: {
    color: 'white',
  },
  welcomeCard: {
    borderRadius: 15,
    padding: 20,
    marginVertical: 15,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  babyPhoto: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    borderWidth: 3,
    borderColor: 'white',
  },
  placeholderPhoto: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    borderWidth: 3,
    borderColor: 'white',
  },
  placeholderText: {
    fontSize: 30,
  },
  babyInfo: {
    flex: 1,
  },
  babyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  babyAge: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  babyStats: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  addBabyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBabyButtonText: {
    fontSize: 20,
    color: 'white',
  },
  timerCard: {
    marginVertical: 10,
  },
  timerGradient: {
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  timerDisplay: {
    fontSize: 36,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginVertical: 10,
  },
  stopTimerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  stopTimerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#2d3748',
  },
  darkText: {
    color: '#f7fafc',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCardContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  summaryCard: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  summaryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  summaryLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
    fontWeight: '600',
  },
  summarySubtext: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  statsSection: {
    marginVertical: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  statCard: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2d3748',
  },
  remindersSection: {
    marginVertical: 15,
  },
  reminderItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reminderIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  reminderTime: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  activityItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#2d3748',
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  activityContent: {
    flex: 1,
  },
  activityType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 4,
  },
  activityNotes: {
    fontSize: 12,
    color: '#4a5568',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  activityDetails: {
    fontSize: 12,
    color: '#2d3748',
    marginBottom: 2,
  },
  activityPhoto: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginLeft: 10,
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 15,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  formHeader: {
    borderRadius: 12,
    padding: 20,
    marginVertical: 15,
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  formSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  form: {
    paddingBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formHalf: {
    flex: 0.48,
  },
  timerSection: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  timerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  timerButton: {
    backgroundColor: '#667eea',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerButtonActive: {
    backgroundColor: '#f56565',
  },
  timerResetButton: {
    backgroundColor: '#718096',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerButtonText: {
    fontSize: 20,
    color: 'white',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2d3748',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  darkInput: {
    backgroundColor: '#4a5568',
    color: '#f7fafc',
    borderColor: '#718096',
  },
  dateInput: {
    paddingVertical: 18,
  },
  dateText: {
    fontSize: 16,
    color: '#4a5568',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  photoButton: {
    backgroundColor: '#48bb78',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  photoButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  addButtonInner: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addPhotoButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addPhotoButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  galleryGrid: {
    paddingBottom: 20,
  },
  galleryItem: {
    flex: 1,
    margin: 5,
    borderRadius: 12,
    overflow: 'hidden',
  },
  galleryImage: {
    width: '100%',
    height: 150,
  },
  galleryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
  },
  galleryDate: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  galleryNotes: {
    color: 'white',
    fontSize: 10,
    marginTop: 2,
  },
  routinesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addRoutineButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addRoutineButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  routineCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  routineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  routineActivities: {
    marginTop: 10,
  },
  routineActivity: {
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 5,
  },
  settingsCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#2d3748',
    fontWeight: '500',
  },
  unitsButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  unitsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  exportButton: {
    backgroundColor: '#48bb78',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  exportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionText: {
    textAlign: 'center',
    color: '#718096',
    fontSize: 12,
    marginBottom: 20,
  },
  tabBar: {
    backgroundColor: 'white',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  darkTabBar: {
    backgroundColor: '#2d3748',
    borderTopColor: '#4a5568',
  },
  tab: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 70,
  },
  activeTab: {
    backgroundColor: '#f0f4ff',
    borderRadius: 8,
    margin: 4,
  },
  tabIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  activeTabIcon: {
    transform: [{ scale: 1.2 }],
  },
  tabText: {
    fontSize: 10,
    color: '#718096',
  },
  darkTabText: {
    color: '#a0aec0',
  },
  activeTabText: {
    color: '#667eea',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#718096',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});