import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings, Share, Grid, List, Star, Clock, Heart } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ProfileMealsDemo() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTab, setSelectedTab] = useState('Favorites');

  const tabs = ['Favorites', 'My Recipes', 'Saved', 'History'];

  const meals = [
    {
      id: 1,
      title: 'Grilled Salmon',
      description: 'Healthy omega-3 rich dish',
      image: '🐟',
      time: '25 min',
      calories: '587 cal',
      rating: 4.8,
      isPrivate: false,
      date: 'Yesterday'
    },
    {
      id: 2,
      title: 'Avocado Toast',
      description: 'Perfect breakfast choice',
      image: '🥑',
      time: '10 min',
      calories: '320 cal',
      rating: 4.6,
      isPrivate: true,
      date: '2 days ago'
    },
    {
      id: 3,
      title: 'Quinoa Salad',
      description: 'Nutritious and filling',
      image: '🥗',
      time: '15 min',
      calories: '450 cal',
      rating: 4.7,
      isPrivate: false,
      date: '3 days ago'
    },
    {
      id: 4,
      title: 'Greek Yogurt Bowl',
      description: 'Protein-rich snack',
      image: '🥛',
      time: '5 min',
      calories: '180 cal',
      rating: 4.5,
      isPrivate: false,
      date: '1 week ago'
    },
    {
      id: 5,
      title: 'Chicken Stir Fry',
      description: 'Quick and healthy dinner',
      image: '🍗',
      time: '20 min',
      calories: '520 cal',
      rating: 4.9,
      isPrivate: true,
      date: '1 week ago'
    },
    {
      id: 6,
      title: 'Smoothie Bowl',
      description: 'Refreshing morning treat',
      image: '🥤',
      time: '8 min',
      calories: '280 cal',
      rating: 4.4,
      isPrivate: false,
      date: '2 weeks ago'
    }
  ];

  const filteredMeals = meals.filter(meal => {
    switch (selectedTab) {
      case 'Favorites':
        return meal.rating >= 4.7;
      case 'My Recipes':
        return meal.isPrivate;
      case 'Saved':
        return !meal.isPrivate && meal.rating >= 4.5;
      case 'History':
        return true;
      default:
        return true;
    }
  });

  const renderGridView = () => (
    <View className="flex-row flex-wrap justify-between">
      {filteredMeals.map((meal) => (
        <TouchableOpacity
          key={meal.id}
          onPress={() => router.push('/(japtor)/recipe-details' as any)}
          className="w-[48%] mb-4"
        >
          <Card className="bg-white">
            <CardContent className="p-0">
              <View className="h-32 bg-gray-100 rounded-t-lg items-center justify-center">
                <Text className="text-4xl">{meal.image}</Text>
              </View>
              <View className="p-3">
                <Text className="font-semibold text-gray-900 mb-1" numberOfLines={1}>
                  {meal.title}
                </Text>
                <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
                  {meal.description}
                </Text>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center space-x-1">
                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    <Text className="text-sm text-gray-600">{meal.rating}</Text>
                  </View>
                  <Text className="text-xs text-blue-600">{meal.calories}</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderListView = () => (
    <View className="space-y-3">
      {filteredMeals.map((meal) => (
        <TouchableOpacity
          key={meal.id}
          onPress={() => router.push('/(japtor)/recipe-details' as any)}
        >
          <Card className="bg-white">
            <CardContent className="p-4">
              <View className="flex-row space-x-3">
                <View className="w-16 h-16 bg-gray-100 rounded-lg items-center justify-center">
                  <Text className="text-2xl">{meal.image}</Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1">
                      <Text className="font-semibold text-gray-900 mb-1">
                        {meal.title}
                      </Text>
                      <Text className="text-sm text-gray-600 mb-2">
                        {meal.description}
                      </Text>
                      <View className="flex-row items-center space-x-4">
                        <View className="flex-row items-center space-x-1">
                          <Star size={12} color="#F59E0B" fill="#F59E0B" />
                          <Text className="text-sm text-gray-600">{meal.rating}</Text>
                        </View>
                        <View className="flex-row items-center space-x-1">
                          <Clock size={12} color="#6B7280" />
                          <Text className="text-sm text-gray-600">{meal.time}</Text>
                        </View>
                        <Text className="text-sm text-blue-600">{meal.calories}</Text>
                      </View>
                    </View>
                    <TouchableOpacity className="p-2">
                      <Heart size={20} color="#EF4444" fill="#EF4444" />
                    </TouchableOpacity>
                  </View>
                  <Text className="text-xs text-gray-500 mt-1">{meal.date}</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View className="bg-white px-4 py-3">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="font-bold text-lg text-gray-900">My Meals</Text>
          <View className="flex-row space-x-3">
            <TouchableOpacity onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
              {viewMode === 'grid' ? (
                <List size={24} color="#374151" />
              ) : (
                <Grid size={24} color="#374151" />
              )}
            </TouchableOpacity>
            <TouchableOpacity>
              <Settings size={24} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Stats */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-900">47</Text>
            <Text className="text-sm text-gray-600">Recipes</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-900">152</Text>
            <Text className="text-sm text-gray-600">Saved</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-900">28</Text>
            <Text className="text-sm text-gray-600">Shared</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-900">4.6</Text>
            <Text className="text-sm text-gray-600">Avg Rating</Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-3">
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setSelectedTab(tab)}
                className={`px-4 py-2 rounded-full ${
                  selectedTab === tab 
                    ? 'bg-blue-500' 
                    : 'bg-gray-200'
                }`}
              >
                <Text className={`font-medium ${
                  selectedTab === tab 
                    ? 'text-white' 
                    : 'text-gray-700'
                }`}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="px-4 py-4">
          {/* Results Count */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900">
              {filteredMeals.length} {selectedTab.toLowerCase()}
            </Text>
            <TouchableOpacity>
              <Share size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          {viewMode === 'grid' ? renderGridView() : renderListView()}

          {/* Add Recipe Button */}
          <Button 
            className="mt-6 bg-blue-500 py-4 rounded-xl"
            onPress={() => router.push('/(japtor)/food-chat' as any)}
          >
            <Text className="text-white font-semibold text-center">Create New Recipe</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
