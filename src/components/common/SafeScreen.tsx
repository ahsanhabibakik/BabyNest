import React from 'react';
import { View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SafeScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  className?: string;
}

export const SafeScreen: React.FC<SafeScreenProps> = ({
  children,
  style,
  edges = ['top', 'bottom'],
  className = '',
}) => {
  return (
    <SafeAreaView 
      edges={edges} 
      style={[{ flex: 1 }, style]}
      className={`bg-gray-50 ${className}`}
    >
      <View className="flex-1">
        {children}
      </View>
    </SafeAreaView>
  );
};