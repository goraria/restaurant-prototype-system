
import React from 'react';
import { Stack, useRouter } from "expo-router";
import { Platform, TouchableOpacity } from 'react-native';
import { useColorScheme } from "react-native/Libraries/Utilities/Appearance";
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@react-navigation/core';
import { useAuth } from '@clerk/clerk-expo';
import { ThemeToggle } from '@/components/element/ThemeToggle';

export default function SettingsLayout() {
  const router = useRouter()
  const { isSignedIn } = useAuth()
  const { colors } = useTheme()

  return (
    <Stack 
      screenOptions={{
        headerShown: false,
        headerTransparent: true,
        animationTypeForReplace: 'pop',
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={{ paddingHorizontal: 12 }}>
            <ArrowLeft className='text-foreground' color={colors.text} size={22} />
          </TouchableOpacity>
        ),
        headerRight: () => <ThemeToggle />,
        contentStyle: {
          backgroundColor: 'transparent',
        },
      }}>
      <Stack.Screen name="information" options={{ title: 'Information' }} />
      <Stack.Screen name="security" options={{ title: 'Security' }} />
    </Stack>
  );
}
