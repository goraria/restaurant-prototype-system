import React from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  Star,
  Car,
  Footprints,
  Bike
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

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <Text className="text-2xl font-bold text-foreground mb-4">Địa điểm</Text>
        </View>

        {/* Restaurant Info */}
        <View className="px-6 mb-6">
          <Card className="p-6">
            <View className="flex-row mb-4">
              <Image
                source={{ uri: restaurantInfo.image }}
                className="w-20 h-20 rounded-lg mr-4"
              />
              <View className="flex-1">
                <Text className="text-xl font-bold text-foreground mb-1">
                  {restaurantInfo.name}
                </Text>
                <View className="flex-row items-center mb-2">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <Text className="font-semibold text-foreground">{restaurantInfo.rating}</Text>
                  <Text className="text-muted-foreground ml-1">({restaurantInfo.reviewCount} đánh giá)</Text>
                </View>
                <View className="flex-row items-center">
                  <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                  <Text className="text-sm text-muted-foreground">{restaurantInfo.hours}</Text>
                </View>
              </View>
            </View>

            {/* Address */}
            <View className="mb-4">
              <View className="flex-row items-start mb-3">
                <MapPin className="w-5 h-5 text-primary mr-3 mt-0.5" />
                <View className="flex-1">
                  <Text className="font-semibold text-foreground mb-1">Địa chỉ</Text>
                  <Text className="text-muted-foreground">{restaurantInfo.address}</Text>
                </View>
              </View>
              
              <View className="flex-row items-center mb-3">
                <Phone className="w-5 h-5 text-primary mr-3" />
                <View className="flex-1">
                  <Text className="font-semibold text-foreground mb-1">Điện thoại</Text>
                  <Text className="text-muted-foreground">{restaurantInfo.phone}</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row space-x-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onPress={() => router.push('../(location)/directions')}
              >
                <Navigation className="w-4 h-4 mr-2" />
                <Text>Chỉ đường</Text>
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onPress={() => router.push('../(location)/nearby')}
              >
                <MapPin className="w-4 h-4 mr-2" />
                <Text>Gần đây</Text>
              </Button>
            </View>
          </Card>
        </View>

        {/* Transportation Options */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-4">Phương tiện di chuyển</Text>
          <View className="space-y-3">
            <Card className="p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                    <Car className="w-5 h-5 text-blue-600" />
                  </View>
                  <View>
                    <Text className="font-semibold text-foreground">Xe hơi</Text>
                    <Text className="text-sm text-muted-foreground">5 phút • Có bãi đỗ xe</Text>
                  </View>
                </View>
                <Button variant="outline" size="sm">
                  <Text className="text-xs">Chỉ đường</Text>
                </Button>
              </View>
            </Card>

            <Card className="p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
                    <Footprints className="w-5 h-5 text-green-600" />
                  </View>
                  <View>
                    <Text className="font-semibold text-foreground">Đi bộ</Text>
                    <Text className="text-sm text-muted-foreground">8 phút • 0.4km</Text>
                  </View>
                </View>
                <Button variant="outline" size="sm">
                  <Text className="text-xs">Chỉ đường</Text>
                </Button>
              </View>
            </Card>

            <Card className="p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-3">
                    <Bike className="w-5 h-5 text-orange-600" />
                  </View>
                  <View>
                    <Text className="font-semibold text-foreground">Xe máy</Text>
                    <Text className="text-sm text-muted-foreground">3 phút • 0.2km</Text>
                  </View>
                </View>
                <Button variant="outline" size="sm">
                  <Text className="text-xs">Chỉ đường</Text>
                </Button>
              </View>
            </Card>
          </View>
        </View>

        {/* Nearby Restaurants */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-foreground">Nhà hàng gần đây</Text>
            <Button variant="ghost" onPress={() => router.push('../(location)/nearby')}>
              <Text className="text-primary">Xem tất cả</Text>
            </Button>
          </View>
          
          <View className="space-y-3">
            {nearbyRestaurants.map((restaurant) => (
              <Card key={restaurant.id} className="p-4">
                <View className="flex-row items-center">
                  <Image
                    source={{ uri: restaurant.image }}
                    className="w-16 h-16 rounded-lg mr-3"
                  />
                  <View className="flex-1">
                    <Text className="font-semibold text-foreground">{restaurant.name}</Text>
                    <View className="flex-row items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <Text className="text-sm font-semibold">{restaurant.rating}</Text>
                      <Text className="text-sm text-muted-foreground ml-2">
                        {restaurant.distance}
                      </Text>
                    </View>
                  </View>
                  <Button variant="outline" size="sm">
                    <Text className="text-xs">Xem</Text>
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
