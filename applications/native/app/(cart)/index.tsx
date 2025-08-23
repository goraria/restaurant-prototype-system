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
  Plus, 
  Minus,
  Trash2,
  MapPin,
  Clock,
  Truck,
  Tag
} from 'lucide-react-native';

export default function CartScreen() {
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'Bò bít tết',
      price: 289000,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500',
      restaurant: 'Waddles Restaurant',
      note: ''
    },
    {
      id: '2',
      name: 'Cá hồi nướng',
      price: 319000,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500',
      restaurant: 'Waddles Restaurant',
      note: 'Không ớt'
    }
  ]);

  const [promoCode, setPromoCode] = useState('');

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } else {
      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const updateNote = (itemId: string, note: string) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, note }
          : item
      )
    );
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 15000;
  const discount = 0;
  const total = subtotal + deliveryFee - discount;

  const renderCartItem = ({ item }: { item: typeof cartItems[0] }) => (
    <Card className="mb-4 overflow-hidden">
      <View className="flex-row p-4">
        <Image 
          source={{ uri: item.image }}
          className="w-16 h-16 rounded-lg"
          resizeMode="cover"
        />
        
        <View className="flex-1 ml-3">
          <Text className="font-bold text-base text-foreground mb-1">
            {item.name}
          </Text>
          
          <Text className="text-sm text-muted-foreground mb-2">
            {item.restaurant}
          </Text>
          
          <Text className="font-bold text-lg text-primary mb-2">
            {item.price.toLocaleString('vi-VN')}đ
          </Text>
          
          {/* Quantity Controls */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Pressable 
                onPress={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 bg-muted rounded-full items-center justify-center"
              >
                <Minus size={16} className="text-foreground" />
              </Pressable>
              
              <Text className="mx-3 font-medium text-base">
                {item.quantity}
              </Text>
              
              <Pressable 
                onPress={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 bg-primary rounded-full items-center justify-center"
              >
                <Plus size={16} className="text-primary-foreground" />
              </Pressable>
            </View>
            
            <Pressable 
              onPress={() => updateQuantity(item.id, 0)}
              className="w-8 h-8 items-center justify-center"
            >
              <Trash2 size={16} className="text-destructive" />
            </Pressable>
          </View>
          
          {/* Note Input */}
          <Input
            placeholder="Ghi chú cho món này..."
            value={item.note}
            onChangeText={(text) => updateNote(item.id, text)}
            className="mt-3"
            multiline
          />
        </View>
      </View>
    </Card>
  );

  if (cartItems.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
        <Header 
          title="Giỏ hàng"
          showBack
          onBack={() => router.back()}
        />
        
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-2xl font-bold text-foreground mb-2">
            Giỏ hàng trống
          </Text>
          <Text className="text-muted-foreground text-center mb-6">
            Hãy thêm món ăn yêu thích vào giỏ hàng
          </Text>
          
          <Button 
            onPress={() => router.push('/(tabs)/menu' as any)}
            className="w-full"
          >
            <Text className="text-primary-foreground font-semibold">
              Khám phá thực đơn
            </Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <Header 
        title="Giỏ hàng"
        showBack
        onBack={() => router.back()}
      />
      
      <ScrollView className="flex-1">
        {/* Restaurant Info */}
        <View className="p-4 border-b border-border">
          <View className="flex-row items-center">
            <MapPin size={16} className="text-muted-foreground mr-2" />
            <Text className="font-medium text-foreground">
              Waddles Restaurant
            </Text>
          </View>
          
          <View className="flex-row items-center mt-1">
            <Clock size={14} className="text-muted-foreground mr-1" />
            <Text className="text-sm text-muted-foreground mr-4">
              15-25 phút
            </Text>
            <Truck size={14} className="text-muted-foreground mr-1" />
            <Text className="text-sm text-muted-foreground">
              Phí giao hàng: {deliveryFee.toLocaleString('vi-VN')}đ
            </Text>
          </View>
        </View>

        {/* Cart Items */}
        <View className="p-4">
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Promo Code */}
        <View className="px-4 pb-4">
          <Card className="p-4">
            <View className="flex-row items-center mb-3">
              <Tag size={16} className="text-primary mr-2" />
              <Text className="font-medium text-foreground">
                Mã khuyến mãi
              </Text>
            </View>
            
            <View className="flex-row">
              <Input
                placeholder="Nhập mã khuyến mãi"
                value={promoCode}
                onChangeText={setPromoCode}
                className="flex-1 mr-3"
              />
              <Button variant="outline">
                <Text className="text-primary font-medium">Áp dụng</Text>
              </Button>
            </View>
          </Card>
        </View>

        {/* Order Summary */}
        <View className="px-4 pb-4">
          <Card className="p-4">
            <Text className="font-bold text-lg text-foreground mb-3">
              Chi tiết đơn hàng
            </Text>
            
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Tạm tính</Text>
                <Text className="text-foreground">
                  {subtotal.toLocaleString('vi-VN')}đ
                </Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Phí giao hàng</Text>
                <Text className="text-foreground">
                  {deliveryFee.toLocaleString('vi-VN')}đ
                </Text>
              </View>
              
              {discount > 0 && (
                <View className="flex-row justify-between">
                  <Text className="text-muted-foreground">Giảm giá</Text>
                  <Text className="text-green-600">
                    -{discount.toLocaleString('vi-VN')}đ
                  </Text>
                </View>
              )}
              
              <View className="h-px bg-border my-2" />
              
              <View className="flex-row justify-between">
                <Text className="font-bold text-lg text-foreground">Tổng cộng</Text>
                <Text className="font-bold text-lg text-primary">
                  {total.toLocaleString('vi-VN')}đ
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View className="p-4 border-t border-border bg-background">
        <Button 
          onPress={() => router.push('/(cart)/checkout' as any)}
          className="w-full"
        >
          <Text className="text-primary-foreground font-semibold text-lg">
            Thanh toán • {total.toLocaleString('vi-VN')}đ
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
