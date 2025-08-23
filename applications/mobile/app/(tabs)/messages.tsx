import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { UserMenu } from '@/components/user-menu';
import { useUser } from '@clerk/clerk-expo';
import { Link, Stack } from 'expo-router';
import { XIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Image, type ImageStyle, View } from 'react-native';
import { ThemeToggle } from '@/components/element/ThemeToggle';

export default function Screen() {
  const { colorScheme } = useColorScheme();
  const { user } = useUser();

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <View className="top-safe absolute left-0 right-0 flex-row justify-between px-4 py-2 web:mx-2">
              <ThemeToggle />
              <UserMenu />
            </View>
          ),
          headerShown: true,
        }}
      />
      <View className="flex-1 items-center justify-center gap-8 p-4">
        <View className="flex-row items-center justify-center gap-3.5">
          <Image
            source={{
              light: require('@/assets/images/clerk-logo-light.png'),
              dark: require('@/assets/images/clerk-logo-dark.png'),
            }[colorScheme ?? 'light']}
            resizeMode="contain"
            style={{
              height: 36,
              width: 40,
            }}
          />
          <Icon as={XIcon} className="mr-1 size-5" />
          <Image
            source={{
              light: require('@/assets/images/react-native-reusables-light.png'),
              dark: require('@/assets/images/react-native-reusables-dark.png'),
            }[colorScheme ?? 'light']}
            style={{
              height: 36,
              width: 40,
            }}
            resizeMode="contain"
          />
        </View>
        <View className="max-w-sm gap-2 px-4">
          <Text variant="h1" className="text-3xl font-medium">
            Make it yours{user?.firstName ? `, ${user.firstName}` : ''}.
          </Text>
          <Text className="ios:text-foreground text-center font-mono text-sm text-muted-foreground">
            Update the screens and components to match your design and logic.
          </Text>
        </View>
        <View className="gap-2">
          <Link href="/(others)/clerk" asChild>
            <Button size="sm">
              <Text>Explore Clerk Docs</Text>
            </Button>
          </Link>
        </View>
      </View>
    </>
  );
}