import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Search,
  Filter,
  Star,
  Clock,
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  ChefHat
} from 'lucide-react-native';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage' | 'soup' | 'salad';
  image: string;
  rating: number;
  reviewCount: number;
  isVegetarian: boolean;
  isSpicy: boolean;
  cookingTime: number;
}

export default function MenuScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<{[key: string]: number}>({});

  const menuItems: MenuItem[] = [
    {
      id: "1",
      name: "Phở Bò Đặc Biệt",
      description: "Phở bò truyền thống với thịt bò tái, chín, gầu, nước dùng trong suốt được ninh từ xương bò trong 24 giờ",
      price: 89000,
      category: "main",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300",
      rating: 4.8,
      reviewCount: 324,
      isVegetarian: false,
      isSpicy: false,
      cookingTime: 15
    },
    {
      id: "2",
      name: "Gỏi Cuốn Tôm Thịt",
      description: "Gỏi cuốn tươi mát với tôm luộc, thịt heo luộc, bún tươi, rau thơm, cuốn trong bánh tráng mỏng",
      price: 45000,
      category: "appetizer",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300",
      rating: 4.7,
      reviewCount: 156,
      isVegetarian: false,
      isSpicy: false,
      cookingTime: 10
    },
    {
      id: "3",
      name: "Bánh Mì Thịt Nướng",
      description: "Bánh mì giòn rụm với thịt nướng thơm lừng, pate, rau sống và các loại gia vị đặc trưng",
      price: 35000,
      category: "main",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300",
      rating: 4.6,
      reviewCount: 89,
      isVegetarian: false,
      isSpicy: true,
      cookingTime: 8
    },
    {
      id: "4",
      name: "Cà Phê Sữa Đá",
      description: "Cà phê phin truyền thống pha với sữa đặc, thưởng thức cùng đá lạnh",
      price: 25000,
      category: "beverage",
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300",
      rating: 4.9,
      reviewCount: 567,
      isVegetarian: true,
      isSpicy: false,
      cookingTime: 5
    }
  ];

  const categories = [
    { id: 'all', name: 'Tất cả', icon: ChefHat },
    { id: 'appetizer', name: 'Khai vị', icon: Heart },
    { id: 'main', name: 'Món chính', icon: ShoppingCart },
    { id: 'beverage', name: 'Đồ uống', icon: Star },
    { id: 'dessert', name: 'Tráng miệng', icon: Plus }
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header Card */}
      <Card className="mx-4 mt-4 mb-4">
        <CardHeader>
          <View className="flex-row items-center justify-between">
            <CardTitle className="text-2xl">Thực đơn</CardTitle>
            <TouchableOpacity 
              className="relative"
              onPress={() => router.push('/(restaurant)/cart' as any)}
            >
              <ShoppingCart className="w-6 h-6 text-foreground" />
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 min-w-[20px] h-5 bg-primary">
                  <Text className="text-xs text-white font-bold">{getTotalItems()}</Text>
                </Badge>
              )}
            </TouchableOpacity>
          </View>
          <CardDescription>Khám phá những món ăn đặc sắc của chúng tôi</CardDescription>
        </CardHeader>
      </Card>

      {/* Search Card */}
      <Card className="mx-4 mb-4">
        <CardContent className="p-4">
          <View className="flex-row space-x-2">
            <View className="flex-1 relative">
              <Input
                placeholder="Tìm kiếm món ăn..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                className="pl-10"
              />
              <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-3" />
            </View>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </View>
        </CardContent>
      </Card>

      {/* Categories Card */}
      <Card className="mx-4 mb-4">
        <CardContent className="p-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-2">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedCategory === category.id 
                      ? 'bg-primary' 
                      : 'bg-muted'
                  }`}
                >
                  <Text className={`font-medium ${
                    selectedCategory === category.id 
                      ? 'text-white' 
                      : 'text-muted-foreground'
                  }`}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </CardContent>
      </Card>

      {/* Menu Items */}
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {filteredItems.map((item) => (
          <Card key={item.id} className="mb-4">
            <CardContent className="p-4">
              <View className="flex-row">
                <Image
                  source={{ uri: item.image }}
                  className="w-24 h-24 rounded-lg mr-4"
                  resizeMode="cover"
                />
                
                <View className="flex-1">
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-1 mr-2">
                      <Text className="font-semibold text-lg text-foreground" numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text className="text-sm text-muted-foreground" numberOfLines={2}>
                        {item.description}
                      </Text>
                    </View>
                    <TouchableOpacity>
                      <Heart className="w-5 h-5 text-muted-foreground" />
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row items-center mb-2">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <Text className="text-sm text-foreground mr-3">
                      {item.rating} ({item.reviewCount})
                    </Text>
                    <Clock className="w-4 h-4 text-muted-foreground mr-1" />
                    <Text className="text-sm text-muted-foreground">
                      {item.cookingTime} phút
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <Text className="text-lg font-bold text-primary">
                      {item.price.toLocaleString()}đ
                    </Text>

                    {cart[item.id] ? (
                      <View className="flex-row items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onPress={() => removeFromCart(item.id)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Text className="font-semibold text-foreground min-w-[20px] text-center">
                          {cart[item.id]}
                        </Text>
                        <Button
                          size="sm"
                          onPress={() => addToCart(item.id)}
                        >
                          <Plus className="w-4 h-4 text-white" />
                        </Button>
                      </View>
                    ) : (
                      <Button
                        size="sm"
                        onPress={() => addToCart(item.id)}
                      >
                        <Plus className="w-4 h-4 mr-1 text-white" />
                        <Text className="text-white">Thêm</Text>
                      </Button>
                    )}
                  </View>

                  {/* Badges */}
                  <View className="flex-row space-x-2 mt-2">
                    {item.isVegetarian && (
                      <Badge variant="secondary">
                        <Text className="text-xs">Chay</Text>
                      </Badge>
                    )}
                    {item.isSpicy && (
                      <Badge variant="destructive">
                        <Text className="text-xs">Cay</Text>
                      </Badge>
                    )}
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>
        ))}
      </ScrollView>

      {/* Fixed Cart Button */}
      {getTotalItems() > 0 && (
        <Card className="mx-4 mb-4">
          <CardContent className="p-4">
            <Button 
              size="lg" 
              className="w-full"
              onPress={() => router.push('/(restaurant)/cart' as any)}
            >
              <ShoppingCart className="w-5 h-5 mr-2 text-white" />
              <Text className="text-white font-semibold">
                Giỏ hàng ({getTotalItems()}) • Xem chi tiết
              </Text>
            </Button>
          </CardContent>
        </Card>
      )}
    </SafeAreaView>
  );
}
