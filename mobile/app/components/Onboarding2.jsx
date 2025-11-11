import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

const Onboarding2 = () => {
  const router = useRouter();
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80' }}
      style={styles.background}
      blurRadius={3}      
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Comprehensive Healthcare Solution</Text>

        <Text style={styles.featureText}>• 24/7 access to healthcare professionals</Text>
        <Text style={styles.featureText}>• Real-time appointment scheduling</Text>
        <Text style={styles.featureText}>• Prescription management and refills</Text>
        <Text style={styles.featureText}>• Health monitoring and reminders</Text>
        <Text style={styles.featureText}>• Secure medical history storage</Text>

        <TouchableOpacity onPress={() => router.replace('/')} style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
    marginBottom: 30,
  },
  featureText: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginVertical: 8,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#2196F3',
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

export default Onboarding2;