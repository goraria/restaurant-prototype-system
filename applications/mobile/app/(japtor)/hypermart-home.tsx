import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Search, 
  MapPin, 
  ChevronDown, 
  ShoppingCart,
  Heart,
  Plus,
  Minus,
  Star,
  ChevronRight
} from 'lucide-react-native';

export default function HyperMartHomeScreen() {
  const [cartCount, setCartCount] = useState(2);

  const categories = [
    { name: 'Thực phẩm', color: '#4AB7B6', icon: '🥬' },
    { name: 'Điện tử', color: '#4B9DCB', icon: '🏠' },
    { name: 'Thời trang', color: '#AF558B', icon: '👕' },
    { name: 'Nội thất', color: '#A187D9', icon: '🪑' },
  ];

  const products = [
    {
      id: 1,
      name: 'Ghế hiện đại',
      price: '₹ 3,599',
      rating: 4.8,
      reviews: 243,
      image: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=300',
      inCart: false,
    },
    {
      id: 2,
      name: 'Máy giặt LG',
      price: '₹ 45,999',
      rating: 4.8,
      reviews: 243,
      image: 'https://images.unsplash.com/photo-1610557892118-7208b5a19363?w=300',
      inCart: true,
      quantity: 2,
    },
    {
      id: 3,
      name: 'Dâu tây tươi',
      price: '₹ 10.9',
      rating: 4.8,
      reviews: 243,
      image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300',
      inCart: true,
      quantity: 2,
    },
    {
      id: 4,
      name: 'Khoai tây chiên',
      price: '₹ 10.9',
      rating: 4.8,
      reviews: 243,
      image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=300',
      inCart: false,
    },
  ];

  const brands = [
    { name: 'Samsung', discount: 'Giảm đến 10%', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200' },
    { name: 'Apple', discount: 'Giảm đến 15%', image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=200' },
    { name: 'Sony', discount: 'Giảm đến 20%', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header Card */}
      <Card className="mx-4 mt-4 mb-4">
        <CardContent className="p-4">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <TouchableOpacity className="mr-3">
                <Bell className="w-6 h-6 text-primary" />
              </TouchableOpacity>
              <Text className="font-bold text-xl text-foreground">HyperMart</Text>
            </View>
            <View className="flex-row items-center">
              <TouchableOpacity 
                className="relative mr-3"
                onPress={() => router.push('/(japtor)/hypermart-cart' as any)}
              >
                <ShoppingCart className="w-6 h-6 text-foreground" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 min-w-[20px] h-5 bg-primary">
                    <Text className="text-xs text-white font-bold">{cartCount}</Text>
                  </Badge>
                )}
              </TouchableOpacity>
              <Text className="text-muted-foreground text-sm mr-1">VN</Text>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </View>
          </View>

          {/* Location */}
          <View className="flex-row items-center mb-4">
            <MapPin className="w-4 h-4 text-muted-foreground mr-2" />
            <Text className="text-muted-foreground text-sm">Giao đến: </Text>
            <Text className="font-medium text-foreground">123 Nguyễn Huệ, Q.1</Text>
            <ChevronDown className="w-4 h-4 text-muted-foreground ml-1" />
          </View>

          {/* Search */}
          <View className="relative">
            <Input placeholder="Tìm kiếm sản phẩm..." className="pl-10" />
            <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-3" />
          </View>
        </CardContent>
      </Card>
      
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Categories Card */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="flex-row justify-between">
              {categories.map((category, index) => (
                <TouchableOpacity key={index} className="items-center flex-1">
                  <View 
                    className="w-16 h-16 rounded-2xl items-center justify-center mb-2"
                    style={{ backgroundColor: category.color + '20' }}
                  >
                    <Text className="text-2xl">{category.icon}</Text>
                  </View>
                  <Text className="text-xs text-center text-foreground font-medium">
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* Featured Products Card */}
        <Card className="mb-4">
          <CardHeader>
            <View className="flex-row items-center justify-between">
              <CardTitle>Sản phẩm nổi bật</CardTitle>
              <TouchableOpacity>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </TouchableOpacity>
            </View>
          </CardHeader>
          <CardContent>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row space-x-4">
                {products.map((product) => (
                  <Card key={product.id} className="w-48 mr-2 last:mr-0">
                    <CardContent className="p-4">
                      <View className="relative mb-3">
                        <Image
                          source={{ uri: product.image }}
                          className="w-full h-32 rounded-lg"
                          resizeMode="cover"
                        />
                        <TouchableOpacity className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full items-center justify-center">
                          <Heart className="w-4 h-4 text-gray-600" />
                        </TouchableOpacity>
                      </View>
                      
                      <Text className="font-semibold text-foreground mb-1" numberOfLines={2}>
                        {product.name}
                      </Text>
                      
                      <View className="flex-row items-center mb-2">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                        <Text className="text-xs text-muted-foreground">
                          {product.rating} ({product.reviews})
                        </Text>
                      </View>
                      
                      <Text className="font-bold text-primary text-lg mb-3">
                        {product.price}
                      </Text>
                      
                      {product.inCart ? (
                        <View className="flex-row items-center justify-between bg-primary/10 rounded-lg p-2">
                          <TouchableOpacity className="w-8 h-8 bg-primary rounded-md items-center justify-center">
                            <Minus className="w-4 h-4 text-white" />
                          </TouchableOpacity>
                          <Text className="font-semibold text-primary">{product.quantity}</Text>
                          <TouchableOpacity className="w-8 h-8 bg-primary rounded-md items-center justify-center">
                            <Plus className="w-4 h-4 text-white" />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <Button size="sm" className="w-full">
                          <Plus className="w-4 h-4 mr-1 text-white" />
                          <Text className="text-white">Thêm</Text>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </View>
            </ScrollView>
          </CardContent>
        </Card>

        {/* Brands Card */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Thương hiệu hàng đầu</CardTitle>
            <CardDescription>Ưu đãi đặc biệt từ các thương hiệu nổi tiếng</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row space-x-4">
                {brands.map((brand, index) => (
                  <Card key={index} className="w-32 mr-2 last:mr-0">
                    <CardContent className="p-3 items-center">
                      <Image
                        source={{ uri: brand.image }}
                        className="w-16 h-16 rounded-lg mb-2"
                        resizeMode="cover"
                      />
                      <Text className="font-medium text-foreground text-center text-xs mb-1">
                        {brand.name}
                      </Text>
                      <Badge variant="secondary">
                        <Text className="text-xs">{brand.discount}</Text>
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </View>
            </ScrollView>
          </CardContent>
        </Card>

        {/* Recent Orders Card */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Đặt hàng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <TouchableOpacity className="flex-row items-center p-3 bg-muted/50 rounded-lg">
              <View className="w-12 h-12 bg-primary/20 rounded-lg items-center justify-center mr-3">
                <ShoppingCart className="w-6 h-6 text-primary" />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-foreground">Đơn hàng #12345</Text>
                <Text className="text-sm text-muted-foreground">3 sản phẩm • ₹ 2,599</Text>
              </View>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </TouchableOpacity>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
