import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { ShoppingCartButton } from '@/components/element/shopping-cart';
import { SearchBar, SearchBarHolder } from '@/components/element/search-bar';
import { useUser } from '@clerk/clerk-expo';
import { Link, Stack, router } from 'expo-router';
import {
  Search,
  MapPin,
  Star,
  Clock,
  Users,
  UtensilsCrossed,
  Calendar,
  Heart,
  TrendingUp,
  Award,
  Utensils,
  ShoppingCart,
  Bell,
  Gift,
  Phone,
  ChefHat,
  Camera,
  MessageCircle
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Image, ScrollView, TouchableOpacity, View, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appGlobal, restaurantColors, quickActions } from '@/constants/restaurant';

import { ThemeToggle } from '@/components/element/ThemeToggle';
import { UserMenu } from '@/components/auth/user-menu';
import { Icon } from "@/components/ui/icon";
import { HeaderStack } from '@/components/layout/header';

const { width } = Dimensions.get('window');

// Mock data for restaurant
const restaurantData = {
  name: appGlobal.name,
  rating: 4.8,
  reviews: 1250,
  location: "Hai Bà Trưng, Hà Nội",
  openTime: "06:00 - 22:00",
  deliveryTime: "30-45 phút",
  promoMessage: "🎉 Giảm 20% cho đơn hàng đầu tiên!"
}

const popularDishes = [
  {
    id: 1,
    name: "Phở Bò Đặc Biệt",
    price: 89000,
    originalPrice: 110000,
    rating: 4.9,
    reviews: 234,
    image: "🍜",
    category: "Món chính",
    discount: "19% OFF",
    preparationTime: "15 phút"
  },
  {
    id: 2,
    name: "Gỏi Cuốn Tôm Thịt",
    price: 45000,
    originalPrice: 60000,
    rating: 4.7,
    reviews: 189,
    image: "🥗",
    category: "Khai vị",
    discount: "25% OFF",
    preparationTime: "10 phút"
  },
  {
    id: 3,
    name: "Bánh Mì Thịt Nướng",
    price: 35000,
    originalPrice: 45000,
    rating: 4.8,
    reviews: 156,
    image: "🥖",
    category: "Ăn vặt",
    discount: "22% OFF",
    preparationTime: "12 phút"
  },
  {
    id: 4,
    name: "Cà Phê Sữa Đá",
    price: 25000,
    originalPrice: 30000,
    rating: 4.6,
    reviews: 98,
    image: "☕",
    category: "Đồ uống",
    discount: "17% OFF",
    preparationTime: "5 phút"
  }
]

const recentBookings = [
  {
    id: 1,
    tableNumber: "B05",
    date: "Hôm nay",
    time: "19:30",
    guests: 4,
    status: "confirmed",
    restaurant: appGlobal.name
  },
  {
    id: 2,
    tableNumber: "A12",
    date: "Mai",
    time: "12:00",
    guests: 2,
    status: "pending",
    restaurant: appGlobal.name
  }
]

const specialOffers = [
  {
    id: 1,
    title: "Combo Gia Đình",
    description: "Phở + Gỏi cuốn + Nước ngọt cho 4 người",
    originalPrice: 320000,
    discountPrice: 250000,
    discount: "22%",
    validUntil: "31/12/2024",
    image: "🍽️"
  },
  {
    id: 2,
    title: "Happy Hour",
    description: "Giảm 30% tất cả đồ uống từ 14:00-16:00",
    originalPrice: null,
    discountPrice: null,
    discount: "30%",
    validUntil: "Hằng ngày",
    image: "🍹"
  }
];

const featuredRestaurants = [
  {
    id: '1',
    name: 'Nhà Hàng Hương Việt',
    cuisine: 'Việt Nam',
    rating: 4.8,
    reviewCount: 328,
    deliveryTime: '25-35',
    address: 'Quận 1, TP.HCM',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    discount: '20%',
    isOpen: true,
    specialOffer: 'Giảm 20% cho đơn đầu tiên'
  },
  {
    id: '2',
    name: 'Sushi Tokyo',
    cuisine: 'Nhật Bản',
    rating: 4.6,
    reviewCount: 156,
    deliveryTime: '30-40',
    address: 'Quận 3, TP.HCM',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    discount: null,
    isOpen: true,
    specialOffer: null
  },
];

