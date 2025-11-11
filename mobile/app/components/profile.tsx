import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import { useAuth } from '../authContext';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function Profile() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
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
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 py-8">
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-blue-100 items-center justify-center mb-4">
            <Text className="text-3xl">{name.charAt(0)}</Text>
          </View>
          <Text className="text-2xl font-bold">{user?.name}</Text>
          <Text className="text-gray-600">{user?.role || 'Patient'}</Text>
        </View>

        {isEditing ? (
          <View>
            <TextInput
              className="border p-3 mb-4 rounded"
              value={name}
              onChangeText={setName}
              placeholder="Name"
            />
            <TextInput
              className="border p-3 mb-4 rounded"
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              editable={false}
            />
            <Pressable
              onPress={handleUpdate}
              className="bg-blue-600 p-3 rounded mb-3"
            >
              <Text className="text-white text-center">Save Changes</Text>
            </Pressable>
            <Pressable
              onPress={() => setIsEditing(false)}
              className="bg-gray-200 p-3 rounded"
            >
              <Text className="text-center">Cancel</Text>
            </Pressable>
          </View>
        ) : (
          <View>
            <View className="border-b border-gray-200 py-4">
              <Text className="text-gray-600 mb-1">Name</Text>
              <Text className="text-lg">{name}</Text>
            </View>
            <View className="border-b border-gray-200 py-4">
              <Text className="text-gray-600 mb-1">Email</Text>
              <Text className="text-lg">{email}</Text>
            </View>

            <Pressable
              onPress={() => setIsEditing(true)}
              className="bg-blue-600 p-3 rounded mt-6 mb-3"
            >
              <Text className="text-white text-center">Edit Profile</Text>
            </Pressable>
            <Pressable
              onPress={handleLogout}
              className="bg-red-600 p-3 rounded"
            >
              <Text className="text-white text-center">Logout</Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}