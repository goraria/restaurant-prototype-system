import React from 'react';
import { View, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { ArrowRight, ArrowLeft } from 'lucide-react-native';

export default function OnboardingWelcomeDemo() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6 py-8">
          {/* Progress Indicators */}
          <View className="flex-row justify-center space-x-2 mb-8">
            <View className="w-8 h-8 bg-orange-500 rounded-full items-center justify-center">
              <Text className="text-white font-semibold">1</Text>
            </View>
            <View className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center">
              <Text className="text-gray-500 font-semibold">2</Text>
            </View>
            <View className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center">
              <Text className="text-gray-500 font-semibold">3</Text>
            </View>
            <View className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center">
              <Text className="text-gray-500 font-semibold">4</Text>
            </View>
          </View>

          {/* Main Content */}
          <View className="flex-1 items-center justify-center">
            {/* Food Images */}
            <View className="flex-row mb-8">
              <View className="w-32 h-40 bg-orange-100 rounded-l-2xl overflow-hidden">
                <View className="w-full h-full bg-gradient-to-b from-orange-200 to-orange-300" />
              </View>
              <View className="w-32 h-40 bg-green-100 rounded-r-2xl overflow-hidden">
                <View className="w-full h-full bg-gradient-to-b from-green-200 to-green-300" />
              </View>
            </View>

            {/* Title and Description */}
            <View className="items-center px-4 mb-12">
              <Text className="text-2xl font-bold text-gray-900 text-center mb-4">
                Enjoy your lunch time
              </Text>
              <Text className="text-gray-600 text-center leading-6">
                Just relax and not overthink what to eat. This is in our side with 
                our personalized meal plans just prepared and adapted to your needs.
              </Text>
            </View>
          </View>

          {/* Navigation Buttons */}
          <View className="flex-row justify-between items-center">
            <Button 
              variant="ghost" 
              className="bg-gray-100 px-6 py-3 rounded-xl"
              onPress={() => router.back()}
            >
              <View className="flex-row items-center">
                <ArrowLeft size={16} color="#6B7280" />
                <Text className="text-gray-600 font-semibold ml-2">Previous</Text>
              </View>
            </Button>

            <Button 
              className="bg-orange-500 px-8 py-3 rounded-xl"
              onPress={() => router.push('/(japtor)/onboarding-allergies' as any)}
            >
              <View className="flex-row items-center">
                <Text className="text-white font-semibold mr-2">Next</Text>
                <ArrowRight size={16} color="white" />
              </View>
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
