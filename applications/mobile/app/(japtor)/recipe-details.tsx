import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Heart, Clock, Users, Star, Bookmark, Share } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function RecipeDetailsDemo() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [servings, setServings] = useState(4);

  const ingredients = [
    { name: 'Salmon fillet', amount: '4 pieces', calories: '280 cal' },
    { name: 'Asparagus', amount: '1 lb', calories: '40 cal' },
    { name: 'Olive oil', amount: '2 tbsp', calories: '240 cal' },
    { name: 'Lemon', amount: '1 piece', calories: '15 cal' },
    { name: 'Garlic', amount: '3 cloves', calories: '12 cal' },
    { name: 'Sea salt', amount: '1 tsp', calories: '0 cal' },
  ];

  const steps = [
    'Preheat oven to 425°F (220°C)',
    'Season salmon with salt, pepper, and minced garlic',
    'Heat olive oil in an oven-safe skillet over medium-high heat',
    'Sear salmon skin-side up for 3-4 minutes until golden',
    'Flip salmon and add asparagus to the pan',
    'Transfer to oven and bake for 8-10 minutes',
    'Squeeze fresh lemon juice over everything before serving'
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View className="relative">
          <View className="h-64 bg-gradient-to-br from-orange-200 to-red-300 items-center justify-center">
            <Text className="text-6xl">🐟</Text>
          </View>
          
          {/* Header Controls */}
          <View className="absolute top-4 left-4 right-4 flex-row justify-between">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="w-10 h-10 bg-white/80 rounded-full items-center justify-center"
            >
              <ArrowLeft size={20} color="#374151" />
            </TouchableOpacity>
            <View className="flex-row space-x-2">
              <TouchableOpacity 
                onPress={() => setIsBookmarked(!isBookmarked)}
                className="w-10 h-10 bg-white/80 rounded-full items-center justify-center"
              >
                <Bookmark size={20} color={isBookmarked ? "#EF4444" : "#374151"} />
              </TouchableOpacity>
              <TouchableOpacity className="w-10 h-10 bg-white/80 rounded-full items-center justify-center">
                <Share size={20} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="px-4 py-6">
          {/* Recipe Header */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              Grilled Salmon with Asparagus
            </Text>
            <Text className="text-gray-600 mb-4">
              A healthy and delicious salmon dish that's perfect for dinner. Rich in omega-3 fatty acids and protein.
            </Text>
            
            {/* Rating and Stats */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center space-x-1">
                <Star size={16} color="#F59E0B" fill="#F59E0B" />
                <Text className="font-medium text-gray-900">4.8</Text>
                <Text className="text-gray-600">(124 reviews)</Text>
              </View>
              <View className="flex-row items-center space-x-4">
                <View className="flex-row items-center space-x-1">
                  <Clock size={16} color="#6B7280" />
                  <Text className="text-gray-600">25 min</Text>
                </View>
                <View className="flex-row items-center space-x-1">
                  <Users size={16} color="#6B7280" />
                  <Text className="text-gray-600">{servings} servings</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Nutrition Facts */}
          <Card className="bg-blue-50 border-blue-200 mb-6">
            <CardContent className="p-4">
              <Text className="font-semibold text-gray-900 mb-3">Nutrition per serving</Text>
              <View className="flex-row justify-between">
                <View className="items-center">
                  <Text className="text-xl font-bold text-blue-600">587</Text>
                  <Text className="text-sm text-gray-600">Calories</Text>
                </View>
                <View className="items-center">
                  <Text className="text-xl font-bold text-blue-600">45g</Text>
                  <Text className="text-sm text-gray-600">Protein</Text>
                </View>
                <View className="items-center">
                  <Text className="text-xl font-bold text-blue-600">8g</Text>
                  <Text className="text-sm text-gray-600">Carbs</Text>
                </View>
                <View className="items-center">
                  <Text className="text-xl font-bold text-blue-600">42g</Text>
                  <Text className="text-sm text-gray-600">Fat</Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Servings Adjuster */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="font-semibold text-lg text-gray-900">Servings</Text>
            <View className="flex-row items-center space-x-4">
              <TouchableOpacity 
                onPress={() => servings > 1 && setServings(servings - 1)}
                className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center"
              >
                <Text className="font-bold text-gray-700">-</Text>
              </TouchableOpacity>
              <Text className="font-semibold text-gray-900 text-lg">{servings}</Text>
              <TouchableOpacity 
                onPress={() => setServings(servings + 1)}
                className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center"
              >
                <Text className="font-bold text-white">+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Ingredients */}
          <View className="mb-6">
            <Text className="font-semibold text-lg text-gray-900 mb-4">Ingredients</Text>
            <View className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <View key={index} className="flex-row items-center justify-between py-2">
                  <View className="flex-1">
                    <Text className="font-medium text-gray-900">{ingredient.name}</Text>
                    <Text className="text-sm text-gray-600">{ingredient.amount}</Text>
                  </View>
                  <Text className="text-sm text-blue-600">{ingredient.calories}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Instructions */}
          <View className="mb-6">
            <Text className="font-semibold text-lg text-gray-900 mb-4">Instructions</Text>
            <View className="space-y-4">
              {steps.map((step, index) => (
                <View key={index} className="flex-row space-x-3">
                  <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center mt-1">
                    <Text className="text-white text-sm font-bold">{index + 1}</Text>
                  </View>
                  <Text className="flex-1 text-gray-700 leading-6">{step}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row space-x-3">
            <Button 
              className="flex-1 bg-blue-500 py-4 rounded-xl"
              onPress={() => router.push('/(japtor)/meal-planner' as any)}
            >
              <Text className="text-white font-semibold text-center">Add to Meal Plan</Text>
            </Button>
            <TouchableOpacity className="px-6 py-4 border-2 border-blue-500 rounded-xl items-center justify-center">
              <Heart size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
