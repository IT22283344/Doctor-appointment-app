import React from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome, MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useAuth } from "../authContext";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const quickActions = [
    {
      id: 1,
      title: "Find Doctor",
      description: "Book appointment with specialists",
      icon: "user-md",
      color: "#2563eb",
      bgColor: "#dbeafe",
      route: "/components/doctors",
    },
    {
      id: 2,
      title: "My Bookings",
      description: "View your appointments",
      icon: "calendar",
      color: "#16a34a",
      bgColor: "#dcfce7",
      route: "/my-bookings",
    },
    {
      id: 3,
      title: "Video Consult",
      description: "Online consultation",
      icon: "video",
      color: "#9333ea",
      bgColor: "#f3e8ff",
      route: "/#",
    },
    {
      id: 4,
      title: "Medical Records",
      description: "Your health history",
      icon: "file-medical",
      color: "#ea580c",
      bgColor: "#ffedd5",
      route: "/#",
    },
  ];

  const features = [
    {
      icon: "clock",
      text: "24/7 Available",
    },
    {
      icon: "s",
      text: "Secure & Private",
    },
    {
      icon: "star",
      text: "Top Specialists",
    },
    {
      icon: "calendar-check",
      text: "Easy Booking",
    },
  ];

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View className="bg-blue-600 pt-12 pb-8 px-6 rounded-b-3xl">
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-1">
            <Text className="text-blue-200 text-lg font-medium">
              {getGreeting()}
            </Text>{" "}
            <Text className="text-white text-2xl font-bold mt-1">
              {user?.name || "Welcome back!"}
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/profile")}
            className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center"
          >
            <Text className="text-white text-lg font-bold ">
              {user?.name?.charAt(0) || "U"}
            </Text>
          </Pressable>
        </View>

        {/* Stats Card */}
        <View className="bg-white rounded-2xl p-5 shadow-lg">
          <View className="flex-row justify-between items-center">
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-800">12</Text>
              <Text className="text-gray-500 text-xs mt-1">Appointments</Text>
            </View>
            <View className="h-8 w-px bg-gray-200" />
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-800">3</Text>
              <Text className="text-gray-500 text-xs mt-1">Upcoming</Text>
            </View>
            <View className="h-8 w-px bg-gray-200" />
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-800">9</Text>
              <Text className="text-gray-500 text-xs mt-1">Completed</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-6 -mt-1">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Quick Actions
        </Text>
        <View className="flex-row flex-wrap -mx-2">
          {quickActions.map((action) => (
            <Pressable
              key={action.id}
              onPress={() => router.push(action.route)}
              className="w-1/2 px-2 mb-4"
            >
              <View
                className="p-4 rounded-2xl shadow-sm border border-gray-100"
                style={{ backgroundColor: action.bgColor }}
              >
                <FontAwesome5
                  name={action.icon}
                  size={24}
                  color={action.color}
                />
                <Text className="font-semibold text-gray-800 mt-3 text-base">
                  {action.title}
                </Text>
                <Text className="text-gray-500 text-xs mt-1">
                  {action.description}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Upcoming Appointment */}
      <View className="px-6 mt-2">
        <View className="bg-blue-300 from-purple-500 to-purple-600 rounded-2xl p-5 shadow-lg">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-white text-lg font-bold mb-1">
                Upcoming Appointment
              </Text>
              <Text className="text-gray-600 text-sm mb-3">
                Dr. Sarah Johnson - Cardiology
              </Text>
              <View className="flex-row items-center">
                <MaterialIcons name="access-time" size={16}  />
                <Text className="text-gray-700 ml-2 text-sm">
                  Today, 2:30 PM
                </Text>
              </View>
            </View>
            <Pressable
              onPress={() => router.push("/my-bookings")}
              className="bg-white px-4 py-2 rounded-full"
            >
              <Text className="text-purple-600 font-semibold text-sm">
                View
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Features Section */}
      <View className="px-6 mt-6">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Why Choose Us
        </Text>
        <View className="flex-row justify-between">
          {features.map((feature, index) => (
            <View key={index} className="items-center">
              <View className="w-14 h-14 bg-blue-50 rounded-2xl items-center justify-center">
                <FontAwesome5 name={feature.icon} size={20} color="#2563eb" />
              </View>
              <Text className="text-gray-600 text-xs text-center mt-2 px-1">
                {feature.text}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Emergency Section */}
      <View className="px-6 mt-8 mb-8">
        <View className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-red-100 rounded-xl items-center justify-center mr-4">
              <Ionicons name="medkit" size={24} color="#dc2626" />
            </View>
            <View className="flex-1">
              <Text className="text-red-800 font-bold text-base">
                Emergency Care
              </Text>
              <Text className="text-red-600 text-sm mt-1">
                24/7 emergency services available
              </Text>
            </View>
            <Pressable
              onPress={() => router.push("/#")}
              className="bg-red-600 px-4 py-2 rounded-full"
            >
              <Text className="text-white font-semibold text-sm">Call Now</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Health Tips */}
      <View className="px-6 mt-2 mb-8">
        <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Health Tips
          </Text>
          <View className="space-y-3">
            <View className="flex-row items-start">
              <View className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3" />
              <Text className="text-gray-600 flex-1 text-sm">
                Stay hydrated - Drink at least 8 glasses of water daily
              </Text>
            </View>
            <View className="flex-row items-start">
              <View className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3" />
              <Text className="text-gray-600 flex-1 text-sm">
                Regular exercise improves overall health and immunity
              </Text>
            </View>
            <View className="flex-row items-start">
              <View className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3" />
              <Text className="text-gray-600 flex-1 text-sm">
                Get 7-8 hours of sleep for better mental and physical health
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
