import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Bell,
  Gift,
  ShoppingBag,
  MessageSquare,
  Star,
  Calendar,
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
  Trash2,
  Settings,
  X,
  ChevronRight
} from 'lucide-react-native';

interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'reservation' | 'review' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
  icon: any;
  color: string;
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: 'Đơn hàng đã được xác nhận',
      message: 'Đơn hàng #WD2024001 đã được xác nhận và đang được chuẩn bị.',
      time: '5 phút trước',
      read: false,
      actionUrl: '/(tabs)/orders',
      icon: ShoppingBag,
      color: '#10b981'
    },
    {
      id: '2',
      type: 'promotion',
      title: 'Ưu đãi đặc biệt cho bạn! 🎉',
      message: 'Giảm 30% cho đơn hàng trên 200k. Áp dụng đến hết ngày hôm nay.',
      time: '1 giờ trước',
      read: false,
      actionUrl: '/(promotions)',
      icon: Gift,
      color: '#f59e0b'
    },
    {
      id: '3',
      type: 'reservation',
      title: 'Nhắc nhở đặt bàn',
      message: 'Bạn có đặt bàn lúc 19:30 hôm nay tại Waddles Restaurant.',
      time: '2 giờ trước',
      read: true,
      actionUrl: '/(tabs)/booking',
      icon: Calendar,
      color: '#3b82f6'
    },
    {
      id: '4',
      type: 'review',
      title: 'Đánh giá trải nghiệm',
      message: 'Hãy đánh giá trải nghiệm của bạn tại Waddles Restaurant.',
      time: '1 ngày trước',
      read: true,
      actionUrl: '/reviews',
      icon: Star,
      color: '#f59e0b'
    },
    {
      id: '5',
      type: 'system',
      title: 'Cập nhật ứng dụng',
      message: 'Phiên bản mới với nhiều tính năng thú vị đã có sẵn.',
      time: '2 ngày trước',
      read: true,
      actionUrl: '/settings',
      icon: Settings,
      color: '#6b7280'
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleNotificationPress = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      router.push(notification.actionUrl as any);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const todayNotifications = notifications.filter(n => 
    n.time.includes('phút') || n.time.includes('giờ')
  );
  
  const earlierNotifications = notifications.filter(n => 
    n.time.includes('ngày')
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Simple Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-background border-b border-border">
        <Text className="text-xl font-bold text-foreground">Thông báo</Text>
        {unreadCount > 0 && (
          <Pressable onPress={markAllAsRead}>
            <Text className="text-primary font-medium">Đọc tất cả</Text>
          </Pressable>
        )}
      </View>
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View className="px-4 py-4">
          {unreadCount > 0 && (
            <View className="flex-row items-center mb-4">
              <View className="w-3 h-3 bg-primary rounded-full mr-2" />
              <Text className="text-muted-foreground">
                {unreadCount} thông báo mới
              </Text>
            </View>
          )}

          {/* Quick Actions */}
          <View className="flex-row space-x-3">
            <Card className="flex-1 p-3">
              <Pressable 
                onPress={() => router.push('/(promotions)' as any)}
                className="items-center"
              >
                <Gift size={24} className="text-orange-500 mb-2" />
                <Text className="text-sm font-medium text-foreground">Ưu đãi</Text>
              </Pressable>
            </Card>
            
            <Card className="flex-1 p-3">
              <Pressable 
                onPress={() => router.push('/(tabs)/orders' as any)}
                className="items-center"
              >
                <ShoppingBag size={24} className="text-green-500 mb-2" />
                <Text className="text-sm font-medium text-foreground">Đơn hàng</Text>
              </Pressable>
            </Card>
            
            <Card className="flex-1 p-3">
              <Pressable 
                onPress={() => router.push('/(tabs)/messages' as any)}
                className="items-center"
              >
                <MessageSquare size={24} className="text-blue-500 mb-2" />
                <Text className="text-sm font-medium text-foreground">Tin nhắn</Text>
              </Pressable>
            </Card>
          </View>
        </View>

        {/* Today's Notifications */}
        {todayNotifications.length > 0 && (
          <View className="px-4 mb-6">
            <Text className="text-lg font-semibold text-foreground mb-4">
              Hôm nay
            </Text>
            
            {todayNotifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <Pressable
                  key={notification.id}
                  onPress={() => handleNotificationPress(notification)}
                  className={`mb-3 ${!notification.read ? 'bg-primary/5' : ''}`}
                >
                  <Card className="p-4">
                    <View className="flex-row items-start">
                      <View 
                        className="w-10 h-10 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: `${notification.color}20` }}
                      >
                        <IconComponent 
                          size={20} 
                          style={{ color: notification.color }}
                        />
                      </View>
                      
                      <View className="flex-1">
                        <View className="flex-row items-center justify-between mb-1">
                          <Text className="font-semibold text-foreground">
                            {notification.title}
                          </Text>
                          
                          <View className="flex-row items-center">
                            {!notification.read && (
                              <View className="w-2 h-2 bg-primary rounded-full mr-2" />
                            )}
                            
                            <Pressable
                              onPress={() => deleteNotification(notification.id)}
                              className="p-1"
                            >
                              <X size={16} className="text-muted-foreground" />
                            </Pressable>
                          </View>
                        </View>
                        
                        <Text className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </Text>
                        
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row items-center">
                            <Clock size={12} className="text-muted-foreground mr-1" />
                            <Text className="text-xs text-muted-foreground">
                              {notification.time}
                            </Text>
                          </View>
                          
                          {notification.actionUrl && (
                            <ChevronRight size={16} className="text-muted-foreground" />
                          )}
                        </View>
                      </View>
                    </View>
                  </Card>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Earlier Notifications */}
        {earlierNotifications.length > 0 && (
          <View className="px-4 mb-6">
            <Text className="text-lg font-semibold text-foreground mb-4">
              Trước đó
            </Text>
            
            {earlierNotifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <Pressable
                  key={notification.id}
                  onPress={() => handleNotificationPress(notification)}
                  className="mb-3"
                >
                  <Card className="p-4">
                    <View className="flex-row items-start">
                      <View 
                        className="w-10 h-10 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: `${notification.color}20` }}
                      >
                        <IconComponent 
                          size={20} 
                          style={{ color: notification.color }}
                        />
                      </View>
                      
                      <View className="flex-1">
                        <View className="flex-row items-center justify-between mb-1">
                          <Text className="font-medium text-foreground">
                            {notification.title}
                          </Text>
                          
                          <Pressable
                            onPress={() => deleteNotification(notification.id)}
                            className="p-1"
                          >
                            <X size={16} className="text-muted-foreground" />
                          </Pressable>
                        </View>
                        
                        <Text className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </Text>
                        
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row items-center">
                            <Clock size={12} className="text-muted-foreground mr-1" />
                            <Text className="text-xs text-muted-foreground">
                              {notification.time}
                            </Text>
                          </View>
                          
                          {notification.actionUrl && (
                            <ChevronRight size={16} className="text-muted-foreground" />
                          )}
                        </View>
                      </View>
                    </View>
                  </Card>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Empty State */}
        {notifications.length === 0 && (
          <View className="items-center justify-center py-20">
            <Bell size={64} className="text-muted-foreground mb-4" />
            <Text className="text-lg font-semibold text-foreground mb-2">
              Không có thông báo
            </Text>
            <Text className="text-muted-foreground text-center px-8">
              Chúng tôi sẽ thông báo cho bạn về đơn hàng, ưu đãi và các tin tức mới
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
