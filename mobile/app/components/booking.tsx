import React, { useEffect, useState } from 'react'
import { View, Text, Pressable, TextInput, Alert, ActivityIndicator, Platform, Modal, TouchableOpacity, ScrollView } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import doctorsData from '../data/doctors.json'
import * as SecureStore from 'expo-secure-store'
import DateTimePicker from '@react-native-community/datetimepicker'

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
  slots: { [key: string]: DoctorSlot };
}

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
  const [appointmentDate, setAppointmentDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)

  useEffect(() => {
    const foundDoctor = doctorsData.find((x: any) => x.id === id);
    if (!foundDoctor) {
      Alert.alert('Error', 'Doctor not found');
      router.back();
      return;
    }

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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // Always close the picker first
    setShowDatePicker(false);
    
    if (event.type === 'set' && selectedDate) {
      setAppointmentDate(selectedDate);
    }
    // If event.type is 'dismissed' or 'canceled', do nothing (picker closed without selection)
  };

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

      const ageNum = parseInt(age, 10);
      if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
        Alert.alert('Invalid Age', 'Please enter a valid age');
        return;
      }

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
        date: appointmentDate.toISOString().split('T')[0],
        patient: { name, age, contact, appointmentDate },
        fee: doctor.fee || CONSULTATION_FEE,
        status: 'upcoming',
        createdAt: new Date().toISOString()
      }

      const raw = await SecureStore.getItemAsync('appointments')
      const list = raw ? JSON.parse(raw) : []
      list.push(appointment)
      await SecureStore.setItemAsync('appointments', JSON.stringify(list))

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

      await SecureStore.setItemAsync('doctorsData', JSON.stringify(updatedDoctors))
      Alert.alert('Success', `Appointment booked\nBooking #: ${bookingNumber}`)
      router.replace(`/invoice?id=${appointment.id}`)
    } catch (err) {
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
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-4 pt-6 pb-8">
        <Text className="text-2xl font-bold mb-2">Book with {doctor.name}</Text>
        <Text className="text-sm text-gray-600 mb-6">{doctor.specialization}</Text>

        {/* Available Slots */}
        <Text className="text-lg font-semibold mb-3">Available Slots</Text>
        <View className="flex-row flex-wrap mb-6">
          {Object.entries(doctor.slots).map(([time, info]: [string, any]) => (
            <Pressable
              key={time}
              onPress={() => setSelectedSlot(time)}
              disabled={info.available === 0}
              className={`px-4 py-3 mr-3 mb-3 rounded-lg border ${
                selectedSlot === time
                  ? 'bg-blue-600 border-blue-600'
                  : info.available === 0
                  ? 'bg-gray-100 border-gray-300'
                  : 'bg-white border-gray-300'
              }`}
            >
              <Text className={`font-medium ${
                selectedSlot === time
                  ? 'text-white'
                  : info.available === 0
                  ? 'text-gray-400'
                  : 'text-gray-800'
              }`}>
                {time}
              </Text>
              <Text className={`text-sm ${
                selectedSlot === time
                  ? 'text-blue-200'
                  : info.available === 0
                  ? 'text-gray-400'
                  : 'text-gray-500'
              }`}>
                {info.available}/{info.capacity} available
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Patient Information */}
        <Text className="text-lg font-semibold mb-4">Patient Information</Text>
        
        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#666"
          className="border border-gray-300 p-4 mb-4 rounded-lg text-black bg-white"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Age"
          placeholderTextColor="#666"
          className="border border-gray-300 p-4 mb-4 rounded-lg text-black bg-white"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        <TextInput
          placeholder="Contact Number"
          placeholderTextColor="#666"
          className="border border-gray-300 p-4 mb-6 rounded-lg text-black bg-white"
          value={contact}
          onChangeText={setContact}
          keyboardType="phone-pad"
        />

        {/* Date Picker Section */}
        <Text className="text-lg font-semibold mb-3">Appointment Date</Text>
        
        <Pressable
          onPress={() => setShowDatePicker(true)}
          className="border border-gray-300 p-4 mb-6 rounded-lg bg-white"
        >
          <Text className="text-black text-base">
             {appointmentDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
          <Text className="text-gray-500 text-sm mt-1">Tap to change date</Text>
        </Pressable>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={appointmentDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
            onChange={handleDateChange}
            minimumDate={new Date()}
            style={
              Platform.OS === 'ios' 
                ? { height: 200, backgroundColor: 'white' } 
                : {}
            }
            textColor="#000000"
            accentColor="#2563eb"
          />
        )}

        {/* Booking Summary */}
        <View className="bg-gray-50 p-4 rounded-lg mb-6">
          <Text className="text-lg font-semibold mb-3">Booking Summary</Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Doctor Fee</Text>
            <Text className="text-gray-800">Rs.{doctor.fee}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Date</Text>
            <Text className="text-gray-800">{appointmentDate.toLocaleDateString()}</Text>
          </View>
          {selectedSlot && (
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Time Slot</Text>
              <Text className="text-gray-800">{selectedSlot}</Text>
            </View>
          )}
          <View className="border-t border-gray-200 mt-3 pt-3">
            <View className="flex-row justify-between">
              <Text className="text-lg font-semibold">Total</Text>
              <Text className="text-lg font-semibold">Rs.{doctor.fee}</Text>
            </View>
          </View>
        </View>

        {/* Confirm Button */}
        <Pressable
          onPress={confirmBooking}
          disabled={isLoading || !selectedSlot}
          className={`p-4 rounded-lg ${
            isLoading || !selectedSlot ? 'bg-blue-300' : 'bg-green-600'
          }`}
        >
          <View className="flex-row justify-center items-center">
            {isLoading && <ActivityIndicator color="white" size="small" className="mr-2" />}
            <Text className="text-white text-center text-xl font-semibold">
              {isLoading ? 'Booking...' : `Confirm Booking`}
            </Text>
          </View>
        </Pressable>

        {!selectedSlot && (
          <Text className="text-red-500 text-center mt-2">
            Please select a time slot to continue
          </Text>
        )}
      </View>
    </ScrollView>
  )
}