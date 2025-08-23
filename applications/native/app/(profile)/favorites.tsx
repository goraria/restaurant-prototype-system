import React, { useState } from 'react';
import { View, ScrollView, Pressable, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Header } from '@/components/layout/Header';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { 
  Heart,
  Star,
  MapPin,
  Clock,
  Trash2
} from 'lucide-react-native';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([
    {
      id: '1',
      type: 'restaurant',
      name: 'Waddles Restaurant',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500',
      rating: 4.8,
      cuisine: 'Âu - Á',
      distance: '1.2 km',
      deliveryTime: '15-25 phút'
    },
    {
      id: '2',
      type: 'dish',
      name: 'Bò bít tết',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500',
      price: 289000,
      restaurant: 'Waddles Restaurant',
      rating: 4.9
    },
    {
      id: '3',
      type: 'restaurant',
      name: 'Phở Hà Nội',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500',
      rating: 4.6,
      cuisine: 'Việt Nam',
      distance: '0.8 km',
      deliveryTime: '10-20 phút'
    }
  ]);

  const [selectedTab, setSelectedTab] = useState('all');

  const filteredFavorites = favorites.filter(item => {
    if (selectedTab === 'all') return true;
    return item.type === selectedTab;
  });

  const removeFavorite = (itemId: string) => {
    setFavorites(prev => prev.filter(item => item.id !== itemId));
  };

  const renderFavoriteItem = ({ item }: { item: typeof favorites[0] }) => (
    <Card className="mb-4 overflow-hidden">
      <Pressable 
        onPress={() => {
          if (item.type === 'restaurant') {
            router.push(`/(restaurants)/${item.id}` as any);
          }
        }}
      >
        <View className="flex-row">
          <Image 
            source={{ uri: item.image }}
            className="w-20 h-20"
            resizeMode="cover"
          />
          
          <View className="flex-1 p-3">
            <View className="flex-row items-start justify-between mb-2">
              <Text className="font-bold text-base text-foreground flex-1 mr-2">
                {item.name}
              </Text>
              
              <Pressable 
                onPress={() => removeFavorite(item.id)}
                className="w-8 h-8 items-center justify-center"
              >
                <Trash2 size={16} className="text-destructive" />
              </Pressable>
            </View>
            
            <View className="flex-row items-center mb-2">
              <Star size={14} className="text-yellow-500 mr-1" />
              <Text className="text-sm font-medium mr-2">{item.rating}</Text>
              
              {item.type === 'restaurant' && (
                <Text className="text-sm text-muted-foreground">
                  {item.cuisine} • {item.distance}
                </Text>
              )}
              
              {item.type === 'dish' && (
                <Text className="text-sm text-muted-foreground">
                  {item.restaurant}
                </Text>
              )}
            </View>
            
            <View className="flex-row items-center justify-between">
              {item.type === 'restaurant' && (
                <View className="flex-row items-center">
                  <Clock size={14} className="text-muted-foreground mr-1" />
                  <Text className="text-sm text-muted-foreground">
                    {item.deliveryTime}
                  </Text>
                </View>
              )}
              
              {item.type === 'dish' && (
                <Text className="font-bold text-lg text-primary">
                  {item.price?.toLocaleString('vi-VN')}đ
                </Text>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    </Card>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <Header 
        title="Yêu thích"
        showBack
        onBack={() => router.back()}
      />
      
      {/* Tabs */}
      <View className="flex-row px-4 py-3 border-b border-border">
        {[
          { id: 'all', title: 'Tất cả' },
          { id: 'restaurant', title: 'Nhà hàng' },
          { id: 'dish', title: 'Món ăn' }
        ].map((tab) => (
          <Pressable
            key={tab.id}
            onPress={() => setSelectedTab(tab.id)}
            className={`mr-6 pb-2 ${
              selectedTab === tab.id 
                ? 'border-b-2 border-primary' 
                : ''
            }`}
          >
            <Text className={`font-medium ${
              selectedTab === tab.id 
                ? 'text-primary' 
                : 'text-muted-foreground'
            }`}>
              {tab.title}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Favorites List */}
      {filteredFavorites.length > 0 ? (
        <FlatList
          data={filteredFavorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 items-center justify-center px-8">
          <Heart size={64} className="text-muted-foreground mb-4" />
          <Text className="text-xl font-bold text-foreground mb-2 text-center">
            Chưa có món yêu thích
          </Text>
          <Text className="text-muted-foreground text-center mb-6">
            Hãy thêm nhà hàng và món ăn yêu thích để dễ dàng tìm lại
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
