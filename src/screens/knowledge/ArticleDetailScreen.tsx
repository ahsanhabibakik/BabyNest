import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { SafeScreen } from '@/components/common/SafeScreen';

export const ArticleDetailScreen: React.FC<{ route: any }> = ({ route }) => {
  const { articleId } = route.params;

  return (
    <SafeScreen>
      <ScrollView className="flex-1 bg-white">
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800' }}
          className="w-full h-64"
          resizeMode="cover"
        />
        
        <View className="px-6 py-6">
          <Text className="text-2xl font-bold text-gray-900 mb-4">
            Breastfeeding Basics: Getting Started
          </Text>
          
          <Text className="text-gray-700 leading-7">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            {'\n\n'}
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
            culpa qui officia deserunt mollit anim id est laborum.
          </Text>
        </View>
      </ScrollView>
    </SafeScreen>
  );
};