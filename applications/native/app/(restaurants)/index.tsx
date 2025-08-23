import React, { useState } from 'react';
import { View, ScrollView, Pressable, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Header } from '@/components/layout/Header';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin,
  Clock,
  Truck
} from 'lucide-react-native';

export default function RestaurantsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const restaurants = [
    {
      id: '1',
      name: 'Waddles Restaurant',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500',
      rating: 4.8,
      cuisine: 'Âu - Á',
      distance: '1.2 km',
      deliveryTime: '15-25 phút',
      deliveryFee: 15000,
      promotion: 'Giảm 20%',
      isOpen: true
    },
    {
      id: '2',
      name: 'Phở Hà Nội',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500',
      rating: 4.6,
      cuisine: 'Việt Nam',
      distance: '0.8 km',
      deliveryTime: '10-20 phút',
      deliveryFee: 0,
      promotion: 'Miễn phí ship',
      isOpen: true
    },
    {
      id: '3',
      name: 'Sushi Sakura',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500',
      rating: 4.7,
      cuisine: 'Nhật Bản',
      distance: '2.5 km',
      deliveryTime: '20-30 phút',
      deliveryFee: 25000,
      promotion: '',
      isOpen: false
    }
  ];

  const renderRestaurantCard = ({ item }: { item: typeof restaurants[0] }) => (
    <Pressable 
      onPress={() => router.push(`/(restaurants)/${item.id}` as any)}
      className="mb-4"
    >
      <Card className="overflow-hidden">
        <View className="relative">
          <Image 
            source={{ uri: item.image }}
            className="w-full h-40"
            resizeMode="cover"
          />
          
          {/* Overlay for closed restaurants */}
          {!item.isOpen && (
            <View className="absolute inset-0 bg-black/50 items-center justify-center">
              <Text className="text-white font-semibold">Đã đóng cửa</Text>
            </View>
          )}
          
          {/* Promotion badge */}
          {item.promotion && (
            <View className="absolute top-3 left-3 bg-red-500 px-2 py-1 rounded-full">
              <Text className="text-white text-xs font-medium">
                {item.promotion}
              </Text>
            </View>
          )}
          
          {/* Rating badge */}
          <View className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full flex-row items-center">
            <Star size={12} className="text-yellow-500 mr-1" />
            <Text className="text-sm font-medium">{item.rating}</Text>
          </View>
        </View>
        
        <View className="p-4">
          <Text className="font-bold text-lg text-foreground mb-1">
            {item.name}
          </Text>
          
          <Text className="text-sm text-muted-foreground mb-3">
            {item.cuisine} • {item.distance}
          </Text>
          
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Clock size={14} className="text-muted-foreground mr-1" />
              <Text className="text-sm text-muted-foreground">
                {item.deliveryTime}
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Truck size={14} className="text-muted-foreground mr-1" />
              <Text className="text-sm text-muted-foreground">
                {item.deliveryFee === 0 ? 'Miễn phí' : `${item.deliveryFee.toLocaleString('vi-VN')}đ`}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <Header 
        title="Nhà hàng"
        showBack
        onBack={() => router.back()}
      />
      
      {/* Search */}
      <View className="px-4 py-3 border-b border-border">
        <View className="relative">
          <Search size={20} className="absolute left-3 top-3 text-muted-foreground z-10" />
          <Input
            placeholder="Tìm kiếm nhà hàng..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="pl-10 pr-12"
          />
          <Pressable className="absolute right-3 top-3">
            <Filter size={20} className="text-muted-foreground" />
          </Pressable>
        </View>
      </View>

      {/* Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="border-b border-border"
      >
        <View className="flex-row px-4 py-3">
          {['Tất cả', 'Gần nhất', 'Đánh giá cao', 'Miễn phí ship', 'Khuyến mãi'].map((filter, index) => (
            <Pressable
              key={index}
              className="mr-3 px-4 py-2 bg-muted rounded-full"
            >
              <Text className="font-medium text-foreground">{filter}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Restaurants List */}
      <FlatList
        data={restaurants}
        renderItem={renderRestaurantCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
