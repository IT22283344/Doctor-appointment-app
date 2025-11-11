# Doctor Appointment App

A mobile application for booking doctor appointments and managing healthcare visits.

## Features

- Onboarding flow for first-time users
- View list of doctors and their available slots
- Book appointments and save them locally
- Generate PDF invoices for appointments
- Authentication system for users

## Setup & Installation

1. Install dependencies:
```bash
cd mobile
npm install
expo install expo-secure-store @react-native-async-storage/async-storage expo-print expo-sharing
```

2. Start the backend server:
```bash
cd api
# Create .env with MONGO_URL and JWT_SECRET
npm install
npm run dev
```

3. Start the Expo app:
```bash
cd mobile
expo start
```

## App Flow

1. First Launch:
   - Users see Onboarding1 -> Onboarding2 screens
   - After onboarding, directed to main menu

2. Subsequent Launches:
   - Main menu with "View Doctors" and "Sign In" options
   - Authenticated users can book appointments
   - Generate PDF invoices after booking

## Project Structure

```
mobile/
  app/
    components/
      Onboarding1.jsx    # First onboarding screen
      Onboarding2.jsx    # Second onboarding screen
      DoctorCard.tsx     # Doctor list item component
    data/
      doctors.json       # Static doctor data
    index.tsx           # Main entry & menu
    doctors.tsx         # Doctor listing
    booking.tsx         # Appointment booking
    invoice.tsx         # Invoice generation
```

## Important Notes

- The app uses `expo-secure-store` for persistent storage
- PDF generation requires `expo-print` and `expo-sharing`
- Backend API URL needs to be updated with your machine's IP when testing on physical devices