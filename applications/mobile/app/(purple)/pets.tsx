import React from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Plus, 
  Search, 
  Filter, 
  Heart, 
  Calendar, 
  MapPin, 
  Star,
  Edit,
  Trash2,
  Camera
} from 'lucide-react-native';

export default function PetsScreen() {
  const pets = [
    {
      id: 1,
      name: 'Lucky',
      type: 'Chó',
      breed: 'Golden Retriever',
      age: '3 tuổi',
      weight: '25kg',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
      healthStatus: 'Khỏe mạnh',
      lastCheckup: '2024-01-15',
      nextVaccine: '2024-03-20'
    },
    {
      id: 2,
      name: 'Milo',
      type: 'Mèo',
      breed: 'Persian',
      age: '2 tuổi',
      weight: '4kg',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
      healthStatus: 'Cần khám',
      lastCheckup: '2024-01-10',
      nextVaccine: '2024-02-15'
    },
    {
      id: 3,
      name: 'Buddy',
      type: 'Chó',
      breed: 'Poodle',
      age: '1 tuổi',
      weight: '8kg',
      image: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=400&h=400&fit=crop',
      healthStatus: 'Khỏe mạnh',
      lastCheckup: '2024-01-20',
      nextVaccine: '2024-04-10'
    }
  ];

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'Khỏe mạnh':
        return 'bg-green-100 text-green-800';
      case 'Cần khám':
        return 'bg-yellow-100 text-yellow-800';
      case 'Bệnh':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-2xl font-bold text-foreground">Thú cưng của tôi</Text>
            <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                <Text className="text-white font-semibold">Thêm thú cưng</Text>
            </Button>
          </View>

          {/* Search and Filter */}
          <View className="flex-row space-x-3 mb-4">
            <View className="flex-1 relative">
              <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-3 z-10" />
              <Text className="bg-muted/50 px-10 py-3 rounded-lg text-muted-foreground">
                Tìm kiếm thú cưng...
              </Text>
            </View>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </View>
        </View>

        {/* Pets List */}
        <View className="px-6 mb-6">
          {pets.map((pet) => (
            <Card key={pet.id} className="p-4 mb-4">
              <View className="flex-row">
                {/* Pet Image */}
                <View className="mr-4">
                  <Avatar className="w-20 h-20">
                    <Image
                      source={{ uri: pet.image }}
                      className="w-full h-full rounded-full"
                    />
                  </Avatar>
                  <Badge className={`mt-2 ${getHealthStatusColor(pet.healthStatus)}`}>
                    {pet.healthStatus}
                  </Badge>
                </View>

                {/* Pet Info */}
                <View className="flex-1">
                  <View className="flex-row justify-between items-start mb-2">
                    <View>
                      <Text className="text-lg font-bold text-foreground">{pet.name}</Text>
                      <Text className="text-sm text-muted-foreground">{pet.breed}</Text>
                    </View>
                    <View className="flex-row space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </View>
                  </View>

                  <View className="space-y-1 mb-3">
                    <View className="flex-row">
                      <Text className="text-sm text-muted-foreground w-16">Tuổi:</Text>
                      <Text className="text-sm text-foreground">{pet.age}</Text>
                    </View>
                    <View className="flex-row">
                      <Text className="text-sm text-muted-foreground w-16">Cân nặng:</Text>
                      <Text className="text-sm text-foreground">{pet.weight}</Text>
                    </View>
                    <View className="flex-row">
                      <Text className="text-sm text-muted-foreground w-16">Khám cuối:</Text>
                      <Text className="text-sm text-foreground">{pet.lastCheckup}</Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      <Text className="text-xs">Đặt lịch</Text>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Heart className="w-4 h-4 mr-1" />
                      <Text className="text-xs">Hồ sơ</Text>
                    </Button>
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-4">Thao tác nhanh</Text>
          <View className="flex-row space-x-4">
            <Card className="flex-1 p-4 items-center">
              <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center mb-2">
                <Camera className="w-6 h-6 text-primary" />
              </View>
              <Text className="text-sm font-semibold text-center">Chụp ảnh</Text>
            </Card>
            
            <Card className="flex-1 p-4 items-center">
              <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-2">
                <Calendar className="w-6 h-6 text-green-600" />
              </View>
              <Text className="text-sm font-semibold text-center">Lịch hẹn</Text>
            </Card>
            
            <Card className="flex-1 p-4 items-center">
              <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
                <Heart className="w-6 h-6 text-blue-600" />
              </View>
              <Text className="text-sm font-semibold text-center">Sức khỏe</Text>
            </Card>
          </View>
        </View>

        {/* Health Reminders */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-4">Nhắc nhở sức khỏe</Text>
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-yellow-100 rounded-full items-center justify-center mr-3">
                <Calendar className="w-5 h-5 text-yellow-600" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-foreground">Milo cần tiêm vaccine</Text>
                <Text className="text-sm text-muted-foreground">Ngày 15/02/2024</Text>
              </View>
              <Button variant="outline" size="sm">
                <Text className="text-xs">Đặt lịch</Text>
              </Button>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
