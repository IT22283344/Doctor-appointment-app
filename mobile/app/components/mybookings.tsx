import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

type Booking = {
  id: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  slot: string;
  patient: {
    name: string;
    age: string;
    contact: string;
  };
  fee: number;
  createdAt: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  bookingNumber: string;
};

export default function MyBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const raw = await SecureStore.getItemAsync('appointments');
      if (raw) {
        const data = JSON.parse(raw);
        setBookings(data.reverse()); // newest first
      }
    } catch (err) {
      console.error('Error loading bookings:', err);
    }
  };

  const cancelBooking = async (booking: Booking) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              const raw = await SecureStore.getItemAsync('appointments');
              if (raw) {
                const data = JSON.parse(raw);
                const updated = data.map((b: Booking) =>
                  b.id === booking.id ? { ...b, status: 'cancelled' } : b
                );
                await SecureStore.setItemAsync('appointments', JSON.stringify(updated));
                await loadBookings();
                Alert.alert('Success', 'Booking cancelled successfully');
              }
            } catch (err) {
              console.error('Error cancelling booking:', err);
              Alert.alert('Error', 'Failed to cancel booking');
            }
          },
        },
      ]
    );
  };

  const renderBooking = ({ item: booking }: { item: Booking }) => (
    <View className="bg-white p-4 mb-4 rounded-lg shadow">
      <View className="flex-row justify-between mb-2">
        <Text className="font-bold text-lg">{booking.doctorName}</Text>
        <Text
          className={`${
            booking.status === 'upcoming'
              ? 'text-green-600'
              : booking.status === 'cancelled'
              ? 'text-red-600'
              : 'text-gray-600'
          }`}
        >
          {booking.status}
        </Text>
      </View>
      <Text className="text-gray-600 mb-1">{booking.specialization}</Text>
      <Text className="mb-1">Slot: {booking.slot}</Text>
      <Text className="mb-2">Booking #: {booking.bookingNumber}</Text>

      <View className="flex-row justify-between mt-2">
        <Pressable
          onPress={() => router.push(`/invoice?id=${booking.id}`)}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          <Text className="text-white">View Invoice</Text>
        </Pressable>
        {booking.status === 'upcoming' && (
          <Pressable
            onPress={() => cancelBooking(booking)}
            className="bg-red-600 px-4 py-2 rounded"
          >
            <Text className="text-white">Cancel</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-4">My Bookings</Text>
      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-gray-500">No bookings found</Text>
          </View>
        }
      />
    </View>
  );
}