import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { SignOutButton } from '@/components/element/SignOutButton'
import { Image } from "expo-image";
import { ThemedView } from "@/components/element/ThemedView";
import { ThemedText } from "@/components/element/ThemedText";
import { HelloWave } from "@/components/element/HelloWave";
import ParallaxScrollView from "@/components/element/ParallaxScrollView";
import { Button } from '@/components/ui/button';

export default function Page() {
  const { user } = useUser()

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        }>
        <View>
          <SignedIn>
            <Text style={styles.textContent}>Hello {user?.emailAddresses[0].emailAddress}</Text>
            <SignOutButton />
          </SignedIn>
          <SignedOut>
            <Link href="/(auth)/sign-in" asChild>
              <Button>
                <Text className="text-background">Sign in</Text>
              </Button>
            </Link>
            <Link href="/(auth)/sign-up" asChild>
              <Button variant="outline">
                <Text>Sign up</Text>
              </Button>
            </Link>
          </SignedOut>
        </View>
      </ParallaxScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  textContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    color: "white"
  }
});