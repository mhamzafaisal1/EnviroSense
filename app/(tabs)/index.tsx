import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Platform, View, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, child } from 'firebase/database';
import { app, database } from '../../firebaseConfig'; // Use named imports for Firebase

export default function HomeScreen() {
  const [sensorData, setSensorData] = useState<{ [key: string]: any } | null>(null);
  const [userName, setUserName] = useState<string>('User'); // Placeholder user name

  useEffect(() => {
    const fetchData = async () => {
      const dbRef = ref(database, '/environmentalData/'); // Correctly reference the database path
      try {
        const snapshot = await get(dbRef); // Use `get` instead of `once`
        setSensorData(snapshot.val());
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      {/* App Title */}
      <ThemedView style={styles.titleSection}>
        <ThemedText type="title" style={styles.appTitle}>EnviroSense</ThemedText>
        <ThemedText type="subtitle" style={styles.greeting}>Hello, {userName}!</ThemedText>
      </ThemedView>

      {/* Sensor Data */}
      {sensorData ? (
        Object.keys(sensorData).map((key) => (
          <ThemedView key={key} style={styles.dataContainer}>
            <ThemedText type="subtitle">Type: {sensorData[key].type}</ThemedText>
            <ThemedText>Value: {sensorData[key].value} {sensorData[key].unit}</ThemedText>
            <ThemedText>Timestamp: {sensorData[key].timestamp}</ThemedText>
          </ThemedView>
        ))
      ) : (
        <Text style={styles.loadingText}>Loading data...</Text>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleSection: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D3D47',
    marginBottom: 10,
  },
  greeting: {
    fontSize: 18,
    color: '#1D3D47',
  },
  dataContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
    color: '#999',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

