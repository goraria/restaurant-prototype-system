import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/element/HapticTab';
import { IconSymbol } from '@/components/element/IconSymbol';
import TabBarBackground from '@/components/element/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  BookText,
  LucideBell,
  LucideHome,
  LucideMessageCircle,
  LucideSend,
  LucideUser,
  PaperclipIcon
} from "lucide-react-native";
import { ThemeToggle } from '@/components/element/ThemeToggle';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ? 'light' : 'dark'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <LucideHome color={color} size={28} />,
          }}
        />
        <Tabs.Screen
          name="order"
          options={{
            title: 'Order',
            tabBarIcon: ({ color }) => <BookText color={color} size={28} />,
          }}
        />
        <Tabs.Screen
          name="message"
          options={{
            title: 'Message',
            headerShown: true,
            headerRight: () => <ThemeToggle />,
            tabBarIcon: ({ color }) => <LucideMessageCircle color={color} size={28} />,
          }}
        />
        <Tabs.Screen
          name="notification"
          options={{
            title: 'Notification',
            headerShown: true,
            // headerLeft: () => <CustomButton />,
            // headerRight: () => <ThemeToggle />,
            tabBarIcon: ({ color }) => <LucideBell color={color} size={28} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            // sceneStyle: {
            //   backgroundColor: 'transparent',
            // },
            tabBarIcon: ({ color }) => <LucideUser color={color} size={28} />,
            // headerRight: () => <ThemeToggle/>,
          }}
        />
      </Tabs>
    </>
  );
}
