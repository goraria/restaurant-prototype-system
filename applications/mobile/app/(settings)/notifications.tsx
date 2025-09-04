import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { ArrowLeft, Bell, Mail, MessageSquare, ShoppingBag, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { HeaderStack } from '@/components/layout/header';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';

interface NotificationSetting {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  enabled: boolean;
  category: 'orders' | 'promotions' | 'general';
}

export default function NotificationsScreen() {
  const router = useRouter();
  
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: 'order_updates',
      title: 'Cập nhật đơn hàng',
      subtitle: 'Thông báo về trạng thái đơn hàng',
      icon: ShoppingBag,
      enabled: true,
      category: 'orders'
    },
    {
      id: 'order_ready',
      title: 'Đơn hàng sẵn sàng',
      subtitle: 'Khi đơn hàng đã được chuẩn bị xong',
      icon: Bell,
      enabled: true,
      category: 'orders'
    },
    {
      id: 'promotions',
      title: 'Khuyến mãi & ưu đãi',
      subtitle: 'Thông báo về các chương trình khuyến mãi',
      icon: Mail,
      enabled: false,
      category: 'promotions'
    },
    {
      id: 'new_menu',
      title: 'Món ăn mới',
      subtitle: 'Thông báo khi có món ăn mới',
      icon: MessageSquare,
      enabled: true,
      category: 'promotions'
    },
    {
      id: 'reservation',
      title: 'Nhắc nhở đặt bàn',
      subtitle: 'Nhắc nhở về lịch đặt bàn sắp tới',
      icon: Calendar,
      enabled: true,
      category: 'general'
    }
  ]);

  const toggleNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, enabled: !notif.enabled } : notif
      )
    );
  };

  const categories = [
    { id: 'orders', title: 'Đơn hàng', subtitle: 'Thông báo về đơn hàng của bạn', emoji: '🛍️' },
    { id: 'promotions', title: 'Khuyến mãi', subtitle: 'Ưu đãi và chương trình khuyến mãi', emoji: '🎉' },
    { id: 'general', title: 'Tổng quát', subtitle: 'Thông báo chung và nhắc nhở', emoji: '⚡' }
  ];

  const resetToDefault = () => {
    Alert.alert(
      'Khôi phục mặc định',
      'Bạn có muốn khôi phục tất cả cài đặt thông báo về mặc định?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Khôi phục',
          style: 'destructive',
          onPress: () => {
            setNotifications(prev =>
              prev.map(notif => ({
                ...notif,
                enabled: notif.category === 'orders' || notif.id === 'new_menu' || notif.id === 'reservation'
              }))
            );
          }
        }
      ]
    );
  };

  const getIconColor = (category: string) => {
    switch(category) {
      case 'orders': return '#3b82f6';
      case 'promotions': return '#f59e0b';
      case 'general': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <>
      <HeaderStack
        position="left"
        iconLeft={ArrowLeft}
        iconLeftAction={() => router.back()}
        title="Thông báo"
      />
      
      <ScrollView className="flex-1 bg-background">
        {/* Tiêu đề lớn kiểu iOS 18 */}
        <View className="px-5 pt-2 pb-6">
          <Text className="text-4xl font-bold text-foreground tracking-tight">Thông báo</Text>
          <Text className="text-base text-muted-foreground mt-2 leading-6">
            Chọn loại thông báo bạn muốn nhận từ Waddles
          </Text>
        </View>

        {/* Notification categories */}
        {categories.map(category => (
          <View key={category.id} className="mb-8">
            {/* Category Header */}
            <View className="px-4 mb-3">
              <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 px-1">
                {category.emoji} {category.title}
              </Text>
              <Text className="text-sm text-muted-foreground px-1">
                {category.subtitle}
              </Text>
            </View>
            
            {/* Category Card */}
            <View className="px-4">
              <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardContent className="p-0">
                  {notifications
                    .filter(notif => notif.category === category.id)
                    .map((notification, index, arr) => (
                      <View key={notification.id}>
                        <TouchableOpacity
                          className="flex-row items-center py-4 px-5 active:bg-muted/50"
                          onPress={() => toggleNotification(notification.id)}
                        >
                          <View className="w-10 h-10 rounded-xl items-center justify-center mr-4"
                                style={{ backgroundColor: `${getIconColor(notification.category)}15` }}>
                            <notification.icon 
                              size={20} 
                              color={getIconColor(notification.category)}
                            />
                          </View>
                          
                          <View className="flex-1">
                            <Text className="text-base font-medium text-foreground mb-1">
                              {notification.title}
                            </Text>
                            <Text className="text-sm text-muted-foreground leading-5">
                              {notification.subtitle}
                            </Text>
                          </View>
                          
                          <Switch
                            value={notification.enabled}
                            onValueChange={() => toggleNotification(notification.id)}
                            trackColor={{ false: '#f1f5f9', true: '#EC668380' }}
                            thumbColor={notification.enabled ? '#EC6683' : '#f8fafc'}
                            style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
                          />
                        </TouchableOpacity>
                        
                        {index < arr.length - 1 && (
                          <View className="border-b border-border/50 ml-14" />
                        )}
                      </View>
                    ))}
                </CardContent>
              </Card>
            </View>
          </View>
        ))}

        {/* Reset section */}
        <View className="px-4 mb-8">
          <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Tùy chọn
          </Text>
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="p-0">
              <TouchableOpacity 
                className="flex-row items-center py-4 px-5 active:bg-muted/50"
                onPress={resetToDefault}
              >
                <View className="w-10 h-10 bg-red-100 rounded-xl items-center justify-center mr-4">
                  <Text className="text-lg">🔄</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-foreground mb-1">
                    Khôi phục cài đặt mặc định
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    Đặt lại tất cả thông báo về cài đặt ban đầu
                  </Text>
                </View>
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
