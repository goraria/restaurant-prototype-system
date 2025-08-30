import React, { useState } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Edit, 
  Camera, 
  Heart, 
  Calendar, 
  MapPin, 
  User, 
  Star,
  Weight,
  Ruler,
  Birthday,
  Shield,
  Activity,
  FileText
} from 'lucide-react-native';

export default function PetProfileScreen() {
  const [activeTab, setActiveTab] = useState('overview');

  const petInfo = {
    id: 1,
    name: 'Lucky',
    type: 'Chó',
    breed: 'Golden Retriever',
    age: '3 tuổi',
    weight: '25kg',
    height: '55cm',
    birthday: '15/03/2021',
    gender: 'Đực',
    color: 'Vàng',
    microchip: '123456789',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
    healthStatus: 'Khỏe mạnh',
    lastCheckup: '2024-01-15',
    nextVaccine: '2024-03-20'
  };

  const healthMetrics = [
    { label: 'Cân nặng', value: '25kg', icon: Weight, color: 'text-blue-600' },
    { label: 'Chiều cao', value: '55cm', icon: Ruler, color: 'text-green-600' },
    { label: 'Tuổi', value: '3 tuổi', icon: Birthday, color: 'text-purple-600' },
    { label: 'Tình trạng', value: 'Khỏe mạnh', icon: Heart, color: 'text-green-600' }
  ];

  const medicalHistory = [
    {
      id: 1,
      date: '15/01/2024',
      type: 'Khám định kỳ',
      vet: 'Dr. Nguyễn Văn A',
      diagnosis: 'Sức khỏe tốt',
      treatment: 'Không cần điều trị',
      cost: '500.000đ'
    },
    {
      id: 2,
      date: '20/12/2023',
      type: 'Tiêm vaccine',
      vet: 'Dr. Trần Thị B',
      diagnosis: 'Tiêm vaccine 5 bệnh',
      treatment: 'Vaccine đã được tiêm',
      cost: '300.000đ'
    },
    {
      id: 3,
      date: '10/11/2023',
      type: 'Tắm rửa',
      vet: 'Dr. Lê Văn C',
      diagnosis: 'Vệ sinh thông thường',
      treatment: 'Tắm rửa, cắt móng',
      cost: '200.000đ'
    }
  ];

  const vaccines = [
    { name: 'Vaccine 5 bệnh', date: '20/12/2023', nextDate: '20/12/2024', status: 'completed' },
    { name: 'Vaccine dại', date: '15/10/2023', nextDate: '15/10/2024', status: 'completed' },
    { name: 'Vaccine cúm', date: '01/09/2023', nextDate: '01/09/2024', status: 'completed' }
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Button variant="ghost" className="w-10 h-10 p-0 mr-3">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Text className="text-2xl font-bold text-foreground">Hồ sơ thú cưng</Text>
            </View>
            <View className="flex-row space-x-2">
              <Button variant="ghost" size="sm">
                <Camera className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
            </View>
          </View>
        </View>

        {/* Pet Info Header */}
        <View className="px-6 mb-6">
          <Card className="p-6">
            <View className="flex-row">
              <Image
                source={{ uri: petInfo.image }}
                className="w-24 h-24 rounded-full mr-4"
              />
              <View className="flex-1">
                <Text className="text-2xl font-bold text-foreground mb-1">{petInfo.name}</Text>
                <Text className="text-lg text-muted-foreground mb-2">{petInfo.breed}</Text>
                <Badge className="bg-green-100 text-green-800 mb-3">
                  {petInfo.healthStatus}
                </Badge>
                <View className="flex-row items-center">
                  <Calendar className="w-4 h-4 text-muted-foreground mr-2" />
                  <Text className="text-sm text-muted-foreground">
                    Khám cuối: {petInfo.lastCheckup}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Health Metrics */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-4">Chỉ số sức khỏe</Text>
          <View className="flex-row flex-wrap justify-between">
            {healthMetrics.map((metric, index) => (
              <Card key={index} className="w-[48%] p-4 mb-4">
                <View className="items-center">
                  <View className={`w-12 h-12 bg-gray-100 rounded-full items-center justify-center mb-3`}>
                    <metric.icon className={`w-6 h-6 ${metric.color}`} />
                  </View>
                  <Text className="font-semibold text-foreground text-center">{metric.value}</Text>
                  <Text className="text-sm text-muted-foreground text-center">{metric.label}</Text>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Tabs */}
        <View className="px-6 mb-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            items={[
              { value: 'overview', label: 'Tổng quan' },
              { value: 'medical', label: 'Lịch sử y tế' },
              { value: 'vaccines', label: 'Vaccine' }
            ]}
          />
        </View>

        {/* Tab Content */}
        <View className="px-6 mb-6">
          {activeTab === 'overview' && (
            <View>
              <Text className="text-lg font-bold text-foreground mb-4">Thông tin chi tiết</Text>
              <Card className="p-4">
                <View className="space-y-3">
                  <View className="flex-row justify-between">
                    <Text className="text-muted-foreground">Loài:</Text>
                    <Text className="font-semibold text-foreground">{petInfo.type}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-muted-foreground">Giống:</Text>
                    <Text className="font-semibold text-foreground">{petInfo.breed}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-muted-foreground">Giới tính:</Text>
                    <Text className="font-semibold text-foreground">{petInfo.gender}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-muted-foreground">Màu sắc:</Text>
                    <Text className="font-semibold text-foreground">{petInfo.color}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-muted-foreground">Ngày sinh:</Text>
                    <Text className="font-semibold text-foreground">{petInfo.birthday}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-muted-foreground">Microchip:</Text>
                    <Text className="font-semibold text-foreground">{petInfo.microchip}</Text>
                  </View>
                </View>
              </Card>

              {/* Health Progress */}
              <View className="mt-6">
                <Text className="text-lg font-bold text-foreground mb-4">Tiến độ sức khỏe</Text>
                <Card className="p-4">
                  <View className="space-y-4">
                    <View>
                      <View className="flex-row justify-between mb-2">
                        <Text className="text-sm font-semibold text-foreground">Cân nặng</Text>
                        <Text className="text-sm text-muted-foreground">25kg / 30kg</Text>
                      </View>
                      <Progress value={83} className="h-2" />
                    </View>
                    <View>
                      <View className="flex-row justify-between mb-2">
                        <Text className="text-sm font-semibold text-foreground">Hoạt động</Text>
                        <Text className="text-sm text-muted-foreground">85%</Text>
                      </View>
                      <Progress value={85} className="h-2" />
                    </View>
                    <View>
                      <View className="flex-row justify-between mb-2">
                        <Text className="text-sm font-semibold text-foreground">Dinh dưỡng</Text>
                        <Text className="text-sm text-muted-foreground">90%</Text>
                      </View>
                      <Progress value={90} className="h-2" />
                    </View>
                  </View>
                </Card>
              </View>
            </View>
          )}

          {activeTab === 'medical' && (
            <View>
              <Text className="text-lg font-bold text-foreground mb-4">Lịch sử y tế</Text>
              <View className="space-y-4">
                {medicalHistory.map((record) => (
                  <Card key={record.id} className="p-4">
                    <View className="flex-row justify-between items-start mb-3">
                      <View>
                        <Text className="font-semibold text-foreground">{record.type}</Text>
                        <Text className="text-sm text-muted-foreground">{record.date}</Text>
                      </View>
                      <Text className="font-semibold text-primary">{record.cost}</Text>
                    </View>
                    <View className="space-y-2">
                      <View className="flex-row">
                        <Text className="text-sm text-muted-foreground w-20">Bác sĩ:</Text>
                        <Text className="text-sm text-foreground">{record.vet}</Text>
                      </View>
                      <View className="flex-row">
                        <Text className="text-sm text-muted-foreground w-20">Chẩn đoán:</Text>
                        <Text className="text-sm text-foreground">{record.diagnosis}</Text>
                      </View>
                      <View className="flex-row">
                        <Text className="text-sm text-muted-foreground w-20">Điều trị:</Text>
                        <Text className="text-sm text-foreground">{record.treatment}</Text>
                      </View>
                    </View>
                  </Card>
                ))}
              </View>
            </View>
          )}

          {activeTab === 'vaccines' && (
            <View>
              <Text className="text-lg font-bold text-foreground mb-4">Lịch sử vaccine</Text>
              <View className="space-y-4">
                {vaccines.map((vaccine, index) => (
                  <Card key={index} className="p-4">
                    <View className="flex-row justify-between items-start mb-3">
                      <View>
                        <Text className="font-semibold text-foreground">{vaccine.name}</Text>
                        <Text className="text-sm text-muted-foreground">
                          Tiêm: {vaccine.date}
                        </Text>
                      </View>
                      <Badge className="bg-green-100 text-green-800">
                        Hoàn thành
                      </Badge>
                    </View>
                    <View className="flex-row items-center">
                      <Calendar className="w-4 h-4 text-muted-foreground mr-2" />
                      <Text className="text-sm text-muted-foreground">
                        Tiêm lại: {vaccine.nextDate}
                      </Text>
                    </View>
                  </Card>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View className="px-6 pb-8">
          <View className="flex-row space-x-3">
            <Button variant="outline" className="flex-1">
              <Calendar className="w-4 h-4 mr-2" />
              <Text>Đặt lịch</Text>
            </Button>
            <Button variant="outline" className="flex-1">
              <FileText className="w-4 h-4 mr-2" />
              <Text>Xuất hồ sơ</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
