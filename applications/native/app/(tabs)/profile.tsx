import React from 'react';
import { View, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Settings,
  MapPin,
  CreditCard,
  Star,
  Gift,
  Heart,
  HelpCircle,
  Shield,
  LogOut,
  ChevronRight,
  Award,
  Calendar,
  ShoppingBag,
  TrendingUp,
  Edit,
  Bell,
  User,
  Phone
} from 'lucide-react-native';

export default function ProfileScreen() {
  const user = {
    name: 'Nguyễn Văn A',
    email: 'user@example.com',
    phone: '0987654321',
    avatar: 'https://avatars.githubusercontent.com/u/95116413?v=4',
    level: 'Thành viên Vàng',
    points: 2350,
    totalOrders: 47,
    totalSpent: 2850000
  };

  const quickStats = [
    {
      icon: ShoppingBag,
      label: 'Đơn hàng',
      value: user.totalOrders.toString(),
      color: 'text-blue-600'
    },
    {
      icon: Star,
      label: 'Điểm tích lũy',
      value: user.points.toString(),
      color: 'text-yellow-600'
    },
    {
      icon: Award,
      label: 'Cấp độ',
      value: user.level,
      color: 'text-purple-600'
    }
  ];

  const menuSections = [
    {
      title: 'Tài khoản',
      items: [
        {
          icon: MapPin,
          title: 'Địa chỉ giao hàng',
          onPress: () => router.push('/(profile)/addresses' as any)
        },
        {
          icon: CreditCard,
          title: 'Phương thức thanh toán',
          onPress: () => router.push('/(profile)/payment-methods' as any)
        },
        {
          icon: Heart,
          title: 'Yêu thích',
          onPress: () => router.push('/(profile)/favorites' as any)
        },
        {
          icon: Gift,
          title: 'Voucher của tôi',
          onPress: () => router.push('/(profile)/vouchers' as any)
        }
      ]
    },
    {
      title: 'Cài đặt',
      items: [
        {
          icon: Settings,
          title: 'Cài đặt ứng dụng',
          onPress: () => router.push('/(profile)/settings' as any)
        },
        {
          icon: HelpCircle,
          title: 'Trợ giúp & Hỗ trợ',
          onPress: () => router.push('/(profile)/help' as any)
        },
        {
          icon: Shield,
          title: 'Về chúng tôi',
          onPress: () => router.push('/(profile)/about' as any)
        }
      ]
    }
  ];

  const renderMenuItem = (item: any) => (
    <Pressable
      key={item.title}
      onPress={item.onPress}
      className="flex-row items-center justify-between py-4 border-b border-border last:border-b-0"
    >
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 bg-muted rounded-full items-center justify-center mr-3">
          <item.icon size={20} className="text-foreground" />
        </View>
                                  
        <Text className="font-medium text-foreground">
          {item.title}
        </Text>
      </View>
      
      <ChevronRight size={20} className="text-muted-foreground" />
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Custom Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-background border-b border-border">
        <Text className="text-xl font-bold text-foreground">Cá nhân</Text>
        <Pressable onPress={() => router.push('/(settings)' as any)}>
          <Settings size={24} className="text-muted-foreground" />
        </Pressable>
      </View>      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* User Profile Header */}
        <View className="px-4 py-6">
          <Card className="p-6">
            <View className="items-center">
              <View className="relative">
                <Avatar alt="User Avatar" className="w-24 h-24 mb-4">
                  <AvatarImage source={{ uri: user.avatar }} />
                  <AvatarFallback>
                    <Text className="text-2xl font-bold text-primary">
                      {user.name.charAt(0)}
                    </Text>
                  </AvatarFallback>
                </Avatar>
                
                <Pressable className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full items-center justify-center">
                  <Edit size={16} className="text-primary-foreground" />
                </Pressable>
              </View>
              
              <Text className="font-bold text-xl text-foreground mb-1">
                {user.name}
              </Text>
              
              <Text className="text-muted-foreground mb-3">
                {user.email}
              </Text>
              
              <View className="bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-2 rounded-full">
                <Text className="text-primary font-semibold">
                  {user.level}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Quick Stats */}
        <View className="px-4 mb-6">
          <Text className="font-bold text-lg text-foreground mb-4">
            Thống kê cá nhân
          </Text>
          
          <View className="flex-row space-x-3">
            {quickStats.map((stat, index) => (
              <Card key={index} className="flex-1 p-4">
                <View className="items-center">
                  <View 
                    className="w-12 h-12 rounded-full items-center justify-center mb-3"
                    style={{ backgroundColor: stat.color === 'text-blue-600' ? '#3b82f620' : 
                             stat.color === 'text-yellow-600' ? '#f59e0b20' : '#8b5cf620' }}
                  >
                    <stat.icon 
                      size={24} 
                      color={stat.color === 'text-blue-600' ? '#3b82f6' : 
                             stat.color === 'text-yellow-600' ? '#f59e0b' : '#8b5cf6'}
                    />
                  </View>
                  
                  <Text className="font-bold text-lg text-foreground mb-1">
                    {stat.value}
                  </Text>
                  
                  <Text className="text-xs text-muted-foreground text-center">
                    {stat.label}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} className="px-4 mb-6">
            <Text className="font-bold text-lg text-foreground mb-4">
              {section.title}
            </Text>
            
            <Card>
              {section.items.map((item, itemIndex) => (
                <Pressable
                  key={itemIndex}
                  onPress={item.onPress}
                  className={`flex-row items-center p-4 ${
                    itemIndex !== section.items.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <View className="w-10 h-10 bg-muted rounded-full items-center justify-center mr-4">
                    <item.icon size={20} className="text-muted-foreground" />
                  </View>
                  
                  <Text className="flex-1 font-medium text-foreground">
                    {item.title}
                  </Text>
                  
                  <ChevronRight size={20} className="text-muted-foreground" />
                </Pressable>
              ))}
            </Card>
          </View>
        ))}

        {/* App Info */}
        <View className="px-4 mb-6">
          <Card className="p-4 bg-muted/30">
            <View className="items-center">
              <Text className="text-sm text-muted-foreground mb-1">
                Waddles Restaurant App
              </Text>
              <Text className="text-xs text-muted-foreground">
                Phiên bản 1.0.0
              </Text>
            </View>
          </Card>
        </View>

        {/* Logout Button */}
        <View className="px-4 mb-20">
          <Button 
            variant="outline" 
            className="flex-row items-center justify-center border-destructive"
            onPress={() => {/* TODO: Handle logout */}}
          >
            <LogOut size={20} className="text-destructive mr-2" />
            <Text className="text-destructive font-medium">
              Đăng xuất
            </Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
