import React, { useState } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Heart,
  Check,
  ChevronRight
} from 'lucide-react-native';

export default function AppointmentScreen() {
  const [selectedDate, setSelectedDate] = useState('2024-02-15');
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [selectedPet, setSelectedPet] = useState('Lucky');
  const [selectedService, setSelectedService] = useState('Khám bệnh');

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const services = [
    { value: 'khambenh', label: 'Khám bệnh' },
    { value: 'tiemchung', label: 'Tiêm chủng' },
    { value: 'tamrua', label: 'Tắm rửa' },
    { value: 'cattia', label: 'Cắt tỉa' },
    { value: 'truongrang', label: 'Trồng răng' },
    { value: 'phau', label: 'Phẫu thuật' }
  ];

  const pets = [
    { value: 'lucky', label: 'Lucky (Golden Retriever)' },
    { value: 'milo', label: 'Milo (Persian)' },
    { value: 'buddy', label: 'Buddy (Poodle)' }
  ];

  const vets = [
    {
      id: 1,
      name: 'Dr. Nguyễn Văn A',
      specialty: 'Bác sĩ thú y',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Dr. Trần Thị B',
      specialty: 'Chuyên gia phẫu thuật',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <View className="flex-row items-center mb-4">
            <Button variant="ghost" className="w-10 h-10 p-0 mr-3">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Text className="text-2xl font-bold text-foreground">Đặt lịch hẹn</Text>
          </View>
        </View>

        {/* Service Selection */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-4">Chọn dịch vụ</Text>
          <Card className="p-4">
            <View className="space-y-4">
              <View>
                <Label className="mb-2">Loại dịch vụ</Label>
                <Select
                  value={selectedService}
                  onValueChange={setSelectedService}
                  items={services}
                />
              </View>
              
              <View>
                <Label className="mb-2">Thú cưng</Label>
                <Select
                  value={selectedPet}
                  onValueChange={setSelectedPet}
                  items={pets}
                />
              </View>
            </View>
          </Card>
        </View>

        {/* Date Selection */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-4">Chọn ngày</Text>
          <Card className="p-4">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Calendar className="w-5 h-5 text-primary mr-2" />
                <Text className="font-semibold text-foreground">15 Tháng 2, 2024</Text>
              </View>
              <Button variant="outline" size="sm">
                <Text className="text-primary">Thay đổi</Text>
              </Button>
            </View>
          </Card>
        </View>

        {/* Time Selection */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-4">Chọn giờ</Text>
          <View className="flex-row flex-wrap justify-between">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                size="sm"
                className="w-[30%] mb-3"
                onPress={() => setSelectedTime(time)}
              >
                <Text className={selectedTime === time ? "text-white" : "text-foreground"}>
                  {time}
                </Text>
              </Button>
            ))}
          </View>
        </View>

        {/* Vet Selection */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-4">Chọn bác sĩ</Text>
          <View className="space-y-3">
            {vets.map((vet) => (
              <Card key={vet.id} className="p-4">
                <View className="flex-row items-center">
                  <Image
                    source={{ uri: vet.image }}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <View className="flex-1">
                    <Text className="font-semibold text-foreground">{vet.name}</Text>
                    <Text className="text-sm text-muted-foreground">{vet.specialty}</Text>
                    <View className="flex-row items-center mt-1">
                      <Text className="text-sm font-semibold text-yellow-600">{vet.rating}</Text>
                      <Text className="text-sm text-muted-foreground ml-1">★</Text>
                    </View>
                  </View>
                  <Button variant="outline" size="sm">
                    <Check className="w-4 h-4" />
                  </Button>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Additional Information */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-4">Thông tin bổ sung</Text>
          <Card className="p-4">
            <View className="space-y-4">
              <View>
                <Label className="mb-2">Ghi chú</Label>
                <Textarea
                  placeholder="Mô tả triệu chứng hoặc yêu cầu đặc biệt..."
                  className="min-h-[80px]"
                />
              </View>
              
              <View>
                <Label className="mb-2">Địa chỉ</Label>
                <View className="relative">
                  <Input
                    placeholder="Nhập địa chỉ của bạn"
                    className="pl-10"
                  />
                  <MapPin className="w-5 h-5 text-muted-foreground absolute left-3 top-3" />
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Summary */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-4">Tóm tắt</Text>
          <Card className="p-4">
            <View className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Dịch vụ:</Text>
                <Text className="font-semibold text-foreground">Khám bệnh</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Thú cưng:</Text>
                <Text className="font-semibold text-foreground">Lucky</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Ngày:</Text>
                <Text className="font-semibold text-foreground">15/02/2024</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Giờ:</Text>
                <Text className="font-semibold text-foreground">14:00</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Bác sĩ:</Text>
                <Text className="font-semibold text-foreground">Dr. Nguyễn Văn A</Text>
              </View>
              <View className="border-t pt-3">
                <View className="flex-row justify-between">
                  <Text className="text-lg font-bold text-foreground">Tổng cộng:</Text>
                  <Text className="text-lg font-bold text-primary">500.000đ</Text>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Confirm Button */}
        <View className="px-6 pb-8">
          <Button size="lg">
            <Text className="text-white font-semibold">Xác nhận đặt lịch</Text>
            <ChevronRight className="w-5 h-5 ml-2 text-white" />
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
