import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
            <CardTitle className="text-xl">Thanh toán</CardTitle>
          </View>
        </CardHeader>
      </Card>

      <ScrollView className="flex-1 px-4">
        {/* Order Summary Card */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Tóm tắt đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
          </CardContent>
        </Card>

        {/* Payment Methods Card */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Phương thức thanh toán</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {paymentMethods.map((method) => (
              <TouchableOpacity 
                key={method.id}
                onPress={() => setSelectedMethod(method.id)}
              >
                <Card className={`${selectedMethod === method.id ? 'border-primary' : ''}`}>
                  <CardContent className="p-4">
                    <View className="flex-row items-center">
                      <View className={`w-12 h-12 ${method.color} rounded-full items-center justify-center mr-4`}>
                        <method.icon className="w-6 h-6" />
                      </View>
                      <View className="flex-1">
                        <Text className="font-semibold text-foreground">{method.title}</Text>
                        <Text className="text-sm text-muted-foreground">{method.subtitle}</Text>
                      </View>
                      <View className={`px-3 py-1.5 rounded-md ${selectedMethod === method.id ? 'bg-primary' : 'bg-muted'}`}>
                        <View className="flex-row items-center">
                          {selectedMethod === method.id && <CheckCircle className="w-4 h-4 mr-1 text-white" />}
                          <Text className={selectedMethod === method.id ? "text-white" : "text-foreground"}>
                            {selectedMethod === method.id ? 'Đã chọn' : 'Chọn'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              </TouchableOpacity>
            ))}
          </CardContent>
        </Card>

        {/* Card Details (if card selected) */}
        {selectedMethod === 'card' && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg">Thông tin thẻ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">Số thẻ</Text>
                <Input 
                  placeholder="1234 5678 9012 3456"
                  className="border border-border"
                />
              </View>
              
              <View className="flex-row">
                <View className="flex-1 mr-2">
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
            </CardContent>
          </Card>
        )}

        {/* Security Info Card */}
        <Card className="mb-4 bg-green-50">
          <CardContent className="p-4">
            <View className="flex-row items-center">
              <Shield className="w-5 h-5 text-green-600 mr-3" />
              <View className="flex-1">
                <Text className="font-semibold text-green-800">Thanh toán an toàn</Text>
                <Text className="text-sm text-green-700">
                  Thông tin của bạn được mã hóa và bảo vệ bởi SSL
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Payment Button Card */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <Button 
              size="lg"
              className="w-full"
              onPress={() => router.push('/(payments)/checkout')}
            >
              <Lock className="w-5 h-5 mr-2 text-white" />
              <Text className="text-white font-semibold text-lg">
                Thanh toán {orderSummary.total.toLocaleString()}đ
              </Text>
            </Button>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
