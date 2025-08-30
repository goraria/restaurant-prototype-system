import React from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Bell, 
  Search, 
  Heart, 
  Calendar, 
  MapPin, 
  Star, 
  Clock,
  Users,
  Shield,
  Award
} from 'lucide-react-native';
import { Input } from '@/components/ui/input';

export default function HomeScreen() {
  const services = [
    {
      id: 1,
      title: 'Khám bệnh',
      icon: Heart,
      color: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    {
      id: 2,
      title: 'Tiêm chủng',
      icon: Shield,
      color: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 3,
      title: 'Tắm rửa',
      icon: Users,
      color: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      id: 4,
      title: 'Cắt tỉa',
      icon: Award,
      color: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      petName: 'Lucky',
      service: 'Khám định kỳ',
      time: '14:00',
      date: 'Hôm nay',
      vetName: 'Dr. Nguyễn Văn A'
    },
    {
      id: 2,
      petName: 'Milo',
      service: 'Tiêm vaccine',
      time: '16:30',
      date: 'Ngày mai',
      vetName: 'Dr. Trần Thị B'
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-lg text-muted-foreground">Xin chào,</Text>
              <Text className="text-2xl font-bold text-foreground">Nguyễn Văn An</Text>
            </View>
            <View className="flex-row items-center space-x-3">
              <Button variant="ghost" className="w-10 h-10 p-0 relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs">3</Badge>
              </Button>
              <Avatar className="w-10 h-10">
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' }}
                  className="w-full h-full rounded-full"
                />
              </Avatar>
            </View>
          </View>

          {/* Search Bar */}
          <View className="relative">
            <Input
              placeholder="Tìm kiếm dịch vụ, bác sĩ..."
              className="pl-10"
            />
            <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-3" />
          </View>
        </View>

        {/* Quick Stats */}
        <View className="px-6 mb-6">
          <View className="flex-row space-x-4">
            <Card className="flex-1 p-4">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
                  <Calendar className="w-5 h-5 text-primary" />
                </View>
                <View>
                  <Text className="text-2xl font-bold text-foreground">5</Text>
                  <Text className="text-sm text-muted-foreground">Lịch hẹn</Text>
                </View>
              </View>
            </Card>
            
            <Card className="flex-1 p-4">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
                  <Heart className="w-5 h-5 text-green-600" />
                </View>
                <View>
                  <Text className="text-2xl font-bold text-foreground">3</Text>
                  <Text className="text-sm text-muted-foreground">Thú cưng</Text>
                </View>
              </View>
            </Card>
          </View>
        </View>

        {/* Services */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold text-foreground mb-4">Dịch vụ chính</Text>
          <View className="flex-row flex-wrap justify-between">
            {services.map((service) => (
              <Card key={service.id} className="w-[48%] p-4 mb-4">
                <View className={`w-12 h-12 ${service.color} rounded-full items-center justify-center mb-3`}>
                  <service.icon className={`w-6 h-6 ${service.iconColor}`} />
                </View>
                <Text className="font-semibold text-foreground">{service.title}</Text>
              </Card>
            ))}
          </View>
        </View>

        {/* Upcoming Appointments */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-foreground">Lịch hẹn sắp tới</Text>
            <Button variant="ghost">
              <Text className="text-primary font-semibold">Xem tất cả</Text>
            </Button>
          </View>
          
          {upcomingAppointments.map((appointment) => (
            <Card key={appointment.id} className="p-4 mb-3">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">{appointment.petName}</Text>
                  <Text className="text-sm text-muted-foreground">{appointment.service}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-sm font-semibold text-primary">{appointment.time}</Text>
                  <Text className="text-xs text-muted-foreground">{appointment.date}</Text>
                </View>
              </View>
              <View className="flex-row items-center">
                <MapPin className="w-4 h-4 text-muted-foreground mr-2" />
                <Text className="text-sm text-muted-foreground">{appointment.vetName}</Text>
              </View>
            </Card>
          ))}
        </View>

        {/* Featured Vets */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold text-foreground mb-4">Bác sĩ nổi bật</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-4">
            {[1, 2, 3].map((vet) => (
              <Card key={vet} className="w-48 p-4">
                <Avatar className="w-16 h-16 mb-3 mx-auto">
                  <Image
                    source={{ uri: `https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face` }}
                    className="w-full h-full rounded-full"
                  />
                </Avatar>
                <Text className="font-semibold text-foreground text-center mb-1">Dr. Nguyễn Văn A</Text>
                <Text className="text-sm text-muted-foreground text-center mb-2">Bác sĩ thú y</Text>
                <View className="flex-row items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <Text className="text-sm font-semibold">4.9</Text>
                  <Text className="text-sm text-muted-foreground ml-1">(128)</Text>
                </View>
              </Card>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
