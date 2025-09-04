import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  HelpCircle, 
  Star, 
  Share,
  ChevronRight,
  Moon,
  Smartphone,
  Database,
  LogOut
} from 'lucide-react-native';

export default function SettingsDemo() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [dataSync, setDataSync] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);

  const settingSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile Information', hasArrow: true },
        { icon: Shield, label: 'Privacy & Security', hasArrow: true },
        { icon: Database, label: 'Data & Storage', hasArrow: true }
      ]
    },
    {
      title: 'Preferences',
      items: [
        { 
          icon: Bell, 
          label: 'Notifications', 
          hasSwitch: true, 
          value: notifications,
          onToggle: setNotifications
        },
        { 
          icon: Moon, 
          label: 'Dark Mode', 
          hasSwitch: true, 
          value: darkMode,
          onToggle: setDarkMode
        },
        { 
          icon: Smartphone, 
          label: 'Auto-sync Data', 
          hasSwitch: true, 
          value: dataSync,
          onToggle: setDataSync
        },
        { 
          icon: Database, 
          label: 'Auto Backup', 
          hasSwitch: true, 
          value: autoBackup,
          onToggle: setAutoBackup
        }
      ]
    },
    {
      title: 'General',
      items: [
        { icon: Globe, label: 'Language & Region', subtitle: 'English (US)', hasArrow: true },
        { icon: HelpCircle, label: 'Help & Support', hasArrow: true },
        { icon: Star, label: 'Rate App', hasArrow: true },
        { icon: Share, label: 'Share App', hasArrow: true }
      ]
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View className="bg-white px-4 py-3 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="font-bold text-lg text-gray-900">Settings</Text>
        <View className="w-6" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {/* Profile Header */}
          <Card className="bg-white mb-6">
            <CardContent className="p-4">
              <View className="flex-row items-center space-x-4">
                <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center">
                  <Text className="text-2xl">👤</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-lg text-gray-900">John Doe</Text>
                  <Text className="text-gray-600">john.doe@example.com</Text>
                  <Text className="text-sm text-blue-600 mt-1">Premium Member</Text>
                </View>
                <TouchableOpacity>
                  <ChevronRight size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </CardContent>
          </Card>

          {/* Settings Sections */}
          {settingSections.map((section, sectionIndex) => (
            <View key={sectionIndex} className="mb-6">
              <Text className="font-semibold text-lg text-gray-900 mb-3 px-1">
                {section.title}
              </Text>
              
              <Card className="bg-white">
                <CardContent className="p-0">
                  {section.items.map((item, itemIndex) => (
                    <TouchableOpacity
                      key={itemIndex}
                      className={`flex-row items-center justify-between p-4 ${
                        itemIndex < section.items.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                      disabled={'hasSwitch' in item}
                    >
                      <View className="flex-row items-center space-x-3 flex-1">
                        <View className="w-8 h-8 bg-gray-100 rounded-lg items-center justify-center">
                          <item.icon size={18} color="#6B7280" />
                        </View>
                        <View className="flex-1">
                          <Text className="font-medium text-gray-900">{item.label}</Text>
                          {'subtitle' in item && item.subtitle && (
                            <Text className="text-sm text-gray-600">{item.subtitle}</Text>
                          )}
                        </View>
                      </View>
                      
                      {'hasArrow' in item && item.hasArrow && (
                        <ChevronRight size={20} color="#9CA3AF" />
                      )}
                      
                      {'hasSwitch' in item && item.hasSwitch && (
                        <Switch
                          value={item.value}
                          onValueChange={item.onToggle}
                          trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                          thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </CardContent>
              </Card>
            </View>
          ))}

          {/* Usage Stats */}
          <Card className="bg-blue-50 border-blue-200 mb-6">
            <CardContent className="p-4">
              <Text className="font-semibold text-gray-900 mb-3">App Usage</Text>
              <View className="flex-row justify-between">
                <View className="items-center">
                  <Text className="text-xl font-bold text-blue-600">47</Text>
                  <Text className="text-sm text-gray-600">Recipes Saved</Text>
                </View>
                <View className="items-center">
                  <Text className="text-xl font-bold text-blue-600">15</Text>
                  <Text className="text-sm text-gray-600">Days Active</Text>
                </View>
                <View className="items-center">
                  <Text className="text-xl font-bold text-blue-600">2.1GB</Text>
                  <Text className="text-sm text-gray-600">Data Used</Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* App Info */}
          <Card className="bg-white mb-6">
            <CardContent className="p-4">
              <Text className="font-semibold text-gray-900 mb-3">App Information</Text>
              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Version</Text>
                  <Text className="text-gray-900">1.2.3</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Build</Text>
                  <Text className="text-gray-900">123</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Last Updated</Text>
                  <Text className="text-gray-900">March 10, 2024</Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-red-50 border-red-200 mb-6">
            <CardContent className="p-4">
              <Text className="font-semibold text-red-900 mb-3">Danger Zone</Text>
              <TouchableOpacity className="flex-row items-center space-x-2 p-3 bg-red-100 rounded-lg">
                <LogOut size={18} color="#DC2626" />
                <Text className="text-red-600 font-medium">Sign Out</Text>
              </TouchableOpacity>
            </CardContent>
          </Card>

          {/* Footer */}
          <View className="items-center py-4">
            <Text className="text-gray-500 text-sm">Made with ❤️ for healthy eating</Text>
            <Text className="text-gray-400 text-xs mt-1">© 2024 FoodApp. All rights reserved.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
