import React, { useState } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      {/* Header */}
      <View className="px-6 pt-4 pb-6">
        <Text className="text-2xl font-bold text-foreground mb-4">Lịch sử</Text>
        
        {/* Quick Stats */}
        <View className="flex-row space-x-4 mb-6">
          <Card className="flex-1 p-4">
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary">{reservations.length}</Text>
              <Text className="text-sm text-muted-foreground">Đặt bàn</Text>
            </View>
          </Card>
          
          <Card className="flex-1 p-4">
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">{orders.length}</Text>
              <Text className="text-sm text-muted-foreground">Đơn hàng</Text>
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
            { value: 'reservations', label: 'Đặt bàn' },
            { value: 'orders', label: 'Đơn hàng' }
          ]}
        />
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6">
        {activeTab === 'reservations' && (
          <View className="space-y-4">
            {reservations.map((reservation) => (
              <Card key={reservation.id} className="p-4">
                <View className="flex-row">
                  <Image
                    source={{ uri: reservation.image }}
                    className="w-20 h-20 rounded-lg mr-4"
                  />
                  <View className="flex-1">
                    <View className="flex-row justify-between items-start mb-2">
                      <Text className="font-semibold text-foreground text-lg">
                        {reservation.restaurant}
                      </Text>
                      <Badge className={getStatusColor(reservation.status)}>
                        {getStatusText(reservation.status)}
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
                      <View className="flex-row space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onPress={() => router.push(`/(history)/reservation/${reservation.id}`)}
                        >
                          <Text className="text-xs">Chi tiết</Text>
                        </Button>
                        {reservation.status === 'completed' && !reservation.rating && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onPress={() => router.push(`/(history)/review/${reservation.id}`)}
                          >
                            <Text className="text-xs">Đánh giá</Text>
                          </Button>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        {activeTab === 'orders' && (
          <View className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-4">
                <View className="flex-row">
                  <Image
                    source={{ uri: order.image }}
                    className="w-20 h-20 rounded-lg mr-4"
                  />
                  <View className="flex-1">
                    <View className="flex-row justify-between items-start mb-2">
                      <Text className="font-semibold text-foreground text-lg">
                        {order.restaurant}
                      </Text>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </View>

                    <View className="space-y-1 mb-3">
                      <View className="flex-row items-center">
                        <Calendar className="w-4 h-4 text-muted-foreground mr-2" />
                        <Text className="text-sm text-muted-foreground">
                          {order.date}
                        </Text>
                      </View>
                      <Text className="text-sm text-muted-foreground">
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
                      <View className="flex-row space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onPress={() => router.push(`/(history)/order/${order.id}`)}
                        >
                          <Text className="text-xs">Chi tiết</Text>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onPress={() => router.push(`/(history)/reorder/${order.id}`)}
                        >
                          <Text className="text-xs">Đặt lại</Text>
                        </Button>
                      </View>
                    </View>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
