import React, { useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ShoppingBag, 
  Clock, 
  Star, 
  MapPin,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
  Phone,
  MessageCircle
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState('active');

  const orders = [
    {
      id: 'ORD001',
      restaurantName: 'Nhà Hàng Hương Việt',
      restaurantImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
      status: 'preparing',
      orderDate: '15/02/2024',
      orderTime: '19:30',
      estimatedTime: '15-20 phút',
      total: 350000,
      items: [
        { name: 'Phở Bò Đặc Biệt', quantity: 2, price: 89000 },
        { name: 'Gỏi Cuốn Tôm Thịt', quantity: 3, price: 45000 },
        { name: 'Cà Phê Sữa Đá', quantity: 2, price: 25000 }
      ],
      rating: null
    },
    {
      id: 'ORD002',
      restaurantName: 'Sushi Tokyo',
      restaurantImage: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
      status: 'delivering',
      orderDate: '15/02/2024',
      orderTime: '18:15',
      estimatedTime: '10 phút',
      total: 480000,
      items: [
        { name: 'Sushi Set A', quantity: 1, price: 380000 },
        { name: 'Trà Xanh', quantity: 2, price: 50000 }
      ],
      rating: null
    },
    {
      id: 'ORD003',
      restaurantName: 'Pizza Italia',
      restaurantImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
      status: 'completed',
      orderDate: '10/02/2024',
      orderTime: '20:00',
      estimatedTime: null,
      total: 420000,
      items: [
        { name: 'Pizza Margherita', quantity: 1, price: 280000 },
        { name: 'Pasta Carbonara', quantity: 1, price: 140000 }
      ],
      rating: 5
    },
    {
      id: 'ORD004',
      restaurantName: 'Burger House',
      restaurantImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
      status: 'cancelled',
      orderDate: '08/02/2024',
      orderTime: '12:30',
      estimatedTime: null,
      total: 180000,
      items: [
        { name: 'Cheeseburger Deluxe', quantity: 2, price: 90000 }
      ],
      rating: null
    }
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'preparing':
        return { 
          text: 'Đang chuẩn bị', 
          color: 'bg-yellow-100 text-yellow-800',
          icon: Clock 
        };
      case 'delivering':
        return { 
          text: 'Đang giao', 
          color: 'bg-blue-100 text-blue-800',
          icon: Truck 
        };
      case 'completed':
        return { 
          text: 'Hoàn thành', 
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle 
        };
      case 'cancelled':
        return { 
          text: 'Đã hủy', 
          color: 'bg-red-100 text-red-800',
          icon: XCircle 
        };
      default:
        return { 
          text: 'Không xác định', 
          color: 'bg-gray-100 text-gray-800',
          icon: Clock 
        };
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'active') {
      return order.status === 'preparing' || order.status === 'delivering';
    }
    if (activeTab === 'completed') {
      return order.status === 'completed';
    }
    if (activeTab === 'cancelled') {
      return order.status === 'cancelled';
    }
    return true;
  });

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header Card */}
      <Card className="mx-4 mt-4 mb-4">
        <CardHeader>
          <CardTitle className="text-2xl">Đơn hàng của tôi</CardTitle>
        </CardHeader>
      </Card>

      {/* Quick Stats Cards */}
      <View className="flex-row px-4 mb-4">
        <Card className="flex-1 mr-2">
          <CardContent className="p-4 items-center">
            <Text className="text-2xl font-bold text-orange-600">
              {orders.filter(o => o.status === 'preparing' || o.status === 'delivering').length}
            </Text>
            <Text className="text-sm text-muted-foreground">Đang xử lý</Text>
          </CardContent>
        </Card>
        
        <Card className="flex-1">
          <CardContent className="p-4 items-center">
            <Text className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === 'completed').length}
            </Text>
            <Text className="text-sm text-muted-foreground">Hoàn thành</Text>
          </CardContent>
        </Card>
      </View>

      {/* Tabs Card */}
      <Card className="mx-4 mb-4">
        <CardContent className="p-4">
          <View className="flex-row bg-muted rounded-lg p-1">
            <TouchableOpacity 
              className={`flex-1 py-3 px-4 rounded-md ${activeTab === 'active' ? 'bg-background shadow-sm' : ''}`}
              onPress={() => setActiveTab('active')}
            >
              <Text className={`text-center font-medium ${activeTab === 'active' ? 'text-foreground' : 'text-muted-foreground'}`}>
                Đang xử lý
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className={`flex-1 py-3 px-4 rounded-md ${activeTab === 'completed' ? 'bg-background shadow-sm' : ''}`}
              onPress={() => setActiveTab('completed')}
            >
              <Text className={`text-center font-medium ${activeTab === 'completed' ? 'text-foreground' : 'text-muted-foreground'}`}>
                Hoàn thành
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className={`flex-1 py-3 px-4 rounded-md ${activeTab === 'cancelled' ? 'bg-background shadow-sm' : ''}`}
              onPress={() => setActiveTab('cancelled')}
            >
              <Text className={`text-center font-medium ${activeTab === 'cancelled' ? 'text-foreground' : 'text-muted-foreground'}`}>
                Đã hủy
              </Text>
            </TouchableOpacity>
          </View>
        </CardContent>
      </Card>

      {/* Orders List */}
      <ScrollView className="flex-1 px-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            return (
              <Card key={order.id} className="mb-4">
                <CardContent className="p-4">
                  <View className="flex-row">
                    <Image
                      source={{ uri: order.restaurantImage }}
                      className="w-20 h-20 rounded-lg mr-4"
                      resizeMode="cover"
                    />
                    
                    <View className="flex-1">
                      {/* Header */}
                      <View className="flex-row justify-between items-start mb-2">
                        <View className="flex-1">
                          <Text className="font-semibold text-lg" numberOfLines={1}>
                            {order.restaurantName}
                          </Text>
                          <Text className="text-sm text-muted-foreground">
                            #{order.id} • {order.orderDate} lúc {order.orderTime}
                          </Text>
                        </View>
                        <Badge variant={order.status === 'completed' ? 'default' : order.status === 'cancelled' ? 'destructive' : 'secondary'}>
                          <statusConfig.icon className="w-3 h-3 mr-1" />
                          <Text className="text-xs font-medium">{statusConfig.text}</Text>
                        </Badge>
                      </View>

                      {/* Items */}
                      <Text className="text-sm text-muted-foreground mb-2" numberOfLines={2}>
                        {order.items.map(item => `${item.name} x${item.quantity}`).join(', ')}
                      </Text>

                      {/* Estimated Time */}
                      {order.estimatedTime && (
                        <View className="flex-row items-center mb-2">
                          <Clock className="w-4 h-4 text-orange-500 mr-2" />
                          <Text className="text-sm text-orange-600 font-medium">
                            {order.estimatedTime}
                          </Text>
                        </View>
                      )}

                      {/* Price and Actions */}
                      <View className="flex-row justify-between items-center">
                        <Text className="text-lg font-bold text-primary">
                          {order.total.toLocaleString()}đ
                        </Text>
                        
                        <View className="flex-row gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onPress={() => router.push(`/order-detail?id=${order.id}` as any)}
                          >
                            <Text className="text-xs">Chi tiết</Text>
                          </Button>
                          
                          {order.status === 'preparing' || order.status === 'delivering' ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onPress={() => router.push('/(account)/chat')}
                            >
                              <MessageCircle className="w-3 h-3 mr-1" />
                              <Text className="text-xs">Nhắn tin</Text>
                            </Button>
                          ) : order.status === 'completed' && !order.rating ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onPress={() => router.push(`/rate-order?id=${order.id}` as any)}
                            >
                              <Star className="w-3 h-3 mr-1" />
                              <Text className="text-xs">Đánh giá</Text>
                            </Button>
                          ) : order.status === 'completed' && order.rating ? (
                            <View className="flex-row items-center px-2">
                              <Star className="w-3 h-3 text-yellow-500 mr-1" />
                              <Text className="text-xs font-semibold">{order.rating}/5</Text>
                            </View>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onPress={() => router.push('/(booking)/cart')}
                            >
                              <RefreshCw className="w-3 h-3 mr-1" />
                              <Text className="text-xs">Đặt lại</Text>
                            </Button>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="mb-4">
            <CardContent className="p-8 items-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground mb-4" />
              <CardTitle className="text-lg mb-2">
                {activeTab === 'active' ? 'Không có đơn hàng đang xử lý' : 
                 activeTab === 'completed' ? 'Chưa có đơn hàng hoàn thành' : 
                 'Không có đơn hàng đã hủy'}
              </CardTitle>
              <CardDescription className="text-center mb-4">
                {activeTab === 'active' 
                  ? 'Các đơn hàng đang chuẩn bị hoặc giao sẽ xuất hiện ở đây'
                  : activeTab === 'completed'
                  ? 'Lịch sử đơn hàng đã hoàn thành sẽ hiển thị tại đây'
                  : 'Các đơn hàng đã hủy sẽ được hiển thị ở đây'
                }
              </CardDescription>
              {activeTab === 'active' && (
                <Button onPress={() => router.push('/(tabs)/menu')}>
                  <Text className="text-white font-semibold">Đặt món ngay</Text>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
