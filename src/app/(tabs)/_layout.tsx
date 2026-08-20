import React from 'react';
import { Tabs } from 'expo-router';
import { useAppSelector } from '../../store/hooks';
import { COLORS } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function TabsLayout() {
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'admin';

  // Dynamic colors based on admin role
  const activeColor = isAdmin ? '#FFFFFF' : COLORS.primary;
  const inactiveColor = isAdmin ? 'rgba(255, 255, 255, 0.65)' : COLORS.textMuted;
  const borderTopColor = isAdmin ? '#E6732B' : COLORS.border;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        
        // Tab Bar styles dynamically colored based on role
        tabBarStyle: {
          backgroundColor: isAdmin ? 'transparent' : '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: borderTopColor,
          height: Platform.OS === 'ios' ? 62 + 34 : 62,
          paddingBottom: Platform.OS === 'ios' ? 34 : 8,
          paddingTop: 8,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={isAdmin ? (['#FF8C42', '#FF5722'] as const) : (['#FFFFFF', '#FAF9F6'] as const)}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: 0.3,
        },
      }}
    >
      {/* 1. Dashboard Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'grid' : 'grid-outline'} size={18} color={color} />
          ),
        }}
      />

      {/* 2. Inbox Tab (Leads / Messages) */}
      <Tabs.Screen
        name="inbox/index"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'chatbubbles' : 'chatbubbles-outline'} size={18} color={color} />
          ),
        }}
      />

      {/* 3. Content Hub Tab */}
      <Tabs.Screen
        name="content/index"
        options={{
          title: 'Content',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'library' : 'library-outline'} size={18} color={color} />
          ),
        }}
      />

      {/* 4. Workflows Tab */}
      <Tabs.Screen
        name="workflows/index"
        options={{
          title: 'Workflows',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'git-pull-request' : 'git-pull-request-outline'} size={18} color={color} />
          ),
        }}
      />

      {/* 5. Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} size={18} color={color} />
          ),
        }}
      />

      {/* Hidden sub-screens inside the Tabs group */}
      <Tabs.Screen name="inbox/[id]" options={{ href: null }} />
      <Tabs.Screen name="content/pages" options={{ href: null }} />
      <Tabs.Screen name="content/services" options={{ href: null }} />
      <Tabs.Screen name="content/industries" options={{ href: null }} />
      <Tabs.Screen name="content/blogs" options={{ href: null }} />
      <Tabs.Screen name="content/faqs" options={{ href: null }} />
      <Tabs.Screen name="content/sections" options={{ href: null }} />
      <Tabs.Screen name="case-studies/index" options={{ href: null }} />
      <Tabs.Screen name="case-studies/[id]" options={{ href: null }} />
    </Tabs>
  );
}
