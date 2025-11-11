import React from 'react'
import { View, Text, Pressable } from 'react-native'

export default function DoctorCard({ doctor, onPress }: { doctor: any; onPress: () => void }) {
  const availableSlots = Object.entries(doctor.slots).filter(([_, info]: [string, any]) => info.available > 0).length;

  return (
    <Pressable onPress={onPress} className="bg-white p-4 rounded-lg shadow-md mb-4">
      <View>
        <View className="flex-row justify-between items-start mb-2">
          <View>
            <Text className="text-xl font-bold">{doctor.name}</Text>
            <Text className="text-gray-600">{doctor.specialization}</Text>
          </View>
          <View className="bg-blue-100 px-3 py-1 rounded">
            <Text className="text-blue-800">{doctor.rating} ★</Text>
          </View>
        </View>

        <Text className="text-gray-600 mb-2">{doctor.experience}</Text>
        <Text className="text-gray-700 mb-3">{doctor.about}</Text>

        <View className="flex-row justify-between items-center border-t border-gray-200 pt-3">
          <Text className="text-green-600 font-semibold">
            {availableSlots} slots available
          </Text>
          <Text className="text-blue-600 font-bold">
            Rs. {doctor.fee}
          </Text>
        </View>

        <View className="flex-row flex-wrap mt-2">
          {Object.entries(doctor.slots).map(([time, info]: [string, any]) => (
            info.available > 0 && (
              <View key={time} className="bg-gray-100 px-2 py-1 mr-2 mb-2 rounded">
                <Text className="text-sm">{time}</Text>
              </View>
            )
          ))}
        </View>
      </View>
    </Pressable>
  )
}
