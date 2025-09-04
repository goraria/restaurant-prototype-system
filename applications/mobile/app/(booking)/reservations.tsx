import React, { useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
      <Card className="mx-4 mt-4 mb-4">
        <CardHeader>
          <View className="flex-row items-center justify-between">
            <CardTitle className="text-2xl">Đặt bàn của tôi</CardTitle>
            <Button 
              size="sm"
              onPress={() => router.push('/(booking)/create-reservation' as any)}
              className="flex-row items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              <Text className="text-white">Đặt bàn</Text>
            </Button>
          </View>
        </CardHeader>
      </Card>

      <ScrollView className="flex-1 px-4">
        {/* Tab Navigation */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <View className="flex-row bg-muted rounded-lg p-1">
              <TouchableOpacity
                className={`flex-1 py-2 rounded-md ${activeTab === 'upcoming' ? 'bg-background shadow-sm' : ''}`}
                onPress={() => setActiveTab('upcoming')}
              >
                <Text className={`text-center text-sm font-medium ${
                  activeTab === 'upcoming' ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  Sắp tới
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-2 rounded-md ${activeTab === 'completed' ? 'bg-background shadow-sm' : ''}`}
                onPress={() => setActiveTab('completed')}
              >
                <Text className={`text-center text-sm font-medium ${
                  activeTab === 'completed' ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  Đã hoàn thành
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-2 rounded-md ${activeTab === 'all' ? 'bg-background shadow-sm' : ''}`}
                onPress={() => setActiveTab('all')}
              >
                <Text className={`text-center text-sm font-medium ${
                  activeTab === 'all' ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  Tất cả
                </Text>
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>

        {/* Reservations List */}
        {filteredReservations.length > 0 ? (
          filteredReservations.map((reservation) => (
            <Card key={reservation.id} className="mb-4">
              <CardContent className="p-4">
                <View className="flex-row">
                  {/* Restaurant Image */}
                  <Image 
                    source={{ uri: reservation.restaurantImage }}
                    className="w-20 h-20 rounded-lg mr-4"
                    resizeMode="cover"
                  />
                  
                  {/* Content */}
                  <View className="flex-1">
                    {/* Header */}
                    <View className="flex-row items-start justify-between mb-2">
                      <Text className="text-lg font-semibold text-foreground flex-1" numberOfLines={1}>
                        {reservation.restaurantName}
                      </Text>
                      <Badge variant={reservation.status === 'confirmed' ? 'default' : reservation.status === 'pending' ? 'secondary' : 'destructive'}>
                        <Text className="text-xs font-medium">
                          {getStatusText(reservation.status)}
                        </Text>
                      </Badge>
                    </View>

                    {/* Info */}
                    <View className="space-y-1 mb-3">
                      <View className="flex-row items-center">
                        <Calendar className="w-4 h-4 text-muted-foreground mr-2" />
                        <Text className="text-sm text-foreground">{reservation.date}</Text>
                        <Clock className="w-4 h-4 text-muted-foreground ml-4 mr-2" />
                        <Text className="text-sm text-foreground">{reservation.time}</Text>
                      </View>
                      <View className="flex-row items-center">
                        <Users className="w-4 h-4 text-muted-foreground mr-2" />
                        <Text className="text-sm text-foreground">{reservation.partySize} người</Text>
                        {reservation.tableNumber && (
                          <>
                            <MapPin className="w-4 h-4 text-muted-foreground ml-4 mr-2" />
                            <Text className="text-sm text-foreground">Bàn {reservation.tableNumber}</Text>
                          </>
                        )}
                      </View>
                    </View>

                    {/* Actions */}
                    <View className="flex-row gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onPress={() => router.push(`/(booking)/reservation-detail?id=${reservation.id}` as any)}
                      >
                        <Text className="text-xs">Chi tiết</Text>
                      </Button>
                      {reservation.status === 'pending' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onPress={() => {
                            // Handle cancel reservation
                            console.log('Cancel reservation:', reservation.id);
                          }}
                        >
                          <Text className="text-xs">Hủy</Text>
                        </Button>
                      )}
                      {reservation.status === 'confirmed' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onPress={() => router.push(`/(booking)/edit-reservation?id=${reservation.id}` as any)}
                        >
                          <Text className="text-xs">Chỉnh sửa</Text>
                        </Button>
                      )}
                    </View>
                  </View>
                </View>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="mb-4">
            <CardContent className="p-8 items-center">
              <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
              <CardTitle className="text-lg mb-2">
                {activeTab === 'upcoming' ? 'Không có đặt bàn sắp tới' : 'Không có đặt bàn'}
              </CardTitle>
              <CardDescription className="text-center mb-4">
                {activeTab === 'upcoming' 
                  ? 'Bạn chưa có đặt bàn nào sắp tới. Hãy đặt bàn mới!'
                  : 'Các đặt bàn sẽ xuất hiện ở đây'
                }
              </CardDescription>
              {activeTab === 'upcoming' && (
                <Button onPress={() => router.push('/(booking)/create-reservation' as any)}>
                  <Text className="text-white font-semibold">Đặt bàn ngay</Text>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
