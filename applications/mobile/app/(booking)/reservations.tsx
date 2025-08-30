import React, { useState } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Star,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Search,
  Filter
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function ReservationsScreen() {
  const [activeTab, setActiveTab] = useState('upcoming');

  const reservations = [
    {
      id: 1,
      restaurantName: 'Nhà Hàng Hương Việt',
      date: '15/02/2024',
      time: '19:00',
      partySize: 4,
      status: 'confirmed',
      tableNumber: 'A12',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      restaurantImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
      specialRequests: 'Bàn gần cửa sổ'
    },
    {
      id: 2,
      restaurantName: 'Sushi Tokyo',
      date: '20/02/2024',
      time: '18:30',
      partySize: 2,
      status: 'pending',
      tableNumber: null,
      address: '456 Lê Lợi, Quận 3, TP.HCM',
      restaurantImage: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
      specialRequests: null
    },
    {
      id: 3,
      restaurantName: 'Pizza Italia',
      date: '10/02/2024',
      time: '20:00',
      partySize: 6,
      status: 'completed',
      tableNumber: 'B8',
      address: '789 Đồng Khởi, Quận 1, TP.HCM',
      restaurantImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
      specialRequests: 'Bàn tròn'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const filteredReservations = activeTab === 'all' 
    ? reservations 
    : reservations.filter(r => {
        if (activeTab === 'upcoming') return r.status === 'confirmed' || r.status === 'pending';
        if (activeTab === 'completed') return r.status === 'completed';
        if (activeTab === 'cancelled') return r.status === 'cancelled';
        return true;
      });

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-4 pb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-foreground">Đặt bàn</Text>
          <View className="flex-row space-x-2">
            <Button variant="ghost" size="sm">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="flex-row space-x-4 mb-6">
          <Card className="flex-1 p-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
                <Calendar className="w-5 h-5 text-primary" />
              </View>
              <View>
                <Text className="text-2xl font-bold text-foreground">5</Text>
                <Text className="text-sm text-muted-foreground">Đặt bàn</Text>
              </View>
            </View>
          </Card>
          
          <Card className="flex-1 p-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </View>
              <View>
                <Text className="text-2xl font-bold text-foreground">3</Text>
                <Text className="text-sm text-muted-foreground">Đã xác nhận</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Create New Reservation Button */}
        <Button 
          size="lg" 
          className="mb-6"
          onPress={() => router.push('/(reservations)/create')}
        >
          <Plus className="w-5 h-5 mr-2 text-white" />
          <Text className="text-white font-semibold">Đặt bàn mới</Text>
        </Button>
      </View>

      {/* Tabs */}
      <View className="px-6 mb-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          items={[
            { value: 'upcoming', label: 'Sắp tới' },
            { value: 'completed', label: 'Hoàn thành' },
            { value: 'cancelled', label: 'Đã hủy' }
          ]}
        />
      </View>

      {/* Reservations List */}
      <ScrollView className="flex-1 px-6">
        {filteredReservations.length > 0 ? (
          <View className="space-y-4">
            {filteredReservations.map((reservation) => (
              <Card key={reservation.id} className="p-4">
                <View className="flex-row">
                  <Image
                    source={{ uri: reservation.restaurantImage }}
                    className="w-20 h-20 rounded-lg mr-4"
                  />
                  <View className="flex-1">
                    <View className="flex-row justify-between items-start mb-2">
                      <Text className="font-semibold text-foreground text-lg">
                        {reservation.restaurantName}
                      </Text>
                      <Badge className={getStatusColor(reservation.status)}>
                        {getStatusText(reservation.status)}
                      </Badge>
                    </View>

                    <View className="space-y-2 mb-3">
                      <View className="flex-row items-center">
                        <Calendar className="w-4 h-4 text-muted-foreground mr-2" />
                        <Text className="text-sm text-foreground">{reservation.date}</Text>
                      </View>
                      <View className="flex-row items-center">
                        <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                        <Text className="text-sm text-foreground">{reservation.time}</Text>
                      </View>
                      <View className="flex-row items-center">
                        <Users className="w-4 h-4 text-muted-foreground mr-2" />
                        <Text className="text-sm text-foreground">{reservation.partySize} người</Text>
                      </View>
                      {reservation.tableNumber && (
                        <View className="flex-row items-center">
                          <MapPin className="w-4 h-4 text-muted-foreground mr-2" />
                          <Text className="text-sm text-foreground">Bàn {reservation.tableNumber}</Text>
                        </View>
                      )}
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onPress={() => router.push(`/(reservations)/detail/${reservation.id}`)}
                      >
                        <Text className="text-xs">Chi tiết</Text>
                      </Button>
                      {reservation.status === 'pending' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                        >
                          <Text className="text-xs">Hủy</Text>
                        </Button>
                      )}
                      {reservation.status === 'confirmed' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                        >
                          <Text className="text-xs">Chỉnh sửa</Text>
                        </Button>
                      )}
                    </View>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        ) : (
          <Card className="p-8 items-center">
            <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
            <Text className="text-lg font-semibold text-foreground mb-2">
              {activeTab === 'upcoming' ? 'Không có đặt bàn sắp tới' : 'Không có đặt bàn'}
            </Text>
            <Text className="text-muted-foreground text-center mb-4">
              {activeTab === 'upcoming' 
                ? 'Bạn chưa có đặt bàn nào sắp tới. Hãy đặt bàn mới!'
                : 'Các đặt bàn sẽ xuất hiện ở đây'
              }
            </Text>
            {activeTab === 'upcoming' && (
              <Button onPress={() => router.push('/(reservations)/create')}>
                <Text className="text-white font-semibold">Đặt bàn ngay</Text>
              </Button>
            )}
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
