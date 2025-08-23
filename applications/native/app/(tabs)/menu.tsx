import React, { useState } from 'react';
import { View, ScrollView, Pressable, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Header } from '@/components/layout/Header';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Star, 
  Plus,
  Minus,
  ShoppingCart,
  Clock,
  Flame,
  Heart
} from 'lucide-react-native';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  isPopular: boolean;
  cookingTime: string;
  calories?: number;
}

interface Category {
  id: string;
  name: string;
  count: number;
  color: string;
}

export default function MenuScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<{[key: string]: number}>({});
  const [activeCategory, setActiveCategory] = useState('all');

  const categories: Category[] = [
    { id: 'all', name: 'Tất cả', count: 45, color: '#09090b' },
    { id: 'appetizer', name: 'Khai vị', count: 8, color: '#10b981' },
    { id: 'main', name: 'Món chính', count: 15, color: '#3b82f6' },
    { id: 'dessert', name: 'Tráng miệng', count: 10, color: '#f59e0b' },
    { id: 'drinks', name: 'Đồ uống', count: 12, color: '#8b5cf6' }
  ];

  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Pizza Margherita',
      description: 'Pizza truyền thống với cà chua, mozzarella và húng quế tươi',
      price: 159000,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500',
      category: 'main',
      rating: 4.8,
      isPopular: true,
      cookingTime: '15-20 phút',
      calories: 320
    },
    {
      id: '2',
      name: 'Phở Bò Đặc Biệt',
      description: 'Phở bò truyền thống với thịt bò tươi và nước dùng đậm đà',
      price: 89000,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500',
      category: 'main',
      rating: 4.6,
      isPopular: true,
      cookingTime: '12-15 phút',
      calories: 450
    },
    {
      id: '3',
      name: 'Salad Caesar',
      description: 'Salad tươi với sốt Caesar đặc trưng và bánh mì nướng giòn',
      price: 69000,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500',
      category: 'appetizer',
      rating: 4.4,
      isPopular: false,
      cookingTime: '8-10 phút',
      calories: 180
    },
    {
      id: '4',
      name: 'Tiramisu',
      description: 'Bánh Tiramisu Italia truyền thống với cà phê và mascarpone',
      price: 79000,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500',
      category: 'dessert',
      rating: 4.9,
      isPopular: true,
      cookingTime: '5 phút',
      calories: 250
    },
    {
      id: '5',
      name: 'Trà Sữa Trân Châu',
      description: 'Trà sữa ngon với trân châu dai giòn và kem tươi',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=500',
      category: 'drinks',
      rating: 4.3,
      isPopular: false,
      cookingTime: '3-5 phút',
      calories: 320
    },
    {
      id: '6',
      name: 'Bò Bít Tết',
      description: 'Bít tết bò Úc thượng hạng với khoai tây chiên và salad',
      price: 299000,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500',
      category: 'main',
      rating: 4.7,
      isPopular: true,
      cookingTime: '20-25 phút',
      calories: 680
    }
  ];

  const addToCart = (itemId: string) => {
    setCartItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) - 1)
    }));
  };

  const getFilteredItems = () => {
    let filtered = menuItems;
    
    if (activeCategory !== 'all') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((sum, count) => sum + count, 0);
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <Card className="mb-4">
      <View className="relative">
        <Image 
          source={{ uri: item.image }}
          className="w-full h-48 rounded-t-lg"
          style={{ resizeMode: 'cover' }}
        />
        
        {/* Popular Badge */}
        {item.isPopular && (
          <View className="absolute top-3 left-3 bg-primary px-3 py-1 rounded-full flex-row items-center">
            <Flame size={14} color="white" />
            <Text className="text-white text-xs font-semibold ml-1">Phổ biến</Text>
          </View>
        )}
        
        {/* Favorite Button */}
        <Pressable className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full items-center justify-center">
          <Heart size={18} className="text-muted-foreground" />
        </Pressable>
      </View>
      
      <View className="p-4">
        <View className="flex-row items-start justify-between mb-2">
          <Text className="text-lg font-semibold text-foreground flex-1" numberOfLines={1}>
            {item.name}
          </Text>
          <View className="flex-row items-center ml-2">
            <Star size={14} color="#f59e0b" />
            <Text className="text-sm font-medium text-foreground ml-1">
              {item.rating}
            </Text>
          </View>
        </View>
        
        <Text className="text-sm text-muted-foreground mb-3" numberOfLines={2}>
          {item.description}
        </Text>
        
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Clock size={14} className="text-muted-foreground mr-1" />
            <Text className="text-sm text-muted-foreground">
              {item.cookingTime}
            </Text>
          </View>
          
          {item.calories && (
            <Text className="text-sm text-muted-foreground">
              {item.calories} kcal
            </Text>
          )}
        </View>
        
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold text-primary">
            {item.price.toLocaleString('vi-VN')}đ
          </Text>
          
          <View className="flex-row items-center">
            {cartItems[item.id] > 0 ? (
              <View className="flex-row items-center">
                <Pressable
                  onPress={() => removeFromCart(item.id)}
                  className="w-8 h-8 bg-muted rounded-full items-center justify-center"
                >
                  <Minus size={16} className="text-foreground" />
                </Pressable>
                
                <Text className="mx-3 font-semibold text-foreground">
                  {cartItems[item.id]}
                </Text>
                
                <Pressable
                  onPress={() => addToCart(item.id)}
                  className="w-8 h-8 bg-primary rounded-full items-center justify-center"
                >
                  <Plus size={16} color="white" />
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={() => addToCart(item.id)}
                className="bg-primary px-4 py-2 rounded-full flex-row items-center"
              >
                <Plus size={16} color="white" />
                <Text className="text-white font-medium ml-1">Thêm</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header 
        title="Thực đơn"
        showCart
        cartItemCount={getTotalCartItems()}
        onCart={() => router.push('/(cart)' as any)}
      />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View className="px-4 py-4">
          <View className="flex-row items-center space-x-3">
            <View className="flex-1 flex-row items-center bg-muted px-3 py-2 rounded-lg">
              <Search size={20} className="text-muted-foreground mr-2" />
              <Input
                placeholder="Tìm kiếm món ăn..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 border-0 bg-transparent"
              />
            </View>
            <Pressable className="w-10 h-10 bg-primary rounded-lg items-center justify-center">
              <Filter size={20} color="white" />
            </Pressable>
          </View>
        </View>

        {/* Categories */}
        <View className="px-4 mb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-3">
              {categories.map((category) => (
                <Pressable
                  key={category.id}
                  onPress={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full border ${
                    activeCategory === category.id
                      ? 'bg-primary border-primary'
                      : 'bg-transparent border-border'
                  }`}
                >
                  <View className="flex-row items-center">
                    <Text className={`font-medium ${
                      activeCategory === category.id
                        ? 'text-white'
                        : 'text-foreground'
                    }`}>
                      {category.name}
                    </Text>
                    <Text className={`ml-2 text-sm ${
                      activeCategory === category.id
                        ? 'text-white/80'
                        : 'text-muted-foreground'
                    }`}>
                      ({category.count})
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Menu Items */}
        <View className="px-4">
          <FlatList
            data={getFilteredItems()}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Bottom Padding */}
        <View className="h-20" />
      </ScrollView>

      {/* Floating Cart Button */}
      {getTotalCartItems() > 0 && (
        <Pressable
          onPress={() => router.push('/(cart)' as any)}
          className="absolute bottom-6 right-4 bg-primary rounded-full p-4 shadow-lg"
        >
          <View className="flex-row items-center">
            <ShoppingCart size={24} color="white" />
            <View className="ml-2 bg-white rounded-full w-6 h-6 items-center justify-center">
              <Text className="text-primary text-xs font-bold">
                {getTotalCartItems()}
              </Text>
            </View>
          </View>
        </Pressable>
      )}
    </SafeAreaView>
  );
}
