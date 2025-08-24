import React, { useEffect, useState, useRef } from 'react';
import { Image, View, ScrollView, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { ShoppingCartButton } from '@/components/element/shopping-cart';
import { router, Stack } from 'expo-router';
import {
  Search,
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Filter,
  TrendingUp,
  X
} from 'lucide-react-native';
import { SearchBar } from '@/components/element/search-bar';
import { HeaderStack } from '@/components/layout/header';

// Mock data cho kết quả tìm kiếm
const recentSearches = [
  'Phở bò',
  'Bánh mì',
  'Cà phê sữa đá',
  'Gỏi cuốn',
];

const popularSearches = [
  'Pizza',
  'Sushi',
  'Burger',
  'Trà sữa',
  'Bánh tráng nướng',
  'Lẩu',
];

const searchResults = [
  {
    id: '1',
    type: 'restaurant',
    name: 'Nhà Hàng Hương Việt',
    description: 'Món Việt truyền thống',
    rating: 4.8,
    time: '25-35 phút',
    address: 'Quận 1, TP.HCM',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
  },
  {
    id: '2',
    type: 'dish',
    name: 'Phở Bò Đặc Biệt',
    description: 'Phở bò với thịt tái, chín, gầu',
    price: 89000,
    restaurant: 'Phở Hương',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400',
  },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItemCount, setCartItemCount] = useState(3);
  const [isSearching, setIsSearching] = useState(false);

  const searchInputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Auto focus vào ô tìm kiếm khi vào trang
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  }, []);

  const handleCartPress = () => {
    console.log('Navigate to cart');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(query.length > 0);
  };

  const handleRecentSearch = (search: string) => {
    setSearchQuery(search);
    setIsSearching(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  const renderRecentSearch = ({ item }: { item: string }) => (
    <TouchableOpacity
      className="flex-row items-center py-3 px-4 border-b border-border"
      onPress={() => handleRecentSearch(item)}
    >
      <Clock size={16} color="#71717a" />
      <Text className="flex-1 ml-3">{item}</Text>
      <TouchableOpacity>
        <X size={16} color="#71717a" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderPopularSearch = ({ item }: { item: string }) => (
    <TouchableOpacity
      className="bg-muted rounded-full px-4 py-2 mr-2 mb-2"
      onPress={() => handleRecentSearch(item)}
    >
      <Text className="text-sm">{item}</Text>
    </TouchableOpacity>
  );

  const renderSearchResult = ({ item }: { item: any }) => (
    <TouchableOpacity className="mb-4">
      <Card>
        <CardContent className="p-0">
          <View className="flex-row">
            <Image
              source={{ uri: item.image }}
              className="w-20 h-20 rounded-l-lg"
              resizeMode="cover"
            />
            <View className="flex-1 p-3">
              <Text className="font-semibold mb-1">{item.name}</Text>
              <Text className="text-sm text-muted-foreground mb-2">{item.description}</Text>

              <View className="flex-row items-center justify-between">
                {item.type === 'restaurant' ? (
                  <View className="flex-row items-center">
                    <Star size={14} fill="#FFD700" color="#FFD700" />
                    <Text className="text-sm ml-1">{item.rating}</Text>
                    <Text className="text-xs text-muted-foreground ml-2">{item.time}</Text>
                  </View>
                ) : (
                  <Text className="text-sm font-semibold text-primary">
                    {item.price?.toLocaleString('vi-VN')}₫
                  </Text>
                )}

                {item.type === 'restaurant' && (
                  <View className="flex-row items-center">
                    <MapPin size={12} color="#71717a" />
                    <Text className="text-xs text-muted-foreground ml-1">{item.address}</Text>
                  </View>
                )}
              </View>

              {item.type === 'dish' && (
                <Text className="text-xs text-muted-foreground mt-1">{item.restaurant}</Text>
              )}
            </View>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );

  return (
    <>
      {/* <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <>
              <View className="bg-background pt-16 pb-4 px-4 border-b border-border">
                <View className="flex-row items-center gap-3">
                  <Button
                    onPress={() => router.back()}
                    size="icon"
                    variant="ghost"
                    className="rounded-full p-4"
                  >
                    <Icon
                      as={ArrowLeft}
                      className="size-6"
                    />
                  </Button>
                  <SearchBar
                    ref={searchInputRef}
                    placeholder="Tìm nhà hàng, món ăn..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                    onSearchPress={() => {
                      alert('Search pressed');
                    }}
                  />
                </View>
              </View>
            </>
          )
        }}
      /> */}
      <HeaderStack
        position='left'
        iconLeft={ArrowLeft}
        iconLeftAction={() => router.back()}
      >
        <SearchBar
          ref={searchInputRef}
          placeholder="Tìm nhà hàng, món ăn..."
          value={searchQuery}
          onChangeText={handleSearch}
          onSearchPress={() => {
            alert('Search pressed');
          }}
        />
      </HeaderStack>
      <View className="flex-1 bg-background">
        {/* <View className="bg-background pt-12 pb-4 px-4 border-b border-border">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={handleBack} className="p-2">
              <ArrowLeft size={24} color="#71717a" />
            </TouchableOpacity>
            
            <View className="flex-1 flex-row items-center bg-muted rounded-lg px-3 py-3">
              <Search size={20} color="#71717a" />
              <TextInput
                ref={searchInputRef}
                placeholder="Tìm nhà hàng, món ăn..."
                value={searchQuery}
                onChangeText={handleSearch}
                className="flex-1 ml-3 text-foreground"
                placeholderTextColor="#71717a"
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearSearch}>
                  <X size={20} color="#71717a" />
                </TouchableOpacity>
              )}
            </View>
            
            <TouchableOpacity className="p-2">
              <Filter size={24} color="#71717a" />
            </TouchableOpacity>
            
            <ShoppingCartButton 
              itemCount={cartItemCount}
              onPress={handleCartPress}
              color="#71717a"
            />
          </View>
        </View> */}

        <ScrollView className="flex-1">
          {!isSearching ? (
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <View className="mb-6">
                  <View className="flex-row items-center justify-between px-4 py-3">
                    <Text className="font-semibold">Tìm kiếm gần đây</Text>
                    <TouchableOpacity>
                      <Text className="text-primary text-sm">Xóa tất cả</Text>
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={recentSearches}
                    renderItem={renderRecentSearch}
                    scrollEnabled={false}
                  />
                </View>
              )}

              {/* Popular Searches */}
              <View className="px-4 mb-6">
                <View className="flex-row items-center mb-3">
                  <TrendingUp size={20} color="#71717a" />
                  <Text className="font-semibold ml-2">Tìm kiếm phổ biến</Text>
                </View>
                <View className="flex-row flex-wrap">
                  {popularSearches.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      className="bg-muted rounded-full px-4 py-2 mr-2 mb-2"
                      onPress={() => handleRecentSearch(item)}
                    >
                      <Text className="text-sm">{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          ) : (
            <>
              {/* Search Results */}
              <View className="px-4 py-4">
                <Text className="font-semibold mb-4">
                  Kết quả cho "{searchQuery}" ({searchResults.length})
                </Text>
                <FlatList
                  data={searchResults}
                  renderItem={renderSearchResult}
                  scrollEnabled={false}
                />
              </View>

              {/* No Results */}
              {searchResults.length === 0 && (
                <View className="flex-1 items-center justify-center py-16">
                  <Search size={64} color="#71717a" />
                  <Text className="text-lg font-semibold mt-4 mb-2">Không tìm thấy kết quả</Text>
                  <Text className="text-muted-foreground text-center px-8">
                    Thử tìm kiếm với từ khóa khác hoặc kiểm tra chính tả
                  </Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </>
  );
}
