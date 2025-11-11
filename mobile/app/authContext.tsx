import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updateProfile?: (data: Partial<User>) => Promise<void>;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: { name: string; email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user data on app start
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await SecureStore.getItemAsync('userData');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser({
          ...parsedUser,
          updateProfile: async (data: Partial<User>) => {
            const updated = { ...parsedUser, ...data };
            await SecureStore.setItemAsync('userData', JSON.stringify(updated));
            setUser(updated);
          }
        });
      }
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // For demo purposes, we'll validate against stored data
      const storedUsers = await SecureStore.getItemAsync('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const user = users.find((u: any) => 
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Remove password from user data
      const { password: _, ...userData } = user;
      
      // Store user data
      await SecureStore.setItemAsync('userData', JSON.stringify(userData));
      
      // Set user in state with updateProfile method
      setUser({
        ...userData,
        updateProfile: async (data: Partial<User>) => {
          const updated = { ...userData, ...data };
          await SecureStore.setItemAsync('userData', JSON.stringify(updated));
          setUser(updated);
        }
      });
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to sign in');
    }
  };

  const signUp = async (userData: { name: string; email: string; password: string }) => {
    try {
      // Get existing users
      const storedUsers = await SecureStore.getItemAsync('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      // Check if email already exists
      if (users.some((u: any) => u.email.toLowerCase() === userData.email.toLowerCase())) {
        throw new Error('Email already registered');
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        ...userData,
        role: 'patient',
        createdAt: new Date().toISOString()
      };

      // Save to users list
      users.push(newUser);
      await SecureStore.setItemAsync('users', JSON.stringify(users));

      // Sign in the new user
      await signIn(userData.email, userData.password);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to sign up');
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync('userData');
      setUser(null);
    } catch (err) {
      throw new Error('Failed to sign out');
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};