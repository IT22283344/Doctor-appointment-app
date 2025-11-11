import React, { useEffect, useState } from 'react'
import { View, Text, Pressable, Alert } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'

export default function Invoice() {
  const { id } = useLocalSearchParams()
  const [appointment, setAppointment] = useState<any>(null)

  useEffect(() => {
    ;(async () => {
      const raw = await SecureStore.getItemAsync('appointments')
      const list = raw ? JSON.parse(raw) : []
      const appt = list.find((a: any) => a.id === id)
      setAppointment(appt)
    })()
  }, [id])

  const generatePdf = async () => {
    if (!appointment) return

    // You can replace this watermark image with your own hosted image URL
    const watermarkUrl =
      'https://cdn-icons-png.flaticon.com/512/2966/2966485.png' // sample medical watermark

    const html = `
      <div style="position: relative; padding: 20px; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; overflow: hidden;">
        <!-- Watermark Image -->
        <img src="${watermarkUrl}" 
          style="position: absolute; top: 50%; left: 50%; width: 300px; height: 300px; 
          transform: translate(-50%, -50%); opacity: 0.08; z-index: 0; pointer-events: none;" />

        <div style="position: relative; z-index: 1;">
          <h1 style="color: #2196F3; text-align: center;">Appointment Invoice</h1>
          <div style="border-bottom: 1px solid #eee; margin-bottom: 20px;">
            <p><strong>Booking Number:</strong> ${appointment.bookingNumber}</p>
            <p><strong>Date:</strong> ${new Date(appointment.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${appointment.status}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #666;">Patient Information</h3>
            <p><strong>Name:</strong> ${appointment.patient.name}</p>
            <p><strong>Age:</strong> ${appointment.patient.age}</p>
            <p><strong>Contact:</strong> ${appointment.patient.contact}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="color: #666;">Appointment Details</h3>
            <p><strong>Doctor:</strong> ${appointment.doctorName}</p>
            <p><strong>Specialization:</strong> ${appointment.specialization}</p>
            <p><strong>Time Slot:</strong> ${appointment.slot}</p>
          </div>

          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
            <p><strong>Consultation Fee:</strong> ${appointment.fee.toLocaleString('en-US', { style: 'currency', currency: 'LKR' })}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 10px 0;" />
            <h3 style="margin: 0; color: #2196F3;">Total: ${appointment.fee.toLocaleString('en-US', { style: 'currency', currency: 'LKR' })}</h3>
          </div>

          <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
            <p>Thank you for choosing our healthcare services!</p>
            <p>For any queries, please contact us at support@healthconnect.com</p>
          </div>
        </div>
      </div>
    `

    try {
      const { uri } = await Print.printToFileAsync({ html })
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Saved', `PDF saved to: ${uri}`)
        return
      }
      await Sharing.shareAsync(uri)
    } catch (err) {
      console.log(err)
      Alert.alert('Error', 'Unable to generate PDF')
    }
  }

  if (!appointment)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    )

  return (
    <View className="flex-1 px-6 pt-6">
      <Text className="text-2xl font-bold mb-4">Invoice</Text>
      <Text className="mb-2">Patient: {appointment.patient.name}</Text>
      <Text className="mb-2">Age: {appointment.patient.age}</Text>
      <Text className="mb-2">Contact: {appointment.patient.contact}</Text>
      <Text className="mb-2">
        Doctor: {appointment.doctorName} ({appointment.specialization})
      </Text>
      <Text className="mb-2">Slot: {appointment.slot}</Text>
      <Text className="mb-2">Consultation Fee: {appointment.fee}</Text>
      <Text className="mb-2"> Date: {new Date(appointment.patient.appointmentDate).toLocaleDateString()}</Text>
      <Pressable onPress={generatePdf} className="bg-blue-600 p-3 rounded mt-6">
        <Text className="text-white text-center">Generate PDF</Text>
      </Pressable>
    </View>
  )
}
