import * as React from "react";
import { ScrollView, TouchableOpacity, View, Alert } from "react-native";
import { Link, Stack, router } from "expo-router";
import { useUser, useClerk } from "@clerk/clerk-expo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Icon } from "@/components/ui/icon";
import {
  Settings,
  MapPin,
  Calendar,
  Star,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  Edit,
  Gift,
  Clock,
  Users,
  Heart,
  Award,
  ChevronRight,
  Utensils,
  Receipt,
  SettingsIcon
} from "lucide-react-native";
import { ThemeToggle } from "@/components/element/ThemeToggle";

// Mock data cho lịch sử đặt bàn
const recentBookings = [
  {
    id: "1",
    restaurantName: "Nhà Hàng Hương Việt",
    date: "2024-03-20",
    time: "19:00",
    guests: 4,
    status: "completed",
    total: 850000,
    rating: 5
  },
  {
    id: "2",
    restaurantName: "Sushi Tokyo",
    date: "2024-03-18",
    time: "18:30",
    guests: 2,
    status: "completed",
    total: 650000,
    rating: 4
  },
  {
    id: "3",
    restaurantName: "BBQ Garden",
    date: "2024-03-15",
    time: "20:00",
    guests: 6,
    status: "cancelled",
    total: 0,
    rating: null
  }
];

// Mock user stats
const userStats = {
  totalBookings: 24,
  favoriteRestaurants: 8,
  totalSpent: 12500000,
  loyaltyPoints: 1250
};

