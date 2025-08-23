import React, { useState } from 'react';
import { View, ScrollView, Pressable, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Header } from '@/components/layout/Header';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Clock,
  TrendingUp,
  X
} from 'lucide-react-native';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    'Phở bò',
    'Pizza',
    'Sushi',
    'Bánh mì'
  ]);

  const trendingSearches = [
    'Bún bò Huế',
    'Cơm tấm',
    'Bánh cuốn',
    'Chè',
    'Bánh flan'
  ];

  const popularCategories = [
    { id: '1', name: 'Đồ ăn nhanh', emoji: '🍔' },
    { id: '2', name: 'Món Việt', emoji: '🍜' },
    { id: '3', name: 'Món Nhật', emoji: '🍣' },
    { id: '4', name: 'Đồ uống', emoji: '🧋' },
    { id: '5', name: 'Tráng miệng', emoji: '🍰' },
    { id: '6', name: 'Món Hàn', emoji: '🍲' }
  ];

  const removeRecentSearch = (index: number) => {
    setRecentSearches(prev => prev.filter((_, i) => i !== index));
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Add to recent searches if not already there
      if (!recentSearches.includes(query)) {
        setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
      }
      
      // Navigate to search results
      router.push({
        pathname: '/(search)/results' as any,
        params: { q: query }
      });
    }
  };

  const renderCategory = ({ item }: { item: typeof popularCategories[0] }) => (
    <Pressable 
      onPress={() => handleSearch(item.name)}
      className="w-24 items-center mr-4"
    >
      <View className="w-16 h-16 bg-muted rounded-full items-center justify-center mb-2">
        <Text className="text-2xl">{item.emoji}</Text>
      </View>
      <Text className="text-xs text-center text-foreground font-medium">
        {item.name}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <Header 
        title="Tìm kiếm"
        showBack
        onBack={() => router.back()}
      />
      
      <ScrollView className="flex-1">
        {/* Search Input */}
        <View className="p-4">
          <View className="relative">
            <Search size={20} className="absolute left-3 top-3 text-muted-foreground z-10" />
            <Input
              placeholder="Tìm món ăn, nhà hàng..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => handleSearch(searchQuery)}
              className="pl-10"
              autoFocus
            />
          </View>
        </View>

        {/* Popular Categories */}
        <View className="px-4 mb-6">
          <Text className="font-bold text-lg text-foreground mb-4">
            Danh mục phổ biến
          </Text>
          
          <FlatList
            data={popularCategories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          />
        </View>

        {/* Trending Searches */}
        <View className="px-4 mb-6">
          <View className="flex-row items-center mb-4">
            <TrendingUp size={20} className="text-primary mr-2" />
            <Text className="font-bold text-lg text-foreground">
              Xu hướng tìm kiếm
            </Text>
          </View>
          
          <View className="flex-row flex-wrap">
            {trendingSearches.map((search, index) => (
              <Pressable
                key={index}
                onPress={() => handleSearch(search)}
                className="bg-muted px-4 py-2 rounded-full mr-2 mb-2"
              >
                <Text className="text-foreground">{search}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View className="px-4">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <Clock size={20} className="text-muted-foreground mr-2" />
                <Text className="font-bold text-lg text-foreground">
                  Tìm kiếm gần đây
                </Text>
              </View>
              
              <Pressable onPress={() => setRecentSearches([])}>
                <Text className="text-primary">Xóa tất cả</Text>
              </Pressable>
            </View>
            
            {recentSearches.map((search, index) => (
              <Pressable
                key={index}
                onPress={() => handleSearch(search)}
                className="flex-row items-center justify-between py-3 border-b border-border"
              >
                <Text className="text-foreground flex-1">{search}</Text>
                
                <Pressable
                  onPress={() => removeRecentSearch(index)}
                  className="w-8 h-8 items-center justify-center"
                >
                  <X size={16} className="text-muted-foreground" />
                </Pressable>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
