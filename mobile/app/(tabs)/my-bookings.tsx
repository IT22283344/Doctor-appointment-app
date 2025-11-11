import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { FontAwesome } from '@expo/vector-icons';

type Booking = {
  id: string;
  bookingNumber: string;
  doctorName: string;
  doctorId: string;
  specialization: string;
  slot: string;
  fee: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  patient: {
    name: string;
    age: string;
    contact: string;
  };
  createdAt: string;
};

export default function MyBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const raw = await SecureStore.getItemAsync('appointments');
      const appointments = raw ? JSON.parse(raw) : [];
      setBookings(appointments.sort((a: Booking, b: Booking) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (err) {
      console.error('Error loading bookings:', err);
      Alert.alert('Error', 'Failed to load appointments');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const cancelBooking = async (bookingId: string) => {
    try {
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: 'cancelled' as const } : booking
      );
      await SecureStore.setItemAsync('appointments', JSON.stringify(updatedBookings));
      setBookings(updatedBookings);
      Alert.alert('Success', 'Appointment cancelled successfully');
    } catch (err) {
      console.error('Error cancelling booking:', err);
      Alert.alert('Error', 'Failed to cancel appointment');
    }
  };

  const confirmCancel = (bookingId: string) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => cancelBooking(bookingId) }
      ]
    );
  };

  const renderBooking = ({ item: booking }: { item: Booking }) => {
    const isUpcoming = booking.status === 'upcoming';
    const statusColor = {
      upcoming: 'text-blue-600',
      completed: 'text-green-600',
      cancelled: 'text-red-600'
    }[booking.status];

    return (
      <View className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-100">
        <View className="flex-row justify-between items-start mb-2">
          <View>
            <Text className="font-semibold text-lg">{booking.doctorName}</Text>
            <Text className="text-gray-600">{booking.specialization}</Text>
          </View>
          <Text className={statusColor + ' capitalize'}>{booking.status}</Text>
        </View>
        
        <View className="border-t border-gray-100 mt-2 pt-2">
          <View className="flex-row items-center mb-1">
            <FontAwesome name="calendar" size={14} color="#64748b" />
            <Text className="text-gray-600 ml-2">{booking.slot}</Text>
          </View>
          <View className="flex-row items-center">
            <FontAwesome name="user" size={14} color="#64748b" />
            <Text className="text-gray-600 ml-2">{booking.patient.name}</Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center mt-3 pt-2 border-t border-gray-100">
          <Text className="text-gray-600">#{booking.bookingNumber}</Text>
          {isUpcoming && (
            <View className="flex-row">
              <Pressable
                onPress={() => router.push(`/invoice?id=${booking.id}`)}
                className="bg-blue-100 px-3 py-1 rounded-full mr-2"
              >
                <Text className="text-blue-600">Invoice</Text>
              </Pressable>
              <Pressable
                onPress={() => confirmCancel(booking.id)}
                className="bg-red-100 px-3 py-1 rounded-full"
              >
                <Text className="text-red-600">Cancel</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-6">
      <Text className="text-2xl font-bold mb-4">My Appointments</Text>
      
      <View className="flex-row mb-4">
        {(['all', 'upcoming', 'completed'] as const).map((status) => (
          <Pressable
            key={status}
            onPress={() => setFilter(status)}
            className={`px-4 py-2 rounded-full mr-2 ${
              filter === status ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <Text
              className={`${
                filter === status ? 'text-white' : 'text-gray-700'
              } capitalize`}
            >
              {status}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredBookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-gray-500">No appointments found</Text>
          </View>
        }
      />
    </View>
  );
}