export default function ProfileScreen() {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100"><Text className="text-green-800 text-xs">Hoàn thành</Text></Badge>;
      case "cancelled":
        return <Badge className="bg-red-100"><Text className="text-red-800 text-xs">Đã hủy</Text></Badge>;
      case "confirmed":
        return <Badge className="bg-blue-100"><Text className="text-blue-800 text-xs">Đã xác nhận</Text></Badge>;
      default:
        return <Badge className="bg-gray-100"><Text className="text-gray-800 text-xs">Chờ xác nhận</Text></Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const MenuSection = ({ icon, title, subtitle, onPress, showChevron = true }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showChevron?: boolean;
  }) => (
    <TouchableOpacity onPress={onPress} className="flex-row items-center py-4 px-4">
      <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="font-medium">{title}</Text>
        {subtitle && <Text className="text-sm text-muted-foreground">{subtitle}</Text>}
      </View>
      {showChevron && <ChevronRight size={20} color="#666" />}
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <View className="bg-background pt-16 pb-4 px-4 border-b border-border">
              <View className="flex-row items-center justify-between gap-3">
                <ThemeToggle />
                <Button
                  onPress={() => {
                  }}
                  size="icon"
                  variant="ghost"
                  className="rounded-full" // p-4
                >
                  <Icon
                    as={SettingsIcon}
                    className="size-6"
                  />
                </Button>
              </View>
            </View>
          ),
        }}
      />
      {user ? (
        <>
          <ScrollView className="flex-1 bg-background">
            {/* Header Profile */}
            <View className="bg-primary pt-12 pb-8 px-4">
              <View className="flex-row items-center">
                <Avatar alt="User Avatar" className="w-20 h-20 mr-4">
                  <AvatarImage source={{ uri: user?.imageUrl }} />
                  <AvatarFallback>
                    <Text className="text-primary-foreground text-xl font-bold">
                      {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress.charAt(0)}
                    </Text>
                  </AvatarFallback>
                </Avatar>
                <View className="flex-1">
                  <Text className="text-primary-foreground text-xl font-bold">
                    {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.emailAddresses[0]?.emailAddress}
                  </Text>
                  <Text className="text-primary-foreground/80 text-sm">Thành viên từ tháng 3/2024</Text>
                  <View className="flex-row items-center mt-1">
                    <Star size={16} fill="#FFD700" color="#FFD700" />
                    <Text className="text-primary-foreground/80 text-sm ml-1">VIP Member</Text>
                  </View>
                </View>
                <TouchableOpacity className="p-2">
                  <Edit size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Stats Cards */}
            <View className="px-4 -mt-6 mb-6">
              <View className="flex-row justify-between">
                <Card className="flex-1 mr-2">
                  <CardContent className="p-3 items-center">
                    <Text className="text-2xl font-bold text-primary">{userStats.totalBookings}</Text>
                    <Text className="text-xs text-muted-foreground text-center">Lượt đặt bàn</Text>
                  </CardContent>
                </Card>
                <Card className="flex-1 mx-1">
                  <CardContent className="p-3 items-center">
                    <Text className="text-2xl font-bold text-blue-500">{userStats.favoriteRestaurants}</Text>
                    <Text className="text-xs text-muted-foreground text-center">Nhà hàng yêu thích</Text>
                  </CardContent>
                </Card>
                <Card className="flex-1 ml-2">
                  <CardContent className="p-3 items-center">
                    <Text className="text-lg font-bold text-green-500">{userStats.loyaltyPoints}</Text>
                    <Text className="text-xs text-muted-foreground text-center">Điểm tích lũy</Text>
                  </CardContent>
                </Card>
              </View>
            </View>

            {/* Recent Bookings */}
            <View className="px-4 mb-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold">Lịch sử đặt bàn</Text>
                <TouchableOpacity onPress={() => console.log('Navigate to history')}>
                  <Text className="text-primary text-sm font-medium">Xem tất cả</Text>
                </TouchableOpacity>
              </View>

              {recentBookings.slice(0, 3).map((booking, index) => (
                <Card key={booking.id} className="mb-3">
                  <CardContent className="p-4">
                    <View className="flex-row items-start justify-between mb-2">
                      <View className="flex-1">
                        <Text className="font-semibold">{booking.restaurantName}</Text>
                        <View className="flex-row items-center mt-1">
                          <Calendar size={14} color="#666" />
                          <Text className="text-sm text-muted-foreground ml-1">
                            {booking.date} • {booking.time}
                          </Text>
                        </View>
                        <View className="flex-row items-center mt-1">
                          <Users size={14} color="#666" />
                          <Text className="text-sm text-muted-foreground ml-1">
                            {booking.guests} người
                          </Text>
                        </View>
                      </View>
                      <View className="items-end">
                        {getStatusBadge(booking.status)}
                        {booking.total > 0 && (
                          <Text className="text-sm font-medium mt-1">
                            {formatCurrency(booking.total)}
                          </Text>
                        )}
                      </View>
                    </View>
                    {booking.rating && (
                      <View className="flex-row items-center mt-2">
                        <Text className="text-sm text-muted-foreground mr-2">Đánh giá:</Text>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < booking.rating! ? "#FFD700" : "transparent"}
                            color="#FFD700"
                          />
                        ))}
                      </View>
                    )}
                  </CardContent>
                </Card>
              ))}
            </View>

            {/* Menu Options */}
            <View className="px-4 mb-6">
              <Card>
                <CardContent className="p-0">
                  <MenuSection
                    icon={<Calendar size={20} color="#09090b" />}
                    title="Đặt bàn của tôi"
                    subtitle="Xem và quản lý đặt bàn"
                    onPress={() => console.log('Navigate to reservations')}
                  />
                  <Separator />
                  <MenuSection
                    icon={<Heart size={20} color="#EF4444" />}
                    title="Yêu thích"
                    subtitle="Nhà hàng và món ăn yêu thích"
                    onPress={() => console.log('Navigate to promotions')}
                  />
                  <Separator />
                  <MenuSection
                    icon={<Award size={20} color="#8B5CF6" />}
                    title="Điểm thưởng"
                    subtitle={`${userStats.loyaltyPoints} điểm có thể sử dụng`}
                    onPress={() => console.log('Navigate to promotions')}
                  />
                  <Separator />
                  <MenuSection
                    icon={<Receipt size={20} color="#10B981" />}
                    title="Lịch sử thanh toán"
                    subtitle="Xem chi tiết hóa đơn"
                    onPress={() => console.log('Navigate to history')}
                  />
                </CardContent>
              </Card>
            </View>

            {/* Settings */}
            <View className="px-4 mb-6">
              <Card>
                <CardContent className="p-0">
                  <MenuSection
                    icon={<Settings size={20} color="#6B7280" />}
                    title="Cài đặt tài khoản"
                    subtitle="Thông tin cá nhân, bảo mật"
                    onPress={() => { }}
                  />
                  <Separator />
                  <MenuSection
                    icon={<Bell size={20} color="#F59E0B" />}
                    title="Thông báo"
                    subtitle="Cài đặt thông báo"
                    onPress={() => { }}
                  />
                  <Separator />
                  <MenuSection
                    icon={<CreditCard size={20} color="#3B82F6" />}
                    title="Phương thức thanh toán"
                    subtitle="Quản lý thẻ và ví điện tử"
                    onPress={() => { }}
                  />
                  <Separator />
                  <MenuSection
                    icon={<MapPin size={20} color="#DC2626" />}
                    title="Địa chỉ"
                    subtitle="Quản lý địa chỉ giao hàng"
                    onPress={() => { }}
                  />
                  <Separator />
                  <MenuSection
                    icon={<HelpCircle size={20} color="#059669" />}
                    title="Trợ giúp & Hỗ trợ"
                    subtitle="FAQ, liên hệ hỗ trợ"
                    onPress={() => { }}
                  />
                </CardContent>
              </Card>
            </View>

            {/* Sign Out */}
            <View className="px-4 mb-8">
              <Card>
                <CardContent className="p-0">
                  <MenuSection
                    icon={<LogOut size={20} color="#EF4444" />}
                    title="Đăng xuất"
                    onPress={handleSignOut}
                    showChevron={false}
                  />
                </CardContent>
              </Card>
            </View>

            {/* App Info */}
            <View className="px-4 pb-8">
              <Text className="text-center text-xs text-muted-foreground">
                Japtor Restaurant v1.0.0
              </Text>
              <Text className="text-center text-xs text-muted-foreground mt-1">
                © 2024 Japtor. All rights reserved.
              </Text>
            </View>
          </ScrollView>
        </>
      ) : (
        <>
          <Button
            variant="default"
            className="m-4"
            onPress={() => router.push('/sign-in')}
          >
            <Text>Đăng nhập</Text>
          </Button>
          <Button
            variant="outline"
            className="m-4"
            onPress={() => router.push('/sign-up')}
          >
            <Text>Đăng ký</Text>
          </Button>
        </>
      )}
    </>
  );
}
