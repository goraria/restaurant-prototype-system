import React from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronRight,
  User,
  Lock,
  Bell,
  Globe,
  HelpCircle,
  Info,
  LogOut,
  Edit,
  Camera,
  Settings,
  Shield,
  Smartphone,
  Mail,
  Phone
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const user = {
    firstName: 'Nguyễn',
    lastName: 'Văn A',
    email: 'nguyenvana@email.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isOnline: true
  };

  const handleSignOut = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Đăng xuất", style: "destructive", onPress: () => router.push('/(auth)' as any) }
      ]
    );
  };

  const settingsMenuItems = [
    {
      section: "Tài khoản",
      items: [
        {
          title: "Thông tin cá nhân",
          subtitle: "Chỉnh sửa tên, ảnh đại diện",
          icon: User,
          route: "/(settings)/profile",
        },
        {
          title: "Tài khoản & bảo mật",
          subtitle: "Email, mật khẩu, xác thực 2 bước",
          icon: Lock,
          route: "/(settings)/security",
        }
      ]
    },
    {
      section: "Ứng dụng",
      items: [
        {
          title: "Thông báo",
          subtitle: "Quản lý thông báo và nhắc nhở",
          icon: Bell,
          route: "/(settings)/notifications",
        },
        {
          title: "Ngôn ngữ",
          subtitle: "Thay đổi ngôn ngữ hiển thị",
          icon: Globe,
          route: "/(settings)/language",
        }
      ]
    },
    {
      section: "Hỗ trợ",
      items: [
        {
          title: "Về chúng tôi",
          subtitle: "Thông tin ứng dụng và liên hệ",
          icon: Info,
          route: "/(settings)/about",
        },
        {
          title: "Trung tâm trợ giúp",
          subtitle: "FAQ, hướng dẫn sử dụng",
          icon: HelpCircle,
          route: "/(restaurant)/support",
        }
      ]
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header Card */}
      <Card className="mx-4 mt-4 mb-4">
        <CardHeader>
          <CardTitle className="text-2xl">Cài đặt</CardTitle>
          <CardDescription>Quản lý tài khoản và tùy chỉnh ứng dụng</CardDescription>
        </CardHeader>
      </Card>

      <ScrollView className="flex-1 px-4">
        {/* User Profile Card */}
        <Card className="mb-4">
          <CardContent className="p-6">
            <View className="flex-row items-center">
              <View className="relative">
                <Avatar className="w-20 h-20" alt="User Avatar">
                  <AvatarImage source={{ uri: user.avatar }} />
                  <AvatarFallback>
                    <Text className="text-xl font-semibold">
                      {user.firstName?.charAt(0) + user.lastName?.charAt(0)}
                    </Text>
                  </AvatarFallback>
                </Avatar>
                {user.isOnline && (
                  <View className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-background bg-green-500" />
                )}
              </View>
              
              <View className="flex-1 ml-4">
                <Text className="text-xl font-semibold text-foreground mb-1">
                  {user.firstName} {user.lastName}
                </Text>
                <Text className="text-sm text-muted-foreground mb-2">
                  {user.email}
                </Text>
                <Badge variant="secondary">
                  <Text className="text-xs">Khách hàng VIP</Text>
                </Badge>
              </View>
              
              <Button
                variant="ghost"
                size="sm"
                onPress={() => router.push('/(settings)/profile' as any)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </View>
          </CardContent>
        </Card>

        {/* Settings Sections */}
        {settingsMenuItems.map((section, sectionIndex) => (
          <View key={section.section} className="mb-4">
            <Text className="text-sm font-medium text-muted-foreground mb-2 px-1">
              {section.section}
            </Text>
            
            <Card>
              <CardContent className="p-0">
                {section.items.map((item, itemIndex) => (
                  <View key={item.title}>
                    <TouchableOpacity
                      onPress={() => router.push(item.route as any)}
                      className="flex-row items-center py-4 px-4 active:bg-muted/50"
                    >
                      <View className="w-10 h-10 bg-primary/10 rounded-lg items-center justify-center mr-4">
                        <item.icon className="w-5 h-5 text-primary" />
                      </View>
                      
                      <View className="flex-1">
                        <Text className="text-base font-medium text-foreground mb-1">
                          {item.title}
                        </Text>
                        <Text className="text-sm text-muted-foreground" numberOfLines={1}>
                          {item.subtitle}
                        </Text>
                      </View>
                      
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </TouchableOpacity>
                    
                    {itemIndex < section.items.length - 1 && (
                      <View className="border-b border-border ml-14" />
                    )}
                  </View>
                ))}
              </CardContent>
            </Card>
          </View>
        ))}

        {/* Account Actions Card */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg text-red-600">Tài khoản</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <TouchableOpacity
              onPress={handleSignOut}
              className="flex-row items-center py-4 px-4 active:bg-red-50"
            >
              <View className="w-10 h-10 bg-red-100 rounded-lg items-center justify-center mr-4">
                <LogOut className="w-5 h-5 text-red-600" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-medium text-red-600 mb-1">
                  Đăng xuất
                </Text>
                <Text className="text-sm text-muted-foreground">
                  Thoát khỏi tài khoản hiện tại
                </Text>
              </View>
              <ChevronRight className="w-5 h-5 text-red-400" />
            </TouchableOpacity>
          </CardContent>
        </Card>

        {/* App Info Card */}
        <Card className="mb-4">
          <CardContent className="p-4 items-center">
            <Text className="text-sm text-muted-foreground text-center">
              Ứng dụng Đặt bàn nhà hàng
            </Text>
            <Text className="text-xs text-muted-foreground text-center mt-1">
              Phiên bản 1.0.0
            </Text>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
