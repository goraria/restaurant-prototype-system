import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import { ThemeToggle } from "@/components/element/ThemeToggle";
import { TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Router, useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';

export default function AuthRoutesLayout() {
  const router = useRouter()
  const { isSignedIn } = useAuth()
  const { colors } = useTheme()

  if (isSignedIn) {
    return <Redirect href={'/'} />
  }

  return (
    <>
      <Stack screenOptions={{ 
        headerShown: true,
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
        <Stack.Screen name="sign-in" options={{ title: 'Sign In' }} />
        <Stack.Screen name="sign-up" options={{ title: 'Sign Up' }} />
        <Stack.Screen name="forgot-password" options={{ title: 'Forgot Password' }} />
      </Stack>
    </>
  )
}