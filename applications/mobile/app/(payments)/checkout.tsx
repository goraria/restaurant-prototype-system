import React, { useState } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  CreditCard, 
  Wallet, 
  Smartphone,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  Edit,
  Plus
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function CheckoutScreen() {
  const [selectedPayment, setSelectedPayment] = useState('card');

  const orderItems = [
    {
      id: 1,
      name: 'Phở bò đặc biệt',
      quantity: 2,
      price: 85000,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200'
    },
    {
      id: 2,
      name: 'Gỏi cuốn tôm thịt',
      quantity: 1,
      price: 45000,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200'
    }
  ];

  const paymentMethods = [
    {
      id: 'card',
      name: 'Thẻ tín dụng/ghi nợ',
      icon: CreditCard,
      description: '**** 1234'
    },
    {
      id: 'momo',
      name: 'Ví MoMo',
      icon: Smartphone,
      description: '0987654321'
    },
    {
      id: 'cash',
      name: 'Tiền mặt',
      icon: Wallet,
      description: 'Thanh toán khi nhận hàng'
    }
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 20000;
  const discount = 15000;
  const total = subtotal + deliveryFee - discount;

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header Card */}
      <Card className="mx-4 mt-4 mb-4">
        <CardHeader>
          <CardTitle className="text-2xl">Thanh toán</CardTitle>
          <CardDescription>Xác nhận đơn hàng và thanh toán</CardDescription>
        </CardHeader>
      </Card>

      <ScrollView className="flex-1 px-4">
        {/* Delivery Info Card */}
        <Card className="mb-4">
          <CardHeader>
            <View className="flex-row items-center justify-between">
              <CardTitle className="text-lg">Thông tin giao hàng</CardTitle>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </View>
          </CardHeader>
          <CardContent>
            <View className="space-y-2">
              <View className="flex-row items-center">
                <MapPin className="w-4 h-4 text-muted-foreground mr-2" />
                <Text className="text-sm text-foreground">123 Nguyễn Huệ, Quận 1, TP.HCM</Text>
              </View>
              <View className="flex-row items-center">
                <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                <Text className="text-sm text-foreground">Giao trong 30-45 phút</Text>
              </View>
              <View className="flex-row items-center">
                <Users className="w-4 h-4 text-muted-foreground mr-2" />
                <Text className="text-sm text-foreground">Nguyễn Văn A - 0987654321</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Order Items Card */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Món ăn đã chọn</CardTitle>
          </CardHeader>
          <CardContent>
            {orderItems.map((item) => (
              <View key={item.id} className="flex-row items-center mb-4 last:mb-0">
                <Image
                  source={{ uri: item.image }}
                  className="w-16 h-16 rounded-lg mr-4"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <Text className="font-semibold text-foreground" numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    Số lượng: {item.quantity}
                  </Text>
                  <Text className="font-medium text-foreground">
                    {(item.price * item.quantity).toLocaleString()}đ
                  </Text>
                </View>
              </View>
            ))}
          </CardContent>
        </Card>

        {/* Payment Method Card */}
        <Card className="mb-4">
          <CardHeader>
            <View className="flex-row items-center justify-between">
              <CardTitle className="text-lg">Phương thức thanh toán</CardTitle>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </View>
          </CardHeader>
          <CardContent>
            {paymentMethods.map((method) => (
              <View
                key={method.id}
                className={`flex-row items-center p-4 rounded-lg mb-2 last:mb-0 border ${
                  selectedPayment === method.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border bg-background'
                }`}
              >
                <method.icon className={`w-6 h-6 mr-4 ${
                  selectedPayment === method.id ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <View className="flex-1">
                  <Text className={`font-medium ${
                    selectedPayment === method.id ? 'text-primary' : 'text-foreground'
                  }`}>
                    {method.name}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    {method.description}
                  </Text>
                </View>
                {selectedPayment === method.id && (
                  <CheckCircle className="w-5 h-5 text-primary" />
                )}
              </View>
            ))}
          </CardContent>
        </Card>

        {/* Order Summary Card */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Tổng kết đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Tạm tính</Text>
                <Text className="text-foreground">{subtotal.toLocaleString()}đ</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Phí giao hàng</Text>
                <Text className="text-foreground">{deliveryFee.toLocaleString()}đ</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Giảm giá</Text>
                <Text className="text-green-600">-{discount.toLocaleString()}đ</Text>
              </View>
              <View className="border-t border-border pt-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-lg font-bold text-foreground">Tổng cộng</Text>
                  <Text className="text-lg font-bold text-primary">{total.toLocaleString()}đ</Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Promo Code Card */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <View className="flex-row space-x-2">
              <Input
                placeholder="Mã giảm giá"
                className="flex-1"
              />
              <Button variant="outline">
                <Text>Áp dụng</Text>
              </Button>
            </View>
          </CardContent>
        </Card>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <Card className="mx-4 mb-4">
        <CardContent className="p-4">
          <Button 
            size="lg" 
            className="w-full"
            onPress={() => router.push('/(payments)/purchase' as any)}
          >
            <Text className="text-white font-semibold">
              Thanh toán {total.toLocaleString()}đ
            </Text>
          </Button>
        </CardContent>
      </Card>
    </SafeAreaView>
  );
}