import React, { useEffect, useState } from 'react'
import { View, Text, Pressable, TextInput, Alert, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import doctorsData from '../data/doctors.json'
import * as SecureStore from 'expo-secure-store'

// Types
interface DoctorSlot {
  available: number;
  capacity: number;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  fee: number;
  experience: string;
  rating: number;
  about: string;
  slots: {
    [key: string]: DoctorSlot;
  };
}

// Type assertion for doctorsData
//const typedDoctorsData = doctorsData as Doctor[];

interface Patient {
  name: string;
  age: string;
  contact: string;
}

const CONSULTATION_FEE = 2500

type SlotInfo = {
  capacity: number;
  available: number;
};

type DoctorData = {
  id: string;
  name: string;
  specialization: string;
  fee: number;
  experience: string;
  rating: number;
  about: string;
  slots: { [key: string]: SlotInfo };
};

export default function Booking() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const [doctor, setDoctor] = useState<DoctorData | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [contact, setContact] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const foundDoctor = doctorsData.find((x: any) => x.id === id);
    if (!foundDoctor) {
      Alert.alert('Error', 'Doctor not found');
      router.back();
      return;
    }
    
    // Convert the raw data to match our type
    const formattedDoctor: DoctorData = {
      id: foundDoctor.id,
      name: foundDoctor.name,
      specialization: foundDoctor.specialization,
      fee: foundDoctor.fee,
      experience: foundDoctor.experience,
      rating: foundDoctor.rating,
      about: foundDoctor.about,
      slots: Object.entries(foundDoctor.slots).reduce((acc, [key, value]: [string, any]) => {
        acc[key] = {
          capacity: value.capacity,
          available: value.available
        };
        return acc;
      }, {} as { [key: string]: SlotInfo })
    };
    
    setDoctor(formattedDoctor);
  }, [id, router]);

  const confirmBooking = async () => {
    try {
      setIsLoading(true);

      if (!doctor) {
        Alert.alert('Error', 'Doctor information not found');
        return;
      }

      if (!selectedSlot || !name || !age || !contact) {
        Alert.alert('Missing fields', 'Please fill all fields and select a slot');
        return;
      }

      // Validate inputs
      if (!name.trim() || !age.trim() || !contact.trim()) {
        Alert.alert('Invalid Input', 'Please fill all fields with valid information');
        return;
      }

      // Validate age
      const ageNum = parseInt(age, 10);
      if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
        Alert.alert('Invalid Age', 'Please enter a valid age');
        return;
      }

      // Check if slot is still available
      const slotInfo = doctor.slots[selectedSlot as keyof typeof doctor.slots];
      if (!slotInfo || slotInfo.available === 0) {
        Alert.alert('Slot Full', 'This time slot is no longer available');
        return;
      }

      const timestamp = Date.now()
      const bookingNumber = `BK${timestamp.toString().slice(-6)}`
      
      const appointment = {
        id: `appt_${timestamp}`,
        bookingNumber,
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialization: doctor.specialization,
        slot: selectedSlot,
        patient: { name, age, contact },
        fee: doctor.fee || CONSULTATION_FEE,
        status: 'upcoming',
        createdAt: new Date().toISOString()
      }

      // Update appointments
      const raw = await SecureStore.getItemAsync('appointments')
      const list = raw ? JSON.parse(raw) : []
      list.push(appointment)
      await SecureStore.setItemAsync('appointments', JSON.stringify(list))

      // Update doctor's slot availability
      const updatedDoctors = doctorsData.map((d: any) => {
        if (d.id === doctor.id && selectedSlot && d.slots[selectedSlot]) {
          const currentSlot = d.slots[selectedSlot];
          const updatedSlot = {
            ...currentSlot,
            available: Math.max(0, currentSlot.available - 1)
          };
          
          return {
            ...d,
            slots: {
              ...d.slots,
              [selectedSlot]: updatedSlot
            }
          };
        }
        return d;
      });

      // Save updated doctor data
      await SecureStore.setItemAsync('doctorsData', JSON.stringify(updatedDoctors))
      Alert.alert('Success', `Appointment booked\nBooking #: ${bookingNumber}`)
      router.replace(`/invoice?id=${appointment.id}`)
    } catch(err) {
      console.error(err);
      Alert.alert('Error', 'Unable to save appointment');
    } finally {
      setIsLoading(false);
    }
  };

  if (!doctor) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2">Loading doctor information...</Text>
      </View>
    );
  }  return (
    <View className="flex-1 px-4 pt-6">
      <Text className="text-2xl font-bold mb-2">Book with {doctor.name}</Text>
      <Text className="text-sm text-gray-600 mb-4">{doctor.specialization}</Text>

      <Text className="mb-2 font-semibold">Available Slots</Text>
      <View className="flex-row flex-wrap mb-4">
        {Object.entries(doctor.slots).map(([time, info]: [string, any]) => (
          <Pressable
            key={time}
            onPress={() => setSelectedSlot(time)}
            disabled={info.available === 0}
            className={`px-3 py-2 mr-2 mb-2 rounded ${
              selectedSlot === time
                ? 'bg-blue-600'
                : info.available === 0
                ? 'bg-gray-300'
                : 'bg-gray-200'
            }`}
          >
            <Text className={`${selectedSlot === time ? 'text-white' : ''}`}>
              {time} ({info.available}/{info.capacity})
            </Text>
          </Pressable>
        ))}
      </View>

      <TextInput placeholder="Patient name"  placeholderTextColor="#888" className="border p-3 mb-3 rounded  text-black" value={name} onChangeText={setName} />
      <TextInput placeholder="Age"  placeholderTextColor="#888" className="border p-3 mb-3 rounded" value={age} onChangeText={setAge} keyboardType="numeric" />
      <TextInput placeholder="Contact number"  placeholderTextColor="#888" className="border p-3 mb-3 rounded" value={contact} onChangeText={setContact} keyboardType="phone-pad" />

      <Pressable 
        onPress={confirmBooking} 
        className={`bg-green-600 p-3 rounded ${isLoading ? 'opacity-50' : ''}`}
        disabled={isLoading}
      >
        <View className="flex-row justify-center items-center">
          {isLoading && <ActivityIndicator color="white" className="mr-2" />}
          <Text className="text-white text-center">
            {isLoading ? 'Booking...' : 'Confirm Booking'}
          </Text>
        </View>
      </Pressable>
    </View>
  )
}
