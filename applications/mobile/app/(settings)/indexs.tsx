import React from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@/components/ui/icon';
import { HeaderStack } from '@/components/layout/header';
import { useUser, useClerk } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import {
  ArrowLeft,
  ChevronRight,
  User,
  Lock,
  Bell,
  Globe,
  HelpCircle,
  Info,
  LogOut,
  Edit
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Đăng xuất", style: "destructive", onPress: () => signOut() }
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
          route: "/settings/profile",
          badge: null
        },
        {
          title: "Tài khoản & bảo mật",
          subtitle: "Email, mật khẩu, xác thực 2 bước",
          icon: Lock,
          route: "/settings/security",
          badge: null
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
          route: "/settings/notifications",
          badge: null
        },
        {
          title: "Ngôn ngữ",
          subtitle: "Thay đổi ngôn ngữ hiển thị",
          icon: Globe,
          route: "/settings/language",
          badge: null
        },
        {
          title: "Về chúng tôi",
          subtitle: "Thông tin ứng dụng và liên hệ",
          icon: Info,
          route: "/settings/about",
          badge: null
        }
      ]
    },
    {
      section: "Hỗ trợ",
      items: [
        {
          title: "Trung tâm trợ giúp",
          subtitle: "FAQ, hướng dẫn sử dụng",
          icon: HelpCircle,
          route: "/(restaurant)/support",
          badge: null
        },
        {
          title: "Về ứng dụng",
          subtitle: "Phiên bản, điều khoản",
          icon: Info,
          route: "/(settings)/about",
          badge: null
        }
      ]
    }
  ];

  const renderMenuItem = (item: any) => (
    <TouchableOpacity
      key={item.title}
      onPress={() => router.push(item.route)}
      className="flex-row items-center py-4 px-5 active:bg-muted/50"
    >
      <View className="w-8 h-8 bg-primary/10 rounded-lg items-center justify-center mr-4">
        <Icon as={item.icon} size={18} className="text-primary" />
      </View>
      
      <View className="flex-1">
        <Text className="font-medium text-base leading-5">{item.title}</Text>
        <Text className="text-sm text-muted-foreground mt-0.5">{item.subtitle}</Text>
      </View>
      
      <Icon as={ChevronRight} size={16} className="text-muted-foreground" />
    </TouchableOpacity>
  );

  return (
    <>
      <HeaderStack
        position="left"
        iconLeft={ArrowLeft}
        iconLeftAction={() => router.back()}
        title="Cài đặt"
      />

      <ScrollView className="flex-1 bg-background">
        {/* Tiêu đề lớn kiểu iOS 18 */}
        <View className="px-5 pt-2 pb-6">
          <Text className="text-4xl font-bold text-foreground tracking-tight">Cài đặt</Text>
        </View>

        {/* Thông tin người dùng */}
        <View className="mx-4 mb-8">
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="p-5">
              <View className="flex-row items-center">
                <View className="relative">
                  <Avatar className="w-16 h-16" alt="Avatar người dùng">
                    <AvatarImage source={{ uri: user?.imageUrl }} />
                    <AvatarFallback className="bg-primary/10">
                      <Text className="text-xl font-semibold text-primary">
                        {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0) || "U"}
                      </Text>
                    </AvatarFallback>
                  </Avatar>
                  <TouchableOpacity 
                    onPress={() => router.push('/settings/profile' as any)}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full items-center justify-center shadow-sm"
                  >
                    <Icon as={Edit} size={12} className="text-primary-foreground" />
                  </TouchableOpacity>
                </View>
                
                <View className="flex-1 ml-4">
                  <Text className="text-lg font-semibold text-foreground leading-5">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user?.username || "Người dùng"}
                  </Text>
                  <Text className="text-sm text-muted-foreground mt-1">
                    {user?.emailAddresses[0]?.emailAddress}
                  </Text>
                  <Text className="text-xs text-muted-foreground mt-1">
                    Thành viên từ {new Date(user?.createdAt || Date.now()).toLocaleDateString('vi-VN')}
                  </Text>
                </View>
                
                <TouchableOpacity 
                  onPress={() => router.push('/settings/profile' as any)}
                  className="p-2 rounded-lg active:bg-muted/50"
                >
                  <Icon as={ChevronRight} size={16} className="text-muted-foreground" />
                </TouchableOpacity>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Menu cài đặt */}
        <View className="px-4 space-y-6">
          {settingsMenuItems.map((section, sectionIndex) => (
            <View key={section.section}>
              <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
                {section.section}
              </Text>
              <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                  {section.items.map((item, itemIndex) => (
                    <View key={item.title}>
                      {renderMenuItem(item)}
                      {itemIndex < section.items.length - 1 && (
                        <Separator className="ml-12" />
                      )}
                    </View>
                  ))}
                </CardContent>
              </Card>
            </View>
          ))}
        </View>

        {/* Đăng xuất */}
        <View className="px-4 mt-6 mb-8">
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
              <TouchableOpacity
                onPress={handleSignOut}
                className="flex-row items-center py-4 px-5 active:bg-destructive/10"
              >
                <View className="w-8 h-8 bg-destructive/10 rounded-lg items-center justify-center mr-4">
                  <Icon as={LogOut} size={18} className="text-destructive" />
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-destructive text-base">Đăng xuất</Text>
                  <Text className="text-sm text-muted-foreground mt-0.5">Thoát khỏi tài khoản hiện tại</Text>
                </View>
                <Icon as={ChevronRight} size={16} className="text-muted-foreground" />
              </TouchableOpacity>
            </CardContent>
          </Card>
        </View>

        {/* Khoảng trống cuối trang */}
        <View className="h-20" />
      </ScrollView>
    </>
  );
}
