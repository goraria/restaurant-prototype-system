import React, { useState } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Bell, 
  Calendar, 
  Heart, 
  MessageCircle, 
  Star,
  CheckCircle,
  AlertCircle,
  Info,
  Trash2,
  Settings
} from 'lucide-react-native';

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState('all');

  const notifications = [
    {
      id: 1,
      type: 'appointment',
      title: 'Lịch hẹn sắp tới',
      message: 'Lucky có lịch khám bệnh vào ngày mai lúc 14:00',
      time: '2 giờ trước',
      isRead: false,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 2,
      type: 'reminder',
      title: 'Nhắc nhở vaccine',
      message: 'Milo cần tiêm vaccine vào tuần tới',
      time: '4 giờ trước',
      isRead: false,
      icon: Heart,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 3,
      type: 'message',
      title: 'Tin nhắn từ bác sĩ',
      message: 'Dr. Nguyễn Văn A đã gửi tin nhắn về kết quả khám',
      time: '1 ngày trước',
      isRead: true,
      icon: MessageCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 4,
      type: 'promotion',
      title: 'Ưu đãi đặc biệt',
      message: 'Giảm 20% cho dịch vụ tắm rửa thú cưng',
      time: '2 ngày trước',
      isRead: true,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      id: 5,
      type: 'system',
      title: 'Cập nhật ứng dụng',
      message: 'Phiên bản mới 1.1.0 đã có sẵn',
      time: '3 ngày trước',
      isRead: true,
      icon: Info,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return Calendar;
      case 'reminder':
        return Heart;
      case 'message':
        return MessageCircle;
      case 'promotion':
        return Star;
      case 'system':
        return Info;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'appointment':
        return { icon: 'text-blue-600', bg: 'bg-blue-100' };
      case 'reminder':
        return { icon: 'text-green-600', bg: 'bg-green-100' };
      case 'message':
        return { icon: 'text-purple-600', bg: 'bg-purple-100' };
      case 'promotion':
        return { icon: 'text-yellow-600', bg: 'bg-yellow-100' };
      case 'system':
        return { icon: 'text-gray-600', bg: 'bg-gray-100' };
      default:
        return { icon: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === activeTab);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-4 pb-6">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Button variant="ghost" className="w-10 h-10 p-0 mr-3">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Text className="text-2xl font-bold text-foreground">Thông báo</Text>
            {unreadCount > 0 && (
              <Badge className="ml-3 bg-primary text-white">
                {unreadCount}
              </Badge>
            )}
          </View>
          <View className="flex-row space-x-2">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View className="px-6 mb-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          items={[
            { value: 'all', label: 'Tất cả' },
            { value: 'appointment', label: 'Lịch hẹn' },
            { value: 'reminder', label: 'Nhắc nhở' },
            { value: 'message', label: 'Tin nhắn' }
          ]}
        />
      </View>

      {/* Notifications List */}
      <ScrollView className="flex-1 px-6">
        {filteredNotifications.length > 0 ? (
          <View className="space-y-4">
            {filteredNotifications.map((notification) => {
              const colors = getNotificationColor(notification.type);
              const IconComponent = getNotificationIcon(notification.type);
              
              return (
                <Card key={notification.id} className={`p-4 ${!notification.isRead ? 'bg-blue-50 border-blue-200' : ''}`}>
                  <View className="flex-row">
                    <View className={`w-12 h-12 ${colors.bg} rounded-full items-center justify-center mr-4`}>
                      <IconComponent className={`w-6 h-6 ${colors.icon}`} />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row justify-between items-start mb-2">
                        <Text className={`font-semibold text-foreground ${!notification.isRead ? 'font-bold' : ''}`}>
                          {notification.title}
                        </Text>
                        <View className="flex-row items-center">
                          {!notification.isRead && (
                            <View className="w-2 h-2 bg-primary rounded-full mr-2" />
                          )}
                          <Text className="text-xs text-muted-foreground">{notification.time}</Text>
                        </View>
                      </View>
                      <Text className="text-sm text-muted-foreground mb-3 leading-5">
                        {notification.message}
                      </Text>
                      
                      {/* Action Buttons */}
                      {notification.type === 'appointment' && (
                        <View className="flex-row space-x-2">
                          <Button variant="outline" size="sm">
                            <Calendar className="w-4 h-4 mr-1" />
                            <Text className="text-xs">Xem chi tiết</Text>
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            <Text className="text-xs">Nhắn tin</Text>
                          </Button>
                        </View>
                      )}
                      
                      {notification.type === 'reminder' && (
                        <View className="flex-row space-x-2">
                          <Button variant="outline" size="sm">
                            <Calendar className="w-4 h-4 mr-1" />
                            <Text className="text-xs">Đặt lịch</Text>
                          </Button>
                          <Button variant="outline" size="sm">
                            <Text className="text-xs">Nhắc lại sau</Text>
                          </Button>
                        </View>
                      )}
                      
                      {notification.type === 'message' && (
                        <View className="flex-row space-x-2">
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            <Text className="text-xs">Trả lời</Text>
                          </Button>
                          <Button variant="outline" size="sm">
                            <Text className="text-xs">Xem tin nhắn</Text>
                          </Button>
                        </View>
                      )}
                      
                      {notification.type === 'promotion' && (
                        <View className="flex-row space-x-2">
                          <Button variant="outline" size="sm">
                            <Text className="text-xs">Xem chi tiết</Text>
                          </Button>
                          <Button variant="outline" size="sm">
                            <Text className="text-xs">Sử dụng ngay</Text>
                          </Button>
                        </View>
                      )}
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>
        ) : (
          <Card className="p-8 items-center">
            <Bell className="w-12 h-12 text-muted-foreground mb-4" />
            <Text className="text-lg font-semibold text-foreground mb-2">Không có thông báo</Text>
            <Text className="text-muted-foreground text-center">
              {activeTab === 'all' 
                ? 'Bạn chưa có thông báo nào'
                : `Không có thông báo ${activeTab} nào`
              }
            </Text>
          </Card>
        )}
      </ScrollView>

      {/* Quick Actions */}
      {unreadCount > 0 && (
        <View className="px-6 py-4 border-t bg-background">
          <View className="flex-row space-x-3">
            <Button variant="outline" className="flex-1">
              <CheckCircle className="w-4 h-4 mr-2" />
              <Text>Đánh dấu đã đọc</Text>
            </Button>
            <Button variant="outline" className="flex-1">
              <Trash2 className="w-4 h-4 mr-2" />
              <Text>Xóa tất cả</Text>
            </Button>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
