import React from 'react';
import { Tabs } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { ShoppingBasket, Chrome as Home, Clipboard, User, Settings } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function TabLayout() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const { userData } = useAuth();
  
  const isFarmer = userData?.role === 'farmer';
  const isAdmin = userData?.role === 'admin';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Medium',
          fontSize: 12,
        },
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.background,
          height: 60,
          paddingBottom: 8,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      
      {isFarmer && (
        <Tabs.Screen
          name="my-crops"
          options={{
            title: 'My Crops',
            tabBarIcon: ({ color, size }) => <Clipboard size={size} color={color} />,
          }}
        />
      )}
      
      {!isFarmer && (
        <Tabs.Screen
          name="browse"
          options={{
            title: 'Browse',
            tabBarIcon: ({ color, size }) => <ShoppingBasket size={size} color={color} />,
          }}
        />
      )}
      
      {isAdmin && (
        <Tabs.Screen
          name="admin"
          options={{
            title: 'Admin',
            tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          }}
        />
      )}
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}