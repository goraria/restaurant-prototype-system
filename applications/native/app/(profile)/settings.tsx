import React, { useState } from 'react';
import { View, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Header } from '@/components/layout/Header';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { 
  Bell,
  MapPin,
  Globe,
  Shield,
  Moon,
  Volume2,
  ChevronRight
} from 'lucide-react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [sound, setSound] = useState(true);

  const settingsSections = [
    {
      title: 'Tài khoản',
      items: [
        {
          icon: MapPin,
          title: 'Địa chỉ giao hàng',
          description: 'Quản lý địa chỉ nhận hàng',
          onPress: () => router.push('/(profile)/addresses' as any)
        },
        {
          icon: Shield,
          title: 'Bảo mật',
          description: 'Thay đổi mật khẩu, xác thực 2 lớp',
          onPress: () => {}
        }
      ]
    },
    {
      title: 'Thông báo',
      items: [
        {
          icon: Bell,
          title: 'Thông báo đẩy',
          description: 'Nhận thông báo về đơn hàng và khuyến mãi',
          onPress: () => {},
          hasSwitch: true,
          switchValue: notifications,
          onSwitchChange: setNotifications
        },
        {
          icon: Volume2,
          title: 'Âm thanh',
          description: 'Bật/tắt âm thanh thông báo',
          onPress: () => {},
          hasSwitch: true,
          switchValue: sound,
          onSwitchChange: setSound
        }
      ]
    },
    {
      title: 'Giao diện',
      items: [
        {
          icon: Moon,
          title: 'Chế độ tối',
          description: 'Chuyển đổi giao diện sáng/tối',
          onPress: () => {},
          hasSwitch: true,
          switchValue: darkMode,
          onSwitchChange: setDarkMode
        },
        {
          icon: Globe,
          title: 'Ngôn ngữ',
          description: 'Tiếng Việt',
          onPress: () => {}
        }
      ]
    }
  ];

  const renderSettingItem = (item: any) => (
    <Pressable
      key={item.title}
      onPress={item.onPress}
      className="flex-row items-center justify-between py-4 border-b border-border"
    >
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 bg-muted rounded-full items-center justify-center mr-3">
          <item.icon size={20} className="text-foreground" />
        </View>
        
        <View className="flex-1">
          <Text className="font-medium text-foreground mb-1">
            {item.title}
          </Text>
          <Text className="text-sm text-muted-foreground">
            {item.description}
          </Text>
        </View>
      </View>
      
      {item.hasSwitch ? (
        <Switch
          value={item.switchValue}
          onValueChange={item.onSwitchChange}
        />
      ) : (
        <ChevronRight size={20} className="text-muted-foreground" />
      )}
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <Header 
        title="Cài đặt"
        showBack
        onBack={() => router.back()}
      />
      
      <ScrollView className="flex-1">
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} className="mb-6">
            <Text className="font-bold text-lg text-foreground px-4 mb-3">
              {section.title}
            </Text>
            
            <Card className="mx-4">
              <View className="p-4">
                {section.items.map((item, itemIndex) => (
                  <View key={itemIndex}>
                    {renderSettingItem(item)}
                    {itemIndex < section.items.length - 1 && (
                      <View className="h-px bg-border" />
                    )}
                  </View>
                ))}
              </View>
            </Card>
          </View>
        ))}

        {/* App Info */}
        <View className="px-4 py-6">
          <Text className="text-center text-muted-foreground text-sm">
            Phiên bản 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
