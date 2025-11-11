import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

const Onboarding1 = () => {
  const router = useRouter();
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80' }}
      blurRadius={3}      
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome to HealthConnect</Text>
        <Text style={styles.subtitle}>
          Your trusted partner for seamless doctor appointments and healthcare management.
        </Text>

        <Text style={styles.featureText}>• Book appointments with specialist doctors instantly</Text>
        <Text style={styles.featureText}>• Video consultations from the comfort of your home</Text>
        <Text style={styles.featureText}>• Manage your medical records securely</Text>

        <TouchableOpacity onPress={() => router.push('/components/Onboarding2')} style={styles.button}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'right',
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Slightly more opaque for better readability
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3', // Changed to medical blue theme
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  featureText: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginVertical: 8,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#2196F3', // Medical blue color
    padding: 15,
    borderRadius: 25,
    marginTop: 40,
    width: '70%',
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Onboarding1;