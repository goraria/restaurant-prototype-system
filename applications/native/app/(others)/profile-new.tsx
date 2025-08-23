import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Header } from '@/components/layout/Header';
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
  TrendingUp
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
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <Header 
        title="Hồ sơ"
        showSearch
        showNotifications
        onSearch={() => router.push('/(search)' as any)}
        onNotifications={() => {}}
      />
      
      <ScrollView className="flex-1">
        {/* User Profile */}
        <Card className="m-4">
          <View className="p-6 items-center">
            <Avatar alt="User Avatar" className="w-20 h-20 mb-4">
              <AvatarImage source={{ uri: user.avatar }} />
              <AvatarFallback>
                <Text className="text-2xl font-bold">
                  {user.name.charAt(0)}
                </Text>
              </AvatarFallback>
            </Avatar>
            
            <Text className="font-bold text-xl text-foreground mb-1">
              {user.name}
            </Text>
            
            <Text className="text-muted-foreground mb-4">
              {user.email}
            </Text>
            
            <View className="bg-primary/10 px-3 py-1 rounded-full">
              <Text className="text-primary font-medium">
                {user.level}
              </Text>
            </View>
          </View>
        </Card>

        {/* Quick Stats */}
        <View className="px-4 mb-4">
          <Text className="font-bold text-lg text-foreground mb-3">
            Thống kê
          </Text>
          
          <View className="flex-row justify-between">
            {quickStats.map((stat, index) => (
              <Card key={index} className="flex-1 mx-1">
                <View className="p-4 items-center">
                  <View className="w-12 h-12 bg-muted rounded-full items-center justify-center mb-2">
                    <stat.icon size={24} className={stat.color} />
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
          <View key={sectionIndex} className="mb-4">
            <Text className="font-bold text-lg text-foreground px-4 mb-3">
              {section.title}
            </Text>
            
            <Card className="mx-4">
              <View className="p-4">
                {section.items.map((item, itemIndex) => (
                  <View key={itemIndex}>
                    {renderMenuItem(item)}
                  </View>
                ))}
              </View>
            </Card>
          </View>
        ))}

        {/* Logout Button */}
        <View className="p-4">
          <Button 
            variant="outline" 
            className="flex-row items-center justify-center border-destructive"
          >
            <LogOut size={20} className="text-destructive mr-2" />
            <Text className="text-destructive font-medium">
              Đăng xuất
            </Text>
          </Button>
        </View>
        
        {/* Bottom Spacing */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
