import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '@/components/common/SafeScreen';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth/authService';
import { COLORS } from '@/constants';

export const SignUpScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, setLoading } = useAuthStore();

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setLoading(true);

    try {
      const user = await authService.signUp(email, password, name);
      setUser(user);
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message || 'Please try again');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setLoading(true);

    try {
      const user = await authService.signInWithGoogle();
      setUser(user);
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message || 'Please try again');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <SafeScreen>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6">
          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-4xl font-bold text-gray-900 mb-2">
              Create Account
            </Text>
            <Text className="text-lg text-gray-600">
              Start your baby care journey with BabyNest
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4 mb-6">
            {/* Name Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Full Name
              </Text>
              <View className="border border-gray-300 rounded-xl px-4 py-4 bg-white">
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  autoCapitalize="words"
                  autoComplete="name"
                  className="text-base text-gray-900"
                />
              </View>
            </View>

            {/* Email Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Email Address
              </Text>
              <View className="border border-gray-300 rounded-xl px-4 py-4 bg-white">
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  className="text-base text-gray-900"
                />
              </View>
            </View>

            {/* Password Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Password
              </Text>
              <View className="border border-gray-300 rounded-xl px-4 py-4 bg-white flex-row items-center">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a password"
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                  className="flex-1 text-base text-gray-900"
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color={COLORS.neutral}
                  />
                </Pressable>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </Text>
              <View className="border border-gray-300 rounded-xl px-4 py-4 bg-white">
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                  className="text-base text-gray-900"
                />
              </View>
            </View>
          </View>

          {/* Sign Up Button */}
          <Pressable
            onPress={handleSignUp}
            disabled={isLoading}
            className={`py-4 px-8 rounded-xl items-center mb-4 ${
              isLoading ? 'bg-gray-300' : 'bg-orange-500'
            }`}
          >
            <Text className="text-white font-semibold text-lg">
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </Pressable>

          {/* Divider */}
          <View className="flex-row items-center mb-4">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500">or</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Google Sign In */}
          <Pressable
            onPress={handleGoogleSignIn}
            disabled={isLoading}
            className="border border-gray-300 py-4 px-8 rounded-xl items-center mb-4 bg-white flex-row justify-center"
          >
            <Ionicons name="logo-google" size={24} color="#DB4437" />
            <Text className="ml-3 text-gray-700 font-semibold text-lg">
              Continue with Google
            </Text>
          </Pressable>

          {/* Guest Mode Button */}
          <Pressable
            onPress={() => {
              // Create guest user
              const guestUser = {
                id: 'guest-' + Date.now(),
                email: 'guest@babynest.com',
                displayName: 'Guest User',
                isPremium: false,
                aiCredits: 3, // Limited credits for guest
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              setUser(guestUser);
            }}
            className="border border-gray-300 py-3 px-6 rounded-xl items-center mb-4 bg-gray-50"
          >
            <Text className="text-gray-700 font-medium">
              Continue as Guest
            </Text>
          </Pressable>

          {/* Sign In Link */}
          <View className="flex-row justify-center">
            <Text className="text-gray-600">
              Already have an account?{' '}
            </Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text className="font-semibold" style={{ color: COLORS.primary }}>
                Sign In
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
};