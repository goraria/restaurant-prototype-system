import React, { useState } from "react";
import { View, ScrollView, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart,
  Clock,
  UtensilsCrossed,
  ChevronRight,
  AlertCircle
} from "lucide-react-native";

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
    <SafeAreaView className="flex-1 bg-background">
      {/* Header Card */}
      <Card className="mx-4 mt-4 mb-4">
        <CardHeader>
          <View className="flex-row items-center">
            <TouchableOpacity 
              className="p-2 rounded-md mr-3"
              onPress={() => router.back()}
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </TouchableOpacity>
            <CardTitle className="text-xl">Giỏ hàng</CardTitle>
          </View>
        </CardHeader>
      </Card>

      {cartItems.length > 0 ? (
        <>
          {/* Estimated Time Card */}
          <Card className="mx-4 mb-4">
            <CardContent className="p-4">
              <View className="flex-row items-center justify-center">
                <Clock className="w-5 h-5 text-orange-500 mr-2" />
                <Text className="text-center text-orange-600 font-medium">
                  Thời gian chuẩn bị: {estimatedCookingTime} phút
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* Cart Items */}
          <ScrollView className="flex-1 px-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="mb-4">
                <CardContent className="p-4">
                  <View className="flex-row">
                    <Image
                      source={{ uri: item.image }}
                      className="w-20 h-20 rounded-lg mr-4"
                      resizeMode="cover"
                    />
                    
                    <View className="flex-1">
                      <View className="flex-row justify-between items-start mb-2">
                        <Text className="text-lg font-semibold flex-1" numberOfLines={1}>
                          {item.name}
                        </Text>
                        <TouchableOpacity
                          onPress={() => removeItem(item.id)}
                          className="p-1"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </TouchableOpacity>
                      </View>

                      <Text className="text-sm text-muted-foreground mb-2">
                        {item.category} • {item.cookingTime} phút
                      </Text>

                      {item.specialRequests && (
                        <Text className="text-xs text-blue-600 mb-2">
                          Ghi chú: {item.specialRequests}
                        </Text>
                      )}

                      <View className="flex-row justify-between items-center">
                        <Text className="text-lg font-bold text-primary">
                          {item.price.toLocaleString()}đ
                        </Text>
                        
                        <View className="flex-row items-center bg-muted rounded-lg">
                          <TouchableOpacity
                            onPress={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2"
                          >
                            <Minus className="w-4 h-4 text-foreground" />
                          </TouchableOpacity>
                          <Text className="px-4 font-semibold">{item.quantity}</Text>
                          <TouchableOpacity
                            onPress={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2"
                          >
                            <Plus className="w-4 h-4 text-foreground" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </ScrollView>

          {/* Order Summary Card */}
          <Card className="mx-4 mb-4">
            <CardHeader>
              <CardTitle className="text-lg">Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="space-y-2">
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
                <View className="border-t border-border pt-2">
                  <View className="flex-row justify-between">
                    <Text className="text-lg font-semibold text-foreground">Tổng cộng:</Text>
                    <Text className="text-lg font-semibold text-primary">
                      {total.toLocaleString()}đ
                    </Text>
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Checkout Button Card */}
          <Card className="mx-4 mb-4">
            <CardContent className="p-4">
              <Button 
                size="lg"
                className="w-full"
                onPress={() => router.push("/(payments)/checkout")}
              >
                <ShoppingCart className="w-5 h-5 mr-2 text-white" />
                <Text className="text-white font-semibold">
                  Thanh toán {total.toLocaleString()}đ
                </Text>
                <ChevronRight className="w-5 h-5 ml-2 text-white" />
              </Button>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="mx-4 mb-4">
          <CardContent className="p-8 items-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
            <CardTitle className="text-xl mb-2">Giỏ hàng trống</CardTitle>
            <Text className="text-muted-foreground text-center mb-6">
              Bạn chưa có món ăn nào trong giỏ hàng. Hãy thêm món ăn từ menu!
            </Text>
            <Button 
              size="lg"
              onPress={() => router.push("/(tabs)/menu")}
            >
              <Text className="text-white font-semibold">Xem menu</Text>
            </Button>
          </CardContent>
        </Card>
      )}
    </SafeAreaView>
  );
}
