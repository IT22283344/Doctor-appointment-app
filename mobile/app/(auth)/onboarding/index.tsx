import React, { useState } from 'react';
import { View, Text, Image, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Find Your Doctor',
    description: 'Easily search and find the best doctors near you',
    icon: 'user-md'
  },
  {
    id: 2,
    title: 'Book Appointments',
    description: 'Schedule appointments with your preferred doctors',
    icon: 'calendar-check-o'
  },
  {
    id: 3,
    title: 'Get Reminders',
    description: 'Never miss an appointment with timely reminders',
    icon: 'bell'
  }
];

export default function Onboarding() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentSlideIndex === slides.length - 1) {
      router.replace('/(auth)/login' as any);
    } else {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Pressable 
        onPress={() => router.replace('/(auth)/login' as any)}
        className="absolute top-4 right-4 z-10"
      >
        <Text className="text-blue-600">Skip</Text>
      </Pressable>

      <View className="flex-1 justify-center items-center">
        <FontAwesome 
          name={slides[currentSlideIndex].icon as any} 
          size={120} 
          color="#3b82f6" 
        />
        
        <Text className="text-3xl font-bold mt-8 text-center px-6">
          {slides[currentSlideIndex].title}
        </Text>
        
        <Text className="text-gray-600 text-center mt-4 px-10">
          {slides[currentSlideIndex].description}
        </Text>
      </View>

      <View className="pb-16 px-6">
        <View className="flex-row justify-center mb-8">
          {slides.map((_, index) => (
            <View
              key={index}
              className={`h-2 w-2 rounded-full mx-1 ${
                index === currentSlideIndex 
                  ? 'w-4 bg-blue-600' 
                  : 'bg-blue-200'
              }`}
            />
          ))}
        </View>

        <Pressable
          onPress={handleNext}
          className="bg-blue-600 p-4 rounded-xl"
        >
          <Text className="text-white text-center font-semibold text-lg">
            {currentSlideIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}