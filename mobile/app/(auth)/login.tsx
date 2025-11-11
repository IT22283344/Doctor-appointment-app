import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../authContext';
import { FontAwesome } from '@expo/vector-icons';

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-6">
        <View className="items-center mb-10">
          <FontAwesome name="user-md" size={80} color="#3b82f6" />
          <Text className="text-4xl font-bold mt-4 text-gray-900">Welcome Back</Text>
          <Text className="text-gray-500 mt-2">Sign in to continue</Text>
        </View>

        <View className="space-y-4">
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            className="bg-gray-50 p-4 m-1 rounded-xl border border-gray-200"
            placeholderTextColor="#9ca3af"
          />
          
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="bg-gray-50 m-1 p-4 mb-4 rounded-xl border border-gray-200"
            placeholderTextColor="#9ca3af"
          />

          <Pressable
            onPress={handleLogin}
            disabled={isLoading}
            className={`bg-blue-600 p-4 mt-4 rounded-xl ${isLoading ? 'opacity-70' : ''}`}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/signup')}
            className="mt-4"
          >
            <Text className="text-center text-blue-600">
              Don't have an account? Sign Up
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}