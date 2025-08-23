import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Header } from '@/components/layout/Header';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MapPin,
  Clock,
  CreditCard,
  Wallet,
  Smartphone,
  Plus,
  Edit,
  CheckCircle
} from 'lucide-react-native';

export default function CheckoutScreen() {
  const [selectedPayment, setSelectedPayment] = useState('momo');
  const [note, setNote] = useState('');

  const orderSummary = {
    subtotal: 897000,
    deliveryFee: 15000,
    discount: 0,
    total: 912000
  };

  const paymentMethods = [
    {
      id: 'momo',
      name: 'Ví MoMo',
      icon: Smartphone,
      description: '0987654321'
    },
    {
      id: 'zalopay',
      name: 'ZaloPay',
      icon: Wallet,
      description: '0987654321'
    },
    {
      id: 'card',
      name: 'Thẻ tín dụng/ghi nợ',
      icon: CreditCard,
      description: '**** **** **** 1234'
    },
    {
      id: 'cash',
      name: 'Tiền mặt',
      icon: Wallet,
      description: 'Thanh toán khi nhận hàng'
    }
  ];

  const handlePlaceOrder = () => {
    // Navigate to order confirmation or success screen
    router.push('/(orders)/confirmation' as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <Header 
        title="Thanh toán"
        showBack
        onBack={() => router.back()}
      />
      
      <ScrollView className="flex-1">
        {/* Delivery Address */}
        <View className="p-4 border-b border-border">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="font-bold text-lg text-foreground">
              Địa chỉ giao hàng
            </Text>
            <Pressable className="flex-row items-center">
              <Edit size={16} className="text-primary mr-1" />
              <Text className="text-primary">Thay đổi</Text>
            </Pressable>
          </View>
          
          <View className="flex-row items-start">
            <MapPin size={16} className="text-muted-foreground mt-1 mr-2" />
            <View className="flex-1">
              <Text className="font-medium text-foreground mb-1">
                Nhà riêng
              </Text>
              <Text className="text-muted-foreground">
                123 Đường ABC, Phường XYZ, Quận 1, TP.HCM
              </Text>
              <Text className="text-muted-foreground mt-1">
                Nguyễn Văn A • 0987654321
              </Text>
            </View>
          </View>
        </View>

        {/* Delivery Time */}
        <View className="p-4 border-b border-border">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="font-bold text-lg text-foreground">
              Thời gian giao hàng
            </Text>
            <Pressable className="flex-row items-center">
              <Edit size={16} className="text-primary mr-1" />
              <Text className="text-primary">Thay đổi</Text>
            </Pressable>
          </View>
          
          <View className="flex-row items-center">
            <Clock size={16} className="text-muted-foreground mr-2" />
            <Text className="text-foreground">
              Giao ngay (15-25 phút)
            </Text>
          </View>
        </View>

        {/* Payment Method */}
        <View className="p-4 border-b border-border">
          <Text className="font-bold text-lg text-foreground mb-4">
            Phương thức thanh toán
          </Text>
          
          {paymentMethods.map((method) => (
            <Pressable
              key={method.id}
              onPress={() => setSelectedPayment(method.id)}
              className="flex-row items-center justify-between p-3 mb-2 bg-card rounded-lg border border-border"
            >
              <View className="flex-row items-center flex-1">
                <method.icon size={20} className="text-foreground mr-3" />
                <View className="flex-1">
                  <Text className="font-medium text-foreground">
                    {method.name}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    {method.description}
                  </Text>
                </View>
              </View>
              
              <View className={`w-5 h-5 rounded-full border-2 ${
                selectedPayment === method.id 
                  ? 'border-primary bg-primary' 
                  : 'border-muted-foreground'
              } items-center justify-center`}>
                {selectedPayment === method.id && (
                  <CheckCircle size={12} className="text-primary-foreground" />
                )}
              </View>
            </Pressable>
          ))}
          
          <Pressable className="flex-row items-center justify-center p-3 border-2 border-dashed border-muted-foreground rounded-lg">
            <Plus size={16} className="text-muted-foreground mr-2" />
            <Text className="text-muted-foreground">
              Thêm phương thức thanh toán
            </Text>
          </Pressable>
        </View>

        {/* Order Note */}
        <View className="p-4 border-b border-border">
          <Text className="font-bold text-lg text-foreground mb-3">
            Ghi chú đơn hàng
          </Text>
          
          <Input
            placeholder="Ghi chú cho nhà hàng..."
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            className="min-h-20"
          />
        </View>

        {/* Order Summary */}
        <View className="p-4">
          <Card className="p-4">
            <Text className="font-bold text-lg text-foreground mb-3">
              Chi tiết thanh toán
            </Text>
            
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Tạm tính</Text>
                <Text className="text-foreground">
                  {orderSummary.subtotal.toLocaleString('vi-VN')}đ
                </Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Phí giao hàng</Text>
                <Text className="text-foreground">
                  {orderSummary.deliveryFee.toLocaleString('vi-VN')}đ
                </Text>
              </View>
              
              {orderSummary.discount > 0 && (
                <View className="flex-row justify-between">
                  <Text className="text-muted-foreground">Giảm giá</Text>
                  <Text className="text-green-600">
                    -{orderSummary.discount.toLocaleString('vi-VN')}đ
                  </Text>
                </View>
              )}
              
              <View className="h-px bg-border my-2" />
              
              <View className="flex-row justify-between">
                <Text className="font-bold text-lg text-foreground">Tổng cộng</Text>
                <Text className="font-bold text-lg text-primary">
                  {orderSummary.total.toLocaleString('vi-VN')}đ
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Terms */}
        <View className="px-4 pb-4">
          <Text className="text-xs text-muted-foreground text-center">
            Bằng việc đặt hàng, bạn đồng ý với{' '}
            <Text className="text-primary">Điều khoản sử dụng</Text>
            {' '}và{' '}
            <Text className="text-primary">Chính sách bảo mật</Text>
            {' '}của chúng tôi.
          </Text>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View className="p-4 border-t border-border bg-background">
        <Button 
          onPress={handlePlaceOrder}
          className="w-full"
        >
          <Text className="text-primary-foreground font-semibold text-lg">
            Đặt hàng • {orderSummary.total.toLocaleString('vi-VN')}đ
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
