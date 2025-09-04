import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, Filter, Star, Clock, Heart } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function SearchResultsDemo() {
  const [searchQuery, setSearchQuery] = useState('salmon');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['Tất cả', 'Công thức', 'Nguyên liệu', 'Nhà hàng', 'Lành mạnh'];

  const searchResults = [
    {
      id: 1,
      type: 'recipe',
      title: 'Cá hồi nướng với măng tây',
      description: 'Món cá hồi giàu omega-3 lành mạnh',
      time: '25 phút',
      calories: '587 cal',
      rating: 4.8,
      image: '🐟',
      tags: ['Lành mạnh', 'Protein', 'Ít carb']
    },
    {
      id: 2,
      type: 'recipe',
      title: 'Cơm cá hồi Teriyaki',
      description: 'Cá hồi phong cách Á châu với cơm',
      time: '30 phút',
      calories: '642 cal',
      rating: 4.6,
      image: '🍚',
      tags: ['Á châu', 'Cơm']
    },
    {
      id: 3,
      type: 'ingredient',
      title: 'Cá hồi Đại Tây Dương tươi',
      description: 'Phi lê cá hồi chất lượng cao',
      time: 'Tươi',
      calories: '206 cal/100g',
      rating: 4.9,
      image: '🐟',
      tags: ['Tươi', 'Protein']
    },
    {
      id: 4,
      type: 'recipe',
      title: 'Bánh mì cá hồi hun khói',
      description: 'Bữa sáng cổ điển với kem phô mai',
      time: '10 phút',
      calories: '425 cal',
      rating: 4.4,
      image: '🥯',
      tags: ['Bữa sáng', 'Nhanh']
    },
    {
      id: 5,
      type: 'restaurant',
      title: 'Ocean Fresh Seafood',
      description: 'Món cá hồi ngon nhất thành phố',
      time: '2.5 km',
      calories: 'Nhà hàng',
      rating: 4.7,
      image: '🏪',
      tags: ['Hải sản', 'Cao cấp']
    }
  ];

  const filteredResults = selectedFilter === 'Tất cả' 
    ? searchResults 
    : searchResults.filter(item => 
        item.type === selectedFilter.toLowerCase() || 
        item.tags.includes(selectedFilter)
      );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <Card className="mx-4 mt-4 mb-4">
        <CardContent className="p-4">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center mr-3"
            >
              <ArrowLeft className="w-5 h-5" />
            </TouchableOpacity>
            <View className="flex-1 flex-row items-center bg-muted rounded-xl px-3 py-2 mr-3">
              <Search className="w-5 h-5 text-muted-foreground" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Tìm kiếm món ăn, công thức..."
                className="flex-1 ml-2 text-foreground"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <TouchableOpacity className="w-10 h-10 items-center justify-center">
              <Filter className="w-5 h-5" />
            </TouchableOpacity>
          </View>

          {/* Filter Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3">
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  onPress={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-full ${
                    selectedFilter === filter 
                      ? 'bg-primary' 
                      : 'bg-muted'
                  }`}
                >
                  <Text className={`font-medium ${
                    selectedFilter === filter 
                      ? 'text-white' 
                      : 'text-muted-foreground'
                  }`}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </CardContent>
      </Card>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Results Header */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-foreground">
                {filteredResults.length} kết quả cho "{searchQuery}"
              </Text>
              <TouchableOpacity>
                <Text className="text-primary font-medium">Sắp xếp</Text>
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>

        {/* Results List */}
        <View className="space-y-4">
          {filteredResults.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                if (item.type === 'recipe') {
                  router.push('/(japtor)/recipe-details' as any);
                }
              }}
            >
              <Card className="mb-4">
                <CardContent className="p-4">
                  <View className="flex-row">
                    {/* Image */}
                    <View className="w-16 h-16 bg-muted rounded-lg items-center justify-center mr-3">
                      <Text className="text-2xl">{item.image}</Text>
                    </View>

                    {/* Content */}
                    <View className="flex-1">
                      <View className="flex-row items-start justify-between">
                        <View className="flex-1">
                          <Text className="font-semibold text-foreground mb-1">
                            {item.title}
                          </Text>
                          <Text className="text-sm text-muted-foreground mb-2">
                            {item.description}
                          </Text>
                          
                          {/* Tags */}
                          <View className="flex-row flex-wrap">
                            {item.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="mr-2 mb-1">
                                <Text className="text-xs">{tag}</Text>
                              </Badge>
                            ))}
                          </View>
                        </View>

                        {/* Action */}
                        <TouchableOpacity className="w-8 h-8 items-center justify-center">
                          <Heart className="w-5 h-5 text-muted-foreground" />
                        </TouchableOpacity>
                      </View>

                      {/* Stats */}
                      <View className="flex-row items-center justify-between mt-2">
                        <View className="flex-row items-center">
                          <Star className="w-3 h-3 text-yellow-500 mr-1" fill="currentColor" />
                          <Text className="text-sm text-muted-foreground mr-3">{item.rating}</Text>
                          <Clock className="w-3 h-3 text-muted-foreground mr-1" />
                          <Text className="text-sm text-muted-foreground">{item.time}</Text>
                        </View>
                        <Badge variant="outline">
                          <Text className="text-xs text-primary font-medium">{item.calories}</Text>
                        </Badge>
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Load More */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <Button variant="outline" className="w-full">
              <Text className="font-medium">Tải thêm kết quả</Text>
            </Button>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
