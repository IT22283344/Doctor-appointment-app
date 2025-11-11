🏥 HealthConnect — Doctor Appointment Booking App

A modern, user-friendly mobile application built with React Native and Expo that allows users to seamlessly book doctor appointments.
HealthConnect provides an intuitive and secure platform for finding healthcare professionals, scheduling visits, and managing medical appointments — all from your mobile device.


📱 Overview

HealthConnect bridges the gap between patients and healthcare providers by offering a streamlined booking experience with real-time availability and transparent pricing.
The app focuses on accessibility, security, and professional healthcare standards, ensuring users can connect with doctors quickly and confidently.

✨ Key Features

🔍 Smart Doctor Search — Find specialists by name, specialization, or filter options
📅 Simple Appointment Booking — Clean and intuitive process for scheduling visits
💰 Transparent Pricing — View consultation fees upfront before booking
🕒 Real-time Slot Availability — See available appointment times instantly
👤 User Profiles — Personalized dashboard for returning users
🔐 Secure Authentication — Uses Expo SecureStore for local token management
📱 Mobile-First Design — Fully optimized for iOS and Android with smooth navigation

🛠 Technology Stack
Frontend

React Native — Cross-platform mobile development
Expo SDK 49 — Simplifies development, testing, and deployment
TypeScript — Type-safe JavaScript for reliability
Tailwind CSS (NativeWind) — Utility-first styling
Expo Router — File-based navigation system

Authentication & Storage

AuthContext — Custom React Context for state management
Expo SecureStore — Secure local data storage for authentication tokens
React Hooks — Used for efficient state and lifecycle management

UI & Icons

FontAwesome and Material Icons — Icon sets for a modern interface
Custom Components — Modular, reusable UI elements

⚙️ Installation & Setup
Prerequisites
Node.js (v16 or higher)
npm or yarn
Expo CLI
Expo Go app (for device testing)

Setup Instructions
# Clone the repository
git clone https://github.com/yourusername/healthconnect.git

# Navigate into the project
cd healthconnect

# Install dependencies
npm install
# or
yarn install

# Run the app
npx expo start


Then, scan the QR code with the Expo Go app to run it on your device.

🧩 Notes

The app uses expo-secure-store for secure, persistent authentication.
PDF generation for appointment summaries and invoices uses expo-print and expo-sharing.
Node.js backend (in development) will handle appointment APIs, authentication, and doctor data management.


🚀 Future Enhancements

🌐 Integration with Node.js + Express backend
💳 Payment gateway for online consultation fees
📊 Doctor analytics and appointment history tracking
📅 Push notifications and reminders for appointments