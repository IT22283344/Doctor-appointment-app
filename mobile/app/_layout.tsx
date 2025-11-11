import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "./authContext";
import "../global.css";

// This is the main layout component that handles authentication flow
function RootLayoutNav() {
  const { user } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    // Use setTimeout to ensure the navigation is ready
    const timer = setTimeout(() => {
      if (!user && !inAuthGroup) {
        // Redirect to the sign-in page if not signed 
        
        router.replace("/(auth)/login");
      } else if (user && inAuthGroup) {
        // Redirect to the main app if signed in
        router.replace("/(tabs)");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [user, segments]);

  return (
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: '#f8fafc',
      },
      headerShadowVisible: false,
      headerTintColor: '#1e293b',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      contentStyle: {
        backgroundColor: '#f8fafc',
      },
    }}>
      <Stack.Screen 
        name="(auth)" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="booking" 
        options={{ 
          title: "Book Appointment",
          presentation: 'modal',
        }} 
      />
      <Stack.Screen 
        name="invoice" 
        options={{ 
          title: "Invoice",
          presentation: 'modal',
        }} 
      />
    </Stack>
  );
}

// This is the root layout that provides the auth context
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
