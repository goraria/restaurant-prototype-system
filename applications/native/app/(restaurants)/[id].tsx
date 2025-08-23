import React, { useState } from 'react';
import { View, ScrollView, Pressable, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Header } from '@/components/layout/Header';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  MapPin,
  Clock,
  Plus,
  Minus,
  ShoppingCart,
  Heart,
  Share,
  Info
} from 'lucide-react-native';

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('Món chính');
  const [cartItems, setCartItems] = useState<Record<string, number>>({});

  const restaurant = {
    id: '1',
    name: 'Waddles Restaurant',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500',
    rating: 4.8,
    reviews: 234,
    cuisine: 'Âu - Á',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    distance: '1.2 km',
    deliveryTime: '15-25 phút',
    deliveryFee: 15000,
    promotion: 'Giảm 20%',
    isOpen: true,
    description: 'Nhà hàng phục vụ món ăn Âu - Á với không gian sang trọng và thực đơn đa dạng.',
    openTime: '10:00 - 22:00'
  };

  const categories = ['Món chính', 'Khai vị', 'Salad', 'Đồ uống', 'Tráng miệng'];

  const menuItems = [
    {
      id: '1',
      name: 'Bò bít tết',
      description: 'Thịt bò nhập khẩu với sốt tiêu đen, khoai tây nghiền',
      price: 289000,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500',
      category: 'Món chính',
      available: true
    },
    {
      id: '2',
      name: 'Cá hồi nướng',
      description: 'Cá hồi Na Uy nướng với rau củ theo mùa',
      price: 319000,
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500',
      category: 'Món chính',
      available: true
    },
    {
      id: '3',
      name: 'Salad Caesar',
      description: 'Salad rau tươi với sốt Caesar, bánh mì nướng',
      price: 149000,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500',
      category: 'Salad',
      available: false
    }
  ];

  const filteredItems = menuItems.filter(item => item.category === selectedCategory);

  const addToCart = (itemId: string) => {
    setCartItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0)
    }));
  };

  const getTotalItems = () => {
    return Object.values(cartItems).reduce((sum, count) => sum + count, 0);
  };

  const renderMenuItem = ({ item }: { item: typeof menuItems[0] }) => (
    <Card className="mb-4 overflow-hidden">
      <View className="flex-row">
        <Image 
          source={{ uri: item.image }}
          className="w-20 h-20"
          resizeMode="cover"
        />
        
        <View className="flex-1 p-3">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="font-bold text-base text-foreground flex-1 mr-2">
              {item.name}
            </Text>
            {!item.available && (
              <View className="bg-red-100 px-2 py-1 rounded-full">
                <Text className="text-red-600 text-xs">Hết hàng</Text>
              </View>
            )}
          </View>
          
          <Text className="text-sm text-muted-foreground mb-2" numberOfLines={2}>
            {item.description}
          </Text>
          
          <View className="flex-row justify-between items-center">
            <Text className="font-bold text-lg text-primary">
              {item.price.toLocaleString('vi-VN')}đ
            </Text>
            
            {item.available && (
              <View className="flex-row items-center">
                {cartItems[item.id] > 0 ? (
                  <View className="flex-row items-center">
                    <Pressable 
                      onPress={() => removeFromCart(item.id)}
                      className="w-8 h-8 bg-primary rounded-full items-center justify-center"
                    >
                      <Minus size={16} className="text-primary-foreground" />
                    </Pressable>
                    
                    <Text className="mx-3 font-medium text-base">
                      {cartItems[item.id]}
                    </Text>
                    
                    <Pressable 
                      onPress={() => addToCart(item.id)}
                      className="w-8 h-8 bg-primary rounded-full items-center justify-center"
                    >
                      <Plus size={16} className="text-primary-foreground" />
                    </Pressable>
                  </View>
                ) : (
                  <Pressable 
                    onPress={() => addToCart(item.id)}
                    className="w-8 h-8 bg-primary rounded-full items-center justify-center"
                  >
                    <Plus size={16} className="text-primary-foreground" />
                  </Pressable>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <Header 
        showBack
        onBack={() => router.back()}
      />
      
      {/* Header Actions */}
      <View className="absolute top-16 right-4 z-10 flex-row">
        <Pressable className="w-10 h-10 bg-white/90 rounded-full items-center justify-center mr-2">
          <Heart size={20} className="text-foreground" />
        </Pressable>
        <Pressable className="w-10 h-10 bg-white/90 rounded-full items-center justify-center">
          <Share size={20} className="text-foreground" />
        </Pressable>
      </View>
      
      <ScrollView className="flex-1">
        {/* Restaurant Header */}
        <View className="relative">
          <Image 
            source={{ uri: restaurant.image }}
            className="w-full h-48"
            resizeMode="cover"
          />
          
          {restaurant.promotion && (
            <View className="absolute top-4 left-4 bg-red-500 px-3 py-1 rounded-full">
              <Text className="text-white font-medium">
                {restaurant.promotion}
              </Text>
            </View>
          )}
        </View>

        {/* Restaurant Info */}
        <View className="p-4 border-b border-border">
          <Text className="font-bold text-2xl text-foreground mb-2">
            {restaurant.name}
          </Text>
          
          <View className="flex-row items-center mb-2">
            <Star size={16} className="text-yellow-500 mr-1" />
            <Text className="font-medium mr-2">{restaurant.rating}</Text>
            <Text className="text-muted-foreground">({restaurant.reviews} đánh giá)</Text>
          </View>
          
          <Text className="text-muted-foreground mb-2">
            {restaurant.cuisine} • {restaurant.distance}
          </Text>
          
          <View className="flex-row items-center mb-2">
            <MapPin size={14} className="text-muted-foreground mr-1" />
            <Text className="text-sm text-muted-foreground flex-1">
              {restaurant.address}
            </Text>
          </View>
          
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Clock size={14} className="text-muted-foreground mr-1" />
              <Text className="text-sm text-muted-foreground">
                {restaurant.deliveryTime} • {restaurant.openTime}
              </Text>
            </View>
            
            <Pressable className="flex-row items-center">
              <Info size={14} className="text-primary mr-1" />
              <Text className="text-sm text-primary">Thông tin</Text>
            </Pressable>
          </View>
        </View>

        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="border-b border-border"
        >
          <View className="flex-row px-4 py-3">
            {categories.map((category, index) => (
              <Pressable
                key={index}
                onPress={() => setSelectedCategory(category)}
                className={`mr-3 px-4 py-2 rounded-full ${
                  selectedCategory === category 
                    ? 'bg-primary' 
                    : 'bg-muted'
                }`}
              >
                <Text className={`font-medium ${
                  selectedCategory === category 
                    ? 'text-primary-foreground' 
                    : 'text-foreground'
                }`}>
                  {category}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* Menu Items */}
        <View className="p-4">
          <FlatList
            data={filteredItems}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {/* Cart Button */}
      {getTotalItems() > 0 && (
        <View className="p-4 border-t border-border bg-background">
          <Button 
            onPress={() => router.push('/(cart)' as any)}
            className="flex-row items-center justify-center"
          >
            <ShoppingCart size={20} className="text-primary-foreground mr-2" />
            <Text className="text-primary-foreground font-semibold mr-2">
              Xem giỏ hàng
            </Text>
            <View className="bg-primary-foreground/20 px-2 py-1 rounded-full">
              <Text className="text-primary-foreground font-bold">
                {getTotalItems()}
              </Text>
            </View>
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}
