import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, FlatList, ScrollView, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import DoctorCard from './DoctorCard'
import doctorsData from '../data/doctors.json'
import { FontAwesome } from '@expo/vector-icons'

export default function Doctors() {
  const router = useRouter()
  const [doctors, setDoctors] = useState<any[]>([])
  const [query, setQuery] = useState('');
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

  const filtered = doctors.filter(d => {
    const q = query.toLowerCase()
    const matchesQuery = d.name.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q)
    const matchesSpecialization = !selectedSpecialization || d.specialization === selectedSpecialization
    return matchesQuery && matchesSpecialization
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'fee') return a.fee - b.fee
    return 0
  })

  return (
    <View className="flex-1 px-4 pt-6">
      <Text className="text-2xl font-bold mb-4">Doctors</Text>
      <View className="flex-row items-center mb-4">
        <View className="flex-1">
          <TextInput
            placeholder="Search by name"
            className="border p-3 rounded bg-white"
            value={query}
            onChangeText={setQuery}
            placeholderTextColor="#888"
          />
        </View>
        <Pressable
          onPress={() => setSortBy(sortBy === 'rating' ? null : 'rating')}
          className={`ml-2 p-3 rounded ${sortBy === 'rating' ? 'bg-blue-600' : 'bg-gray-200'}`}
        >
          <FontAwesome name="star" size={20} color={sortBy === 'rating' ? 'white' : 'black'} />
        </Pressable>
        <Pressable
          onPress={() => setSortBy(sortBy === 'fee' ? null : 'fee')}
          className={`ml-2 p-3 rounded ${sortBy === 'fee' ? 'bg-blue-600' : 'bg-gray-200'}`}
        >
          <FontAwesome name="dollar" size={20} color={sortBy === 'fee' ? 'white' : 'black'} />
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        <Pressable
          onPress={() => setSelectedSpecialization(null)}
          className={`px-4 py-2 rounded-full mr-2 ${!selectedSpecialization ? 'bg-blue-600' : 'bg-gray-200'}`}
        >
          <Text className={!selectedSpecialization ? 'text-white' : 'text-black'}>All</Text>
        </Pressable>
        {specializations.map(spec => (
          <Pressable
            key={spec}
            onPress={() => setSelectedSpecialization(spec === selectedSpecialization ? null : spec)}
            className={`px-4 py-2 rounded-full mr-2 ${spec === selectedSpecialization ? 'bg-blue-600' : 'bg-gray-200'}`}
          >
            <Text className={spec === selectedSpecialization ? 'text-white' : 'text-black'}>{spec}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DoctorCard doctor={item} onPress={() => router.push(`/components/booking?id=${item.id}`)} />
        )}
      />
    </View>
  )
}
