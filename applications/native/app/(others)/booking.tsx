import React, { useState } from 'react';
import { View, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Header } from '@/components/layout/Header';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Phone,
  CheckCircle,
  Star,
  ArrowRight
} from 'lucide-react-native';

interface TableOption {
  id: string;
  name: string;
  capacity: number;
  location: string;
  pricePerHour: number;
  features: string[];
  isAvailable: boolean;
  image: string;
}

interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

export default function BookingScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [guestCount, setGuestCount] = useState('2');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    specialRequests: ''
  });

  const timeSlots: TimeSlot[] = [
    { time: '11:00', isAvailable: true },
    { time: '11:30', isAvailable: true },
    { time: '12:00', isAvailable: false },
    { time: '12:30', isAvailable: true },
    { time: '13:00', isAvailable: true },
    { time: '13:30', isAvailable: false },
    { time: '14:00', isAvailable: true },
    { time: '18:00', isAvailable: true },
    { time: '18:30', isAvailable: true },
    { time: '19:00', isAvailable: false },
    { time: '19:30', isAvailable: true },
    { time: '20:00', isAvailable: true },
    { time: '20:30', isAvailable: true },
    { time: '21:00', isAvailable: true },
  ];

  const tableOptions: TableOption[] = [
    {
      id: '1',
      name: 'Bàn VIP Sân vườn',
      capacity: 4,
      location: 'Sân vườn',
      pricePerHour: 200000,
      features: ['View sân vườn', 'Riêng tư', 'Có mái che'],
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300'
    },
    {
      id: '2',
      name: 'Bàn cửa sổ',
      capacity: 2,
      location: 'Tầng 1',
      pricePerHour: 150000,
      features: ['View đường phố', 'Ánh sáng tự nhiên', 'Lãng mạn'],
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300'
    },
    {
      id: '3',
      name: 'Bàn tròn gia đình',
      capacity: 8,
      location: 'Tầng 2',
      pricePerHour: 300000,
      features: ['Phù hợp gia đình', 'Rộng rãi', 'Gần khu vui chơi trẻ em'],
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300'
    },
    {
      id: '4',
      name: 'Phòng riêng VIP',
      capacity: 12,
      location: 'Tầng 3',
      pricePerHour: 500000,
      features: ['Phòng riêng', 'Karaoke', 'Phục vụ riêng', 'Điều hòa'],
      isAvailable: false,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300'
    }
  ];

  const handleBooking = () => {
    if (!selectedTime || !selectedTable || !customerInfo.name || !customerInfo.phone) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin đặt bàn');
      return;
    }

    Alert.alert(
      'Xác nhận đặt bàn',
      `Bạn có muốn đặt bàn vào ${selectedDate} lúc ${selectedTime}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xác nhận', 
          onPress: () => {
            Alert.alert('Thành công', 'Đặt bàn thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
            // Reset form
            setSelectedTime('');
            setSelectedTable(null);
            setCustomerInfo({ name: '', phone: '', email: '', specialRequests: '' });
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="Đặt bàn" showBack />
      
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Date Selection */}
        <Card className="p-4 mb-4">
          <View className="flex-row items-center mb-3">
            <Calendar size={20} className="text-primary mr-2" />
            <Text className="text-lg font-semibold">Chọn ngày</Text>
          </View>
          <View className="bg-muted p-3 rounded-lg">
            <Input
              placeholder="Chọn ngày"
              value={selectedDate}
              onChangeText={setSelectedDate}
              className="border-0 bg-transparent text-base"
            />
          </View>
        </Card>

        {/* Guest Count */}
        <Card className="p-4 mb-4">
          <View className="flex-row items-center mb-3">
            <Users size={20} className="text-primary mr-2" />
            <Text className="text-lg font-semibold">Số lượng khách</Text>
          </View>
          <View className="flex-row items-center justify-between bg-muted p-3 rounded-lg">
            <Pressable
              onPress={() => setGuestCount(String(Math.max(1, parseInt(guestCount) - 1)))}
              className="w-10 h-10 bg-primary rounded-full items-center justify-center"
            >
              <Text className="text-primary-foreground text-xl font-bold">-</Text>
            </Pressable>
            <Text className="text-xl font-bold">{guestCount} người</Text>
            <Pressable
              onPress={() => setGuestCount(String(parseInt(guestCount) + 1))}
              className="w-10 h-10 bg-primary rounded-full items-center justify-center"
            >
              <Text className="text-primary-foreground text-xl font-bold">+</Text>
            </Pressable>
          </View>
        </Card>

        {/* Time Selection */}
        <Card className="p-4 mb-4">
          <View className="flex-row items-center mb-3">
            <Clock size={20} className="text-primary mr-2" />
            <Text className="text-lg font-semibold">Chọn giờ</Text>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {timeSlots.map((slot) => (
              <Pressable
                key={slot.time}
                onPress={() => slot.isAvailable ? setSelectedTime(slot.time) : null}
                className={`px-4 py-3 rounded-lg border ${
                  selectedTime === slot.time
                    ? 'bg-primary border-primary'
                    : slot.isAvailable
                    ? 'bg-background border-border'
                    : 'bg-muted border-muted opacity-50'
                }`}
                disabled={!slot.isAvailable}
              >
                <Text
                  className={`text-center font-medium ${
                    selectedTime === slot.time
                      ? 'text-primary-foreground'
                      : slot.isAvailable
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {slot.time}
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>

        {/* Table Selection */}
        <Card className="p-4 mb-4">
          <View className="flex-row items-center mb-3">
            <MapPin size={20} className="text-primary mr-2" />
            <Text className="text-lg font-semibold">Chọn bàn</Text>
          </View>
          {tableOptions.map((table) => (
            <Pressable
              key={table.id}
              onPress={() => table.isAvailable ? setSelectedTable(table.id) : null}
              className={`mb-3 p-3 rounded-lg border ${
                selectedTable === table.id
                  ? 'bg-primary/10 border-primary'
                  : table.isAvailable
                  ? 'bg-background border-border'
                  : 'bg-muted border-muted opacity-50'
              }`}
              disabled={!table.isAvailable}
            >
              <View className="flex-row">
                <View className="w-20 h-20 rounded-lg bg-muted mr-3" />
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="font-semibold text-base">{table.name}</Text>
                    {!table.isAvailable && (
                      <Text className="text-destructive text-sm font-medium">Đã đặt</Text>
                    )}
                  </View>
                  <View className="flex-row items-center mb-2">
                    <Users size={14} className="text-muted-foreground mr-1" />
                    <Text className="text-muted-foreground text-sm mr-3">
                      {table.capacity} người
                    </Text>
                    <MapPin size={14} className="text-muted-foreground mr-1" />
                    <Text className="text-muted-foreground text-sm">
                      {table.location}
                    </Text>
                  </View>
                  <View className="flex-row flex-wrap gap-1 mb-2">
                    {table.features.slice(0, 2).map((feature, index) => (
                      <View key={index} className="bg-secondary px-2 py-1 rounded">
                        <Text className="text-secondary-foreground text-xs">{feature}</Text>
                      </View>
                    ))}
                  </View>
                  <Text className="font-bold text-primary">
                    {table.pricePerHour.toLocaleString()}đ/giờ
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </Card>

        {/* Customer Information */}
        <Card className="p-4 mb-4">
          <View className="flex-row items-center mb-4">
            <Phone size={20} className="text-primary mr-2" />
            <Text className="text-lg font-semibold">Thông tin liên hệ</Text>
          </View>
          
          <View className="space-y-3">
            <View>
              <Text className="text-sm font-medium mb-2">Họ và tên *</Text>
              <Input
                placeholder="Nhập họ và tên"
                value={customerInfo.name}
                onChangeText={(text) => setCustomerInfo(prev => ({ ...prev, name: text }))}
                className="bg-muted border-0"
              />
            </View>
            
            <View>
              <Text className="text-sm font-medium mb-2">Số điện thoại *</Text>
              <Input
                placeholder="Nhập số điện thoại"
                value={customerInfo.phone}
                onChangeText={(text) => setCustomerInfo(prev => ({ ...prev, phone: text }))}
                keyboardType="phone-pad"
                className="bg-muted border-0"
              />
            </View>
            
            <View>
              <Text className="text-sm font-medium mb-2">Email</Text>
              <Input
                placeholder="Nhập email (tùy chọn)"
                value={customerInfo.email}
                onChangeText={(text) => setCustomerInfo(prev => ({ ...prev, email: text }))}
                keyboardType="email-address"
                className="bg-muted border-0"
              />
            </View>
            
            <View>
              <Text className="text-sm font-medium mb-2">Yêu cầu đặc biệt</Text>
              <Input
                placeholder="Nhập yêu cầu đặc biệt (tùy chọn)"
                value={customerInfo.specialRequests}
                onChangeText={(text) => setCustomerInfo(prev => ({ ...prev, specialRequests: text }))}
                multiline
                numberOfLines={3}
                className="bg-muted border-0 min-h-20"
              />
            </View>
          </View>
        </Card>

        {/* Booking Summary */}
        {selectedTime && selectedTable && (
          <Card className="p-4 mb-4 bg-secondary/50">
            <View className="flex-row items-center mb-3">
              <CheckCircle size={20} className="text-success mr-2" />
              <Text className="text-lg font-semibold">Tóm tắt đặt bàn</Text>
            </View>
            
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Ngày:</Text>
                <Text className="font-medium">{selectedDate}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Giờ:</Text>
                <Text className="font-medium">{selectedTime}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Số khách:</Text>
                <Text className="font-medium">{guestCount} người</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Bàn:</Text>
                <Text className="font-medium">
                  {tableOptions.find(t => t.id === selectedTable)?.name}
                </Text>
              </View>
              <View className="border-t border-border pt-2 mt-2">
                <View className="flex-row justify-between">
                  <Text className="font-semibold">Tổng cộng:</Text>
                  <Text className="font-bold text-primary text-lg">
                    {tableOptions.find(t => t.id === selectedTable)?.pricePerHour.toLocaleString()}đ
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        )}

        {/* Booking Button */}
        <Button onPress={handleBooking} className="mb-8">
          <View className="flex-row items-center justify-center">
            <Text className="text-primary-foreground font-semibold mr-2">Xác nhận đặt bàn</Text>
            <ArrowRight size={20} className="text-primary-foreground" />
          </View>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
