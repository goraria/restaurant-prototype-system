import React, { useState } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Gift, 
  Clock, 
  Star, 
  Users, 
  Calendar,
  Percent,
  Tag,
  ArrowRight
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function PromotionsScreen() {
  const [activeTab, setActiveTab] = useState('all');

  const promotions = [
    {
      id: 1,
      title: 'Giảm 50% - Món mới',
      subtitle: 'Áp dụng cho tất cả món ăn mới',
      discount: '50%',
      validUntil: '31/12/2024',
      minOrder: 200000,
      maxDiscount: 100000,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
      category: 'food',
      isActive: true,
      usageCount: 156,
      description: 'Giảm giá 50% cho tất cả món ăn mới trong menu. Áp dụng cho đơn hàng từ 200.000đ.'
    },
    {
      id: 2,
      title: 'Miễn phí ship',
      subtitle: 'Đơn từ 300k',
      discount: 'Freeship',
      validUntil: '15/03/2024',
      minOrder: 300000,
      maxDiscount: 50000,
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
      category: 'delivery',
      isActive: true,
      usageCount: 89,
      description: 'Miễn phí vận chuyển cho đơn hàng từ 300.000đ. Tối đa 50.000đ.'
    },
    {
      id: 3,
      title: 'Tặng đồ uống',
      subtitle: 'Khi đặt món chính',
      discount: 'Free Drink',
      validUntil: '20/02/2024',
      minOrder: 150000,
      maxDiscount: 25000,
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
      category: 'drink',
      isActive: false,
      usageCount: 234,
      description: 'Tặng đồ uống miễn phí khi đặt món chính từ 150.000đ.'
    }
  ];

  const vouchers = [
    {
      id: 1,
      code: 'WELCOME50',
      title: 'Giảm 50k cho khách mới',
      discount: '50.000đ',
      minOrder: 200000,
      validUntil: '28/02/2024',
      isUsed: false
    },
    {
      id: 2,
      code: 'LOYAL20',
      title: 'Giảm 20% cho khách thân thiết',
      discount: '20%',
      minOrder: 100000,
      validUntil: '15/03/2024',
      isUsed: true
    }
  ];

  const filteredPromotions = activeTab === 'all' 
    ? promotions 
    : promotions.filter(p => p.category === activeTab);

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-4 pb-6">
        <Text className="text-2xl font-bold text-foreground mb-4">Khuyến mãi</Text>
        
        {/* Quick Stats */}
        <View className="flex-row space-x-4 mb-6">
          <Card className="flex-1 p-4">
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary">3</Text>
              <Text className="text-sm text-muted-foreground">Khuyến mãi</Text>
            </View>
          </Card>
          
          <Card className="flex-1 p-4">
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">2</Text>
              <Text className="text-sm text-muted-foreground">Mã giảm giá</Text>
            </View>
          </Card>
        </View>
      </View>

      {/* Tabs */}
      <View className="px-6 mb-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          items={[
            { value: 'all', label: 'Tất cả' },
            { value: 'food', label: 'Món ăn' },
            { value: 'delivery', label: 'Vận chuyển' },
            { value: 'drink', label: 'Đồ uống' }
          ]}
        />
      </View>

      {/* Promotions */}
      <ScrollView className="flex-1 px-6">
        <View className="space-y-4">
          {filteredPromotions.map((promotion) => (
            <Card key={promotion.id} className="p-4">
              <View className="flex-row">
                <Image
                  source={{ uri: promotion.image }}
                  className="w-20 h-20 rounded-lg mr-4"
                />
                <View className="flex-1">
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                      <Text className="font-semibold text-foreground text-lg">
                        {promotion.title}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        {promotion.subtitle}
                      </Text>
                    </View>
                    <Badge className={promotion.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {promotion.isActive ? 'Đang diễn ra' : 'Đã kết thúc'}
                    </Badge>
                  </View>

                  <View className="space-y-2 mb-3">
                    <View className="flex-row items-center">
                      <Percent className="w-4 h-4 text-primary mr-2" />
                      <Text className="text-sm text-foreground">
                        Giảm: <Text className="font-semibold text-primary">{promotion.discount}</Text>
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Calendar className="w-4 h-4 text-muted-foreground mr-2" />
                      <Text className="text-sm text-muted-foreground">
                        Hạn sử dụng: {promotion.validUntil}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Tag className="w-4 h-4 text-muted-foreground mr-2" />
                      <Text className="text-sm text-muted-foreground">
                        Đơn tối thiểu: {promotion.minOrder.toLocaleString()}đ
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                      <Users className="w-4 h-4 text-muted-foreground mr-1" />
                      <Text className="text-xs text-muted-foreground">
                        {promotion.usageCount} người đã sử dụng
                      </Text>
                    </View>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onPress={() => router.push(`../(promotions)/detail/${promotion.id}`)}
                    >
                      <Text className="text-xs">Chi tiết</Text>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Vouchers Section */}
        <View className="mt-8 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-foreground">Mã giảm giá</Text>
            <Button variant="ghost" onPress={() => router.push('../(promotions)/vouchers')}>
              <Text className="text-primary">Xem tất cả</Text>
            </Button>
          </View>
          
          <View className="space-y-3">
            {vouchers.map((voucher) => (
              <Card key={voucher.id} className="p-4">
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <Text className="font-bold text-foreground text-lg mr-2">
                        {voucher.code}
                      </Text>
                      <Badge className={voucher.isUsed ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}>
                        {voucher.isUsed ? 'Đã sử dụng' : 'Có thể sử dụng'}
                      </Badge>
                    </View>
                    <Text className="text-sm text-muted-foreground mb-1">
                      {voucher.title}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      Giảm {voucher.discount} • Đơn tối thiểu {voucher.minOrder.toLocaleString()}đ
                    </Text>
                  </View>
                  <Button 
                    variant={voucher.isUsed ? "outline" : "default"}
                    size="sm"
                    disabled={voucher.isUsed}
                  >
                    <Text className={voucher.isUsed ? "text-muted-foreground" : "text-white"}>
                      {voucher.isUsed ? 'Đã dùng' : 'Sử dụng'}
                    </Text>
                  </Button>
                </View>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
