import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { ShoppingCartButton } from '@/components/ui/shopping-cart';
import { useUser } from '@clerk/clerk-expo';
import { Link, Stack } from 'expo-router';
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
  Utensils
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Image, ScrollView, TouchableOpacity, View, FlatList } from 'react-native';

// Mock data cho nhà hàng
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
    // Navigate to cart screen
    console.log('Navigate to cart');
  };

  const renderRestaurantCard = ({ item }: { item: any }) => (
    <TouchableOpacity className="mr-4">
      <Card className="w-72 overflow-hidden">
        <View className="relative">
          <Image
            source={{ uri: item.image }}
            className="h-32 w-full"
            resizeMode="cover"
          />
          {item.discount && (
            <Badge className="absolute top-2 left-2 bg-red-500">
              <Text className="text-white text-xs font-bold">{item.discount}</Text>
            </Badge>
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
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ScrollView className="flex-1 bg-background">
        {/* Simple Header với Search Bar và Cart */}
        <View className="bg-background pt-12 pb-4 px-4 border-b border-border">
          <View className="flex-row items-center gap-3">
            {/* Search Bar */}
            {/* <View className="flex-1 flex-row items-center bg-muted rounded-lg px-3 py-3">
              <Search size={20} color="#71717a" />
              <Input
                placeholder="Tìm nhà hàng, món ăn..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 ml-3 border-0 bg-transparent p-0 text-foreground"
              />
            </View> */}
            <View className="flex-1 flex-row items-center bg-muted rounded-lg p-3">
              <View className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm món ăn..."
                  className="w-[200px] pl-8"
                />
              </View>
            </View>
            
            {/* Shopping Cart */}
            <ShoppingCartButton 
              itemCount={cartItemCount}
              onPress={handleCartPress}
              color="#71717a"
            />
          </View>
        </View>

        {/* Promotions Banner */}
        <View className="px-4 py-4">
          <FlatList
            data={promotions}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity className="mr-3">
                <View className={`${item.color} rounded-xl p-4 w-64`}>
                  <Text className="text-white font-bold text-lg">{item.title}</Text>
                  <Text className="text-white/90 text-sm">{item.subtitle}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Categories */}
        <View className="px-4 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold">Danh mục</Text>
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

        {/* Featured Restaurants */}
        <View className="px-4 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold">Nhà hàng nổi bật</Text>
            <TouchableOpacity>
              <Text className="text-primary text-sm font-medium">Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredRestaurants}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderRestaurantCard}
          />
        </View>

        {/* Quick Actions */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold mb-4">Dịch vụ</Text>
          <View className="flex-row justify-between">
            <TouchableOpacity className="items-center flex-1">
              <View className="w-16 h-16 rounded-xl bg-blue-100 items-center justify-center mb-2">
                <Calendar size={24} color="#3B82F6" />
              </View>
              <Text className="text-sm font-medium text-center">Đặt bàn</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="items-center flex-1">
              <View className="w-16 h-16 rounded-xl bg-green-100 items-center justify-center mb-2">
                <UtensilsCrossed size={24} color="#10B981" />
              </View>
              <Text className="text-sm font-medium text-center">Gọi món</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="items-center flex-1">
              <View className="w-16 h-16 rounded-xl bg-purple-100 items-center justify-center mb-2">
                <Award size={24} color="#8B5CF6" />
              </View>
              <Text className="text-sm font-medium text-center">Ưu đãi</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="items-center flex-1">
              <View className="w-16 h-16 rounded-xl bg-yellow-100 items-center justify-center mb-2">
                <TrendingUp size={24} color="#F59E0B" />
              </View>
              <Text className="text-sm font-medium text-center">Xu hướng</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Bookings */}
        <View className="px-4 mb-8">
          <Text className="text-lg font-bold mb-4">Đặt bàn gần đây</Text>
          <Card>
            <CardContent className="p-4">
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-xl bg-muted items-center justify-center mr-3">
                  <Utensils size={20} color="#09090b" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold">Nhà Hàng Hương Việt</Text>
                  <Text className="text-sm text-muted-foreground">Hôm nay, 19:00 - 2 người</Text>
                  <Text className="text-xs text-green-600">Đã xác nhận</Text>
                </View>
                <TouchableOpacity>
                  <Button size="sm">
                    <Text>Xem chi tiết</Text>
                  </Button>
                </TouchableOpacity>
              </View>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </>
  );
}