import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  CheckCircle, 
  Clock, 
  MapPin,
  Smartphone,
  Receipt,
  ArrowRight,
  Star,
  MessageCircle
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function PurchaseScreen() {
  const [paymentStatus, setPaymentStatus] = useState('processing'); // processing, success, failed

  useEffect(() => {
    // Simulate payment processing
    const timer = setTimeout(() => {
      setPaymentStatus('success');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const orderDetails = {
    orderId: 'DH001234',
    restaurant: 'Nhà Hàng Hương Việt',
    total: 235000,
    items: ['Phở bò đặc biệt (x2)', 'Gỏi cuốn tôm thịt (x1)'],
    deliveryTime: '30-45 phút',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    paymentMethod: 'Thẻ tín dụng **** 1234'
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (paymentStatus) {
      case 'processing':
        return 'Đang xử lý';
      case 'success':
        return 'Thành công';
      case 'failed':
        return 'Thất bại';
      default:
        return 'Không xác định';
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'processing':
        return <Clock className="w-16 h-16 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'failed':
        return <CheckCircle className="w-16 h-16 text-red-500" />;
      default:
        return <Clock className="w-16 h-16 text-gray-500" />;
    }
  };

  if (paymentStatus === 'processing') {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <Card className="mx-4 mt-4 mb-4">
          <CardContent className="p-8 items-center">
            <Clock className="w-16 h-16 text-yellow-500 mb-4" />
            <CardTitle className="text-xl mb-2 text-center">Đang xử lý thanh toán</CardTitle>
            <CardDescription className="text-center">
              Vui lòng chờ trong giây lát...
            </CardDescription>
          </CardContent>
        </Card>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Status Card */}
      <Card className="mx-4 mt-4 mb-4">
        <CardContent className="p-8 items-center">
          {getStatusIcon()}
          <CardTitle className="text-xl mb-2 mt-4 text-center">
            {paymentStatus === 'success' ? 'Thanh toán thành công!' : 'Thanh toán thất bại!'}
          </CardTitle>
          <CardDescription className="text-center mb-4">
            {paymentStatus === 'success' 
              ? 'Đơn hàng của bạn đã được xác nhận'
              : 'Có lỗi xảy ra trong quá trình thanh toán'
            }
          </CardDescription>
          <Badge variant={paymentStatus === 'success' ? 'default' : 'destructive'}>
            <Text className="text-xs font-medium">{getStatusText()}</Text>
          </Badge>
        </CardContent>
      </Card>

      <ScrollView className="flex-1 px-4">
        {/* Order Info Card */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Thông tin đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Mã đơn hàng</Text>
                <Text className="font-semibold text-foreground">{orderDetails.orderId}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Nhà hàng</Text>
                <Text className="text-foreground flex-1 text-right" numberOfLines={1}>
                  {orderDetails.restaurant}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Tổng tiền</Text>
                <Text className="font-bold text-primary">
                  {orderDetails.total.toLocaleString()}đ
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Delivery Info Card */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Thông tin giao hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="space-y-3">
              <View className="flex-row items-start">
                <MapPin className="w-4 h-4 text-muted-foreground mr-2 mt-0.5" />
                <View className="flex-1">
                  <Text className="text-sm text-foreground">{orderDetails.address}</Text>
                </View>
              </View>
              <View className="flex-row items-center">
                <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                <Text className="text-sm text-foreground">
                  Dự kiến giao trong {orderDetails.deliveryTime}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Payment Method Card */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Phương thức thanh toán</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="flex-row items-center">
              <Smartphone className="w-4 h-4 text-muted-foreground mr-2" />
              <Text className="text-sm text-foreground">{orderDetails.paymentMethod}</Text>
            </View>
          </CardContent>
        </Card>

        {/* Order Items Card */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Món ăn đã đặt</CardTitle>
          </CardHeader>
          <CardContent>
            {orderDetails.items.map((item, index) => (
              <Text key={index} className="text-sm text-foreground mb-1 last:mb-0">
                • {item}
              </Text>
            ))}
          </CardContent>
        </Card>

        {paymentStatus === 'success' && (
          <>
            {/* Actions Card */}
            <Card className="mb-4">
              <CardContent className="p-4">
                <View className="space-y-2">
                  <Button 
                    variant="outline"
                    className="w-full"
                    onPress={() => router.push('/(account)/history' as any)}
                  >
                    <Receipt className="mr-2 h-4 w-4" />
                    <Text>Xem lịch sử đơn hàng</Text>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full"
                    onPress={() => router.push('/(account)/chat' as any)}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    <Text>Liên hệ nhà hàng</Text>
                  </Button>
                </View>
              </CardContent>
            </Card>

            {/* Rating Card */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Đánh giá trải nghiệm</CardTitle>
                <CardDescription>
                  Hãy cho chúng tôi biết cảm nhận của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <View className="flex-row justify-center space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-8 h-8 text-gray-300" />
                  ))}
                </View>
                <Button variant="outline" className="w-full">
                  <Text>Đánh giá sau</Text>
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </ScrollView>

      {/* Fixed Bottom Button */}
      <Card className="mx-4 mb-4">
        <CardContent className="p-4">
          <Button 
            size="lg" 
            className="w-full"
            onPress={() => router.push('/(tabs)' as any)}
          >
            <Text className="text-white font-semibold">
              {paymentStatus === 'success' ? 'Về trang chủ' : 'Thử lại'}
            </Text>
            <ArrowRight className="ml-2 h-4 w-4 text-white" />
          </Button>
        </CardContent>
      </Card>
    </SafeAreaView>
  );
}
