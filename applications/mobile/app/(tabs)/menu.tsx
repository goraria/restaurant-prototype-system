import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { ShoppingCartButton } from '@/components/ui/shopping-cart';
import { Stack } from 'expo-router';
import { 
  Search, 
  Star, 
  Clock, 
  Filter,
  Heart,
  Plus,
  Minus,
  UtensilsCrossed
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Image, ScrollView, TouchableOpacity, View, FlatList } from 'react-native';

// Mock data cho menu
const menuCategories = [
  { id: 'all', name: 'Tất cả', count: 48 },
  { id: 'main', name: 'Món chính', count: 18 },
  { id: 'appetizer', name: 'Khai vị', count: 8 },
  { id: 'drink', name: 'Đồ uống', count: 12 },
  { id: 'dessert', name: 'Tráng miệng', count: 10 },
];

const menuItems = [
  {
    id: '1',
    name: 'Phở Bò Đặc Biệt',
    description: 'Phở bò truyền thống với thịt bò tái, chín, gầu',
    price: 89000,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    rating: 4.8,
    reviewCount: 124,
    cookingTime: 15,
    isVegetarian: false,
    isSpicy: false,
    isPopular: true
  },
  {
    id: '2',
    name: 'Bún Bò Huế',
    description: 'Bún bò Huế cay nồng đậm đà hương vị miền Trung',
    price: 75000,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400',
    rating: 4.6,
    reviewCount: 89,
    cookingTime: 20,
    isVegetarian: false,
    isSpicy: true,
    isPopular: false
  },
  {
    id: '3',
    name: 'Gỏi Cuốn Tôm Thịt',
    description: 'Gỏi cuốn tươi ngon với tôm và thịt heo',
    price: 45000,
    category: 'appetizer',
    image: 'https://images.unsplash.com/photo-1559847844-d241a92b6d12?w=400',
    rating: 4.7,
    reviewCount: 156,
    cookingTime: 10,
    isVegetarian: false,
    isSpicy: false,
    isPopular: true
  },
  {
    id: '4',
    name: 'Cà Phê Sữa Đá',
    description: 'Cà phê sữa đá truyền thống Việt Nam',
    price: 25000,
    category: 'drink',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
    rating: 4.5,
    reviewCount: 203,
    cookingTime: 5,
    isVegetarian: true,
    isSpicy: false,
    isPopular: false
  },
  {
    id: '5',
    name: 'Bánh Flan Caramel',
    description: 'Bánh flan mềm mịn với lớp caramel thơm ngon',
    price: 35000,
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
    rating: 4.3,
    reviewCount: 67,
    cookingTime: 5,
    isVegetarian: true,
    isSpicy: false,
    isPopular: false
  },
  {
    id: '6',
    name: 'Bánh Mì Thịt Nướng',
    description: 'Bánh mì giòn với thịt nướng thơm lừng',
    price: 35000,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    rating: 4.4,
    reviewCount: 91,
    cookingTime: 8,
    isVegetarian: false,
    isSpicy: false,
    isPopular: true
  }
];

