/**
 * Tabs Layout - Bottom tab navigation configuration
 */

import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { Colors } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <TabIcon iconName="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="uma"
        options={{
          title: 'Uma Chat',
          tabBarIcon: ({ color, size }) => (
            <TabIcon iconName="chat" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: 'Quiz',
          tabBarIcon: ({ color, size }) => (
            <TabIcon iconName="clipboard" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <TabIcon iconName="compass" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

// Simple icon component (replace with your icon library like @expo/vector-icons)
function TabIcon({ iconName, color, size }: { iconName: string; color: string; size: number }) {
  const icons: Record<string, string> = {
    home: '🏠',
    chat: '💬',
    clipboard: '📋',
    compass: '🧭',
  };

  return <Text style={{ fontSize: size, color }}>{icons[iconName] || '•'}</Text>;
}
