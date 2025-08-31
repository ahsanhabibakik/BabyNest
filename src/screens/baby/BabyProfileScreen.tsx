import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { SafeScreen } from '@/components/common/SafeScreen';
import { useBabyStore } from '@/store/babyStore';
import { useAppStore } from '@/store/appStore';
import { Baby } from '@/types';
import { COLORS } from '@/constants';
import { format } from 'date-fns';

interface BabyProfileScreenProps {
  navigation: any;
  route: {
    params?: {
      babyId?: string;
    };
  };
}

export const BabyProfileScreen: React.FC<BabyProfileScreenProps> = ({ navigation, route }) => {
  const { babies, addBaby, updateBaby, deleteBaby } = useBabyStore();
  const { isPremium } = useAppStore();
  
  const babyId = route.params?.babyId;
  const existingBaby = babyId ? babies.find(b => b.id === babyId) : null;
  const isEditing = !!existingBaby;
  
  const [name, setName] = useState(existingBaby?.name || '');
  const [dateOfBirth, setDateOfBirth] = useState(
    existingBaby?.dateOfBirth ? format(new Date(existingBaby.dateOfBirth), 'yyyy-MM-dd') : ''
  );
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(existingBaby?.gender || 'male');
  const [photoUrl, setPhotoUrl] = useState(existingBaby?.photoUrl || '');
  const [weight, setWeight] = useState(existingBaby?.currentWeight?.toString() || '');
  const [height, setHeight] = useState(existingBaby?.currentHeight?.toString() || '');
  const [headCircumference, setHeadCircumference] = useState(existingBaby?.currentHeadCircumference?.toString() || '');
  const [bloodType, setBloodType] = useState(existingBaby?.bloodType || '');
  const [allergies, setAllergies] = useState(existingBaby?.allergies?.join(', ') || '');
  const [medicalNotes, setMedicalNotes] = useState(existingBaby?.medicalNotes || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: isEditing ? 'Edit Baby Profile' : 'Add Baby Profile',
      headerRight: () => (
        <Pressable onPress={handleSave} disabled={isLoading}>
          <Text style={{ color: COLORS.primary, fontWeight: '600' }}>
            {isLoading ? 'Saving...' : 'Save'}
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, isEditing, isLoading, name, dateOfBirth]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUrl(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name for your baby');
      return;
    }

    if (!dateOfBirth) {
      Alert.alert('Error', 'Please enter your baby\'s date of birth');
      return;
    }

    // Check baby limit for free users
    if (!isPremium && !isEditing && babies.length >= 1) {
      Alert.alert(
        'Upgrade Required',
        'Free users can track 1 baby. Upgrade to Pro for unlimited babies!',
        [
          { text: 'Maybe Later', style: 'cancel' },
          { 
            text: 'Upgrade', 
            onPress: () => navigation.navigate('Paywall', { source: 'baby-limit' })
          }
        ]
      );
      return;
    }

    setIsLoading(true);

    try {
      const babyData: Partial<Baby> = {
        name: name.trim(),
        dateOfBirth,
        gender,
        photoUrl: photoUrl || undefined,
        currentWeight: weight ? parseFloat(weight) : undefined,
        currentHeight: height ? parseFloat(height) : undefined,
        currentHeadCircumference: headCircumference ? parseFloat(headCircumference) : undefined,
        bloodType: bloodType || undefined,
        allergies: allergies ? allergies.split(',').map(a => a.trim()).filter(a => a) : undefined,
        medicalNotes: medicalNotes || undefined,
        updatedAt: new Date().toISOString(),
      };

      if (isEditing && existingBaby) {
        updateBaby(existingBaby.id, babyData);
      } else {
        const newBaby: Baby = {
          id: `baby-${Date.now()}`,
          ...babyData as Baby,
          createdAt: new Date().toISOString(),
        };
        addBaby(newBaby);
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save baby profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (!existingBaby) return;

    Alert.alert(
      'Delete Baby Profile',
      `Are you sure you want to delete ${existingBaby.name}'s profile? This will also delete all associated tracking data.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteBaby(existingBaby.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeScreen>
      <ScrollView className="flex-1 bg-gray-50">
        <View className="px-6 py-6">
          {/* Photo Section */}
          <View className="items-center mb-6">
            <Pressable
              onPress={pickImage}
              className="w-32 h-32 bg-gray-200 rounded-full items-center justify-center mb-4 border-4 border-white shadow-lg"
              style={{ elevation: 4 }}
            >
              {photoUrl ? (
                <Image source={{ uri: photoUrl }} className="w-full h-full rounded-full" />
              ) : (
                <View className="items-center">
                  <Ionicons name="camera" size={32} color={COLORS.neutral} />
                  <Text className="text-sm text-gray-600 mt-2">Add Photo</Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Basic Information */}
          <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Basic Information
            </Text>

            {/* Name */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Baby's Name *
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter baby's name"
                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
              />
            </View>

            {/* Date of Birth */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </Text>
              <TextInput
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
                placeholder="YYYY-MM-DD"
                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
              />
            </View>

            {/* Gender */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Gender
              </Text>
              <View className="flex-row space-x-3">
                {[
                  { value: 'male', label: 'Boy', icon: '👦' },
                  { value: 'female', label: 'Girl', icon: '👧' },
                  { value: 'other', label: 'Other', icon: '👶' },
                ].map((option) => (
                  <Pressable
                    key={option.value}
                    onPress={() => setGender(option.value as any)}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 ${
                      gender === option.value
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <Text className="text-center text-lg mb-1">{option.icon}</Text>
                    <Text
                      className={`text-center font-medium ${
                        gender === option.value ? 'text-orange-600' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          {/* Current Measurements */}
          <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Current Measurements
            </Text>

            <View className="flex-row space-x-3 mb-4">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </Text>
                <TextInput
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="0.0"
                  keyboardType="decimal-pad"
                  className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Height (cm)
                </Text>
                <TextInput
                  value={height}
                  onChangeText={setHeight}
                  placeholder="0.0"
                  keyboardType="decimal-pad"
                  className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                />
              </View>
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Head Circumference (cm)
              </Text>
              <TextInput
                value={headCircumference}
                onChangeText={setHeadCircumference}
                placeholder="0.0"
                keyboardType="decimal-pad"
                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
              />
            </View>
          </View>

          {/* Medical Information */}
          <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Medical Information
            </Text>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Blood Type
              </Text>
              <TextInput
                value={bloodType}
                onChangeText={setBloodType}
                placeholder="e.g., O+, A-, AB+"
                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Allergies
              </Text>
              <TextInput
                value={allergies}
                onChangeText={setAllergies}
                placeholder="Separate multiple allergies with commas"
                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Medical Notes
              </Text>
              <TextInput
                value={medicalNotes}
                onChangeText={setMedicalNotes}
                placeholder="Any important medical information"
                multiline
                numberOfLines={3}
                className="border border-gray-300 rounded-xl px-4 py-3 text-base h-20"
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Delete Button for Editing */}
          {isEditing && (
            <Pressable
              onPress={handleDelete}
              className="bg-red-100 rounded-2xl p-4 mb-4 border border-red-200"
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="trash-outline" size={24} color="#dc2626" />
                <Text className="ml-2 text-red-600 font-semibold">
                  Delete Baby Profile
                </Text>
              </View>
            </Pressable>
          )}

          <View className="h-20" />
        </View>
      </ScrollView>
    </SafeScreen>
  );
};