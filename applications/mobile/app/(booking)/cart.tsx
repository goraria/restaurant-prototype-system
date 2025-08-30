import React, { use, useState } from "react";
import { View, ScrollView, Image } from "react-native";
import { router, useRouter } from "expo-router";
import Stack from "expo-router/stack";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart,
  Clock,
  UtensilsCrossed,
  ChevronRight,
  AlertCircle,
  Pill
} from "lucide-react-native";
import { Separator } from "@/components/ui/separator";
import { CartItem } from '@/components/element/menu-item';

export default function CartScreen() {
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      name: "Phở Bò Đặc Biệt",
      price: 89000,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
      category: "Món chính",
      cookingTime: 15,
      specialRequests: "Không hành, thêm rau"
    },
    {
      id: "2",
      name: "Gỏi Cuốn Tôm Thịt",
      price: 45000,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
      category: "Khai vị",
      cookingTime: 10,
      specialRequests: null
    },
    {
      id: "3",
      name: "Cà Phê Sữa Đá",
      price: 25000,
      quantity: 3,
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
      category: "Đồ uống",
      cookingTime: 5,
      specialRequests: "Ít đường"
    },
    {
      id: "4",
      name: "Cà Phê Sữa Đá",
      price: 25000,
      quantity: 3,
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
      category: "Đồ uống",
      cookingTime: 5,
      specialRequests: "Ít đường"
    }
  ]);

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: quantity } : item
      ));
    }
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const serviceFee = Math.round(subtotal * 0.05); // 5% service fee
  const total = subtotal + serviceFee;

  const estimatedCookingTime = Math.max(...cartItems.map(item => item.cookingTime));

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <View className="bg-background pt-16 pb-4 px-4 border-b border-border">
              <View className="flex-row items-center justify-between gap-3">
                <Button
                  onPress={() => useRouter().back()}
                  size="icon"
                  variant="ghost"
                  className="rounded-full p-4"
                >
                  <Icon
                    as={ArrowLeft}
                    className="size-6"
                  />
                </Button>
                <View className="flex-1 justify-center items-center">
                  <Text className="text-lg font-semibold">Giỏ hàng</Text>
                </View>
                <Button
                  onPress={() => {
                  }}
                  size="icon"
                  variant="ghost"
                  className="rounded-full p-4"
                >
                  <Icon
                    as={Pill}
                    className="size-6"
                  />
                </Button>
              </View>
            </View>
          )
        }}
      />

      {cartItems.length > 0 ? (
        <>
          {/* Cart Items */}
          <ScrollView className="flex-1 px-4">
            <View className="gap-4 py-4">
              {cartItems.map((item, index) => (
                <CartItem
                  key={index}
                  item={item}
                  update={updateQuantity}
                  remove={removeItem}
                />
              ))}
            </View>
          </ScrollView>

          {/* Order Summary */}
          <View className="px-4 pt-4 pb-10 border-t border-border bg-background">
            <Card className="p-4 mb-4">
              <View className="gap-2">
                <View className="">
                  <Text className="text-lg font-semibold text-foreground">Tóm tắt đơn hàng</Text>
                </View>
                <View className="">
                  <View className="flex-row justify-between">
                    <Text className="text-muted-foreground">Tạm tính:</Text>
                    <Text className="font-medium text-foreground">
                      {subtotal.toLocaleString()}đ
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-muted-foreground">Phí dịch vụ (5%):</Text>
                    <Text className="font-medium text-foreground">
                      {serviceFee.toLocaleString()}đ
                    </Text>
                  </View>
                </View>
                <Separator />
                <View className="">
                  <View className="flex-row justify-between">
                    <Text className="text-lg font-semibold text-foreground">Tổng cộng:</Text>
                    <Text className="text-lg font-semibold text-primary">
                      {total.toLocaleString()}đ
                    </Text>
                  </View>
                </View>
              </View>
            </Card>

            {/* Checkout Button */}
            <Button 
              size="lg"
              className="w-full"
              onPress={() => router.push("../(payments)/checkout")}
            >
              <ShoppingCart className="w-5 h-5 mr-2 text-white" />
              <Text className="text-white font-semibold">
                Thanh toán {total.toLocaleString()}đ
              </Text>
              <ChevronRight className="w-5 h-5 ml-2 text-white" />
            </Button>
          </View>
        </>
      ) : (
        /* Empty Cart */
        <View className="flex-1 px-6 justify-center items-center">
          <Card className="p-8 items-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
            <Text className="text-xl font-bold text-foreground mb-2">Giỏ hàng trống</Text>
            <Text className="text-muted-foreground text-center mb-6">
              Bạn chưa có món ăn nào trong giỏ hàng. Hãy thêm món ăn từ menu!
            </Text>
            <Button 
              size="lg"
              onPress={() => router.push("/(tabs)/menu")}
            >
              <Text className="text-white font-semibold">Xem menu</Text>
            </Button>
          </Card>
        </View>
      )}
    </>
  );
}
