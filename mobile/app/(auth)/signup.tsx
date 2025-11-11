import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../authContext';
import { FontAwesome } from '@expo/vector-icons';

export default function SignUp() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      setIsLoading(true);
      await signUp({ name, email, password });
      router.replace('/(tabs)' as any);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center px-6">
          <View className="items-center mb-10">
            <FontAwesome name="user-plus" size={60} color="#3b82f6" />
            <Text className="text-3xl font-bold mt-4 text-gray-900">Create Account</Text>
            <Text className="text-gray-500 mt-2">Sign up to get started</Text>
          </View>

          <View className="space-y-4">
            <TextInput
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              className="bg-gray-50 p-4 m-1 rounded-xl border border-gray-200"
              placeholderTextColor="#9ca3af"
            />

            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-gray-50 m-1 p-4 rounded-xl border border-gray-200"
              placeholderTextColor="#9ca3af"
            />
            
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="bg-gray-50 p-4 m-1 rounded-xl border border-gray-200"
              placeholderTextColor="#9ca3af"
            />

            <TextInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              className="bg-gray-50 p-4 m-1 rounded-xl border border-gray-200"
              placeholderTextColor="#9ca3af"
            />

            <Pressable
              onPress={handleSignUp}
              disabled={isLoading}
              className={`bg-blue-600 p-4 mt-8 rounded-xl ${isLoading ? 'opacity-70' : ''}`}
            >
              <Text className="text-white text-center font-semibold text-lg">
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.back()}
              className="mt-4"
            >
              <Text className="text-center text-blue-600">
                Already have an account? Sign In
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}