import { useEffect } from 'react';
import { Redirect, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../authContext';

export default function Index() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await SecureStore.getItemAsync('hasLaunched');
      if (!hasLaunched) {
        await SecureStore.setItemAsync('hasLaunched', 'true');
        router.replace('/(auth)/onboarding' as any);
        return null;
      }
    } catch (err) {
      console.error('Error checking first launch:', err);
    }
  };

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
