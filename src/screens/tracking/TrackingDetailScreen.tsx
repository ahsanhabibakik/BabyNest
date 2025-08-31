import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '@/components/common/SafeScreen';
import { useBabyStore } from '@/store/babyStore';
import { 
  FeedingRecord, 
  SleepRecord, 
  DiaperRecord, 
  GrowthRecord, 
  MilestoneRecord 
} from '@/types';
import { COLORS, FEEDING_TYPES, SLEEP_QUALITY, DIAPER_TYPES, MILESTONE_CATEGORIES } from '@/constants';
import { format } from 'date-fns';

interface TrackingDetailScreenProps {
  navigation: any;
  route: {
    params: {
      type: 'feeding' | 'sleep' | 'diaper' | 'growth' | 'milestone';
    };
  };
}

export const TrackingDetailScreen: React.FC<TrackingDetailScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { type } = route.params;
  const { 
    getSelectedBaby,
    addFeedingRecord,
    addSleepRecord,
    addDiaperRecord,
    addGrowthRecord,
    addMilestoneRecord
  } = useBabyStore();
  
  const selectedBaby = getSelectedBaby();
  const [isLoading, setIsLoading] = useState(false);

  // Common fields
  const [notes, setNotes] = useState('');
  const [timestamp, setTimestamp] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));

  // Feeding fields
  const [feedingType, setFeedingType] = useState<'breast' | 'bottle' | 'solid'>('breast');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [side, setSide] = useState<'left' | 'right' | 'both'>('left');
  const [foodItems, setFoodItems] = useState('');

  // Sleep fields
  const [startTime, setStartTime] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [endTime, setEndTime] = useState('');
  const [sleepQuality, setSleepQuality] = useState<'poor' | 'fair' | 'good' | 'excellent'>('good');
  const [sleepLocation, setSleepLocation] = useState<'crib' | 'bed' | 'stroller' | 'carrier' | 'other'>('crib');

  // Diaper fields
  const [diaperType, setDiaperType] = useState<'wet' | 'dirty' | 'both'>('wet');
  const [consistency, setConsistency] = useState<'liquid' | 'soft' | 'normal' | 'hard'>('normal');
  const [color, setColor] = useState('');

  // Growth fields
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [headCircumference, setHeadCircumference] = useState('');

  // Milestone fields
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDescription, setMilestoneDescription] = useState('');
  const [milestoneCategory, setMilestoneCategory] = useState<'physical' | 'cognitive' | 'social' | 'language'>('physical');

  useEffect(() => {
    const titles = {
      feeding: 'Record Feeding',
      sleep: 'Record Sleep',
      diaper: 'Record Diaper',
      growth: 'Record Growth',
      milestone: 'Record Milestone',
    };
    
    navigation.setOptions({
      headerTitle: titles[type],
      headerRight: () => (
        <Pressable onPress={handleSave} disabled={isLoading}>
          <Text style={{ color: COLORS.primary, fontWeight: '600' }}>
            {isLoading ? 'Saving...' : 'Save'}
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, type, isLoading]);

  const handleSave = async () => {
    if (!selectedBaby) {
      Alert.alert('Error', 'No baby selected');
      return;
    }

    setIsLoading(true);

    try {
      const baseRecord = {
        id: `${type}-${Date.now()}`,
        babyId: selectedBaby.id,
        createdAt: new Date().toISOString(),
      };

      switch (type) {
        case 'feeding':
          if (feedingType === 'bottle' && !amount) {
            Alert.alert('Error', 'Please enter the amount for bottle feeding');
            return;
          }
          if (feedingType === 'breast' && !duration) {
            Alert.alert('Error', 'Please enter the duration for breastfeeding');
            return;
          }

          const feedingRecord: FeedingRecord = {
            ...baseRecord,
            type: feedingType,
            amount: amount ? parseFloat(amount) : undefined,
            duration: duration ? parseInt(duration) : undefined,
            side: feedingType === 'breast' ? side : undefined,
            foodItems: feedingType === 'solid' && foodItems ? foodItems.split(',').map(item => item.trim()) : undefined,
            notes: notes || undefined,
            timestamp,
          };
          addFeedingRecord(feedingRecord);
          break;

        case 'sleep':
          const sleepRecord: SleepRecord = {
            ...baseRecord,
            startTime,
            endTime: endTime || undefined,
            duration: endTime ? Math.floor((new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000) : undefined,
            quality: sleepQuality,
            location: sleepLocation,
            notes: notes || undefined,
          };
          addSleepRecord(sleepRecord);
          break;

        case 'diaper':
          const diaperRecord: DiaperRecord = {
            ...baseRecord,
            type: diaperType,
            consistency: diaperType !== 'wet' ? consistency : undefined,
            color: color || undefined,
            notes: notes || undefined,
            timestamp,
          };
          addDiaperRecord(diaperRecord);
          break;

        case 'growth':
          if (!weight && !height && !headCircumference) {
            Alert.alert('Error', 'Please enter at least one measurement');
            return;
          }

          const growthRecord: GrowthRecord = {
            ...baseRecord,
            weight: weight ? parseFloat(weight) : undefined,
            height: height ? parseFloat(height) : undefined,
            headCircumference: headCircumference ? parseFloat(headCircumference) : undefined,
            measurementDate: timestamp,
            notes: notes || undefined,
          };
          addGrowthRecord(growthRecord);
          break;

        case 'milestone':
          if (!milestoneTitle) {
            Alert.alert('Error', 'Please enter a milestone title');
            return;
          }

          const milestoneRecord: MilestoneRecord = {
            ...baseRecord,
            title: milestoneTitle,
            description: milestoneDescription || undefined,
            category: milestoneCategory,
            achievedDate: timestamp,
            notes: notes || undefined,
          };
          addMilestoneRecord(milestoneRecord);
          break;
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save record');
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedBaby) {
    return (
      <SafeScreen>
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
            No Baby Selected
          </Text>
          <Text className="text-gray-600 text-center mb-4">
            Please select a baby to record activities
          </Text>
        </View>
      </SafeScreen>
    );
  }

  const renderFeedingForm = () => (
    <>
      {/* Feeding Type */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-3">
          Feeding Type
        </Text>
        <View className="flex-row space-x-3">
          {Object.entries(FEEDING_TYPES).map(([key, config]) => (
            <Pressable
              key={key}
              onPress={() => setFeedingType(key as any)}
              className={`flex-1 py-3 px-3 rounded-xl border-2 ${
                feedingType === key
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <Text className="text-center text-lg mb-1">{config.icon}</Text>
              <Text
                className={`text-center font-medium text-sm ${
                  feedingType === key ? 'text-orange-600' : 'text-gray-700'
                }`}
              >
                {config.title}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Amount (for bottle) */}
      {feedingType === 'bottle' && (
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Amount (ml)
          </Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="120"
            keyboardType="numeric"
            className="border border-gray-300 rounded-xl px-4 py-3 text-base"
          />
        </View>
      )}

      {/* Duration (for breast) */}
      {feedingType === 'breast' && (
        <View className="flex-row space-x-3 mb-4">
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </Text>
            <TextInput
              value={duration}
              onChangeText={setDuration}
              placeholder="15"
              keyboardType="numeric"
              className="border border-gray-300 rounded-xl px-4 py-3 text-base"
            />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Side
            </Text>
            <View className="flex-row space-x-2">
              {[
                { value: 'left', label: 'L' },
                { value: 'right', label: 'R' },
                { value: 'both', label: 'Both' },
              ].map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => setSide(option.value as any)}
                  className={`flex-1 py-2 px-2 rounded-lg border ${
                    side === option.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <Text
                    className={`text-center font-medium text-sm ${
                      side === option.value ? 'text-orange-600' : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Food Items (for solid) */}
      {feedingType === 'solid' && (
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Food Items
          </Text>
          <TextInput
            value={foodItems}
            onChangeText={setFoodItems}
            placeholder="banana, rice cereal, apple sauce"
            className="border border-gray-300 rounded-xl px-4 py-3 text-base"
          />
        </View>
      )}
    </>
  );

  const renderSleepForm = () => (
    <>
      {/* Time Range */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">
          Start Time
        </Text>
        <TextInput
          value={startTime}
          onChangeText={setStartTime}
          placeholder="2024-01-01T14:30"
          className="border border-gray-300 rounded-xl px-4 py-3 text-base"
        />
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">
          End Time (optional)
        </Text>
        <TextInput
          value={endTime}
          onChangeText={setEndTime}
          placeholder="2024-01-01T16:30"
          className="border border-gray-300 rounded-xl px-4 py-3 text-base"
        />
      </View>

      {/* Sleep Quality */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-3">
          Sleep Quality
        </Text>
        <View className="flex-row space-x-2">
          {Object.entries(SLEEP_QUALITY).map(([key, config]) => (
            <Pressable
              key={key}
              onPress={() => setSleepQuality(key as any)}
              className={`flex-1 py-3 px-2 rounded-xl border-2 ${
                sleepQuality === key
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <Text className="text-center text-lg mb-1">{config.icon}</Text>
              <Text
                className={`text-center font-medium text-xs ${
                  sleepQuality === key ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {config.title}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Sleep Location */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">
          Sleep Location
        </Text>
        <View className="flex-row flex-wrap">
          {[
            { value: 'crib', label: 'Crib' },
            { value: 'bed', label: 'Bed' },
            { value: 'stroller', label: 'Stroller' },
            { value: 'carrier', label: 'Carrier' },
            { value: 'other', label: 'Other' },
          ].map((option) => (
            <Pressable
              key={option.value}
              onPress={() => setSleepLocation(option.value as any)}
              className={`py-2 px-4 rounded-full border mr-2 mb-2 ${
                sleepLocation === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-white'
              }`}
            >
              <Text
                className={`font-medium text-sm ${
                  sleepLocation === option.value ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </>
  );

  const renderDiaperForm = () => (
    <>
      {/* Diaper Type */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-3">
          Diaper Type
        </Text>
        <View className="flex-row space-x-3">
          {Object.entries(DIAPER_TYPES).map(([key, config]) => (
            <Pressable
              key={key}
              onPress={() => setDiaperType(key as any)}
              className={`flex-1 py-3 px-3 rounded-xl border-2 ${
                diaperType === key
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <Text className="text-center text-lg mb-1">{config.icon}</Text>
              <Text
                className={`text-center font-medium text-sm ${
                  diaperType === key ? 'text-yellow-600' : 'text-gray-700'
                }`}
              >
                {config.title}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Consistency (for dirty diapers) */}
      {diaperType !== 'wet' && (
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Consistency
          </Text>
          <View className="flex-row flex-wrap">
            {[
              { value: 'liquid', label: 'Liquid' },
              { value: 'soft', label: 'Soft' },
              { value: 'normal', label: 'Normal' },
              { value: 'hard', label: 'Hard' },
            ].map((option) => (
              <Pressable
                key={option.value}
                onPress={() => setConsistency(option.value as any)}
                className={`py-2 px-4 rounded-full border mr-2 mb-2 ${
                  consistency === option.value
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-300 bg-white'
                }`}
              >
                <Text
                  className={`font-medium text-sm ${
                    consistency === option.value ? 'text-yellow-600' : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Color */}
      {diaperType !== 'wet' && (
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Color (optional)
          </Text>
          <TextInput
            value={color}
            onChangeText={setColor}
            placeholder="e.g., yellow, green, brown"
            className="border border-gray-300 rounded-xl px-4 py-3 text-base"
          />
        </View>
      )}
    </>
  );

  const renderGrowthForm = () => (
    <>
      <View className="flex-row space-x-3 mb-4">
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Weight (kg)
          </Text>
          <TextInput
            value={weight}
            onChangeText={setWeight}
            placeholder="3.5"
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
            placeholder="52.0"
            keyboardType="decimal-pad"
            className="border border-gray-300 rounded-xl px-4 py-3 text-base"
          />
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">
          Head Circumference (cm)
        </Text>
        <TextInput
          value={headCircumference}
          onChangeText={setHeadCircumference}
          placeholder="36.0"
          keyboardType="decimal-pad"
          className="border border-gray-300 rounded-xl px-4 py-3 text-base"
        />
      </View>
    </>
  );

  const renderMilestoneForm = () => (
    <>
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">
          Milestone Title *
        </Text>
        <TextInput
          value={milestoneTitle}
          onChangeText={setMilestoneTitle}
          placeholder="First smile, first word, first steps"
          className="border border-gray-300 rounded-xl px-4 py-3 text-base"
        />
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">
          Category
        </Text>
        <View className="flex-row flex-wrap">
          {Object.entries(MILESTONE_CATEGORIES).map(([key, config]) => (
            <Pressable
              key={key}
              onPress={() => setMilestoneCategory(key as any)}
              className={`py-2 px-4 rounded-full border mr-2 mb-2 ${
                milestoneCategory === key
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 bg-white'
              }`}
            >
              <Text className="text-sm mr-1">{config.icon}</Text>
              <Text
                className={`font-medium text-sm ${
                  milestoneCategory === key ? 'text-purple-600' : 'text-gray-700'
                }`}
              >
                {config.title}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">
          Description
        </Text>
        <TextInput
          value={milestoneDescription}
          onChangeText={setMilestoneDescription}
          placeholder="Describe the milestone achievement"
          multiline
          numberOfLines={3}
          className="border border-gray-300 rounded-xl px-4 py-3 text-base h-20"
          textAlignVertical="top"
        />
      </View>
    </>
  );

  return (
    <SafeScreen>
      <ScrollView className="flex-1 bg-gray-50">
        <View className="px-6 py-6">
          {/* Baby Info */}
          <View className="bg-white rounded-xl p-4 mb-4 border border-gray-100">
            <Text className="text-center font-semibold text-gray-900">
              Recording for {selectedBaby.name}
            </Text>
          </View>

          <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
            {/* Timestamp */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                {type === 'sleep' ? 'Date & Time' : 'Date & Time'}
              </Text>
              <TextInput
                value={type === 'sleep' ? startTime : timestamp}
                onChangeText={type === 'sleep' ? setStartTime : setTimestamp}
                placeholder="2024-01-01T14:30"
                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
              />
            </View>

            {/* Type-specific forms */}
            {type === 'feeding' && renderFeedingForm()}
            {type === 'sleep' && renderSleepForm()}
            {type === 'diaper' && renderDiaperForm()}
            {type === 'growth' && renderGrowthForm()}
            {type === 'milestone' && renderMilestoneForm()}

            {/* Notes */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Any additional notes..."
                multiline
                numberOfLines={3}
                className="border border-gray-300 rounded-xl px-4 py-3 text-base h-20"
                textAlignVertical="top"
              />
            </View>
          </View>

          <View className="h-20" />
        </View>
      </ScrollView>
    </SafeScreen>
  );
};