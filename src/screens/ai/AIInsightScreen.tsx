import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '@/components/common/SafeScreen';
import { useAppStore } from '@/store/appStore';
import { useBabyStore } from '@/store/babyStore';
import { COLORS } from '@/constants';

const InsightCard: React.FC<{
  type: string;
  title: string;
  description: string;
  icon: string;
  onGenerate: () => void;
}> = ({ type, title, description, icon, onGenerate }) => (
  <Pressable
    onPress={onGenerate}
    className="bg-white rounded-2xl p-5 mb-4 border border-gray-100 shadow-sm"
    style={{ elevation: 2 }}
  >
    <View className="flex-row items-start">
      <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
        <Text className="text-2xl">{icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-lg font-bold text-gray-900 mb-2">
          {title}
        </Text>
        <Text className="text-gray-600 mb-3 leading-5">
          {description}
        </Text>
        <View className="flex-row items-center">
          <Text className="text-purple-600 font-medium mr-1">
            Generate Insight
          </Text>
          <Ionicons name="arrow-forward" size={16} color="#8b5cf6" />
        </View>
      </View>
    </View>
  </Pressable>
);

const GeneratedInsight: React.FC<{
  insight: any;
  onClose: () => void;
}> = ({ insight, onClose }) => (
  <View className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-5 mb-4 border border-purple-200">
    <View className="flex-row items-center justify-between mb-3">
      <View className="flex-row items-center">
        <Text className="text-2xl mr-2">🤖</Text>
        <Text className="text-lg font-bold text-gray-900">
          {insight.title}
        </Text>
      </View>
      <Pressable onPress={onClose}>
        <Ionicons name="close" size={20} color={COLORS.neutral} />
      </Pressable>
    </View>
    
    <Text className="text-gray-700 mb-4 leading-6">
      {insight.content}
    </Text>
    
    {insight.recommendations && insight.recommendations.length > 0 && (
      <View className="mb-4">
        <Text className="font-semibold text-gray-900 mb-2">
          Recommendations:
        </Text>
        {insight.recommendations.map((rec: string, index: number) => (
          <Text key={index} className="text-gray-700 mb-1">
            • {rec}
          </Text>
        ))}
      </View>
    )}
    
    <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
      <Text className="text-xs text-yellow-800">
        ⚠️ This is AI-generated information for educational purposes only. 
        Always consult with your pediatrician for medical concerns.
      </Text>
    </View>
  </View>
);

export const AIInsightScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { aiCredits, useAICredit, addAIInsight } = useAppStore();
  const { getSelectedBaby, getBabyRecords } = useBabyStore();
  const [generatedInsights, setGeneratedInsights] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const selectedBaby = getSelectedBaby();

  const generateInsight = async (type: string) => {
    if (!useAICredit()) {
      Alert.alert(
        'No AI Credits',
        'You need AI credits to generate insights. Upgrade to Pro or purchase credits.',
        [
          { text: 'Maybe Later', style: 'cancel' },
          { text: 'Upgrade', onPress: () => navigation.navigate('Paywall', { source: 'ai-credits' }) }
        ]
      );
      return;
    }

    setIsGenerating(true);

    // Mock AI insight generation
    setTimeout(() => {
      const mockInsights: Record<string, any> = {
        'feeding-schedule': {
          id: `insight-${Date.now()}`,
          type: 'feeding-schedule',
          title: 'Feeding Pattern Analysis',
          content: `Based on ${selectedBaby?.name}'s recent feeding data, I notice they're establishing a good 3-4 hour feeding pattern. Their intake appears consistent with healthy growth expectations for their age.`,
          recommendations: [
            'Continue with the current feeding schedule',
            'Consider introducing a dream feed around 10 PM to extend night sleep',
            'Monitor weight gain at next pediatric visit'
          ],
          confidence: 0.85,
          disclaimers: ['For educational purposes only'],
          createdAt: new Date().toISOString(),
        },
        'sleep-pattern': {
          id: `insight-${Date.now()}`,
          type: 'sleep-pattern',
          title: 'Sleep Development Insights',
          content: `${selectedBaby?.name} is showing positive sleep development patterns. The data suggests they're beginning to consolidate longer sleep periods, which is typical for their age.`,
          recommendations: [
            'Maintain consistent bedtime routine',
            'Consider room darkening for better daytime naps',
            'Sleep cycles are maturing well for age'
          ],
          confidence: 0.78,
          disclaimers: ['Consult pediatrician for sleep concerns'],
          createdAt: new Date().toISOString(),
        },
        'growth-analysis': {
          id: `insight-${Date.now()}`,
          type: 'growth-analysis',
          title: 'Growth Trajectory Analysis',
          content: `${selectedBaby?.name}'s growth measurements indicate healthy development within normal percentile ranges. Weight and length gains are proportional and consistent.`,
          recommendations: [
            'Continue current feeding approach',
            'Regular pediatric checkups are sufficient',
            'Growth velocity is appropriate for age'
          ],
          confidence: 0.92,
          disclaimers: ['Medical consultation recommended for growth concerns'],
          createdAt: new Date().toISOString(),
        }
      };

      const insight = mockInsights[type];
      setGeneratedInsights([insight, ...generatedInsights]);
      addAIInsight(insight);
      setIsGenerating(false);
    }, 2000);
  };

  const removeInsight = (insightId: string) => {
    setGeneratedInsights(generatedInsights.filter(i => i.id !== insightId));
  };

  if (!selectedBaby) {
    return (
      <SafeScreen>
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-6xl mb-4">👶</Text>
          <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
            No Baby Selected
          </Text>
          <Text className="text-gray-600 text-center">
            Please select a baby to get AI insights
          </Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <ScrollView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="px-6 pt-4 pb-6 bg-gradient-to-br from-purple-50 to-blue-50">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-2xl font-bold text-gray-900">
                AI Insights
              </Text>
              <Text className="text-gray-600">
                For {selectedBaby.name}
              </Text>
            </View>
            <View className="bg-purple-100 px-3 py-1 rounded-full">
              <Text className="text-purple-700 font-semibold">
                {aiCredits} credits
              </Text>
            </View>
          </View>
        </View>

        <View className="px-6 pt-6">
          {/* Generated Insights */}
          {generatedInsights.map((insight) => (
            <GeneratedInsight
              key={insight.id}
              insight={insight}
              onClose={() => removeInsight(insight.id)}
            />
          ))}

          {/* Loading State */}
          {isGenerating && (
            <View className="bg-white rounded-2xl p-6 mb-4 border border-gray-100 items-center">
              <Text className="text-4xl mb-3">🤖</Text>
              <Text className="text-lg font-semibold text-gray-900 mb-2">
                Generating Insight...
              </Text>
              <Text className="text-gray-600 text-center">
                Analyzing {selectedBaby.name}'s data patterns
              </Text>
            </View>
          )}

          {/* Available Insights */}
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Available Insights
          </Text>

          <InsightCard
            type="feeding-schedule"
            title="Feeding Schedule Analysis"
            description="Get personalized feeding recommendations based on your baby's patterns"
            icon="🍼"
            onGenerate={() => generateInsight('feeding-schedule')}
          />

          <InsightCard
            type="sleep-pattern"
            title="Sleep Pattern Insights"
            description="Understand your baby's sleep cycles and get improvement tips"
            icon="😴"
            onGenerate={() => generateInsight('sleep-pattern')}
          />

          <InsightCard
            type="growth-analysis"
            title="Growth Development"
            description="Track growth milestones and receive development insights"
            icon="📈"
            onGenerate={() => generateInsight('growth-analysis')}
          />

          {/* Credits Info */}
          <View className="bg-white rounded-xl p-4 mt-4 border border-gray-100">
            <View className="flex-row items-center mb-2">
              <Text className="text-2xl mr-2">💡</Text>
              <Text className="text-lg font-semibold text-gray-900">
                About AI Credits
              </Text>
            </View>
            <Text className="text-gray-600 mb-3">
              Each insight costs 1 AI credit. Free users get 5 credits, Pro users get 100 credits monthly.
            </Text>
            <Pressable
              onPress={() => navigation.navigate('Paywall', { source: 'ai-credits' })}
              className="py-2 px-4 bg-purple-100 rounded-full self-start"
            >
              <Text className="text-purple-600 font-medium">
                Get More Credits
              </Text>
            </Pressable>
          </View>

          <View className="h-20" />
        </View>
      </ScrollView>
    </SafeScreen>
  );
};