import * as React from "react";
import { ScrollView, TouchableOpacity, View, Alert } from "react-native";
import { Link, Stack, router } from "expo-router";
import { useUser, useClerk } from "@clerk/clerk-expo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Separator } from "@/components/ui/separator";
import { SafeAreaView } from "react-native-safe-area-context";
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
        return <View className="bg-green-100 px-2 py-1 rounded-full"><Text className="text-green-800 text-xs">Hoàn thành</Text></View>;
      case "cancelled":
        return <View className="bg-red-100 px-2 py-1 rounded-full"><Text className="text-red-800 text-xs">Đã hủy</Text></View>;
      case "confirmed":
        return <View className="bg-blue-100 px-2 py-1 rounded-full"><Text className="text-blue-800 text-xs">Đã xác nhận</Text></View>;
      default:
        return <View className="bg-gray-100 px-2 py-1 rounded-full"><Text className="text-gray-800 text-xs">Chờ xác nhận</Text></View>;
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
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4">
        {/* Header Profile */}
        <Card className="mt-4 mb-4">
          <CardHeader>
            <View className="flex-row items-center justify-between">
              <CardTitle className="text-2xl font-bold">Hồ sơ của tôi</CardTitle>
              <TouchableOpacity 
                onPress={() => router.push("/(settings)/profile")}
                className="p-2 bg-muted rounded-lg"
              >
                <SettingsIcon className="w-5 h-5 text-muted-foreground" />
              </TouchableOpacity>
            </View>
          </CardHeader>
          <CardContent>
            <View className="flex-row items-center">
              <Avatar alt="User Avatar" className="w-20 h-20 mr-4">
                <AvatarImage source={{ uri: user?.imageUrl }} />
                <AvatarFallback>
                  <Text className="text-lg font-bold">
                    {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress.charAt(0)}
                  </Text>
                </AvatarFallback>
              </Avatar>
              <View className="flex-1">
                <Text className="text-xl font-bold text-foreground mb-1">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.emailAddresses[0]?.emailAddress}
                </Text>
                <Text className="text-sm text-muted-foreground mb-2">Thành viên từ tháng 3/2024</Text>
                <Badge variant="secondary" className="self-start">
                  <Star className="w-3 h-3 mr-1" />
                  <Text className="text-xs">VIP Member</Text>
                </Badge>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Thống kê của bạn</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-primary mb-1">{userStats.totalBookings}</Text>
                <Text className="text-xs text-muted-foreground">Đặt bàn</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-green-600 mb-1">{userStats.favoriteRestaurants}</Text>
                <Text className="text-xs text-muted-foreground">Yêu thích</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-orange-600 mb-1">{formatCurrency(userStats.totalSpent)}</Text>
                <Text className="text-xs text-muted-foreground">Đã chi tiêu</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-purple-600 mb-1">{userStats.loyaltyPoints}</Text>
                <Text className="text-xs text-muted-foreground">Điểm tích lũy</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Menu Options */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Tài khoản</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <TouchableOpacity 
              onPress={() => router.push("/(settings)/profile")}
              className="flex-row items-center p-4 border-b border-border"
            >
              <Edit className="w-5 h-5 text-gray-600 mr-3" />
              <View className="flex-1">
                <Text className="font-medium">Chỉnh sửa hồ sơ</Text>
                <Text className="text-sm text-muted-foreground">Cập nhật thông tin cá nhân</Text>
              </View>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => router.push("/(settings)/notifications")}
              className="flex-row items-center p-4 border-b border-border"
            >
              <Bell className="w-5 h-5 text-gray-600 mr-3" />
              <View className="flex-1">
                <Text className="font-medium">Thông báo</Text>
                <Text className="text-sm text-muted-foreground">Quản lý cài đặt thông báo</Text>
              </View>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => router.push("/(booking)/reservations")}
              className="flex-row items-center p-4"
            >
              <Calendar className="w-5 h-5 text-gray-600 mr-3" />
              <View className="flex-1">
                <Text className="font-medium">Lịch sử đặt bàn</Text>
                <Text className="text-sm text-muted-foreground">Xem các đặt bàn trước đây</Text>
              </View>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </TouchableOpacity>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Hỗ trợ</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <TouchableOpacity 
              onPress={() => router.push("/(settings)/about")}
              className="flex-row items-center p-4 border-b border-border"
            >
              <HelpCircle className="w-5 h-5 text-gray-600 mr-3" />
              <View className="flex-1">
                <Text className="font-medium">Giới thiệu</Text>
                <Text className="text-sm text-muted-foreground">FAQ & Hướng dẫn sử dụng</Text>
              </View>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => router.push("/(tabs)/messages")}
              className="flex-row items-center p-4"
            >
              <Users className="w-5 h-5 text-gray-600 mr-3" />
              <View className="flex-1">
                <Text className="font-medium">Liên hệ hỗ trợ</Text>
                <Text className="text-sm text-muted-foreground">Chat trực tiếp với đội ngũ hỗ trợ</Text>
              </View>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </TouchableOpacity>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Đặt bàn gần đây</CardTitle>
            <CardDescription>3 đặt bàn gần đây nhất</CardDescription>
          </CardHeader>
          <CardContent>
            {recentBookings.slice(0, 3).map((booking, index) => (
              <View key={booking.id} className={`${index !== 2 ? 'border-b border-border pb-3 mb-3' : ''}`}>
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-semibold text-foreground">{booking.restaurantName}</Text>
                  <Badge variant={booking.status === 'completed' ? 'default' : booking.status === 'cancelled' ? 'destructive' : 'secondary'}>
                    <Text className="text-xs">
                      {booking.status === 'completed' ? 'Hoàn thành' : booking.status === 'cancelled' ? 'Đã hủy' : 'Chờ xác nhận'}
                    </Text>
                  </Badge>
                </View>
                <View className="flex-row items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-1" />
                  <Text className="text-sm text-muted-foreground mr-4">{booking.date}</Text>
                  <Clock className="w-4 h-4 mr-1" />
                  <Text className="text-sm text-muted-foreground mr-4">{booking.time}</Text>
                  <Users className="w-4 h-4 mr-1" />
                  <Text className="text-sm text-muted-foreground">{booking.guests} người</Text>
                </View>
                {booking.status === 'completed' && booking.total > 0 && (
                  <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-sm font-medium">{formatCurrency(booking.total)}</Text>
                    {booking.rating && (
                      <View className="flex-row items-center">
                        {Array.from({ length: booking.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" />
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </View>
            ))}
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Card className="mb-8">
          <CardContent className="p-0">
            <TouchableOpacity 
              onPress={handleSignOut}
              className="flex-row items-center p-4"
            >
              <LogOut className="w-5 h-5 text-red-600 mr-3" />
              <Text className="font-medium text-red-600">Đăng xuất</Text>
            </TouchableOpacity>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}


  //                   <Text className="text-xs text-muted-foreground text-center">Lượt đặt bàn</Text>
  //                 </CardContent>
  //               </Card>
  //               <Card className="flex-1 border-0 shadow-sm bg-card/50 backdrop-blur-sm">
  //                 <CardContent className="p-4 items-center">
  //                   <Text className="text-2xl font-bold text-blue-500 mb-1">{userStats.favoriteRestaurants}</Text>
  //                   <Text className="text-xs text-muted-foreground text-center">Yêu thích</Text>
  //                 </CardContent>
  //               </Card>
  //               <Card className="flex-1 border-0 shadow-sm bg-card/50 backdrop-blur-sm">
  //                 <CardContent className="p-4 items-center">
  //                   <Text className="text-lg font-bold text-amber-500 mb-1">{userStats.loyaltyPoints}</Text>
  //                   <Text className="text-xs text-muted-foreground text-center">Điểm tích lũy</Text>
  //                 </CardContent>
  //               </Card>
  //             </View>
  //           </View>

  //           {/* Recent Bookings với thiết kế iOS 18 */}
  //           <View className="px-4 mb-8">
  //             <View className="flex-row items-center justify-between mb-3">
  //               <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">
  //                 📅 Lịch sử gần đây
  //               </Text>
  //               <TouchableOpacity onPress={() => console.log('Navigate to history')}>
  //                 <Text className="text-primary text-sm font-medium">Xem tất cả</Text>
  //               </TouchableOpacity>
  //             </View>

  //             <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
  //               <CardContent className="p-0">
  //                 {recentBookings.slice(0, 3).map((booking, index) => (
  //                   <View key={booking.id}>
  //                     <View className="p-5">
  //                       <View className="flex-row items-start justify-between mb-3">
  //                         <View className="flex-1">
  //                           <Text className="text-base font-semibold text-foreground mb-1">{booking.restaurantName}</Text>
  //                           <View className="flex-row items-center mb-1">
  //                             <Text className="text-lg mr-2">📅</Text>
  //                             <Text className="text-sm text-muted-foreground">
  //                               {booking.date} • {booking.time}
  //                             </Text>
  //                           </View>
  //                           <View className="flex-row items-center">
  //                             <Text className="text-lg mr-2">👥</Text>
  //                             <Text className="text-sm text-muted-foreground">
  //                               {booking.guests} người
  //                             </Text>
  //                           </View>
  //                         </View>
  //                         <View className="items-end">
  //                           {getStatusBadge(booking.status)}
  //                           {booking.total > 0 && (
  //                             <Text className="text-sm font-medium mt-1 text-foreground">
  //                               {formatCurrency(booking.total)}
  //                             </Text>
  //                           )}
  //                         </View>
  //                       </View>
  //                       {booking.rating && (
  //                         <View className="flex-row items-center">
  //                           <Text className="text-sm text-muted-foreground mr-2">Đánh giá:</Text>
  //                           {[...Array(5)].map((_, i) => (
  //                             <Star
  //                               key={i}
  //                               size={14}
  //                               fill={i < booking.rating! ? "#F59E0B" : "transparent"}
  //                               color="#F59E0B"
  //                             />
  //                           ))}
  //                         </View>
  //                       )}
  //                     </View>
  //                     {index < 2 && <View className="border-b border-border/50 ml-5" />}
  //                   </View>
  //                 ))}
  //               </CardContent>
  //             </Card>
  //           </View>

  //           {/* Menu Options với thiết kế iOS 18 */}
  //           <View className="px-4 mb-8">
  //             <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
  //               🎯 Hoạt động
  //             </Text>
  //             <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
  //               <CardContent className="p-0">
  //                 <MenuSection
  //                   icon="📅"
  //                   title="Đặt bàn của tôi"
  //                   subtitle="Xem và quản lý đặt bàn"
  //                   onPress={() => console.log('Navigate to reservations')}
  //                 />
  //                 <View className="border-b border-border/50 ml-14" />
  //                 <MenuSection
  //                   icon="❤️"
  //                   title="Yêu thích"
  //                   subtitle="Nhà hàng và món ăn yêu thích"
  //                   onPress={() => console.log('Navigate to promotions')}
  //                 />
  //                 <View className="border-b border-border/50 ml-14" />
  //                 <MenuSection
  //                   icon="🏆"
  //                   title="Điểm thưởng"
  //                   subtitle={`${userStats.loyaltyPoints} điểm có thể sử dụng`}
  //                   onPress={() => console.log('Navigate to promotions')}
  //                 />
  //                 <View className="border-b border-border/50 ml-14" />
  //                 <MenuSection
  //                   icon="🧾"
  //                   title="Lịch sử thanh toán"
  //                   subtitle="Xem chi tiết hóa đơn"
  //                   onPress={() => console.log('Navigate to history')}
  //                 />
  //               </CardContent>
  //             </Card>
  //           </View>

  //           {/* Settings với thiết kế iOS 18 */}
  //           <View className="px-4 mb-8">
  //             <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
  //               ⚙️ Cài đặt
  //             </Text>
  //             <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
  //               <CardContent className="p-0">
  //                 <MenuSection
  //                   icon="⚙️"
  //                   title="Cài đặt tài khoản"
  //                   subtitle="Thông tin cá nhân, bảo mật"
  //                   onPress={() => router.push("/(settings)" as any)}
  //                 />
  //                 <View className="border-b border-border/50 ml-14" />
  //                 <MenuSection
  //                   icon="🔔"
  //                   title="Thông báo"
  //                   subtitle="Cài đặt thông báo"
  //                   onPress={() => router.push("/(settings)/notifications")}
  //                 />
  //                 <View className="border-b border-border/50 ml-14" />
  //                 <MenuSection
  //                   icon="💳"
  //                   title="Phương thức thanh toán"
  //                   subtitle="Quản lý thẻ và ví điện tử"
  //                   onPress={() => { }}
  //                 />
  //                 <View className="border-b border-border/50 ml-14" />
  //                 <MenuSection
  //                   icon="📍"
  //                   title="Địa chỉ"
  //                   subtitle="Quản lý địa chỉ giao hàng"
  //                   onPress={() => { }}
  //                 />
  //                 <View className="border-b border-border/50 ml-14" />
  //                 <MenuSection
  //                   icon="❓"
  //                   title="Trợ giúp & Hỗ trợ"
  //                   subtitle="FAQ, liên hệ hỗ trợ"
  //                   onPress={() => router.push("/(settings)/about")}
  //                 />
  //               </CardContent>
  //             </Card>
  //           </View>

  //           {/* Sign Out với thiết kế iOS 18 */}
  //           <View className="px-4 mb-8">
  //             <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
  //               ⚠️ Tài khoản
  //             </Text>
  //             <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
  //               <CardContent className="p-0">
  //                 <TouchableOpacity 
  //                   onPress={handleSignOut}
  //                   className="flex-row items-center py-4 px-5 active:bg-red-50"
  //                 >
  //                   <View className="w-10 h-10 bg-red-100 rounded-xl items-center justify-center mr-4">
  //                     <Text className="text-lg">🚪</Text>
  //                   </View>
  //                   <View className="flex-1">
  //                     <Text className="text-base font-medium text-red-600">Đăng xuất</Text>
  //                   </View>
  //                 </TouchableOpacity>
  //               </CardContent>
  //             </Card>
  //           </View>

  //           {/* App Info */}
  //           <View className="px-4 pb-8">
  //             <Text className="text-center text-xs text-muted-foreground">
  //               Waddles Restaurant v1.0.0
  //             </Text>
  //             <Text className="text-center text-xs text-muted-foreground mt-1">
  //               © 2024 Waddles. All rights reserved.
  //             </Text>
  //           </View>
  //         </ScrollView>
  //       </>
  //     ) : (
  //       <>
  //         <TouchableOpacity
  //           className="m-4 bg-primary py-3 px-6 rounded-lg"
  //           onPress={() => router.push('/sign-in')}
  //         >
  //           <Text className="text-white text-center font-medium">Đăng nhập</Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           className="m-4 border border-border py-3 px-6 rounded-lg"
  //           onPress={() => router.push('/sign-up')}
  //         >
  //           <Text className="text-foreground text-center font-medium">Đăng ký</Text>
  //         </TouchableOpacity>
  //       </>
  //     )}
  //   </>
  // );