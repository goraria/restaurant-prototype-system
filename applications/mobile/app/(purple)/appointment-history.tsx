import React, { useState } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Heart,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Star,
  MessageCircle
} from 'lucide-react-native';

export default function AppointmentHistoryScreen() {
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingAppointments = [
    {
      id: 1,
      petName: 'Lucky',
      service: 'Khám định kỳ',
      date: '15/02/2024',
      time: '14:00',
      vetName: 'Dr. Nguyễn Văn A',
      status: 'confirmed',
      price: '500.000đ',
      petImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=150&h=150&fit=crop'
    },
    {
      id: 2,
      petName: 'Milo',
      service: 'Tiêm vaccine',
      date: '20/02/2024',
      time: '10:30',
      vetName: 'Dr. Trần Thị B',
      status: 'pending',
      price: '300.000đ',
      petImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&h=150&fit=crop'
    }
  ];

  const completedAppointments = [
    {
      id: 3,
      petName: 'Buddy',
      service: 'Tắm rửa',
      date: '10/02/2024',
      time: '15:00',
      vetName: 'Dr. Lê Văn C',
      status: 'completed',
      price: '200.000đ',
      rating: 5,
      petImage: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=150&h=150&fit=crop'
    },
    {
      id: 4,
      petName: 'Lucky',
      service: 'Cắt tỉa',
      date: '05/02/2024',
      time: '11:00',
      vetName: 'Dr. Nguyễn Văn A',
      status: 'completed',
      price: '150.000đ',
      rating: 4,
      petImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=150&h=150&fit=crop'
    }
  ];

  const cancelledAppointments = [
    {
      id: 5,
      petName: 'Milo',
      service: 'Khám bệnh',
      date: '01/02/2024',
      time: '09:00',
      vetName: 'Dr. Trần Thị B',
      status: 'cancelled',
      price: '400.000đ',
      petImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&h=150&fit=crop'
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <ClockIcon className="w-4 h-4 text-yellow-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const renderAppointmentCard = (appointment: any) => (
    <Card key={appointment.id} className="p-4 mb-4">
      <View className="flex-row">
        <Image
          source={{ uri: appointment.petImage }}
          className="w-16 h-16 rounded-full mr-4"
        />
        <View className="flex-1">
          <View className="flex-row justify-between items-start mb-2">
            <View>
              <Text className="font-semibold text-foreground">{appointment.petName}</Text>
              <Text className="text-sm text-muted-foreground">{appointment.service}</Text>
            </View>
            <Badge className={getStatusColor(appointment.status)}>
              {getStatusText(appointment.status)}
            </Badge>
          </View>

          <View className="space-y-1 mb-3">
            <View className="flex-row items-center">
              <Calendar className="w-4 h-4 text-muted-foreground mr-2" />
              <Text className="text-sm text-foreground">{appointment.date}</Text>
            </View>
            <View className="flex-row items-center">
              <Clock className="w-4 h-4 text-muted-foreground mr-2" />
              <Text className="text-sm text-foreground">{appointment.time}</Text>
            </View>
            <View className="flex-row items-center">
              <User className="w-4 h-4 text-muted-foreground mr-2" />
              <Text className="text-sm text-foreground">{appointment.vetName}</Text>
            </View>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="font-semibold text-primary">{appointment.price}</Text>
            <View className="flex-row space-x-2">
              {appointment.status === 'completed' && (
                <Button variant="outline" size="sm">
                  <Star className="w-4 h-4 mr-1" />
                  <Text className="text-xs">Đánh giá</Text>
                </Button>
              )}
              {appointment.status === 'upcoming' && (
                <>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    <Text className="text-xs">Nhắn tin</Text>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Text className="text-xs">Hủy lịch</Text>
                  </Button>
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-4 pb-6">
        <View className="flex-row items-center mb-4">
          <Button variant="ghost" className="w-10 h-10 p-0 mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Text className="text-2xl font-bold text-foreground">Lịch sử lịch hẹn</Text>
        </View>
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

      {/* Content */}
      <ScrollView className="flex-1 px-6">
        {activeTab === 'upcoming' && (
          <View>
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map(renderAppointmentCard)
            ) : (
              <Card className="p-8 items-center">
                <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
                <Text className="text-lg font-semibold text-foreground mb-2">Không có lịch hẹn sắp tới</Text>
                <Text className="text-muted-foreground text-center">
                  Bạn chưa có lịch hẹn nào sắp tới. Hãy đặt lịch hẹn mới!
                </Text>
                <Button className="mt-4">
                  <Text className="text-white font-semibold">Đặt lịch hẹn</Text>
                </Button>
              </Card>
            )}
          </View>
        )}

        {activeTab === 'completed' && (
          <View>
            {completedAppointments.length > 0 ? (
              completedAppointments.map(renderAppointmentCard)
            ) : (
              <Card className="p-8 items-center">
                <CheckCircle className="w-12 h-12 text-muted-foreground mb-4" />
                <Text className="text-lg font-semibold text-foreground mb-2">Chưa có lịch hẹn hoàn thành</Text>
                <Text className="text-muted-foreground text-center">
                  Các lịch hẹn đã hoàn thành sẽ xuất hiện ở đây
                </Text>
              </Card>
            )}
          </View>
        )}

        {activeTab === 'cancelled' && (
          <View>
            {cancelledAppointments.length > 0 ? (
              cancelledAppointments.map(renderAppointmentCard)
            ) : (
              <Card className="p-8 items-center">
                <XCircle className="w-12 h-12 text-muted-foreground mb-4" />
                <Text className="text-lg font-semibold text-foreground mb-2">Không có lịch hẹn đã hủy</Text>
                <Text className="text-muted-foreground text-center">
                  Các lịch hẹn đã hủy sẽ xuất hiện ở đây
                </Text>
              </Card>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
