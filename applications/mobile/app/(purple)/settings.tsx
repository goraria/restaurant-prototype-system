import React, { useState } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Shield, 
  HelpCircle, 
  Info,
  LogOut,
  Settings,
  Moon,
  Sun,
  Languages,
  Volume2,
  Wifi,
  Smartphone,
  CreditCard,
  Heart,
  Calendar,
  FileText,
  ChevronRight
} from 'lucide-react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [wifiOnly, setWifiOnly] = useState(false);

  const userInfo = {
    name: 'Nguyễn Văn An',
    email: 'nguyenvanan@email.com',
    phone: '+84 123 456 789',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  };

  const settingsSections = [
    {
      title: 'Tài khoản',
      items: [
        {
          icon: User,
          title: 'Thông tin cá nhân',
          subtitle: 'Chỉnh sửa thông tin tài khoản',
          action: 'navigate'
        },
        {
          icon: CreditCard,
          title: 'Phương thức thanh toán',
          subtitle: 'Quản lý thẻ và ví điện tử',
          action: 'navigate'
        },
        {
          icon: Heart,
          title: 'Thú cưng của tôi',
          subtitle: 'Quản lý thông tin thú cưng',
          action: 'navigate'
        }
      ]
    },
    {
      title: 'Thông báo',
      items: [
        {
          icon: Bell,
          title: 'Thông báo đẩy',
          subtitle: 'Bật/tắt thông báo',
          action: 'switch',
          value: notifications,
          onValueChange: setNotifications
        },
        {
          icon: Volume2,
          title: 'Âm thanh',
          subtitle: 'Bật/tắt âm thanh thông báo',
          action: 'switch',
          value: soundEnabled,
          onValueChange: setSoundEnabled
        },
        {
          icon: Calendar,
          title: 'Nhắc nhở lịch hẹn',
          subtitle: 'Thông báo trước lịch hẹn',
          action: 'navigate'
        }
      ]
    },
    {
      title: 'Giao diện',
      items: [
        {
          icon: darkMode ? Moon : Sun,
          title: 'Chế độ tối',
          subtitle: 'Bật/tắt giao diện tối',
          action: 'switch',
          value: darkMode,
          onValueChange: setDarkMode
        },
        {
          icon: Languages,
          title: 'Ngôn ngữ',
          subtitle: 'Tiếng Việt',
          action: 'navigate'
        }
      ]
    },
    {
      title: 'Cài đặt chung',
      items: [
        {
          icon: Wifi,
          title: 'Chỉ tải qua WiFi',
          subtitle: 'Tiết kiệm dữ liệu di động',
          action: 'switch',
          value: wifiOnly,
          onValueChange: setWifiOnly
        },
        {
          icon: Smartphone,
          title: 'Cài đặt ứng dụng',
          subtitle: 'Phiên bản 1.0.0',
          action: 'navigate'
        }
      ]
    },
    {
      title: 'Hỗ trợ',
      items: [
        {
          icon: HelpCircle,
          title: 'Trung tâm trợ giúp',
          subtitle: 'Hướng dẫn sử dụng',
          action: 'navigate'
        },
        {
          icon: FileText,
          title: 'Điều khoản sử dụng',
          subtitle: 'Chính sách và điều khoản',
          action: 'navigate'
        },
        {
          icon: Info,
          title: 'Về ứng dụng',
          subtitle: 'Thông tin phiên bản',
          action: 'navigate'
        }
      ]
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <View className="flex-row items-center mb-4">
            <Button variant="ghost" className="w-10 h-10 p-0 mr-3">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Text className="text-2xl font-bold text-foreground">Cài đặt</Text>
          </View>
        </View>

        {/* User Profile */}
        <View className="px-6 mb-6">
          <Card className="p-6">
            <View className="flex-row items-center">
              <Avatar className="w-16 h-16 mr-4">
                <Image
                  source={{ uri: userInfo.avatar }}
                  className="w-full h-full rounded-full"
                />
              </Avatar>
              <View className="flex-1">
                <Text className="text-lg font-bold text-foreground mb-1">{userInfo.name}</Text>
                <Text className="text-sm text-muted-foreground mb-1">{userInfo.email}</Text>
                <Text className="text-sm text-muted-foreground">{userInfo.phone}</Text>
              </View>
              <Button variant="outline" size="sm">
                <Text className="text-primary">Chỉnh sửa</Text>
              </Button>
            </View>
          </Card>
        </View>

        {/* Settings Sections */}
        <View className="px-6 mb-6">
          {settingsSections.map((section, sectionIndex) => (
            <View key={sectionIndex} className="mb-6">
              <Text className="text-lg font-bold text-foreground mb-4">{section.title}</Text>
              <Card>
                {section.items.map((item, itemIndex) => (
                  <View key={itemIndex}>
                    <View className="flex-row items-center p-4">
                      <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-4">
                        <item.icon className="w-5 h-5 text-primary" />
                      </View>
                      <View className="flex-1">
                        <Text className="font-semibold text-foreground">{item.title}</Text>
                        <Text className="text-sm text-muted-foreground">{item.subtitle}</Text>
                      </View>
                      {item.action === 'switch' ? (
                        <Switch
                          checked={item.value}
                          onCheckedChange={item.onValueChange}
                        />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      )}
                    </View>
                    {itemIndex < section.items.length - 1 && (
                      <Separator className="ml-18" />
                    )}
                  </View>
                ))}
              </Card>
            </View>
          ))}
        </View>

        {/* Logout Button */}
        <View className="px-6 mb-6">
          <Button variant="outline" size="lg" className="border-red-200">
            <LogOut className="w-5 h-5 mr-2 text-red-600" />
            <Text className="text-red-600 font-semibold">Đăng xuất</Text>
          </Button>
        </View>

        {/* App Version */}
        <View className="px-6 pb-8">
          <View className="items-center">
            <Text className="text-sm text-muted-foreground">Phiên bản 1.0.0</Text>
            <Text className="text-xs text-muted-foreground mt-1">
              © 2024 PetCare Pro. Tất cả quyền được bảo lưu.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
