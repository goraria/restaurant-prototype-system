import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { ArrowRight, ArrowLeft } from 'lucide-react-native';

const allergyOptions = [
  'Gluten', 'Soy', 'Milk', 'Fish', 'Peanut', 'Wheat', 'Diary', 'Egg'
];

export default function OnboardingAllergiesDemo() {
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(['Fish']);

  const toggleAllergy = (allergy: string) => {
    if (selectedAllergies.includes(allergy)) {
      setSelectedAllergies(selectedAllergies.filter(item => item !== allergy));
    } else {
      setSelectedAllergies([...selectedAllergies, allergy]);
    }
  };

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
            <View className="w-8 h-8 bg-orange-500 rounded-full items-center justify-center">
              <Text className="text-white font-semibold">2</Text>
            </View>
            <View className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center">
              <Text className="text-gray-500 font-semibold">3</Text>
            </View>
            <View className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center">
              <Text className="text-gray-500 font-semibold">4</Text>
            </View>
          </View>

          {/* Header */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-900 mb-4">
              Any ingredient allergies?
            </Text>
            <Text className="text-gray-600">
              To offer you the best tailored diet experience we need to know 
              more information about you.
            </Text>
          </View>

          {/* Allergy Options Grid */}
          <View className="flex-row flex-wrap gap-3 mb-8">
            {allergyOptions.map((allergy) => (
              <TouchableOpacity
                key={allergy}
                onPress={() => toggleAllergy(allergy)}
                className={`px-4 py-3 rounded-lg border ${
                  selectedAllergies.includes(allergy)
                    ? 'bg-orange-500 border-orange-500'
                    : 'bg-white border-gray-300'
                }`}
              >
                <Text className={`font-medium ${
                  selectedAllergies.includes(allergy) ? 'text-white' : 'text-gray-700'
                }`}>
                  {allergy}
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
              onPress={() => router.push('/(japtor)/onboarding-diet' as any)}
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
