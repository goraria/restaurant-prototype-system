import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/element/HapticTab';
import TabBarBackground from '@/components/element/TabBarBackground';
// import { Colors } from '@/constants/Colors';
import { THEME } from "@/lib/theme";
import { useColorScheme } from 'nativewind';
// import { useColorScheme } from '@/hooks/useColorScheme';
import {
  Home,
  UtensilsCrossed,
  Bell,
  MessageCircle,
  User,
} from "lucide-react-native";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: THEME[colorScheme ?? 'light'].muted,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              // position: 'absolute',
              paddingBottom: 34, // Add padding for iPhone home indicator
            },
            default: {
              paddingBottom: 10,
            },
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Trang chủ',
            tabBarIcon: ({ color }) => <Home color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            title: 'Thực đơn',
            tabBarIcon: ({ color }) => <UtensilsCrossed color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: 'Tin nhắn',
            tabBarIcon: ({ color }) => <MessageCircle color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            title: 'Thông báo',
            tabBarIcon: ({ color }) => <Bell color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Cá nhân',
            headerShown: false,
            tabBarIcon: ({ color }) => <User color={color} size={24} />,
          }}
        />
      </Tabs>
    </>
  );
}