export default function MenuScreen() {
  const { colorScheme } = useColorScheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [cartItems, setCartItems] = React.useState<{[key: string]: number}>({});
  const [cartItemCount, setCartItemCount] = React.useState(0);

  const handleAddToCart = (itemId: string) => {
    setCartItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
    setCartItemCount(prev => prev + 1);
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCartItems(prev => {
      const newCount = Math.max(0, (prev[itemId] || 0) - 1);
      if (newCount === 0) {
        const { [itemId]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: newCount };
    });
    setCartItemCount(prev => Math.max(0, prev - 1));
  };

  const handleCartPress = () => {
    console.log('Navigate to cart');
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderCategoryButton = ({ item }: { item: any }) => (
    <TouchableOpacity
      className={`mr-3 px-4 py-2 rounded-full border ${
        selectedCategory === item.id 
          ? 'bg-primary border-primary' 
          : 'bg-background border-border'
      }`}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text className={`text-sm font-medium ${
        selectedCategory === item.id ? 'text-primary-foreground' : 'text-foreground'
      }`}>
        {item.name} ({item.count})
      </Text>
    </TouchableOpacity>
  );

  const renderMenuItem = ({ item }: { item: any }) => {
    const itemCount = cartItems[item.id] || 0;
    
    return (
      <Card className="mb-4 overflow-hidden">
        <View className="flex-row">
          <Image 
            source={{ uri: item.image }}
            className="w-24 h-24"
            resizeMode="cover"
          />
          <View className="flex-1 p-3">
            <View className="flex-row items-start justify-between mb-1">
              <View className="flex-1 mr-2">
                <View className="flex-row items-center mb-1">
                  <Text className="font-semibold text-base flex-1" numberOfLines={1}>
                    {item.name}
                  </Text>
                  {item.isPopular && (
                    <Badge className="bg-primary ml-2">
                      <Text className="text-primary-foreground text-xs">Phổ biến</Text>
                    </Badge>
                  )}
                </View>
                <Text className="text-sm text-muted-foreground mb-2" numberOfLines={2}>
                  {item.description}
                </Text>
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-bold text-primary">
                    {item.price.toLocaleString('vi-VN')}₫
                  </Text>
                  <View className="flex-row items-center">
                    <Star size={14} fill="#FFD700" color="#FFD700" />
                    <Text className="text-sm ml-1">{item.rating}</Text>
                    <Text className="text-xs text-muted-foreground ml-1">({item.reviewCount})</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity className="p-1">
                <Heart size={20} color="#71717a" />
              </TouchableOpacity>
            </View>
            
            <View className="flex-row items-center justify-between mt-2">
              <View className="flex-row items-center">
                <Clock size={12} color="#71717a" />
                <Text className="text-xs text-muted-foreground ml-1">{item.cookingTime} phút</Text>
                {item.isVegetarian && (
                  <Badge className="bg-green-100 ml-2">
                    <Text className="text-green-800 text-xs">Chay</Text>
                  </Badge>
                )}
                {item.isSpicy && (
                  <Badge className="bg-red-100 ml-2">
                    <Text className="text-red-800 text-xs">Cay</Text>
                  </Badge>
                )}
              </View>
              
              {itemCount > 0 ? (
                <View className="flex-row items-center">
                  <TouchableOpacity 
                    className="w-8 h-8 rounded-full bg-muted items-center justify-center"
                    onPress={() => handleRemoveFromCart(item.id)}
                  >
                    <Minus size={16} color="#71717a" />
                  </TouchableOpacity>
                  <Text className="mx-3 font-semibold">{itemCount}</Text>
                  <TouchableOpacity 
                    className="w-8 h-8 rounded-full bg-primary items-center justify-center"
                    onPress={() => handleAddToCart(item.id)}
                  >
                    <Plus size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  className="px-3 py-1.5 bg-primary rounded-full"
                  onPress={() => handleAddToCart(item.id)}
                >
                  <Text className="text-primary-foreground text-sm font-medium">Thêm</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex-1 bg-background">
        {/* Header với Search và Cart */}
        <View className="bg-background pt-12 pb-4 px-4 border-b border-border">
          <View className="flex-row items-center gap-3 mb-4">
            <View className="flex-1 flex-row items-center bg-muted rounded-lg px-3 py-3">
              <Search size={20} color="#71717a" />
              <Input
                placeholder="Tìm món ăn..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 ml-3 border-0 bg-transparent p-0 text-foreground"
              />
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
          
          <Text className="text-2xl font-bold mb-4">Thực đơn</Text>
        </View>

        {/* Categories */}
        <View className="py-4">
          <FlatList
            data={menuCategories}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderCategoryButton}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />
        </View>

        {/* Menu Items */}
        <ScrollView className="flex-1 px-4">
          <FlatList
            data={filteredItems}
            renderItem={renderMenuItem}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View className="h-2" />}
          />
          
          {filteredItems.length === 0 && (
            <View className="flex-1 items-center justify-center py-16">
              <UtensilsCrossed size={64} color="#71717a" />
              <Text className="text-lg font-semibold mt-4 mb-2">Không tìm thấy món ăn</Text>
              <Text className="text-muted-foreground text-center">
                Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác
              </Text>
            </View>
          )}
          
          <View className="h-20" />
        </ScrollView>

        {/* Cart Floating Button */}
        {cartItemCount > 0 && (
          <View className="absolute bottom-6 left-4 right-4">
            <TouchableOpacity 
              className="bg-primary rounded-xl p-4 flex-row items-center justify-between"
              onPress={handleCartPress}
            >
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-primary-foreground rounded-full items-center justify-center mr-3">
                  <Text className="text-primary font-bold">{cartItemCount}</Text>
                </View>
                <Text className="text-primary-foreground font-semibold">Xem giỏ hàng</Text>
              </View>
              <Text className="text-primary-foreground font-bold">
                {Object.entries(cartItems).reduce((total, [itemId, count]) => {
                  const item = menuItems.find(item => item.id === itemId);
                  return total + (item ? item.price * count : 0);
                }, 0).toLocaleString('vi-VN')}₫
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
}
