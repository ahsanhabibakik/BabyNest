import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '@/components/common/SafeScreen';
import { useAppStore } from '@/store/appStore';
import { MotherHealthRecord } from '@/types';
import { COLORS } from '@/constants';
import { format } from 'date-fns';

const MotherCareCard: React.FC<{
  icon: string;
  title: string;
  description: string;
  color: string;
  onPress: () => void;
}> = ({ icon, title, description, color, onPress }) => (
  <Pressable
    onPress={onPress}
    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4"
    style={{ elevation: 2 }}
  >
    <View className="flex-row items-center">
      <View 
        className="w-12 h-12 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: color + '20' }}
      >
        <Text className="text-2xl">{icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-lg font-bold text-gray-900 mb-1">
          {title}
        </Text>
        <Text className="text-sm text-gray-600">
          {description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={COLORS.neutral} />
    </View>
  </Pressable>
);

const QuickLogModal: React.FC<{
  visible: boolean;
  type: string;
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ visible, type, onClose, onSave }) => {
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');

  if (!visible) return null;

  const getPlaceholder = () => {
    switch (type) {
      case 'weight': return 'Enter your weight (kg)';
      case 'mood': return 'Rate your mood (1-10)';
      case 'breastfeeding': return 'Duration in minutes';
      default: return 'Enter value';
    }
  };

  const handleSave = () => {
    if (!value) {
      Alert.alert('Error', 'Please enter a value');
      return;
    }

    const numValue = ['weight', 'mood', 'breastfeeding'].includes(type) ? parseFloat(value) : value;
    
    onSave({
      type,
      value: numValue,
      notes,
      timestamp: new Date().toISOString(),
    });

    setValue('');
    setNotes('');
    onClose();
  };

  return (
    <View className="absolute inset-0 bg-black bg-opacity-50 flex-1 justify-center px-6">
      <View className="bg-white rounded-2xl p-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-gray-900">
            Log {type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.neutral} />
          </Pressable>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Value
          </Text>
          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder={getPlaceholder()}
            keyboardType={['weight', 'mood', 'breastfeeding'].includes(type) ? 'numeric' : 'default'}
            className="border border-gray-300 rounded-xl px-4 py-3 text-base"
          />
        </View>

        <View className="mb-6">
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

        <View className="flex-row space-x-3">
          <Pressable
            onPress={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-gray-300"
          >
            <Text className="text-center font-semibold text-gray-700">
              Cancel
            </Text>
          </Pressable>
          <Pressable
            onPress={handleSave}
            className="flex-1 py-3 px-4 rounded-xl"
            style={{ backgroundColor: COLORS.primary }}
          >
            <Text className="text-center font-semibold text-white">
              Save
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export const MotherCareScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { isPremium } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [motherRecords, setMotherRecords] = useState<MotherHealthRecord[]>([]);

  const handleQuickLog = (type: string) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleSaveRecord = (data: any) => {
    const record: MotherHealthRecord = {
      id: `mother-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    
    setMotherRecords([record, ...motherRecords]);
    Alert.alert('Saved', 'Your record has been saved successfully');
  };

  const getTodayRecords = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return motherRecords.filter(r => 
      format(new Date(r.timestamp), 'yyyy-MM-dd') === today
    );
  };

  const todayRecords = getTodayRecords();

  return (
    <SafeScreen>
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="px-6 pt-4 pb-6 bg-white">
          <Text className="text-2xl font-bold text-gray-900">
            Mother Care
          </Text>
          <Text className="text-gray-600 mt-1">
            Track your health and well-being
          </Text>
        </View>

        <ScrollView className="flex-1 px-6 pt-4">
          {/* Quick Actions */}
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Quick Log
          </Text>

          <MotherCareCard
            icon="⚖️"
            title="Weight Tracking"
            description="Monitor your weight changes"
            color="#10b981"
            onPress={() => handleQuickLog('weight')}
          />

          <MotherCareCard
            icon="💭"
            title="Mood & Mental Health"
            description="Track your daily mood and feelings"
            color="#8b5cf6"
            onPress={() => handleQuickLog('mood')}
          />

          <MotherCareCard
            icon="🤱"
            title="Breastfeeding Sessions"
            description="Log breastfeeding duration and notes"
            color="#f59e0b"
            onPress={() => handleQuickLog('breastfeeding')}
          />

          <MotherCareCard
            icon="🩸"
            title="Menstrual Cycle"
            description="Track your menstrual cycle and symptoms"
            color="#ec4899"
            onPress={() => {
              if (isPremium) {
                handleQuickLog('menstrual');
              } else {
                navigation.navigate('Paywall', { source: 'menstrual-tracking' });
              }
            }}
          />

          <MotherCareCard
            icon="🏥"
            title="Postpartum Recovery"
            description="Monitor your recovery progress"
            color="#06b6d4"
            onPress={() => {
              if (isPremium) {
                handleQuickLog('postpartum');
              } else {
                navigation.navigate('Paywall', { source: 'postpartum-tracking' });
              }
            }}
          />

          {/* Today's Summary */}
          {todayRecords.length > 0 && (
            <>
              <Text className="text-lg font-bold text-gray-900 mb-3 mt-6">
                Today's Records
              </Text>
              
              <View className="bg-white rounded-xl p-4 mb-4 border border-gray-100">
                {todayRecords.map((record, index) => (
                  <View key={record.id} className={`py-3 ${index > 0 ? 'border-t border-gray-100' : ''}`}>
                    <View className="flex-row justify-between items-center">
                      <Text className="font-semibold text-gray-900 capitalize">
                        {record.type.replace(/([A-Z])/g, ' $1').trim()}
                      </Text>
                      <Text className="text-gray-600">
                        {format(new Date(record.timestamp), 'HH:mm')}
                      </Text>
                    </View>
                    <Text className="text-gray-700 mt-1">
                      {record.value} {record.notes && `• ${record.notes}`}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Educational Content */}
          <View className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-5 mb-4 border border-pink-200">
            <View className="flex-row items-center mb-3">
              <Text className="text-2xl mr-2">📚</Text>
              <Text className="text-lg font-bold text-gray-900">
                Mother Care Tips
              </Text>
            </View>
            <Text className="text-gray-700 mb-3">
              Learn about postpartum recovery, breastfeeding, and maternal mental health
            </Text>
            <Pressable
              onPress={() => navigation.navigate('Knowledge')}
              className="py-2 px-4 bg-pink-500 rounded-full self-start"
            >
              <Text className="text-white font-medium text-sm">
                Read Articles
              </Text>
            </Pressable>
          </View>

          {/* Premium Features */}
          {!isPremium && (
            <View className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-5 mb-6 border border-orange-200">
              <View className="flex-row items-center mb-2">
                <Text className="text-2xl mr-2">⭐</Text>
                <Text className="text-lg font-bold text-gray-900">
                  Unlock More Features
                </Text>
              </View>
              <Text className="text-gray-600 mb-3">
                • Menstrual cycle tracking{'\n'}
                • Postpartum recovery monitoring{'\n'}
                • Detailed health analytics{'\n'}
                • Export health reports
              </Text>
              <Pressable
                onPress={() => navigation.navigate('Paywall')}
                className="py-2 px-4 rounded-full self-start"
                style={{ backgroundColor: COLORS.primary }}
              >
                <Text className="text-white font-medium text-sm">
                  Upgrade to Pro
                </Text>
              </Pressable>
            </View>
          )}

          <View className="h-20" />
        </ScrollView>

        {/* Quick Log Modal */}
        <QuickLogModal
          visible={showModal}
          type={modalType}
          onClose={() => setShowModal(false)}
          onSave={handleSaveRecord}
        />
      </View>
    </SafeScreen>
  );
};