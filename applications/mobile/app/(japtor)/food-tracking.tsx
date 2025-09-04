import React from 'react';
import { View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Plus, MoreHorizontal, TrendingUp } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function FoodTrackingDemo() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white px-4 py-3 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="font-bold text-lg text-gray-900">Food Tracking</Text>
          <TouchableOpacity>
            <MoreHorizontal size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <View className="px-4 py-6">
          {/* Date Selection */}
          <View className="mb-6">
            <Text className="text-center text-lg font-semibold text-gray-700 mb-4">
              Today, March 15
            </Text>
            <View className="flex-row justify-center space-x-4">
              {['Sun', 'Mon', 'Tue', 'Wed'].map((day, index) => (
                <View
                  key={day}
                  className={`w-12 h-12 rounded-full items-center justify-center ${
                    index === 2 ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                >
                  <Text className={`font-medium ${index === 2 ? 'text-white' : 'text-gray-600'}`}>
                    {day}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Stats Cards */}
          <View className="flex-row space-x-3 mb-6">
            <Card className="flex-1 bg-white">
              <CardContent className="p-4 items-center">
                <Text className="text-2xl font-bold text-gray-900">1,850</Text>
                <Text className="text-sm text-gray-600">Calories</Text>
                <Text className="text-xs text-green-500 mt-1">Goal: 2,000</Text>
              </CardContent>
            </Card>
            
            <Card className="flex-1 bg-white">
              <CardContent className="p-4 items-center">
                <Text className="text-2xl font-bold text-gray-900">65g</Text>
                <Text className="text-sm text-gray-600">Protein</Text>
                <Text className="text-xs text-blue-500 mt-1">Goal: 80g</Text>
              </CardContent>
            </Card>
          </View>

          {/* Chart Placeholder */}
          <Card className="bg-white mb-6">
            <CardContent className="p-4">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="font-semibold text-gray-900">Weekly Progress</Text>
                <TrendingUp size={20} color="#10B981" />
              </View>
              <View className="h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg items-center justify-center">
                <View className="flex-row items-end space-x-2">
                  {[40, 60, 30, 80, 50, 70, 90].map((height, index) => (
                    <View
                      key={index}
                      className="bg-blue-500 w-6 rounded-t"
                      style={{ height: height }}
                    />
                  ))}
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Meals Section */}
          <View className="space-y-4">
            <View className="flex-row items-center justify-between">
              <Text className="font-semibold text-lg text-gray-900">Today's Meals</Text>
              <TouchableOpacity>
                <Plus size={24} color="#3B82F6" />
              </TouchableOpacity>
            </View>

            {/* Breakfast */}
            <Card className="bg-white">
              <CardContent className="p-4">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="font-semibold text-gray-900">Breakfast</Text>
                    <Text className="text-sm text-gray-600">450 calories</Text>
                  </View>
                  <View className="w-12 h-12 bg-orange-100 rounded-lg items-center justify-center">
                    <Text className="text-orange-500 text-lg">🥐</Text>
                  </View>
                </View>
              </CardContent>
            </Card>

            {/* Lunch */}
            <Card className="bg-white">
              <CardContent className="p-4">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="font-semibold text-gray-900">Lunch</Text>
                    <Text className="text-sm text-gray-600">650 calories</Text>
                  </View>
                  <View className="w-12 h-12 bg-green-100 rounded-lg items-center justify-center">
                    <Text className="text-green-500 text-lg">🥗</Text>
                  </View>
                </View>
              </CardContent>
            </Card>

            {/* Dinner */}
            <Card className="bg-white">
              <CardContent className="p-4">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="font-semibold text-gray-900">Dinner</Text>
                    <Text className="text-sm text-gray-600">750 calories</Text>
                  </View>
                  <View className="w-12 h-12 bg-purple-100 rounded-lg items-center justify-center">
                    <Text className="text-purple-500 text-lg">🍝</Text>
                  </View>
                </View>
              </CardContent>
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
