import React, { useState } from 'react';
import { View, Text, Image, Pressable, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { SafeScreen } from '@/components/common/SafeScreen';
import { useAppStore } from '@/store/appStore';
import { COLORS } from '@/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: any; // require() result
  backgroundColor: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Welcome to BabyNest',
    subtitle: 'Your Baby Care Companion',
    description: 'Track feeding, sleep, diapers and milestones all in one place. Get AI-powered insights to help your baby thrive.',
    image: require('../../../assets/images/onboarding-1.png'),
    backgroundColor: '#FEF7EE',
  },
  {
    id: '2',
    title: 'Smart Tracking',
    subtitle: 'Made Simple',
    description: 'Log daily activities with just a few taps. Our intelligent system learns your patterns and provides personalized recommendations.',
    image: require('../../../assets/images/onboarding-2.png'),
    backgroundColor: '#F0F9FF',
  },
  {
    id: '3',
    title: 'Mother Care Too',
    subtitle: 'Because You Matter',
    description: 'Track your postpartum recovery, mood, and health. Get support and insights for both you and your baby.',
    image: require('../../../assets/images/onboarding-3.png'),
    backgroundColor: '#F0FDF4',
  },
  {
    id: '4',
    title: 'AI-Powered Insights',
    subtitle: 'Expert Guidance',
    description: 'Get personalized recommendations, feeding schedules, and development insights powered by advanced AI.',
    image: require('../../../assets/images/onboarding-4.png'),
    backgroundColor: '#FEF2F2',
  },
];

export const OnboardingScreen: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { setOnboarded } = useAppStore();
  const translateX = useSharedValue(0);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      translateX.value = withSpring(-nextIndex * SCREEN_WIDTH);
    }
  };

  const handleSkip = () => {
    setOnboarded(true);
  };

  const handleGetStarted = () => {
    setOnboarded(true);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const currentSlide = slides[currentIndex];
  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <SafeScreen edges={['top', 'bottom']}>
      <View className="flex-1">
        {/* Skip Button */}
        <View className="flex-row justify-end p-4">
          <Pressable onPress={handleSkip} className="py-2 px-4">
            <Text className="text-gray-600 font-medium">Skip</Text>
          </Pressable>
        </View>

        {/* Slides Container */}
        <View className="flex-1">
          <Animated.View 
            className="flex-row"
            style={[
              { width: SCREEN_WIDTH * slides.length },
              animatedStyle
            ]}
          >
            {slides.map((slide, index) => (
              <View 
                key={slide.id}
                className="justify-center items-center px-8"
                style={{
                  width: SCREEN_WIDTH,
                  backgroundColor: slide.backgroundColor,
                }}
              >
                <Image 
                  source={slide.image}
                  className="w-80 h-80 mb-8"
                  resizeMode="contain"
                />
                <Text className="text-3xl font-bold text-center mb-4 text-gray-900">
                  {slide.title}
                </Text>
                <Text className="text-xl font-semibold text-center mb-4" style={{ color: COLORS.primary }}>
                  {slide.subtitle}
                </Text>
                <Text className="text-lg text-center text-gray-600 leading-6">
                  {slide.description}
                </Text>
              </View>
            ))}
          </Animated.View>
        </View>

        {/* Pagination Dots */}
        <View className="flex-row justify-center items-center py-4">
          {slides.map((_, index) => (
            <View
              key={index}
              className={`w-3 h-3 rounded-full mx-1 ${
                index === currentIndex ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </View>

        {/* Bottom Actions */}
        <View className="px-6 pb-8">
          {isLastSlide ? (
            <Pressable
              onPress={handleGetStarted}
              className="py-4 px-8 rounded-full items-center"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Text className="text-white font-semibold text-lg">
                Get Started
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleNext}
              className="py-4 px-8 rounded-full items-center"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Text className="text-white font-semibold text-lg">
                Continue
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeScreen>
  );
};