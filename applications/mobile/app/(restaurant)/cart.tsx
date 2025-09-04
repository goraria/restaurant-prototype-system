import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { HeaderStack } from '@/components/layout/header';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  MapPin,
  Clock,
  CreditCard,
  Gift,
  Tag,
  ShoppingBag,
  Receipt
} from 'lucide-react-native';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  specialInstructions?: string;
}

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Phở Bò Đặc Biệt",
      price: 89000,
      image: "🍜",
      quantity: 2,
      specialInstructions: "Ít hành, thêm rau thơm"
    },
    {
      id: "2", 
      name: "Gỏi Cuốn Tôm Thịt",
      price: 45000,
      image: "🥗",
      quantity: 1
    },
    {
      id: "4",
      name: "Cà Phê Sữa Đá",
      price: 25000,
      image: "☕",
      quantity: 3
    }
  ]);

  const [deliveryInfo, setDeliveryInfo] = useState({
    address: "208 Main St, Hai Bà Trưng, Hà Nội",
    deliveryTime: "30-45 phút",
    deliveryFee: 20000
  });

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + deliveryInfo.deliveryFee - discount;

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <Card className="mb-3 mx-4">
      <CardContent className="p-4">
        <View className="flex-row">
          {/* Image */}
          <View className="w-16 h-16 bg-muted rounded-lg items-center justify-center mr-3">
            <Text className="text-2xl">{item.image}</Text>
          </View>

          {/* Content */}
          <View className="flex-1">
            {/* Name and Remove */}
            <View className="flex-row items-start justify-between mb-2">
              <Text className="font-semibold flex-1 mr-2" numberOfLines={2}>{item.name}</Text>
              <TouchableOpacity onPress={() => removeItem(item.id)} className="p-1">
                <Trash2 size={16} color="#f87171" />
              </TouchableOpacity>
            </View>

            {/* Special Instructions */}
            {item.specialInstructions && (
              <Text className="text-xs text-muted-foreground mb-2 italic">
                Ghi chú: {item.specialInstructions}
              </Text>
            )}

            {/* Price and Quantity */}
            <View className="flex-row items-center justify-between">
              <Text className="font-semibold text-primary">
                {item.price.toLocaleString('vi-VN')}đ
              </Text>
              
              <View className="flex-row items-center bg-muted rounded-full px-1">
                <TouchableOpacity 
                  onPress={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-2"
                >
                  <Minus size={14} color="#666" />
                </TouchableOpacity>
                <Text className="mx-3 font-semibold min-w-[20px] text-center">{item.quantity}</Text>
                <TouchableOpacity 
                  onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-2"
                >
                  <Plus size={14} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </CardContent>
    </Card>
  );

  if (cartItems.length === 0) {
    return (
      <>
        <HeaderStack
          position="left"
          iconLeft={ArrowLeft}
          iconLeftAction={() => router.back()}
          title="Giỏ hàng"
        />
        <View className="flex-1 items-center justify-center bg-background px-6">
          <Icon as={ShoppingBag} size={64} color="#ccc" />
          <Text className="text-xl font-semibold mt-4 mb-2">Giỏ hàng trống</Text>
          <Text className="text-muted-foreground text-center mb-6">
            Hãy thêm một số món ăn ngon vào giỏ hàng của bạn
          </Text>
          <TouchableOpacity onPress={() => router.push('/(restaurant)/menu')} className="px-8 py-3 bg-primary rounded-lg">
            <Text className="text-white font-medium text-center">Xem thực đơn</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <>
      <HeaderStack
        position="left"
        iconLeft={ArrowLeft}
        iconLeftAction={() => router.back()}
        title="Giỏ hàng"
      />

      <ScrollView className="flex-1 bg-background">
        {/* Cart Items */}
        <View className="pt-4">
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Delivery Info */}
        <Card className="mx-4 my-4">
          <CardContent className="p-4">
            <View className="flex-row items-center mb-3">
              <Icon as={MapPin} size={20} color="#EC6683" />
              <Text className="font-semibold ml-2">Thông tin giao hàng</Text>
            </View>
            
            <Text className="text-sm mb-2">{deliveryInfo.address}</Text>
            
            <View className="flex-row items-center">
              <Icon as={Clock} size={16} color="#666" />
              <Text className="text-sm text-muted-foreground ml-1">
                Thời gian giao: {deliveryInfo.deliveryTime}
              </Text>
            </View>

            <TouchableOpacity className="mt-3">
              <Text className="text-primary text-sm font-medium">Thay đổi địa chỉ</Text>
            </TouchableOpacity>
          </CardContent>
        </Card>

        {/* Promo Code */}
        <Card className="mx-4 mb-4">
          <CardContent className="p-4">
            <View className="flex-row items-center mb-3">
              <Icon as={Tag} size={20} color="#EC6683" />
              <Text className="font-semibold ml-2">Mã khuyến mãi</Text>
            </View>
            
            <View className="flex-row">
              <View className="flex-1 mr-3 border border-border rounded-lg px-3 py-2">
                <Text className="text-sm text-muted-foreground">
                  {promoCode || "Nhập mã khuyến mãi"}
                </Text>
              </View>
              <TouchableOpacity className="px-4 py-2 border border-border rounded-lg">
                <Text className="text-primary font-medium">Áp dụng</Text>
              </TouchableOpacity>
            </View>

            {discount > 0 && (
              <View className="mt-3 p-3 bg-green-50 rounded-lg">
                <Text className="text-green-800 text-sm font-medium">
                  🎉 Đã áp dụng mã giảm giá -{discount.toLocaleString('vi-VN')}đ
                </Text>
              </View>
            )}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="mx-4 mb-4">
          <CardContent className="p-4">
            <View className="flex-row items-center mb-3">
              <Icon as={Receipt} size={20} color="#EC6683" />
              <Text className="font-semibold ml-2">Chi tiết đơn hàng</Text>
            </View>

            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Tạm tính ({cartItems.length} món)</Text>
                <Text>{subtotal.toLocaleString('vi-VN')}đ</Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Phí giao hàng</Text>
                <Text>{deliveryInfo.deliveryFee.toLocaleString('vi-VN')}đ</Text>
              </View>

              {discount > 0 && (
                <View className="flex-row justify-between">
                  <Text className="text-green-600">Giảm giá</Text>
                  <Text className="text-green-600">-{discount.toLocaleString('vi-VN')}đ</Text>
                </View>
              )}

              <View className="border-t border-border pt-2 mt-2">
                <View className="flex-row justify-between">
                  <Text className="font-semibold text-lg">Tổng cộng</Text>
                  <Text className="font-bold text-lg text-primary">
                    {total.toLocaleString('vi-VN')}đ
                  </Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="mx-4 mb-6">
          <CardContent className="p-4">
            <View className="flex-row items-center mb-3">
              <Icon as={CreditCard} size={20} color="#EC6683" />
              <Text className="font-semibold ml-2">Phương thức thanh toán</Text>
            </View>

            <View className="space-y-3">
              {[
                { id: 'cash', name: 'Tiền mặt', icon: '💵' },
                { id: 'card', name: 'Thẻ tín dụng/ghi nợ', icon: '💳' },
                { id: 'banking', name: 'Chuyển khoản ngân hàng', icon: '🏦' },
                { id: 'momo', name: 'MoMo', icon: '📱' },
                { id: 'zalopay', name: 'ZaloPay', icon: '💙' }
              ].map((method, index) => (
                <TouchableOpacity key={method.id} className="flex-row items-center p-3 border border-border rounded-lg">
                  <Text className="text-xl mr-3">{method.icon}</Text>
                  <Text className="flex-1">{method.name}</Text>
                  <View className="w-4 h-4 border-2 border-primary rounded-full" />
                </TouchableOpacity>
              ))}
            </View>
          </CardContent>
        </Card>

        <View className="h-24" />
      </ScrollView>

      {/* Bottom Action */}
      <View className="bg-background border-t border-border p-4">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-lg font-bold text-primary">
              {total.toLocaleString('vi-VN')}đ
            </Text>
            <Text className="text-xs text-muted-foreground">
              Giao trong {deliveryInfo.deliveryTime}
            </Text>
          </View>
          
          <TouchableOpacity 
            onPress={() => router.push('/(booking)/create-reservation')}
            className="px-8 py-3 bg-primary rounded-lg"
          >
            <Text className="text-white font-semibold text-center">Đặt hàng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
