import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert, Image, Modal, Animated, Dimensions, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

interface Activity {
  id: string;
  type: 'feeding' | 'sleep' | 'diaper' | 'growth' | 'milestone' | 'medication';
  time: Date;
  notes?: string;
  duration?: number;
  weight?: number;
  height?: number;
  milestone?: string;
  medication?: string;
}

interface BabyProfile {
  name: string;
  birthDate: Date;
  photo?: string;
  gender: 'boy' | 'girl' | 'other';
}

interface Reminder {
  id: string;
  type: 'medication' | 'appointment' | 'milestone';
  title: string;
  date: Date;
  completed: boolean;
}

const { width } = Dimensions.get('window');

export default function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'feeding' | 'sleep' | 'diaper' | 'growth' | 'milestones' | 'profile' | 'reminders'>('dashboard');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [milestone, setMilestone] = useState('');
  const [medication, setMedication] = useState('');
  const [babyProfile, setBabyProfile] = useState<BabyProfile>({ name: 'My Baby', birthDate: new Date(), gender: 'other' });
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(0));

  // Data persistence
  useEffect(() => {
    loadData();
    startAnimations();
  }, []);

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

  const loadData = async () => {
    try {
      const activitiesData = await AsyncStorage.getItem('activities');
      const profileData = await AsyncStorage.getItem('babyProfile');
      const remindersData = await AsyncStorage.getItem('reminders');
      
      if (activitiesData) {
        const parsedActivities = JSON.parse(activitiesData).map((a: any) => ({
          ...a,
          time: new Date(a.time)
        }));
        setActivities(parsedActivities);
      }
      
      if (profileData) {
        const parsedProfile = JSON.parse(profileData);
        setBabyProfile({
          ...parsedProfile,
          birthDate: new Date(parsedProfile.birthDate)
        });
      }
      
      if (remindersData) {
        const parsedReminders = JSON.parse(remindersData).map((r: any) => ({
          ...r,
          date: new Date(r.date)
        }));
        setReminders(parsedReminders);
      }
    } catch (error) {
      console.log('Error loading data:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('activities', JSON.stringify(activities));
      await AsyncStorage.setItem('babyProfile', JSON.stringify(babyProfile));
      await AsyncStorage.setItem('reminders', JSON.stringify(reminders));
    } catch (error) {
      console.log('Error saving data:', error);
    }
  };

  useEffect(() => {
    saveData();
  }, [activities, babyProfile, reminders]);

  const addActivity = (type: Activity['type']) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      type,
      time: new Date(),
      notes: notes || undefined,
      duration: duration ? parseInt(duration) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      height: height ? parseFloat(height) : undefined,
      milestone: milestone || undefined,
      medication: medication || undefined,
    };
    setActivities([newActivity, ...activities]);
    clearForm();
    Alert.alert('Success', `${type.charAt(0).toUpperCase() + type.slice(1)} activity added!`);
  };

  const clearForm = () => {
    setNotes('');
    setDuration('');
    setWeight('');
    setHeight('');
    setMilestone('');
    setMedication('');
  };

  const calculateAge = () => {
    const today = new Date();
    const birth = babyProfile.birthDate;
    const ageInDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    
    if (ageInDays < 7) return `${ageInDays} days old`;
    if (ageInDays < 30) return `${Math.floor(ageInDays / 7)} weeks old`;
    return `${Math.floor(ageInDays / 30)} months old`;
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setBabyProfile({ ...babyProfile, photo: result.assets[0].uri });
    }
  };

  const exportData = async () => {
    const data = {
      profile: babyProfile,
      activities: activities,
      reminders: reminders
    };
    
    try {
      await Share.share({
        message: `BabyNest Data Export:\n\n${JSON.stringify(data, null, 2)}`,
        title: 'Export BabyNest Data'
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
      medication: '💊'
    };
    return icons[type as keyof typeof icons] || '📝';
  };

  const renderDashboard = () => {
    const today = new Date().toDateString();
    const todayActivities = activities.filter(a => a.time.toDateString() === today);
    const thisWeek = activities.filter(a => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return a.time >= weekAgo;
    });

    return (
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.welcomeCard}
          >
            <View style={styles.profileSection}>
              {babyProfile.photo ? (
                <Image source={{ uri: babyProfile.photo }} style={styles.babyPhoto} />
              ) : (
                <View style={styles.placeholderPhoto}>
                  <Text style={styles.placeholderText}>👶</Text>
                </View>
              )}
              <View style={styles.babyInfo}>
                <Text style={styles.babyName}>{babyProfile.name}</Text>
                <Text style={styles.babyAge}>{calculateAge()}</Text>
              </View>
            </View>
          </LinearGradient>

          <Text style={styles.title}>Today's Summary</Text>
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
            {['feeding', 'sleep', 'diaper'].map((type, index) => (
              <View key={type} style={[styles.summaryCard, { backgroundColor: index % 2 === 0 ? '#ff9a9e' : '#a8edea' }]}>
                <Text style={styles.summaryIcon}>{getActivityIcon(type)}</Text>
                <Text style={styles.summaryNumber}>{todayActivities.filter(a => a.type === type).length}</Text>
                <Text style={styles.summaryLabel}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
              </View>
            ))}
          </Animated.View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{thisWeek.length}</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{activities.filter(a => a.type === 'milestone').length}</Text>
              <Text style={styles.statLabel}>Milestones</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Recent Activities</Text>
          {activities.slice(0, 8).map(activity => (
            <Animated.View key={activity.id} style={[styles.activityItem, { opacity: fadeAnim }]}>
              <Text style={styles.activityIcon}>{getActivityIcon(activity.type)}</Text>
              <View style={styles.activityContent}>
                <Text style={styles.activityType}>{activity.type.toUpperCase()}</Text>
                <Text style={styles.activityTime}>{activity.time.toLocaleString()}</Text>
                {activity.notes && <Text style={styles.activityNotes}>{activity.notes}</Text>}
                {activity.weight && <Text style={styles.activityDetails}>Weight: {activity.weight}kg</Text>}
                {activity.height && <Text style={styles.activityDetails}>Height: {activity.height}cm</Text>}
                {activity.milestone && <Text style={styles.activityDetails}>🎉 {activity.milestone}</Text>}
              </View>
            </Animated.View>
          ))}
        </ScrollView>
      </Animated.View>
    );
  };

  const renderTrackingForm = (type: Activity['type']) => (
    <ScrollView style={styles.content}>
      <LinearGradient
        colors={['#ffecd2', '#fcb69f']}
        style={styles.formHeader}
      >
        <Text style={styles.formTitle}>{getActivityIcon(type)} Track {type.charAt(0).toUpperCase() + type.slice(1)}</Text>
      </LinearGradient>
      
      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={styles.input}
            value={notes}
            onChangeText={setNotes}
            placeholder={`Add notes about ${type}...`}
            multiline
          />
        </View>

        {type === 'sleep' && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Duration (minutes)</Text>
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              placeholder="How long?"
              keyboardType="numeric"
            />
          </View>
        )}

        {type === 'growth' && (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="Enter weight"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput
                style={styles.input}
                value={height}
                onChangeText={setHeight}
                placeholder="Enter height"
                keyboardType="numeric"
              />
            </View>
          </>
        )}

        {type === 'milestone' && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Milestone Achievement</Text>
            <TextInput
              style={styles.input}
              value={milestone}
              onChangeText={setMilestone}
              placeholder="What milestone was reached?"
            />
          </View>
        )}

        {type === 'medication' && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Medication Name</Text>
            <TextInput
              style={styles.input}
              value={medication}
              onChangeText={setMedication}
              placeholder="What medication was given?"
            />
          </View>
        )}

        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.addButton}
        >
          <TouchableOpacity style={styles.addButtonInner} onPress={() => addActivity(type)}>
            <Text style={styles.addButtonText}>Add {type.charAt(0).toUpperCase() + type.slice(1)}</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </ScrollView>
  );

  const renderProfile = () => (
    <ScrollView style={styles.content}>
      <LinearGradient
        colors={['#a8edea', '#fed6e3']}
        style={styles.profileHeader}
      >
        <TouchableOpacity onPress={pickImage} style={styles.photoContainer}>
          {babyProfile.photo ? (
            <Image source={{ uri: babyProfile.photo }} style={styles.profilePhoto} />
          ) : (
            <View style={styles.placeholderProfilePhoto}>
              <Text style={styles.placeholderPhotoText}>📷 Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Baby's Name</Text>
          <TextInput
            style={styles.input}
            value={babyProfile.name}
            onChangeText={(name) => setBabyProfile({ ...babyProfile, name })}
            placeholder="Enter baby's name"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderButtons}>
            {['boy', 'girl', 'other'].map((gender) => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.genderButton,
                  babyProfile.gender === gender && styles.selectedGender
                ]}
                onPress={() => setBabyProfile({ ...babyProfile, gender: gender as any })}
              >
                <Text style={[
                  styles.genderButtonText,
                  babyProfile.gender === gender && styles.selectedGenderText
                ]}>
                  {gender === 'boy' ? '👦' : gender === 'girl' ? '👧' : '👶'} {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.exportButton} onPress={exportData}>
          <Text style={styles.exportButtonText}>📤 Export Data</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'feeding':
        return renderTrackingForm('feeding');
      case 'sleep':
        return renderTrackingForm('sleep');
      case 'diaper':
        return renderTrackingForm('diaper');
      case 'growth':
        return renderTrackingForm('growth');
      case 'milestones':
        return renderTrackingForm('milestone');
      case 'profile':
        return renderProfile();
      default:
        return renderDashboard();
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>🍼 BabyNest</Text>
        <Text style={styles.headerSubtitle}>Your baby's digital diary</Text>
      </LinearGradient>
      
      {renderContent()}

      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { key: 'dashboard', icon: '📊', label: 'Home' },
            { key: 'feeding', icon: '🍼', label: 'Feed' },
            { key: 'sleep', icon: '😴', label: 'Sleep' },
            { key: 'diaper', icon: '👶', label: 'Diaper' },
            { key: 'growth', icon: '📏', label: 'Growth' },
            { key: 'milestones', icon: '🎉', label: 'Milestones' },
            { key: 'profile', icon: '👤', label: 'Profile' }
          ].map((tab) => (
            <TouchableOpacity 
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key as any)}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  placeholderPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  placeholderText: {
    fontSize: 24,
  },
  babyInfo: {
    flex: 1,
  },
  babyName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  babyAge: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#2d3748',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
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
    color: '#2d3748',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#4a5568',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
  },
  statLabel: {
    fontSize: 12,
    color: '#4a5568',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2d3748',
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
  formHeader: {
    borderRadius: 12,
    padding: 20,
    marginVertical: 15,
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  form: {
    paddingBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
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
  profileHeader: {
    borderRadius: 12,
    padding: 30,
    marginVertical: 15,
    alignItems: 'center',
  },
  photoContainer: {
    alignItems: 'center',
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'white',
  },
  placeholderProfilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    borderStyle: 'dashed',
  },
  placeholderPhotoText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  genderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  genderButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    flex: 1,
    marginHorizontal: 4,
  },
  selectedGender: {
    borderColor: '#667eea',
    backgroundColor: '#f0f4ff',
  },
  genderButtonText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#4a5568',
  },
  selectedGenderText: {
    color: '#667eea',
    fontWeight: 'bold',
  },
  exportButton: {
    backgroundColor: '#48bb78',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  exportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  tabText: {
    fontSize: 10,
    color: '#718096',
  },
  activeTabText: {
    color: '#667eea',
    fontWeight: 'bold',
  },
});