import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  CreditCard, 
  Wallet, 
  QrCode, 
  CheckCircle,
  ArrowLeft,
  Lock,
  Shield
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function PaymentsScreen() {
  const [selectedMethod, setSelectedMethod] = useState('card');

  const paymentMethods = [
    {
      id: 'card',
      title: 'Thẻ tín dụng/ghi nợ',
      subtitle: 'Visa, Mastercard, JCB',
      icon: CreditCard,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'momo',
      title: 'Ví MoMo',
      subtitle: 'Thanh toán nhanh chóng',
      icon: Wallet,
      color: 'bg-pink-100 text-pink-600'
    },
    {
      id: 'zalopay',
      title: 'ZaloPay',
      subtitle: 'Ví điện tử Zalo',
      icon: QrCode,
      color: 'bg-blue-100 text-blue-600'
    }
  ];

  const orderSummary = {
    subtotal: 450000,
    discount: 50000,
    tax: 22500,
    total: 422500
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-4 pb-6">
        <View className="flex-row items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm"
            onPress={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Text className="text-xl font-bold text-foreground ml-2">Thanh toán</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Order Summary */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-4">Tóm tắt đơn hàng</Text>
          <Card className="p-4">
            <View className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Tạm tính:</Text>
                <Text className="font-semibold">{orderSummary.subtotal.toLocaleString()}đ</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Giảm giá:</Text>
                <Text className="font-semibold text-green-600">-{orderSummary.discount.toLocaleString()}đ</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Thuế:</Text>
                <Text className="font-semibold">{orderSummary.tax.toLocaleString()}đ</Text>
              </View>
              <View className="border-t border-border pt-3">
                <View className="flex-row justify-between">
                  <Text className="text-lg font-bold text-foreground">Tổng cộng:</Text>
                  <Text className="text-lg font-bold text-primary">{orderSummary.total.toLocaleString()}đ</Text>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Payment Methods */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-4">Phương thức thanh toán</Text>
          <View className="space-y-3">
            {paymentMethods.map((method) => (
              <Card 
                key={method.id} 
                className={`p-4 ${selectedMethod === method.id ? 'border-primary' : ''}`}
              >
                <View className="flex-row items-center">
                  <View className={`w-12 h-12 ${method.color} rounded-full items-center justify-center mr-4`}>
                    <method.icon className="w-6 h-6" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-foreground">{method.title}</Text>
                    <Text className="text-sm text-muted-foreground">{method.subtitle}</Text>
                  </View>
                  <Button 
                    variant={selectedMethod === method.id ? "default" : "outline"}
                    size="sm"
                    onPress={() => setSelectedMethod(method.id)}
                  >
                    {selectedMethod === method.id && <CheckCircle className="w-4 h-4 mr-1" />}
                    <Text className={selectedMethod === method.id ? "text-white" : ""}>
                      {selectedMethod === method.id ? 'Đã chọn' : 'Chọn'}
                    </Text>
                  </Button>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Card Details (if card selected) */}
        {selectedMethod === 'card' && (
          <View className="mb-6">
            <Text className="text-lg font-bold text-foreground mb-4">Thông tin thẻ</Text>
            <Card className="p-4">
              <View className="space-y-4">
                <View>
                  <Text className="text-sm font-semibold text-foreground mb-2">Số thẻ</Text>
                  <Input 
                    placeholder="1234 5678 9012 3456"
                    className="border border-border"
                  />
                </View>
                
                <View className="flex-row space-x-4">
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-foreground mb-2">Ngày hết hạn</Text>
                    <Input 
                      placeholder="MM/YY"
                      className="border border-border"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-foreground mb-2">CVV</Text>
                    <Input 
                      placeholder="123"
                      className="border border-border"
                    />
                  </View>
                </View>
                
                <View>
                  <Text className="text-sm font-semibold text-foreground mb-2">Tên chủ thẻ</Text>
                  <Input 
                    placeholder="NGUYEN VAN A"
                    className="border border-border"
                  />
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* Security Info */}
        <View className="mb-6">
          <Card className="p-4 bg-green-50">
            <View className="flex-row items-center">
              <Shield className="w-5 h-5 text-green-600 mr-3" />
              <View className="flex-1">
                <Text className="font-semibold text-green-800">Thanh toán an toàn</Text>
                <Text className="text-sm text-green-700">
                  Thông tin của bạn được mã hóa và bảo vệ bởi SSL
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Payment Button */}
        <View className="mb-6">
          <Button 
            size="lg"
            className="w-full"
            onPress={() => router.push('../(payments)/success')}
          >
            <Lock className="w-5 h-5 mr-2 text-white" />
            <Text className="text-white font-semibold">
              Thanh toán {orderSummary.total.toLocaleString()}đ
            </Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
