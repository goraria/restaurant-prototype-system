import React from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Apple, Facebook, Mail } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

export default function OnboardingSignupDemo() {
  const { colorScheme } = useColorScheme();

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-purple-600 to-pink-500">
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Background Design */}
        <View className="absolute inset-0">
          <View className="absolute top-20 left-0 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          <View className="absolute top-40 right-0 w-24 h-24 bg-white/20 rounded-full blur-lg" />
        </View>

        <View className="flex-1 px-6 pt-16">
          {/* Logo/Header Area */}
          <View className="items-center mb-12">
            <View className="w-16 h-16 bg-white/20 rounded-2xl items-center justify-center mb-4">
              <Text className="text-white text-2xl font-bold">🍽️</Text>
            </View>
            <Text className="text-white text-xl font-semibold">Welcome to FoodApp</Text>
            <Text className="text-white/80 text-sm mt-2">Your personalized meal companion</Text>
          </View>

          {/* Sign Up Options */}
          <View className="space-y-4">
            {/* Email Sign Up */}
            <Button 
              className="bg-white rounded-xl h-14 shadow-lg"
              onPress={() => router.push('/(japtor)/onboarding-welcome')}
            >
              <View className="flex-row items-center">
                <Mail size={20} color="#6B46C1" />
                <Text className="text-purple-600 font-semibold ml-3">Sign up with email</Text>
              </View>
            </Button>

            {/* Social Sign Up */}
            <View className="space-y-3">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/30 rounded-xl h-14"
                onPress={() => router.push('/(japtor)/onboarding-welcome')}
              >
                <View className="flex-row items-center">
                  <Apple size={20} color="white" />
                  <Text className="text-white font-semibold ml-3">Continue with Apple</Text>
                </View>
              </Button>

              <Button 
                variant="outline" 
                className="bg-white/10 border-white/30 rounded-xl h-14"
                onPress={() => router.push('/(japtor)/onboarding-welcome')}
              >
                <View className="flex-row items-center">
                  <View className="w-5 h-5 bg-white rounded-full" />
                  <Text className="text-white font-semibold ml-3">Continue with Google</Text>
                </View>
              </Button>

              <Button 
                variant="outline" 
                className="bg-blue-600 border-blue-600 rounded-xl h-14"
                onPress={() => router.push('/(japtor)/onboarding-welcome')}
              >
                <View className="flex-row items-center">
                  <Facebook size={20} color="white" />
                  <Text className="text-white font-semibold ml-3">Continue with Facebook</Text>
                </View>
              </Button>
            </View>

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-white/30" />
              <Text className="text-white/60 text-sm mx-4">or use social sign up</Text>
              <View className="flex-1 h-px bg-white/30" />
            </View>

            {/* Already have account */}
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-white text-center">
                Already have account? <Text className="font-semibold underline">Log In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
