import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSession } from '../context/sessionContext';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { session } = useSession();

  const screens = [
        {
          name: 'home',
          options: {
            title: 'Home',
            tabBarIcon: ({ color }: { color: string }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
            href: null
          },
        },
        {
          name: 'login',
          options: {
            title: 'Connexion',
            tabBarIcon: ({ color }: { color: string }) => (
              <Ionicons name="log-in-outline" size={28} color={color} />
            ),
            href: !session ? "/login" : null
          },
        },
        {
          name: 'register',
          options: {
            title: 'Inscription',
            tabBarIcon: ({ color }: { color: string }) => (
              <Ionicons name="person-add-outline" size={28} color={color} />
            ),
            href: !session ? "/register" : null
          },
        },
      ];

      return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: session ? {display: "none"} : Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      {screens.map((screen) => (
        <Tabs.Screen key={screen.name} name={screen.name} options={screen.options as any} />
      ))}
    </Tabs>
  );
}
