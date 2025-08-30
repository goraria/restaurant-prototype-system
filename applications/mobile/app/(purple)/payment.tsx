import React, { useState } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { RadioGroup } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  CreditCard, 
  Wallet, 
  Smartphone,
  Lock,
  Shield,
  CheckCircle,
  ChevronRight
} from 'lucide-react-native';

export default function PaymentScreen() {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [saveCard, setSaveCard] = useState(false);

  const paymentMethods = [
    {
      id: 'card',
      title: 'Thẻ tín dụng/ghi nợ',
      icon: CreditCard,
      description: 'Visa, Mastercard, JCB'
    },
    {
      id: 'momo',
      title: 'Ví MoMo',
      icon: Wallet,
      description: 'Thanh toán qua ví điện tử'
    },
    {
      id: 'zalopay',
      title: 'ZaloPay',
      icon: Smartphone,
      description: 'Thanh toán qua ZaloPay'
    }
  ];

  const orderSummary = {
    service: 'Khám bệnh',
    petName: 'Lucky',
    date: '15/02/2024',
    time: '14:00',
    subtotal: 500000,
    discount: 50000,
    total: 450000
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <View className="flex-row items-center mb-4">
            <Button variant="ghost" className="w-10 h-10 p-0 mr-3">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Text className="text-2xl font-bold text-foreground">Thanh toán</Text>
          </View>
        </View>

        {/* Order Summary */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-4">Thông tin đơn hàng</Text>
          <Card className="p-4">
            <View className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Dịch vụ:</Text>
                <Text className="font-semibold text-foreground">{orderSummary.service}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Thú cưng:</Text>
                <Text className="font-semibold text-foreground">{orderSummary.petName}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Ngày:</Text>
                <Text className="font-semibold text-foreground">{orderSummary.date}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Giờ:</Text>
                <Text className="font-semibold text-foreground">{orderSummary.time}</Text>
              </View>
              <View className="border-t pt-3">
                <View className="flex-row justify-between">
                  <Text className="text-muted-foreground">Tạm tính:</Text>
                  <Text className="font-semibold text-foreground">{orderSummary.subtotal.toLocaleString()}đ</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-muted-foreground">Giảm giá:</Text>
                  <Text className="font-semibold text-green-600">-{orderSummary.discount.toLocaleString()}đ</Text>
                </View>
                <View className="flex-row justify-between pt-2 border-t">
                  <Text className="text-lg font-bold text-foreground">Tổng cộng:</Text>
                  <Text className="text-lg font-bold text-primary">{orderSummary.total.toLocaleString()}đ</Text>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Payment Methods */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-4">Phương thức thanh toán</Text>
          <RadioGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            className="space-y-3"
          >
            {paymentMethods.map((method) => (
              <Card key={method.id} className="p-4">
                <View className="flex-row items-center">
                  <RadioGroup.Item value={method.id} className="mr-3" />
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <method.icon className="w-6 h-6 text-primary mr-3" />
                      <View className="flex-1">
                        <Text className="font-semibold text-foreground">{method.title}</Text>
                        <Text className="text-sm text-muted-foreground">{method.description}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Card>
            ))}
          </RadioGroup>
        </View>

        {/* Card Details */}
        {paymentMethod === 'card' && (
          <View className="px-6 mb-6">
            <Text className="text-lg font-bold text-foreground mb-4">Thông tin thẻ</Text>
            <Card className="p-4">
              <View className="space-y-4">
                <View>
                  <Label className="mb-2">Số thẻ</Label>
                  <Input
                    placeholder="1234 5678 9012 3456"
                    keyboardType="numeric"
                    maxLength={19}
                  />
                </View>
                
                <View className="flex-row space-x-4">
                  <View className="flex-1">
                    <Label className="mb-2">Ngày hết hạn</Label>
                    <Input
                      placeholder="MM/YY"
                      keyboardType="numeric"
                      maxLength={5}
                    />
                  </View>
                  <View className="flex-1">
                    <Label className="mb-2">CVV</Label>
                    <Input
                      placeholder="123"
                      keyboardType="numeric"
                      maxLength={4}
                      secureTextEntry
                    />
                  </View>
                </View>
                
                <View>
                  <Label className="mb-2">Tên chủ thẻ</Label>
                  <Input
                    placeholder="NGUYEN VAN A"
                  />
                </View>
                
                <View className="flex-row items-center">
                  <Checkbox
                    checked={saveCard}
                    onCheckedChange={setSaveCard}
                    className="mr-3"
                  />
                  <Text className="text-sm text-muted-foreground">Lưu thông tin thẻ cho lần sau</Text>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* Security Info */}
        <View className="px-6 mb-6">
          <Card className="p-4 bg-green-50 border-green-200">
            <View className="flex-row items-start">
              <Shield className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
              <View className="flex-1">
                <Text className="font-semibold text-foreground mb-1">Thanh toán an toàn</Text>
                <Text className="text-sm text-muted-foreground">
                  Thông tin của bạn được mã hóa và bảo vệ bởi SSL. Chúng tôi không lưu trữ thông tin thẻ của bạn.
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Terms */}
        <View className="px-6 mb-6">
          <View className="flex-row items-start">
            <Checkbox className="mr-3 mt-1" />
            <Text className="text-sm text-muted-foreground flex-1">
              Tôi đồng ý với{' '}
              <Text className="text-primary font-semibold">Điều khoản thanh toán</Text>
              {' '}và{' '}
              <Text className="text-primary font-semibold">Chính sách bảo mật</Text>
            </Text>
          </View>
        </View>

        {/* Payment Button */}
        <View className="px-6 pb-8">
          <Button size="lg">
            <Lock className="w-5 h-5 mr-2 text-white" />
            <Text className="text-white font-semibold">Thanh toán {orderSummary.total.toLocaleString()}đ</Text>
            <ChevronRight className="w-5 h-5 ml-2 text-white" />
          </Button>
          
          <View className="mt-4 flex-row justify-center">
            <Text className="text-sm text-muted-foreground">
              Bằng cách tiếp tục, bạn đồng ý với các điều khoản của chúng tôi
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
