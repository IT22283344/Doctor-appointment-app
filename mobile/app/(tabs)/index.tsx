import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../authContext';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-4 py-6">
        <View className="mb-6">
          <Text className="text-2xl font-bold mb-1">Welcome back,</Text>
          <Text className="text-3xl font-bold text-blue-600">{user?.name || 'Guest'}</Text>
        </View>

        <View className="bg-white p-5 rounded-xl shadow-sm mb-6 border border-gray-100">
          <Text className="text-lg font-semibold mb-4">Quick Actions</Text>
          <View className="flex-row flex-wrap -mx-2">
            <Pressable 
              onPress={() => router.push('/components/doctors')}
              className="w-1/2 px-2 mb-4"
            >
              <View className="bg-blue-50 p-4 rounded-xl items-center">
                <FontAwesome name="user-md" size={24} color="#2563eb" />
                <Text className="text-blue-600 font-medium mt-2">Find Doctor</Text>
              </View>
            </Pressable>
            
            <Pressable 
              onPress={() => router.push('/my-bookings')}
              className="w-1/2 px-2 mb-4"
            >
              <View className="bg-green-50 p-4 rounded-xl items-center">
                <FontAwesome name="calendar" size={24} color="#16a34a" />
                <Text className="text-green-600 font-medium mt-2">My Bookings</Text>
              </View>
            </Pressable>
          </View>
        </View>

        <View className="bg-white p-5 rounded-xl shadow-sm mb-6 border border-gray-100">
          <Text className="text-lg font-semibold mb-4">About</Text>
          <View className="bg-gray-50 p-4 rounded-lg">
            <Text className="text-gray-600 leading-6">
              Welcome to our Doctor Appointment Booking App. Here you can easily find doctors,
              book appointments, and manage your bookings. We're here to make healthcare
              accessible and convenient for you.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}