const categories = [
  { id: '1', name: 'Món Việt', icon: '🍜', count: 128 },
  { id: '2', name: 'Nhật Bản', icon: '🍣', count: 89 },
  { id: '3', name: 'Hàn Quốc', icon: '🍱', count: 67 },
  { id: '4', name: 'Thái Lan', icon: '🍛', count: 45 },
  { id: '5', name: 'Fastfood', icon: '🍔', count: 123 },
  { id: '6', name: 'Cafe', icon: '☕', count: 234 },
];

const promotions = [
  {
    id: '1',
    title: 'Giảm 50% - Món mới',
    subtitle: 'Áp dụng cho tất cả nhà hàng',
    color: 'bg-red-500',
  },
  {
    id: '2',
    title: 'Miễn phí ship',
    subtitle: 'Đơn từ 200k',
    color: 'bg-blue-500',
  },
];

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [cartItemCount, setCartItemCount] = React.useState(3); // Mock cart count

  const handleCartPress = () => {
    console.log('Navigate to cart');
  };

  const renderRestaurantCard = ({ item }: { item: any }) => (
    <TouchableOpacity className="mr-4" onPress={() => router.push('/(booking)/tables')}>
      <Card className="w-72 overflow-hidden">
        <View className="relative">
          <Image
            source={{ uri: item.image }}
            className="h-32 w-full"
            resizeMode="cover"
          />
          {item.discount && (
            <View className="absolute top-2 left-2 bg-red-500 px-2 py-1 rounded-lg">
              <Text className="text-white text-xs font-bold">{item.discount}</Text>
            </View>
          )}
          <TouchableOpacity className="absolute top-2 right-2 p-1 bg-white/80 rounded-full">
            <Heart size={16} color="red" />
          </TouchableOpacity>
        </View>
        <CardContent className="p-3">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="font-semibold text-base flex-1" numberOfLines={1}>
              {item.name}
            </Text>
            <View className="flex-row items-center">
              <Star size={14} fill="#FFD700" color="#FFD700" />
              <Text className="text-sm font-medium ml-1">{item.rating}</Text>
              <Text className="text-xs text-muted-foreground ml-1">({item.reviewCount})</Text>
            </View>
          </View>
          <Text className="text-sm text-muted-foreground mb-2">{item.cuisine}</Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Clock size={12} color="#666" />
              <Text className="text-xs text-muted-foreground ml-1">{item.deliveryTime} phút</Text>
            </View>
            <View className="flex-row items-center">
              <MapPin size={12} color="#666" />
              <Text className="text-xs text-muted-foreground ml-1">{item.address}</Text>
            </View>
          </View>
          {item.specialOffer && (
            <Text className="text-xs text-green-600 font-medium mt-2">{item.specialOffer}</Text>
          )}
        </CardContent>
      </Card>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }: { item: any }) => (
    <TouchableOpacity className="items-center mr-4">
      <View className="w-16 h-16 rounded-full bg-muted items-center justify-center mb-2">
        <Text className="text-2xl">{item.icon}</Text>
      </View>
      <Text className="text-xs text-center font-medium" numberOfLines={1}>
        {item.name}
      </Text>
      <Text className="text-xs text-muted-foreground">({item.count})</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <HeaderStack
        position="right"
        iconRight={ShoppingCart}
        iconRightAction={() => router.push('/(restaurant)/cart')}
      >
        <SearchBarHolder
          placeholder="Tìm nhà hàng, món ăn..."
          onPress={() => router.push('/search')}
        />
      </HeaderStack>
      <ScrollView className="flex-1 bg-background">

        {/* Tiêu đề lớn kiểu iOS 18 */}
        <View className="px-5 pt-2 pb-4">
          <Text className="text-4xl font-bold text-foreground tracking-tight">Khám phá</Text>
          <Text className="text-base text-muted-foreground mt-1">Hương vị Việt Nam đích thực</Text>
        </View>

        {/* Promotions Banner với thiết kế iOS 18 */}
        <View className="px-4 mb-8">
          <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
            🎉 Ưu đãi đặc biệt
          </Text>
          <FlatList
            data={promotions}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity className="mr-3">
                <View className={`${item.color} rounded-2xl p-6 w-72 shadow-lg`}>
                  <Text className="text-white font-bold text-xl mb-2">{item.title}</Text>
                  <Text className="text-white/90 text-sm leading-5">{item.subtitle}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Categories với thiết kế iOS 18 */}
        <View className="px-4 mb-8">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">
              🍽️ Danh mục
            </Text>
            <TouchableOpacity>
              <Text className="text-primary text-sm font-medium">Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderCategory}
          />
        </View>

        {/* Featured Restaurants với thiết kế iOS 18 */}
        <View className="px-4 mb-8">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">
              ⭐ Nhà hàng nổi bật
            </Text>
            <TouchableOpacity onPress={() => router.push('/(restaurant)/menu')}>
              <Text className="text-primary text-sm font-medium">Xem thực đơn</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredRestaurants}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderRestaurantCard}
          />
        </View>

        {/* Quick Actions với thiết kế iOS 18 */}
        <View className="px-4 mb-8">
          <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
            🚀 Dịch vụ nhanh
          </Text>
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="p-5">
              <View className="flex-row justify-between">
                <TouchableOpacity className="items-center flex-1" onPress={() => console.log('Navigate to create-reservation')}>
                  <View className="w-16 h-16 rounded-2xl bg-blue-100 items-center justify-center mb-3 shadow-sm">
                    <Text className="text-2xl">📅</Text>
                  </View>
                  <Text className="text-sm font-medium text-center text-foreground">Đặt bàn</Text>
                </TouchableOpacity>

                <TouchableOpacity className="items-center flex-1" onPress={() => console.log('Navigate to cart')}>
                  <View className="w-16 h-16 rounded-2xl bg-green-100 items-center justify-center mb-3 shadow-sm">
                    <Text className="text-2xl">🍽️</Text>
                  </View>
                  <Text className="text-sm font-medium text-center text-foreground">Gọi món</Text>
                </TouchableOpacity>

                <TouchableOpacity className="items-center flex-1" onPress={() => console.log('Navigate to promotions')}>
                  <View className="w-16 h-16 rounded-2xl bg-purple-100 items-center justify-center mb-3 shadow-sm">
                    <Text className="text-2xl">🏆</Text>
                  </View>
                  <Text className="text-sm font-medium text-center text-foreground">Ưu đãi</Text>
                </TouchableOpacity>

                <TouchableOpacity className="items-center flex-1" onPress={() => console.log('Navigate to history')}>
                  <View className="w-16 h-16 rounded-2xl bg-yellow-100 items-center justify-center mb-3 shadow-sm">
                    <Text className="text-2xl">📊</Text>
                  </View>
                  <Text className="text-sm font-medium text-center text-foreground">Lịch sử</Text>
                </TouchableOpacity>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Recent Bookings với thiết kế iOS 18 */}
        <View className="px-4 mb-8">
          <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
            📅 Đặt bàn gần đây
          </Text>
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="p-5">
              <View className="flex-row items-center">
                <View className="w-14 h-14 rounded-2xl bg-muted items-center justify-center mr-4 shadow-sm">
                  <Text className="text-2xl">🍽️</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-base text-foreground mb-1">Nhà Hàng Hương Việt</Text>
                  <Text className="text-sm text-muted-foreground mb-1">Hôm nay, 19:00 • 2 người</Text>
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    <Text className="text-xs text-green-600 font-medium">Đã xác nhận</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => console.log('Navigate to reservations')}>
                  <View className="px-4 py-2 bg-primary rounded-xl">
                    <Text className="text-primary-foreground text-sm font-medium">Chi tiết</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Footer spacing */}
        <View className="h-8" />
      </ScrollView>
    </>
  );
}