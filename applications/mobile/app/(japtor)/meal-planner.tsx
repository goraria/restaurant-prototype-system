import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, ChefHat, Clock, Heart, Target, Plus } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function MealPlannerDemo() {
  const [selectedDay, setSelectedDay] = useState(1);

  const weekDays = [
    { id: 0, day: 'T2', date: '12' },
    { id: 1, day: 'T3', date: '13' },
    { id: 2, day: 'T4', date: '14' },
    { id: 3, day: 'T5', date: '15' },
    { id: 4, day: 'T6', date: '16' },
  ];

  const mealPlans = {
    breakfast: { name: 'Bánh mì bơ', time: '8:00 SA', calories: '320 cal', emoji: '🥑' },
    lunch: { name: 'Salad Quinoa', time: '12:30 CH', calories: '450 cal', emoji: '🥗' },
    dinner: { name: 'Cá hồi nướng', time: '7:00 CH', calories: '520 cal', emoji: '🐟' },
    snack: { name: 'Sữa chua Hy Lạp', time: '3:00 CH', calories: '150 cal', emoji: '🥛' },
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <Card className="mx-4 mt-4 mb-4">
        <CardHeader>
          <View className="flex-row items-center justify-between">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </TouchableOpacity>
            <CardTitle className="text-xl">Kế hoạch bữa ăn</CardTitle>
            <TouchableOpacity className="w-10 h-10 items-center justify-center">
              <Calendar className="w-5 h-5" />
            </TouchableOpacity>
          </View>
        </CardHeader>
      </Card>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Month Selection */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <Text className="text-center text-lg font-semibold text-foreground mb-4">
              Tháng 3, 2024
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                {weekDays.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => setSelectedDay(item.id)}
                    className={`items-center p-3 rounded-xl min-w-[60px] ${
                      selectedDay === item.id ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <Text className={`text-sm font-medium ${
                      selectedDay === item.id ? 'text-white' : 'text-muted-foreground'
                    }`}>
                      {item.day}
                    </Text>
                    <Text className={`text-lg font-bold ${
                      selectedDay === item.id ? 'text-white' : 'text-foreground'
                    }`}>
                      {item.date}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </CardContent>
        </Card>

        {/* Daily Summary */}
        <Card className="mb-4">
          <CardHeader>
            <View className="flex-row items-center">
              <Target className="w-5 h-5 text-primary mr-2" />
              <CardTitle className="text-lg">Mục tiêu hàng ngày</CardTitle>
            </View>
          </CardHeader>
          <CardContent>
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-2xl font-bold text-foreground">1,440</Text>
                <Text className="text-sm text-muted-foreground">Calo</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-foreground">60g</Text>
                <Text className="text-sm text-muted-foreground">Protein</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-foreground">180g</Text>
                <Text className="text-sm text-muted-foreground">Carbs</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-foreground">48g</Text>
                <Text className="text-sm text-muted-foreground">Chất béo</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Meal Cards */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Bữa ăn đã lên kế hoạch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Breakfast */}
            <Card className="border border-border">
              <CardContent className="p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-orange-100 rounded-lg items-center justify-center mr-3">
                      <Text className="text-xl">{mealPlans.breakfast.emoji}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-semibold text-foreground">{mealPlans.breakfast.name}</Text>
                      <View className="flex-row items-center mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground mr-1" />
                        <Text className="text-sm text-muted-foreground mr-3">{mealPlans.breakfast.time}</Text>
                        <Badge variant="secondary">
                          <Text className="text-xs">{mealPlans.breakfast.calories}</Text>
                        </Badge>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity className="w-8 h-8 items-center justify-center">
                    <Heart className="w-5 h-5 text-red-500" />
                  </TouchableOpacity>
                </View>
              </CardContent>
            </Card>

            {/* Lunch */}
            <Card className="border border-border">
              <CardContent className="p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-green-100 rounded-lg items-center justify-center mr-3">
                      <Text className="text-xl">{mealPlans.lunch.emoji}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-semibold text-foreground">{mealPlans.lunch.name}</Text>
                      <View className="flex-row items-center mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground mr-1" />
                        <Text className="text-sm text-muted-foreground mr-3">{mealPlans.lunch.time}</Text>
                        <Badge variant="secondary">
                          <Text className="text-xs">{mealPlans.lunch.calories}</Text>
                        </Badge>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity className="w-8 h-8 items-center justify-center">
                    <Heart className="w-5 h-5 text-red-500" />
                  </TouchableOpacity>
                </View>
              </CardContent>
            </Card>

            {/* Snack */}
            <Card className="border border-border">
              <CardContent className="p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-blue-100 rounded-lg items-center justify-center mr-3">
                      <Text className="text-xl">{mealPlans.snack.emoji}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-semibold text-foreground">{mealPlans.snack.name}</Text>
                      <View className="flex-row items-center mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground mr-1" />
                        <Text className="text-sm text-muted-foreground mr-3">{mealPlans.snack.time}</Text>
                        <Badge variant="secondary">
                          <Text className="text-xs">{mealPlans.snack.calories}</Text>
                        </Badge>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity className="w-8 h-8 items-center justify-center">
                    <Heart className="w-5 h-5 text-red-500" />
                  </TouchableOpacity>
                </View>
              </CardContent>
            </Card>

            {/* Dinner */}
            <Card className="border border-border">
              <CardContent className="p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-purple-100 rounded-lg items-center justify-center mr-3">
                      <Text className="text-xl">{mealPlans.dinner.emoji}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-semibold text-foreground">{mealPlans.dinner.name}</Text>
                      <View className="flex-row items-center mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground mr-1" />
                        <Text className="text-sm text-muted-foreground mr-3">{mealPlans.dinner.time}</Text>
                        <Badge variant="secondary">
                          <Text className="text-xs">{mealPlans.dinner.calories}</Text>
                        </Badge>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity className="w-8 h-8 items-center justify-center">
                    <Heart className="w-5 h-5 text-red-500" />
                  </TouchableOpacity>
                </View>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Add Meal Button */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <Button 
              className="flex-row items-center justify-center"
              onPress={() => router.push('/(japtor)/food-tracking' as any)}
            >
              <Plus className="w-5 h-5 text-white mr-2" />
              <Text className="text-white font-semibold">Thêm bữa ăn mới</Text>
            </Button>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
