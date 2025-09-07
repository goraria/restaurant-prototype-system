import React, { useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Star,
  Search,
  ChevronRight
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function CreateReservationScreen() {
  const [selectedDate, setSelectedDate] = useState('2024-02-15');
  const [selectedTime, setSelectedTime] = useState('19:00');
  const [selectedPartySize, setSelectedPartySize] = useState('4');
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const timeSlots = [
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
  ];

  const popularTimes = ['12:00', '13:00', '18:00', '19:00', '20:00'];

  const restaurants = [
    {
      id: '1',
      name: 'Nhà Hàng Hương Việt',
      cuisine: 'Việt Nam',
      rating: 4.8,
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
      available: true
    },
    {
      id: '2',
      name: 'Sushi Tokyo',
      cuisine: 'Nhật Bản',
      rating: 4.6,
      address: '456 Lê Lợi, Quận 3, TP.HCM',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
      available: true
    },
    {
      id: '3',
      name: 'Pizza Italia',
      cuisine: 'Ý',
      rating: 4.5,
      address: '789 Đồng Khởi, Quận 1, TP.HCM',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
      available: false
    }
  ];

  const partySizes = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4">
        {/* Header */}
        <Card className="mt-4 mb-4">
          <CardHeader>
            <View className="flex-row items-center">
              <TouchableOpacity 
                className="w-10 h-10 items-center justify-center mr-3"
                onPress={() => router.back()}
              >
                <ArrowLeft className="w-5 h-5" />
              </TouchableOpacity>
              <CardTitle className="text-2xl">Đặt bàn mới</CardTitle>
            </View>
          </CardHeader>
        </Card>

        {/* Restaurant Selection */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Chọn nhà hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="relative mb-4">
              <Input
                placeholder="Tìm kiếm nhà hàng..."
                className="pl-10"
              />
              <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-3" />
            </View>
            
            <View>
              <Label className="mb-2">Nhà hàng gần đây</Label>
              <View>
                {restaurants.map((restaurant) => (
                  <TouchableOpacity
                    key={restaurant.id} 
                    onPress={() => setSelectedRestaurant(restaurant.id)}
                    className={`mb-2 p-3 rounded-lg border ${selectedRestaurant === restaurant.id ? 'border-primary bg-primary/5' : 'border-border'}`}
                  >
                    <View className="flex-row items-center">
                      <Image
                        source={{ uri: restaurant.image }}
                        className="w-16 h-16 rounded-lg mr-4"
                      />
                      <View className="flex-1">
                        <Text className="font-semibold text-foreground">{restaurant.name}</Text>
                        <Text className="text-sm text-muted-foreground">{restaurant.cuisine}</Text>
                        <View className="flex-row items-center mt-1">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <Text className="text-sm font-semibold">{restaurant.rating}</Text>
                        </View>
                        <Text className="text-xs text-muted-foreground mt-1">{restaurant.address}</Text>
                      </View>
                      <Badge variant={restaurant.available ? 'default' : 'destructive'}>
                        <Text className="text-xs font-medium">
                          {restaurant.available ? 'Còn chỗ' : 'Hết chỗ'}
                        </Text>
                      </Badge>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Date & Time Selection */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Chọn ngày và giờ</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="mb-4">
              <Label className="mb-2">Ngày</Label>
              <TouchableOpacity className="flex-row justify-between items-center p-3 border rounded-lg">
                <View className="flex-row items-center">
                  <Calendar className="w-5 h-5 text-primary mr-2" />
                  <Text className="font-semibold text-foreground">15 Tháng 2, 2024</Text>
                </View>
                <Text className="text-primary">Thay đổi</Text>
              </TouchableOpacity>
            </View>
            
            <View>
              <Label className="mb-2">Giờ</Label>
              <View className="flex-row flex-wrap gap-2">
                {timeSlots.map((time) => (
                  <TouchableOpacity
                    key={time}
                    onPress={() => setSelectedTime(time)}
                    className={`px-3 py-2 rounded-lg border mr-2 mb-2 ${selectedTime === time ? 'bg-primary border-primary' : 'border-border'}`}
                    style={{ minWidth: '30%' }}
                  >
                    <View className="flex-row items-center justify-center">
                      <Text className={`text-sm font-medium ${selectedTime === time ? "text-white" : "text-foreground"}`}>
                        {time}
                      </Text>
                      {popularTimes.includes(time) && (
                        <Text className={`text-xs ml-1 ${selectedTime === time ? "text-white/70" : "text-yellow-500"}`}>
                          ★
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Party Size */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Số lượng khách</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="mb-4">
              <Label className="mb-2">Số người</Label>
              <View className="flex-row flex-wrap gap-2">
                {partySizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    onPress={() => setSelectedPartySize(size)}
                    className={`px-4 py-2 rounded-lg border mr-2 mb-2 ${selectedPartySize === size ? 'bg-primary border-primary' : 'border-border'}`}
                  >
                    <Text className={`text-sm font-medium ${selectedPartySize === size ? "text-white" : "text-foreground"}`}>
                      {size} người
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-3">
                <View className="flex-row items-center">
                  <Users className="w-5 h-5 text-blue-600 mr-2" />
                  <Text className="text-sm text-blue-800">
                    Gợi ý: Bàn {selectedPartySize} người sẽ được ưu tiên
                  </Text>
                </View>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Special Requests */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Yêu cầu đặc biệt</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="mb-4">
              <Label className="mb-2">Ghi chú</Label>
              <Textarea
                placeholder="Ví dụ: Bàn gần cửa sổ, không gian yên tĩnh, chỗ ngồi cho trẻ em..."
                value={specialRequests}
                onChangeText={setSpecialRequests}
                className="min-h-[80px]"
              />
            </View>
            
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-3">
                <Text className="text-sm text-yellow-800">
                  💡 Mẹo: Ghi rõ yêu cầu để nhà hàng phục vụ tốt hơn
                </Text>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Tóm tắt</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Nhà hàng:</Text>
                <Text className="font-semibold text-foreground">
                  {restaurants.find(r => r.id === selectedRestaurant)?.name || 'Chưa chọn'}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Ngày:</Text>
                <Text className="font-semibold text-foreground">15/02/2024</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Giờ:</Text>
                <Text className="font-semibold text-foreground">{selectedTime}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Số người:</Text>
                <Text className="font-semibold text-foreground">{selectedPartySize} người</Text>
              </View>
              {specialRequests && (
                <View className="flex-row justify-between">
                  <Text className="text-muted-foreground">Yêu cầu:</Text>
                  <Text className="font-semibold text-foreground text-right flex-1 ml-2">
                    {specialRequests}
                  </Text>
                </View>
              )}
            </View>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <View className="mb-8">
          <Button 
            size="lg" 
            disabled={!selectedRestaurant}
            onPress={() => {
              // Handle reservation creation
              router.push('/(booking)/reservations');
            }}
            className="flex-row items-center justify-center"
          >
            <Text className="text-white font-semibold">Xác nhận đặt bàn</Text>
            <ChevronRight className="w-5 h-5 ml-2 text-white" />
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
