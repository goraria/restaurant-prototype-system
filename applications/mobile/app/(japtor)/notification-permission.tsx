import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Check, ArrowUp } from 'lucide-react-native';

export default function NotificationPermissionDemo() {
  return (
    <SafeAreaView className="flex-1 bg-purple-50">
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6 py-8">
          {/* Skip Option */}
          <View className="flex-row justify-end mb-8">
            <Button 
              variant="ghost"
              onPress={() => router.push('/(japtor)/food-chat' as any)}
            >
              <Text className="text-purple-600 font-bold">Skip</Text>
            </Button>
          </View>

          {/* Header Icon */}
          <View className="items-center mb-8">
            <View className="w-16 h-16 bg-purple-500 rounded-full items-center justify-center mb-4">
              <ArrowUp size={24} color="white" />
            </View>
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold text-purple-700 text-center mb-8">
            Do you want to turn on notifications?
          </Text>

          {/* Notification Preview */}
          <Card className="bg-white rounded-2xl shadow-lg mb-8 mx-4">
            <CardContent className="p-4">
              <View className="flex-row items-start">
                <View className="w-10 h-10 bg-purple-500 rounded-lg items-center justify-center mr-3">
                  <Text className="text-white text-lg">🍽️</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900 mb-1">
                    Notification Title
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Notification text would be placed right here. This is where 
                    notification text would be placed.
                  </Text>
                </View>
                <Text className="text-gray-400 text-xs">now</Text>
              </View>
            </CardContent>
          </Card>

          {/* Features List */}
          <View className="space-y-4 mb-12">
            <View className="flex-row items-center">
              <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center mr-4">
                <Check size={14} color="white" />
              </View>
              <Text className="text-purple-700 font-medium">New daily meal reminders</Text>
            </View>
            
            <View className="w-full h-px bg-purple-200" />
            
            <View className="flex-row items-center">
              <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center mr-4">
                <Check size={14} color="white" />
              </View>
              <Text className="text-purple-700 font-medium">Motivational messages</Text>
            </View>
            
            <View className="w-full h-px bg-purple-200" />
            
            <View className="flex-row items-center">
              <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center mr-4">
                <Check size={14} color="white" />
              </View>
              <Text className="text-purple-700 font-medium">Personalized guideline</Text>
            </View>
          </View>

          {/* Enable Button */}
          <Button 
            className="bg-orange-500 rounded-xl h-14 mx-4"
            onPress={() => router.push('/(japtor)/food-chat' as any)}
          >
            <Text className="text-white font-bold text-lg">Enable</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
