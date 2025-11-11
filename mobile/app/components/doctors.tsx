import React, { useEffect, useState } from 'react'
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  ScrollView, 
  Pressable, 
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native'
import { useRouter } from 'expo-router'
import DoctorCard from './DoctorCard'
import doctorsData from '../data/doctors.json'
import { FontAwesome } from '@expo/vector-icons'

export default function Doctors() {
  const router = useRouter()
  const [doctors, setDoctors] = useState<any[]>([])
  const [query, setQuery] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'rating' | 'fee' | null>(null)

  useEffect(() => {
    // emulate fetch from local json
    setDoctors(doctorsData)
  }, [])

  // Get unique specializations from doctors data
  const specializations = React.useMemo(() => 
    Array.from(new Set(doctors.map(d => d.specialization))).sort(),
    [doctors]
  )

  const filteredDoctors = React.useMemo(() => 
    doctors.filter(d => {
      const q = query.toLowerCase()
      const matchesQuery = d.name.toLowerCase().includes(q) || 
                          d.specialization.toLowerCase().includes(q)
      const matchesSpecialization = !selectedSpecialization || 
                                  d.specialization === selectedSpecialization
      return matchesQuery && matchesSpecialization
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'fee') return a.fee - b.fee
      return 0
    }),
    [doctors, query, selectedSpecialization, sortBy]
  )

  const handleSortPress = (type: 'rating' | 'fee') => {
    setSortBy(current => current === type ? null : type)
  }

  const handleSpecializationPress = (spec: string | null) => {
    setSelectedSpecialization(current => current === spec ? null : spec)
  }

  const clearSearch = () => {
    setQuery('')
    Keyboard.dismiss()
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-gray-50">
        <View className="px-4 pt-6 pb-4 bg-white">
          <Text className="text-2xl font-bold text-gray-900 mb-4">Find Doctors</Text>
          
          {/* Search Bar */}
          <View className="flex-row items-center mb-4">
            <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
              <FontAwesome name="search" size={16} color="#6B7280" />
              <TextInput
                placeholder="Search by name or specialization..."
                className="flex-1 ml-2 text-gray-900"
                value={query}
                onChangeText={setQuery}
                placeholderTextColor="#9CA3AF"
                returnKeyType="search"
              />
              {query.length > 0 && (
                <Pressable onPress={clearSearch} className="p-1">
                  <FontAwesome name="times-circle" size={16} color="#6B7280" />
                </Pressable>
              )}
            </View>
          </View>

          {/* Sort Buttons */}
          <View className="flex-row items-center mb-4">
            <Text className="text-gray-700 mr-3">Sort by:</Text>
            <Pressable
              onPress={() => handleSortPress('rating')}
              className={`flex-row items-center px-3 py-2 rounded-full mr-2 ${
                sortBy === 'rating' ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            >
              <FontAwesome 
                name="star" 
                size={14} 
                color={sortBy === 'rating' ? 'white' : '#6B7280'} 
              />
              <Text className={`ml-1 text-sm ${
                sortBy === 'rating' ? 'text-white' : 'text-gray-700'
              }`}>
                Rating
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handleSortPress('fee')}
              className={`flex-row items-center px-3 py-2 rounded-full ${
                sortBy === 'fee' ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            >
              <FontAwesome 
                name="dollar" 
                size={14} 
                color={sortBy === 'fee' ? 'white' : '#6B7280'} 
              />
              <Text className={`ml-1 text-sm ${
                sortBy === 'fee' ? 'text-white' : 'text-gray-700'
              }`}>
                Fee
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Specializations Filter */}
        <View className="bg-white px-4 py-3 border-b border-gray-200">
          <Text className="text-gray-700 mb-2 font-medium">Specializations</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            <Pressable
              onPress={() => handleSpecializationPress(null)}
              className={`px-4 py-2 rounded-full mr-2 ${
                !selectedSpecialization ? 'bg-blue-500' : 'bg-gray-100'
              }`}
            >
              <Text className={!selectedSpecialization ? 'text-white font-medium' : 'text-gray-700'}>
                All
              </Text>
            </Pressable>
            {specializations.map(spec => (
              <Pressable
                key={spec}
                onPress={() => handleSpecializationPress(spec)}
                className={`px-4 py-2 rounded-full mr-2 ${
                  spec === selectedSpecialization ? 'bg-blue-500' : 'bg-gray-100'
                }`}
              >
                <Text className={
                  spec === selectedSpecialization ? 'text-white font-medium' : 'text-gray-700'
                }>
                  {spec}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Results Count */}
        <View className="px-4 py-3 bg-gray-50">
          <Text className="text-gray-600 text-sm">
            {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
          </Text>
        </View>

        {/* Doctors List */}
        <FlatList
          data={filteredDoctors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DoctorCard 
              doctor={item} 
              onPress={() => router.push(`/components/booking?id=${item.id}`)} 
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-10">
              <FontAwesome name="user-md" size={48} color="#D1D5DB" />
              <Text className="text-gray-500 text-lg mt-4">No doctors found</Text>
              <Text className="text-gray-400 text-center mt-2">
                Try adjusting your search or filters
              </Text>
            </View>
          }
        />
      </View>
    </TouchableWithoutFeedback>
  )
}