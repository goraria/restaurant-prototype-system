import React, { useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Clock, 
  Star, 
  Calendar,
  MapPin,
  Users,
  MessageCircle,
  ArrowRight,
  CheckCircle,
  XCircle
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState('reservations');

  const reservations = [
    {
      id: 1,
      restaurant: 'Nhà Hàng Hương Việt',
      date: '15/02/2024',
      time: '19:00',
      people: 4,
      status: 'completed',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400'
    },
    {
      id: 2,
      restaurant: 'Nhà Hàng Hương Việt',
      date: '10/02/2024',
      time: '18:30',
      people: 2,
      status: 'cancelled',
      rating: null,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400'
    }
  ];

  const orders = [
    {
      id: 1,
      restaurant: 'Nhà Hàng Hương Việt',
      date: '15/02/2024',
      items: ['Phở bò', 'Gỏi cuốn', 'Cà phê sữa đá'],
      total: 180000,
      status: 'completed',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400'
    },
    {
      id: 2,
      restaurant: 'Nhà Hàng Hương Việt',
      date: '08/02/2024',
      items: ['Bún chả', 'Nước mía'],
      total: 120000,
      status: 'completed',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400'
    }
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      case 'upcoming':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      case 'upcoming':
        return 'Sắp tới';
      default:
        return 'Không xác định';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header Card */}
      <Card className="mx-4 mt-4 mb-4">
        <CardHeader>
          <CardTitle className="text-2xl">Lịch sử</CardTitle>
        </CardHeader>
      </Card>

      {/* Quick Stats Cards */}
      <View className="flex-row px-4 mb-4">
        <Card className="flex-1 mr-2">
          <CardContent className="p-4 items-center">
            <Text className="text-2xl font-bold text-primary">{reservations.length}</Text>
            <Text className="text-sm text-muted-foreground">Đặt bàn</Text>
          </CardContent>
        </Card>
        
        <Card className="flex-1">
          <CardContent className="p-4 items-center">
            <Text className="text-2xl font-bold text-green-600">{orders.length}</Text>
            <Text className="text-sm text-muted-foreground">Đơn hàng</Text>
          </CardContent>
        </Card>
      </View>

      {/* Tabs Card */}
      <Card className="mx-4 mb-4">
        <CardContent className="p-4">
          <View className="flex-row bg-muted rounded-lg p-1">
            <TouchableOpacity 
              className={`flex-1 py-3 px-4 rounded-md ${activeTab === 'reservations' ? 'bg-background shadow-sm' : ''}`}
              onPress={() => setActiveTab('reservations')}
            >
              <Text className={`text-center font-medium ${activeTab === 'reservations' ? 'text-foreground' : 'text-muted-foreground'}`}>
                Đặt bàn
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className={`flex-1 py-3 px-4 rounded-md ${activeTab === 'orders' ? 'bg-background shadow-sm' : ''}`}
              onPress={() => setActiveTab('orders')}
            >
              <Text className={`text-center font-medium ${activeTab === 'orders' ? 'text-foreground' : 'text-muted-foreground'}`}>
                Đơn hàng
              </Text>
            </TouchableOpacity>
          </View>
        </CardContent>
      </Card>

      {/* Content */}
      <ScrollView className="flex-1 px-4">
        {activeTab === 'reservations' && (
          <View>
            {reservations.map((reservation) => (
              <Card key={reservation.id} className="mb-4">
                <CardContent className="p-4">
                  <View className="flex-row">
                    <Image
                      source={{ uri: reservation.image }}
                      className="w-20 h-20 rounded-lg mr-4"
                      resizeMode="cover"
                    />
                    <View className="flex-1">
                      <View className="flex-row justify-between items-start mb-2">
                        <Text className="font-semibold text-foreground text-lg flex-1" numberOfLines={1}>
                          {reservation.restaurant}
                        </Text>
                        <Badge variant={getStatusVariant(reservation.status)}>
                          <Text className="text-xs font-medium">{getStatusText(reservation.status)}</Text>
                        </Badge>
                      </View>

                      <View className="space-y-1 mb-3">
                        <View className="flex-row items-center">
                          <Calendar className="w-4 h-4 text-muted-foreground mr-2" />
                          <Text className="text-sm text-muted-foreground">
                            {reservation.date} lúc {reservation.time}
                          </Text>
                        </View>
                        <View className="flex-row items-center">
                          <Users className="w-4 h-4 text-muted-foreground mr-2" />
                          <Text className="text-sm text-muted-foreground">
                            {reservation.people} người
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row justify-between items-center">
                        {reservation.rating && (
                          <View className="flex-row items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <Text className="text-sm font-semibold">{reservation.rating}/5</Text>
                          </View>
                        )}
                        <View className="flex-row gap-2">
                          <Button
                            variant="outline" 
                            size="sm"
                            onPress={() => router.push('/(booking)/reservations')}
                          >
                            <Text className="text-xs">Chi tiết</Text>
                          </Button>
                          {reservation.status === 'completed' && !reservation.rating && (
                            <Button
                              variant="outline"
                              size="sm"
                              onPress={() => router.push('/(account)/chat')}
                            >
                              <Text className="text-xs">Đánh giá</Text>
                            </Button>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        )}

        {activeTab === 'orders' && (
          <View>
            {orders.map((order) => (
              <Card key={order.id} className="mb-4">
                <CardContent className="p-4">
                  <View className="flex-row">
                    <Image
                      source={{ uri: order.image }}
                      className="w-20 h-20 rounded-lg mr-4"
                      resizeMode="cover"
                    />
                    <View className="flex-1">
                      <View className="flex-row justify-between items-start mb-2">
                        <Text className="font-semibold text-foreground text-lg flex-1" numberOfLines={1}>
                          {order.restaurant}
                        </Text>
                        <Badge variant={getStatusVariant(order.status)}>
                          <Text className="text-xs font-medium">{getStatusText(order.status)}</Text>
                        </Badge>
                      </View>

                      <View className="space-y-1 mb-3">
                        <View className="flex-row items-center">
                          <Calendar className="w-4 h-4 text-muted-foreground mr-2" />
                          <Text className="text-sm text-muted-foreground">
                            {order.date}
                          </Text>
                        </View>
                        <Text className="text-sm text-muted-foreground" numberOfLines={2}>
                          {order.items.join(', ')}
                        </Text>
                        <Text className="font-semibold text-foreground">
                          {order.total.toLocaleString()}đ
                        </Text>
                      </View>

                      <View className="flex-row justify-between items-center">
                        {order.rating && (
                          <View className="flex-row items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <Text className="text-sm font-semibold">{order.rating}/5</Text>
                          </View>
                        )}
                        <View className="flex-row gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onPress={() => router.push('/(booking)/food')}
                          >
                            <Text className="text-xs">Chi tiết</Text>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onPress={() => router.push('/(booking)/cart')}
                          >
                            <Text className="text-xs">Đặt lại</Text>
                          </Button>
                        </View>
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
