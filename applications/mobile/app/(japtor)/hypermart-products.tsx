import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  SlidersHorizontal, 
  Heart, 
  Star, 
  Plus, 
  Minus,
  ShoppingCart,
  Filter,
  Grid3X3,
  List,
  Search
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 2; // 2 columns with padding

export default function HyperMartProductsDemo() {
  const [viewType, setViewType] = useState('grid'); // 'grid' or 'list'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartCount, setCartCount] = useState(5);

  const categories = [
    'All', 'Groceries', 'Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'
  ];

  const products = [
    {
      id: 1,
      name: 'Modern Chair',
      price: '₹ 3,599',
      originalPrice: '₹ 4,999',
      rating: 4.8,
      reviews: 243,
      image: '🪑',
      discount: '28% OFF',
      inCart: false,
      isFavorite: false,
      category: 'Home',
      quantity: 0,
    },
    {
      id: 2,
      name: 'LG Washing Machine',
      price: '₹ 45,999',
      originalPrice: '₹ 52,999',
      rating: 4.8,
      reviews: 156,
      image: '🧺',
      discount: '13% OFF',
      inCart: true,
      isFavorite: true,
      category: 'Electronics',
      quantity: 1,
    },
    {
      id: 3,
      name: 'Fresh Strawberries',
      price: '₹ 199',
      originalPrice: '₹ 250',
      rating: 4.6,
      reviews: 89,
      image: '🍓',
      discount: '20% OFF',
      inCart: true,
      isFavorite: false,
      category: 'Groceries',
      quantity: 2,
    },
    {
      id: 4,
      name: 'Fried Chips',
      price: '₹ 89',
      originalPrice: '₹ 120',
      rating: 4.4,
      reviews: 167,
      image: '🍟',
      discount: '26% OFF',
      inCart: false,
      isFavorite: true,
      category: 'Groceries',
      quantity: 0,
    },
    {
      id: 5,
      name: 'Casual T-Shirt',
      price: '₹ 799',
      originalPrice: '₹ 1,299',
      rating: 4.5,
      reviews: 234,
      image: '👕',
      discount: '38% OFF',
      inCart: false,
      isFavorite: false,
      category: 'Fashion',
      quantity: 0,
    },
    {
      id: 6,
      name: 'Wireless Headphones',
      price: '₹ 2,499',
      originalPrice: '₹ 3,999',
      rating: 4.7,
      reviews: 178,
      image: '🎧',
      discount: '37% OFF',
      inCart: false,
      isFavorite: true,
      category: 'Electronics',
      quantity: 0,
    },
    {
      id: 7,
      name: 'Makeup Kit',
      price: '₹ 1,299',
      originalPrice: '₹ 1,999',
      rating: 4.6,
      reviews: 145,
      image: '💄',
      discount: '35% OFF',
      inCart: false,
      isFavorite: false,
      category: 'Beauty',
      quantity: 0,
    },
    {
      id: 8,
      name: 'Running Shoes',
      price: '₹ 2,999',
      originalPrice: '₹ 4,499',
      rating: 4.8,
      reviews: 312,
      image: '👟',
      discount: '33% OFF',
      inCart: false,
      isFavorite: false,
      category: 'Sports',
      quantity: 0,
    },
  ];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const renderProductCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      className="mb-4"
      style={{ width: viewType === 'grid' ? itemWidth : '100%' }}
      onPress={() => router.push('/(japtor)/hypermart-product-detail' as any)}
    >
      <Card className="bg-white overflow-hidden">
        <CardContent className="p-0">
          <View className={`${viewType === 'grid' ? 'h-32' : 'h-24'} bg-gray-100 items-center justify-center relative`}>
            <Text className={`${viewType === 'grid' ? 'text-4xl' : 'text-3xl'}`}>{item.image}</Text>
            
            {/* Discount Badge */}
            <View className="absolute top-2 left-2 bg-red-500 px-2 py-1 rounded">
              <Text className="text-white text-xs font-bold">{item.discount}</Text>
            </View>
            
            {/* Favorite Icon */}
            <TouchableOpacity className="absolute top-2 right-2">
              <Heart 
                size={20} 
                color={item.isFavorite ? "#E91E63" : "#7D8FAB"} 
                fill={item.isFavorite ? "#E91E63" : "transparent"}
              />
            </TouchableOpacity>
          </View>
          
          <View className="p-3">
            <Text className="font-medium text-gray-900 mb-1" numberOfLines={2}>
              {item.name}
            </Text>
            
            {/* Price Section */}
            <View className="flex-row items-center space-x-2 mb-2">
              <Text className="font-bold text-green-600">{item.price}</Text>
              <Text className="text-gray-500 text-sm line-through">{item.originalPrice}</Text>
            </View>
            
            {/* Rating */}
            <View className="flex-row items-center space-x-1 mb-3">
              <Star size={12} color="#FFA902" fill="#FFA902" />
              <Text className="text-sm text-gray-600">{item.rating}</Text>
              <Text className="text-sm text-gray-500">({item.reviews})</Text>
            </View>
            
            {/* Add to Cart Button */}
            <View className="flex-row items-center justify-between">
              {item.inCart ? (
                <View className="flex-row items-center bg-green-500 rounded-lg px-2 py-1">
                  <TouchableOpacity className="p-1">
                    <Minus size={12} color="white" />
                  </TouchableOpacity>
                  <Text className="text-white text-sm mx-3">{item.quantity}</Text>
                  <TouchableOpacity className="p-1">
                    <Plus size={12} color="white" />
                  </TouchableOpacity>
                </View>
              ) : (
                <Button className="bg-green-100 flex-1 py-2 rounded-lg">
                  <Text className="text-green-700 text-sm font-medium">Add to Cart</Text>
                </Button>
              )}
            </View>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#2D3748" />
          </TouchableOpacity>
          <Text className="font-bold text-lg text-gray-900">Products</Text>
          <TouchableOpacity onPress={() => router.push('/(japtor)/hypermart-cart' as any)}>
            <View className="relative">
              <ShoppingCart size={24} color="#2D3748" />
              <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-bold">{cartCount}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-3 py-3 mb-4">
          <Search size={20} color="#7D8FAB" />
          <Text className="flex-1 ml-3 text-gray-500">Search products...</Text>
        </View>

        {/* Filter and View Controls */}
        <View className="flex-row items-center justify-between">
          <TouchableOpacity className="flex-row items-center bg-gray-100 px-3 py-2 rounded-lg">
            <Filter size={16} color="#7D8FAB" />
            <Text className="ml-2 text-gray-700 font-medium">Filter</Text>
          </TouchableOpacity>
          
          <View className="flex-row items-center bg-gray-100 rounded-lg p-1">
            <TouchableOpacity 
              className={`p-2 rounded-md ${viewType === 'grid' ? 'bg-white shadow-sm' : ''}`}
              onPress={() => setViewType('grid')}
            >
              <Grid3X3 size={16} color={viewType === 'grid' ? "#4A90E2" : "#7D8FAB"} />
            </TouchableOpacity>
            <TouchableOpacity 
              className={`p-2 rounded-md ${viewType === 'list' ? 'bg-white shadow-sm' : ''}`}
              onPress={() => setViewType('list')}
            >
              <List size={16} color={viewType === 'list' ? "#4A90E2" : "#7D8FAB"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Category Tabs */}
      <View className="bg-white border-b border-gray-200">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          className="px-4 py-3"
        >
          <View className="flex-row space-x-3">
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === category 
                    ? 'bg-blue-500' 
                    : 'bg-gray-100'
                }`}
                onPress={() => setSelectedCategory(category)}
              >
                <Text className={`font-medium ${
                  selectedCategory === category 
                    ? 'text-white' 
                    : 'text-gray-700'
                }`}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Product Results */}
      <View className="flex-1 px-4 py-4">
        <Text className="text-gray-600 text-sm mb-4">
          {filteredProducts.length} products found
        </Text>
        
        <FlatList
          data={filteredProducts}
          renderItem={renderProductCard}
          numColumns={viewType === 'grid' ? 2 : 1}
          key={viewType} // Force re-render when view type changes
          columnWrapperStyle={viewType === 'grid' ? { justifyContent: 'space-between' } : undefined}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
}
