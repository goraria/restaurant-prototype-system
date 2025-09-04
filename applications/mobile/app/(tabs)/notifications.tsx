import { ScrollView, View, TouchableOpacity } from "react-native";
import { Link, Stack, useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { ArrowLeft, SquarePen, Settings, Check, X } from "lucide-react-native";
import { useState } from "react";

export default function Notifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Đặt bàn thành công",
      message: "Bàn của bạn đã được xác nhận cho 19:00 hôm nay tại Nhà Hàng Hương Việt",
      time: "5 phút trước",
      type: "booking",
      read: false,
      icon: "✅"
    },
    {
      id: 2,
      title: "Khuyến mãi đặc biệt",
      message: "Giảm 30% cho tất cả món ăn chính trong tuần này! Áp dụng đến 23:59 Chủ nhật",
      time: "1 giờ trước",
      type: "promotion",
      read: false,
      icon: "🎉"
    },
    {
      id: 3,
      title: "Món ăn đã sẵn sàng",
      message: "Phở Bò Đặc Biệt của bạn đã được chuẩn bị xong. Vui lòng đến quầy lấy món",
      time: "2 giờ trước",
      type: "order",
      read: true,
      icon: "🍜"
    },
    {
      id: 4,
      title: "Đánh giá trải nghiệm",
      message: "Hãy chia sẻ cảm nhận của bạn về bữa ăn hôm qua tại Nhà Hàng Hương Việt",
      time: "1 ngày trước",
      type: "review",
      read: true,
      icon: "⭐"
    },
    {
      id: 5,
      title: "Điểm thưởng mới",
      message: "Bạn vừa nhận được 50 điểm thưởng từ đơn hàng gần nhất. Tổng điểm: 250",
      time: "2 ngày trước",
      type: "points",
      read: true,
      icon: "🏆"
    }
  ]);

  const markAsRead = (id: number) => {
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

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <View className="bg-background pt-16 pb-4 px-4 border-b border-border">
              <View className="flex-row items-center justify-between gap-3">
                <TouchableOpacity
                  onPress={() => router.back()}
                  className="w-10 h-10 rounded-full items-center justify-center"
                >
                  <Icon as={ArrowLeft} className="size-6" />
                </TouchableOpacity>
                <View className="flex-1 justify-center items-center">
                  <Text className="text-lg font-semibold">Thông báo</Text>
                </View>
                <TouchableOpacity
                  onPress={() => router.push("/(settings)/notifications" as any)}
                  className="w-10 h-10 rounded-full items-center justify-center"
                >
                  <Icon as={Settings} className="size-6" />
                </TouchableOpacity>
              </View>
            </View>
          ),
        }}
      />
      <ScrollView className="flex-1 bg-background">
        {/* Tiêu đề lớn kiểu iOS 18 */}
        <View className="px-5 pt-2 pb-4">
          <Text className="text-4xl font-bold text-foreground tracking-tight">Thông báo</Text>
          <Text className="text-base text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Tất cả đã được đọc'}
          </Text>
        </View>

        {/* Actions */}
        {unreadCount > 0 && (
          <View className="px-4 mb-6">
            <TouchableOpacity 
              onPress={markAllAsRead}
              className="w-full border border-border py-3 px-4 rounded-lg flex-row items-center justify-center"
            >
              <Check size={16} className="mr-2" />
              <Text className="font-medium">Đánh dấu tất cả đã đọc</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Notifications List */}
        <View className="px-4 mb-8">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <TouchableOpacity 
                key={notification.id}
                onPress={() => markAsRead(notification.id)}
                className="mb-3"
              >
                <Card className={`border-0 shadow-sm backdrop-blur-sm ${
                  notification.read ? 'bg-card/30' : 'bg-card/70'
                }`}>
                  <CardContent className="p-4">
                    <View className="flex-row items-start">
                      <View className="mr-4 mt-1">
                        <Text className="text-2xl">{notification.icon}</Text>
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-start justify-between mb-1">
                          <Text className={`font-semibold text-base flex-1 ${
                            notification.read ? 'text-muted-foreground' : 'text-foreground'
                          }`} numberOfLines={1}>
                            {notification.title}
                          </Text>
                          <TouchableOpacity 
                            onPress={() => deleteNotification(notification.id)}
                            className="ml-2 p-1"
                          >
                            <X size={16} className="text-muted-foreground" />
                          </TouchableOpacity>
                        </View>
                        <Text className={`text-sm mb-2 leading-5 ${
                          notification.read ? 'text-muted-foreground' : 'text-foreground'
                        }`} numberOfLines={2}>
                          {notification.message}
                        </Text>
                        <View className="flex-row items-center justify-between">
                          <Text className="text-xs text-muted-foreground">
                            {notification.time}
                          </Text>
                          {!notification.read && (
                            <View className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </View>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              </TouchableOpacity>
            ))
          ) : (
            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 items-center">
                <Text className="text-4xl mb-3">🔔</Text>
                <Text className="text-lg font-semibold text-foreground mb-2">
                  Không có thông báo
                </Text>
                <Text className="text-sm text-muted-foreground text-center">
                  Tất cả thông báo sẽ xuất hiện ở đây
                </Text>
              </CardContent>
            </Card>
          )}
        </View>

        {/* Footer spacing */}
        <View className="h-8" />
      </ScrollView>
    </>
  );
}