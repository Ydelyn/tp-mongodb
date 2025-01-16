import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSession } from '../context/sessionContext';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React from 'react';
import WeatherDisplay from '@/components/WeatherDisplay';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation } :any) {
  const { session, setSession } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    try {
        await axios.post(`${process.env.BACKEND_URL}/logout`, { sessionId: session?.id });
        setSession(null);
        router.navigate('/login');
    } catch (error) {
        console.error('Erreur lors de la déconnexion :', error);
    }
};
  return (
        <ThemedView  style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <ThemedText style={styles.title}>Bienvenue !</ThemedText>
            <TouchableOpacity onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#007AFF" />
            </TouchableOpacity>          </View>
          <WeatherDisplay/>
        </ThemedView>
    );
  }

const styles = StyleSheet.create({
  titleRow: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
