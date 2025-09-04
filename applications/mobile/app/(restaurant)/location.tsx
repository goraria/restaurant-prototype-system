import React from 'react';
import { View, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  Star,
  Car,
  Footprints,
  Bike,
  ExternalLink,
  Users,
  Heart
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function LocationScreen() {
  const restaurantInfo = {
    name: 'Nhà Hàng Hương Việt',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    phone: '+84 28 1234 5678',
    hours: '07:00 - 22:00',
    rating: 4.8,
    reviewCount: 128,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    coordinates: {
      latitude: 10.7769,
      longitude: 106.7009
    }
  };

  const nearbyRestaurants = [
    {
      id: 1,
      name: 'Sushi Tokyo',
      distance: '0.2km',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400'
    },
    {
      id: 2,
      name: 'Pizza Italia',
      distance: '0.5km',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400'
    }
  ];

  const transportOptions = [
    {
      type: 'walk',
      icon: Footprints,
      duration: '12 phút',
      distance: '1.2km',
      color: 'text-green-600'
    },
    {
      type: 'bike',
      icon: Bike,
      duration: '5 phút',
      distance: '1.2km',
      color: 'text-blue-600'
    },
    {
      type: 'car',
      icon: Car,
      duration: '3 phút',
      distance: '1.2km',
      color: 'text-purple-600'
    }
  ];

  const handleCall = () => {
    Linking.openURL(`tel:${restaurantInfo.phone}`);
  };

  const handleDirection = () => {
    const url = `https://maps.google.com/?q=${restaurantInfo.coordinates.latitude},${restaurantInfo.coordinates.longitude}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 mb-4">
          <Card>
            <CardContent className="px-4 py-6">
              <Text className="text-3xl font-bold text-foreground mb-2">Địa điểm</Text>
              <Text className="text-muted-foreground">Thông tin vị trí và đường đi</Text>
            </CardContent>
          </Card>
        </View>

        {/* Restaurant Info Card */}
        <View className="px-4 mb-4">
          <Card>
            <CardContent className="px-4 py-6">
              <View className="flex-row mb-4">
                <View className="w-20 h-20 rounded-lg overflow-hidden mr-4">
                  <Image
                    source={{ uri: restaurantInfo.image }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-xl font-bold text-foreground mb-2">
                    {restaurantInfo.name}
                  </Text>
                  <View className="flex-row items-center mb-2">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <Text className="font-semibold text-foreground">{restaurantInfo.rating}</Text>
                    <Text className="text-muted-foreground ml-1">({restaurantInfo.reviewCount} đánh giá)</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Clock className="w-4 h-4 text-green-600 mr-2" />
                    <Text className="text-sm text-green-600 font-medium">Đang mở cửa</Text>
                  </View>
                </View>
              </View>

              {/* Contact Info */}
              <View className="space-y-3 mb-4">
                <View className="flex-row items-center">
                  <MapPin className="w-5 h-5 text-primary mr-3" />
                  <Text className="flex-1 text-foreground">{restaurantInfo.address}</Text>
                </View>
                <View className="flex-row items-center">
                  <Phone className="w-5 h-5 text-primary mr-3" />
                  <Text className="flex-1 text-foreground">{restaurantInfo.phone}</Text>
                </View>
                <View className="flex-row items-center">
                  <Clock className="w-5 h-5 text-primary mr-3" />
                  <Text className="flex-1 text-foreground">{restaurantInfo.hours}</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row space-x-3">
                <TouchableOpacity 
                  onPress={handleDirection}
                  className="flex-1 bg-primary rounded-lg py-3 px-4 flex-row items-center justify-center"
                >
                  <Navigation className="w-5 h-5 text-white mr-2" />
                  <Text className="text-white font-medium">Chỉ đường</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleCall}
                  className="flex-1 bg-green-500 rounded-lg py-3 px-4 flex-row items-center justify-center"
                >
                  <Phone className="w-5 h-5 text-white mr-2" />
                  <Text className="text-white font-medium">Gọi điện</Text>
                </TouchableOpacity>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Transport Options */}
        <View className="px-4 mb-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Phương tiện di chuyển</CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <View className="space-y-3">
                {transportOptions.map((option, index) => (
                  <TouchableOpacity 
                    key={index}
                    className="flex-row items-center p-3 bg-muted/30 rounded-lg"
                  >
                    <View className={`w-10 h-10 rounded-full bg-background items-center justify-center mr-4`}>
                      <option.icon className={`w-5 h-5 ${option.color}`} />
                    </View>
                    <View className="flex-1">
                      <Text className="font-medium text-foreground capitalize">
                        {option.type === 'walk' ? 'Đi bộ' : option.type === 'bike' ? 'Xe đạp' : 'Ô tô'}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        {option.duration} • {option.distance}
                      </Text>
                    </View>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </TouchableOpacity>
                ))}
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Map Placeholder */}
        <View className="px-4 mb-4">
          <Card>
            <CardContent className="px-4 py-4">
              <View className="h-48 bg-muted rounded-lg items-center justify-center">
                <MapPin className="w-12 h-12 text-primary mb-2" />
                <Text className="font-medium text-foreground mb-1">Bản đồ tương tác</Text>
                <Text className="text-sm text-muted-foreground text-center">
                  Nhấn "Chỉ đường" để mở Google Maps
                </Text>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Nearby Restaurants */}
        <View className="px-4 mb-4">
          <Card>
            <CardHeader>
              <View className="flex-row items-center justify-between">
                <CardTitle className="text-lg">Nhà hàng gần đây</CardTitle>
                <TouchableOpacity>
                  <Text className="text-primary text-sm">Xem tất cả</Text>
                </TouchableOpacity>
              </View>
            </CardHeader>
            <CardContent className="px-4">
              <View className="space-y-3">
                {nearbyRestaurants.map((restaurant) => (
                  <TouchableOpacity 
                    key={restaurant.id}
                    className="flex-row items-center p-3 bg-muted/30 rounded-lg"
                  >
                    <View className="w-12 h-12 rounded-lg overflow-hidden mr-4">
                      <Image
                        source={{ uri: restaurant.image }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="font-medium text-foreground mb-1">
                        {restaurant.name}
                      </Text>
                      <View className="flex-row items-center">
                        <MapPin className="w-3 h-3 text-muted-foreground mr-1" />
                        <Text className="text-sm text-muted-foreground mr-3">
                          {restaurant.distance}
                        </Text>
                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                        <Text className="text-sm text-muted-foreground">
                          {restaurant.rating}
                        </Text>
                      </View>
                    </View>
                    <Heart className="w-5 h-5 text-muted-foreground" />
                  </TouchableOpacity>
                ))}
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Operating Hours Detail */}
        <View className="px-4 mb-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Giờ hoạt động</CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <View className="space-y-2">
                {[
                  { day: 'Thứ 2 - Thứ 6', time: '07:00 - 22:00', isToday: false },
                  { day: 'Thứ 7', time: '08:00 - 23:00', isToday: true },
                  { day: 'Chủ nhật', time: '08:00 - 21:00', isToday: false }
                ].map((schedule, index) => (
                  <View 
                    key={index} 
                    className={`flex-row justify-between py-2 px-3 rounded-lg ${
                      schedule.isToday ? 'bg-primary/10 border border-primary/20' : ''
                    }`}
                  >
                    <Text className={`${schedule.isToday ? 'font-medium text-primary' : 'text-foreground'}`}>
                      {schedule.day}
                    </Text>
                    <Text className={`${schedule.isToday ? 'font-medium text-primary' : 'text-muted-foreground'}`}>
                      {schedule.time}
                    </Text>
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Footer spacing */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
