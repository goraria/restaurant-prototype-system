import React, { useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Gift, 
  Clock, 
  Star, 
  Users, 
  Calendar,
  Percent,
  Tag,
  ArrowRight,
  Copy,
  CheckCircle2
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
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 mb-4">
          <Card>
            <CardContent className="px-4 py-6">
              <Text className="text-3xl font-bold text-foreground mb-2">Khuyến mãi</Text>
              <Text className="text-muted-foreground">Tiết kiệm hơn với các ưu đãi đặc biệt</Text>
            </CardContent>
          </Card>
        </View>
        
        {/* Quick Stats */}
        <View className="px-4 mb-4">
          <View className="flex-row space-x-2">
            <Card className="flex-1">
              <CardContent className="px-4 py-4 items-center">
                <Gift className="w-6 h-6 text-primary mb-2" />
                <Text className="text-lg font-bold text-foreground">8</Text>
                <Text className="text-xs text-muted-foreground">Khuyến mãi</Text>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent className="px-4 py-4 items-center">
                <Percent className="w-6 h-6 text-green-500 mb-2" />
                <Text className="text-lg font-bold text-foreground">2</Text>
                <Text className="text-xs text-muted-foreground">Voucher</Text>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent className="px-4 py-4 items-center">
                <Users className="w-6 h-6 text-blue-500 mb-2" />
                <Text className="text-lg font-bold text-foreground">479</Text>
                <Text className="text-xs text-muted-foreground">Đã dùng</Text>
              </CardContent>
            </Card>
          </View>
        </View>

        {/* Tabs */}
        <View className="px-4 mb-4">
          <Card>
            <CardContent className="px-4 py-3">
              <View className="flex-row bg-muted rounded-lg p-1">
                {[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'food', label: 'Món ăn' },
                  { value: 'delivery', label: 'Ship' },
                  { value: 'drink', label: 'Đồ uống' }
                ].map((tab) => (
                  <TouchableOpacity
                    key={tab.value}
                    className={`flex-1 py-2 rounded-md ${activeTab === tab.value ? 'bg-background shadow-sm' : ''}`}
                    onPress={() => setActiveTab(tab.value)}
                  >
                    <Text className={`text-center font-medium text-sm ${
                      activeTab === tab.value ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Promotions */}
        <View className="px-4 mb-4">
          {filteredPromotions.map((promotion) => (
            <TouchableOpacity 
              key={promotion.id}
              className="mb-4"
              onPress={() => console.log('View promotion details:', promotion.id)}
            >
              <Card className="bg-white dark:bg-card">
                <CardContent className="px-4 py-4">
                  <View className="flex-row">
                    <View className="w-20 h-20 rounded-lg overflow-hidden mr-4">
                      <Image
                        source={{ uri: promotion.image }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    </View>
                    
                    <View className="flex-1">
                      <View className="flex-row justify-between items-start mb-2">
                        <View className="flex-1 mr-2">
                          <Text className="font-semibold text-foreground text-base mb-1">
                            {promotion.title}
                          </Text>
                          <Text className="text-sm text-muted-foreground">
                            {promotion.subtitle}
                          </Text>
                        </View>
                        <Badge variant={promotion.isActive ? 'default' : 'secondary'}>
                          <Text className="text-xs">
                            {promotion.isActive ? 'Đang diễn ra' : 'Đã kết thúc'}
                          </Text>
                        </Badge>
                      </View>

                      <View className="space-y-1 mb-3">
                        <View className="flex-row items-center">
                          <Percent className="w-4 h-4 text-primary mr-2" />
                          <Text className="text-sm text-foreground">
                            Giảm: <Text className="font-semibold text-primary">{promotion.discount}</Text>
                          </Text>
                        </View>
                        <View className="flex-row items-center">
                          <Calendar className="w-4 h-4 text-muted-foreground mr-2" />
                          <Text className="text-sm text-muted-foreground">
                            HSD: {promotion.validUntil}
                          </Text>
                        </View>
                        <View className="flex-row items-center">
                          <Tag className="w-4 h-4 text-muted-foreground mr-2" />
                          <Text className="text-sm text-muted-foreground">
                            Tối thiểu: {promotion.minOrder.toLocaleString()}đ
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center">
                          <Users className="w-4 h-4 text-muted-foreground mr-1" />
                          <Text className="text-xs text-muted-foreground">
                            {promotion.usageCount} người đã dùng
                          </Text>
                        </View>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Vouchers Section */}
        <View className="px-4 mb-4">
          <Card>
            <CardHeader>
              <View className="flex-row justify-between items-center">
                <CardTitle className="text-lg">Mã giảm giá</CardTitle>
                <TouchableOpacity onPress={() => console.log('View all vouchers')}>
                  <Text className="text-primary text-sm">Xem tất cả</Text>
                </TouchableOpacity>
              </View>
            </CardHeader>
            <CardContent className="px-4">
              {vouchers.map((voucher) => (
                <View key={voucher.id} className="mb-4 last:mb-0">
                  <Card className="bg-gradient-to-r from-primary/5 to-blue-500/5 border-dashed border-primary/20">
                    <CardContent className="px-4 py-4">
                      <View className="flex-row justify-between items-center">
                        <View className="flex-1">
                          <View className="flex-row items-center mb-1">
                            <Text className="font-bold text-foreground text-base mr-2">
                              {voucher.code}
                            </Text>
                            {voucher.isUsed ? (
                              <Badge variant="secondary">
                                <Text className="text-xs">Đã sử dụng</Text>
                              </Badge>
                            ) : (
                              <Badge>
                                <Text className="text-xs">Có thể dùng</Text>
                              </Badge>
                            )}
                          </View>
                          
                          <Text className="text-sm text-muted-foreground mb-2">
                            {voucher.title}
                          </Text>
                          
                          <View className="flex-row items-center space-x-4">
                            <View className="flex-row items-center">
                              <Gift className="w-4 h-4 text-primary mr-1" />
                              <Text className="text-sm font-medium text-primary">
                                {voucher.discount}
                              </Text>
                            </View>
                            <View className="flex-row items-center">
                              <Clock className="w-4 h-4 text-muted-foreground mr-1" />
                              <Text className="text-xs text-muted-foreground">
                                {voucher.validUntil}
                              </Text>
                            </View>
                          </View>
                        </View>

                        <TouchableOpacity 
                          className={`px-4 py-2 rounded-lg ${
                            voucher.isUsed ? 'bg-muted' : 'bg-primary'
                          }`}
                          disabled={voucher.isUsed}
                        >
                          {voucher.isUsed ? (
                            <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <Copy className="w-5 h-5 text-white" />
                          )}
                        </TouchableOpacity>
                      </View>
                    </CardContent>
                  </Card>
                </View>
              ))}
            </CardContent>
          </Card>
        </View>

        {/* Footer spacing */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
