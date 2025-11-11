import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../authContext';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

export default function Profile() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  // Sync state with user data when it changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      if (!name.trim()) {
        Alert.alert('Error', 'Name cannot be empty');
        return;
      }

      // Get existing user data
      const userData = await SecureStore.getItemAsync('userData');
      const currentData = userData ? JSON.parse(userData) : {};
      
      // Update user data
      const updatedData = {
        ...currentData,
        name: name.trim(),
      };

      // Save to secure storage
      await SecureStore.setItemAsync('userData', JSON.stringify(updatedData));
      
      // Update context if needed
      if (typeof user?.updateProfile === 'function') {
        await user.updateProfile(updatedData);
      }

      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      console.error('Profile update error:', err);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login' as any);
    } catch (err) {
      console.error('Logout error:', err);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-4 py-6">
        <View className="bg-white rounded-2xl shadow-sm p-6 items-center mb-6 border border-gray-100">
          <View className="w-24 h-24 rounded-full bg-blue-100 items-center justify-center mb-4">
            <Text className="text-4xl text-blue-600">{name.charAt(0)}</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900">{user.name}</Text>
          <Text className="text-gray-600 mb-4">{user.role || 'Patient'}</Text>
          {!isEditing && (
            <Pressable
              onPress={() => setIsEditing(true)}
              className="flex-row items-center"
            >
              <FontAwesome name="pencil" size={14} color="#3b82f6" />
              <Text className="text-blue-600 ml-2">Edit Profile</Text>
            </Pressable>
          )}
        </View>

        {isEditing ? (
          <View className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-gray-100">
            <TextInput
              className="border border-gray-200 p-3 mb-4 rounded-lg bg-gray-50"
              value={name}
              onChangeText={setName}
              placeholder="Name"
              placeholderTextColor="#9ca3af"
            />
            <TextInput
              className="border border-gray-200 p-3 mb-4 rounded-lg bg-gray-50"
              value={email}
              placeholder="Email"
              placeholderTextColor="#9ca3af"
              editable={false}
            />
            <View className="flex-row">
              <Pressable
                onPress={handleUpdate}
                disabled={isLoading}
                className={`flex-1 bg-blue-600 p-3 rounded-lg mr-2 ${isLoading ? 'opacity-70' : ''}`}
              >
                <View className="flex-row justify-center items-center">
                  {isLoading && <ActivityIndicator color="white" className="mr-2" />}
                  <Text className="text-white text-center font-medium">
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => setIsEditing(false)}
                disabled={isLoading}
                className="flex-1 bg-gray-100 p-3 rounded-lg"
              >
                <Text className="text-gray-700 text-center font-medium">Cancel</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 border border-gray-100">
            <View className="p-4 border-b border-gray-100">
              <Text className="text-gray-500 text-sm mb-1">Email</Text>
              <Text className="text-gray-900">{email}</Text>
            </View>
            <View className="p-4">
              <Text className="text-gray-500 text-sm mb-1">Member Since</Text>
              <Text className="text-gray-900">
                {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </Text>
            </View>
          </View>
        )}

        <View className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 border border-gray-100">
          <Pressable className="p-4 flex-row items-center border-b border-gray-100">
            <FontAwesome name="bell" size={16} color="#64748b" />
            <Text className="text-gray-600 ml-3">Notifications</Text>
            <FontAwesome name="chevron-right" size={12} color="#64748b" style={{ marginLeft: 'auto' }} />
          </Pressable>
          <Pressable className="p-4 flex-row items-center">
            <FontAwesome name="lock" size={16} color="#64748b" />
            <Text className="text-gray-600 ml-3">Privacy Settings</Text>
            <FontAwesome name="chevron-right" size={12} color="#64748b" style={{ marginLeft: 'auto' }} />
          </Pressable>
        </View>

        <Pressable
          onPress={handleLogout}
          className="bg-red-100 p-4 rounded-xl flex-row justify-center items-center"
        >
          <FontAwesome name="sign-out" size={16} color="#dc2626" />
          <Text className="text-red-600 font-medium ml-2">Logout</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}