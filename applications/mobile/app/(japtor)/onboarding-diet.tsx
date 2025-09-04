import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { ArrowRight, ArrowLeft } from 'lucide-react-native';

const dietOptions = [
  'None', 'Dukan', 'Atkins', 'Intermittent Fasting', 'Vegetarian', 'Vegan', 'Paleo'
];

export default function OnboardingDietDemo() {
  const [selectedDiet, setSelectedDiet] = useState<string>('Paleo');

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6 py-8">
          {/* Progress Indicators */}
          <View className="flex-row justify-center space-x-2 mb-8">
            <View className="w-8 h-8 bg-gray-300 rounded-full items-center justify-center">
              <Text className="text-white font-semibold">1</Text>
            </View>
            <View className="w-8 h-8 bg-gray-300 rounded-full items-center justify-center">
              <Text className="text-white font-semibold">2</Text>
            </View>
            <View className="w-8 h-8 bg-gray-300 rounded-full items-center justify-center">
              <Text className="text-white font-semibold">3</Text>
            </View>
            <View className="w-8 h-8 bg-orange-500 rounded-full items-center justify-center">
              <Text className="text-white font-semibold">4</Text>
            </View>
          </View>

          {/* Header */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-900 mb-4">
              Do you follow any of these diets?
            </Text>
            <Text className="text-gray-600">
              To offer you the best tailored diet experience we need to know 
              more information about you.
            </Text>
          </View>

          {/* Diet Options */}
          <View className="space-y-3 mb-8">
            {dietOptions.map((diet) => (
              <TouchableOpacity
                key={diet}
                onPress={() => setSelectedDiet(diet)}
                className={`p-4 rounded-lg border ${
                  selectedDiet === diet
                    ? 'bg-orange-500 border-orange-500'
                    : 'bg-white border-gray-300'
                }`}
              >
                <Text className={`font-medium ${
                  selectedDiet === diet ? 'text-white' : 'text-gray-700'
                }`}>
                  {diet}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Skip Option */}
          <TouchableOpacity className="mb-8">
            <Text className="text-purple-600 font-semibold text-center">Skip</Text>
          </TouchableOpacity>

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
              onPress={() => router.push('/(japtor)/notification-permission' as any)}
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
