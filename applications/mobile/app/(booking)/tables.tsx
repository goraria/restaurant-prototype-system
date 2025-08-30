import React, { useState } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  QrCode, 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Camera
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function TablesScreen() {
  const [activeTab, setActiveTab] = useState('all');

  const tables = [
    {
      id: 1,
      tableNumber: 'A1',
      capacity: 4,
      status: 'available',
      location: 'Tầng 1 - Gần cửa sổ',
      currentReservation: null,
      qrCode: 'table_a1_qr',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400'
    },
    {
      id: 2,
      tableNumber: 'A2',
      capacity: 6,
      status: 'occupied',
      location: 'Tầng 1 - Góc yên tĩnh',
      currentReservation: {
        customerName: 'Nguyễn Văn A',
        partySize: 4,
        startTime: '19:00',
        estimatedEndTime: '21:00'
      },
      qrCode: 'table_a2_qr',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400'
    },
    {
      id: 3,
      tableNumber: 'B1',
      capacity: 2,
      status: 'reserved',
      location: 'Tầng 2 - Ban công',
      currentReservation: {
        customerName: 'Trần Thị B',
        partySize: 2,
        startTime: '20:00',
        estimatedEndTime: '22:00'
      },
      qrCode: 'table_b1_qr',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400'
    },
    {
      id: 4,
      tableNumber: 'B2',
      capacity: 8,
      status: 'maintenance',
      location: 'Tầng 2 - Phòng VIP',
      currentReservation: null,
      qrCode: 'table_b2_qr',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-red-100 text-red-800';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
      case 'maintenance':
        return 'bg-gray-100 text-gray-800';
      case 'out_of_order':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Trống';
      case 'occupied':
        return 'Có khách';
      case 'reserved':
        return 'Đã đặt';
      case 'maintenance':
        return 'Bảo trì';
      case 'out_of_order':
        return 'Hỏng';
      default:
        return 'Không xác định';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'occupied':
        return <Users className="w-4 h-4 text-red-600" />;
      case 'reserved':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'maintenance':
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
      case 'out_of_order':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const filteredTables = activeTab === 'all' 
    ? tables 
    : tables.filter(table => table.status === activeTab);

  const tableStats = {
    total: tables.length,
    available: tables.filter(t => t.status === 'available').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    reserved: tables.filter(t => t.status === 'reserved').length
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-4 pb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-foreground">Quản lý bàn</Text>
          <View className="flex-row space-x-2">
            <Button variant="ghost" size="sm">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="flex-row space-x-3 mb-6">
          <Card className="flex-1 p-3">
            <View className="items-center">
              <Text className="text-2xl font-bold text-foreground">{tableStats.total}</Text>
              <Text className="text-xs text-muted-foreground">Tổng bàn</Text>
            </View>
          </Card>
          
          <Card className="flex-1 p-3">
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">{tableStats.available}</Text>
              <Text className="text-xs text-muted-foreground">Trống</Text>
            </View>
          </Card>
          
          <Card className="flex-1 p-3">
            <View className="items-center">
              <Text className="text-2xl font-bold text-red-600">{tableStats.occupied}</Text>
              <Text className="text-xs text-muted-foreground">Có khách</Text>
            </View>
          </Card>
          
          <Card className="flex-1 p-3">
            <View className="items-center">
              <Text className="text-2xl font-bold text-yellow-600">{tableStats.reserved}</Text>
              <Text className="text-xs text-muted-foreground">Đã đặt</Text>
            </View>
          </Card>
        </View>

        {/* QR Scanner Button */}
        <Button 
          size="lg" 
          className="mb-6"
          onPress={() => router.push('/(tables)/qr-scanner')}
        >
          <QrCode className="w-5 h-5 mr-2 text-white" />
          <Text className="text-white font-semibold">Quét QR Code bàn</Text>
        </Button>
      </View>

      {/* Tabs */}
      <View className="px-6 mb-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          items={[
            { value: 'all', label: 'Tất cả' },
            { value: 'available', label: 'Trống' },
            { value: 'occupied', label: 'Có khách' },
            { value: 'reserved', label: 'Đã đặt' }
          ]}
        />
      </View>

      {/* Tables Grid */}
      <ScrollView className="flex-1 px-6">
        <View className="flex-row flex-wrap justify-between">
          {filteredTables.map((table) => (
            <Card key={table.id} className="w-[48%] p-4 mb-4">
              <View className="items-center">
                {/* Table Image */}
                <View className="relative mb-3">
                  <Image
                    source={{ uri: table.image }}
                    className="w-20 h-20 rounded-lg"
                  />
                  <Badge className={`absolute -top-2 -right-2 ${getStatusColor(table.status)}`}>
                    {getStatusText(table.status)}
                  </Badge>
                </View>

                {/* Table Info */}
                <Text className="text-lg font-bold text-foreground mb-1">
                  Bàn {table.tableNumber}
                </Text>
                <Text className="text-sm text-muted-foreground mb-2">
                  {table.capacity} người
                </Text>

                {/* Location */}
                <View className="flex-row items-center mb-2">
                  <MapPin className="w-3 h-3 text-muted-foreground mr-1" />
                  <Text className="text-xs text-muted-foreground text-center">
                    {table.location}
                  </Text>
                </View>

                {/* Current Reservation Info */}
                {table.currentReservation && (
                  <View className="bg-blue-50 p-2 rounded-lg mb-3 w-full">
                    <Text className="text-xs font-semibold text-blue-800 mb-1">
                      Khách hiện tại:
                    </Text>
                    <Text className="text-xs text-blue-700">
                      {table.currentReservation.customerName}
                    </Text>
                    <Text className="text-xs text-blue-700">
                      {table.currentReservation.partySize} người • {table.currentReservation.startTime}
                    </Text>
                  </View>
                )}

                {/* Action Buttons */}
                <View className="space-y-2 w-full">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onPress={() => router.push(`/(tables)/detail/${table.id}`)}
                  >
                    <Text className="text-xs">Chi tiết</Text>
                  </Button>
                  
                  {table.status === 'available' && (
                    <Button 
                      size="sm"
                      onPress={() => router.push('/(reservations)/create')}
                    >
                      <Text className="text-xs text-white">Đặt bàn</Text>
                    </Button>
                  )}
                  
                  {table.status === 'occupied' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onPress={() => router.push(`/(tables)/qr-scanner?table=${table.id}`)}
                    >
                      <QrCode className="w-3 h-3 mr-1" />
                      <Text className="text-xs">Quét QR</Text>
                    </Button>
                  )}
                </View>
              </View>
            </Card>
          ))}
        </View>

        {filteredTables.length === 0 && (
          <Card className="p-8 items-center">
            <AlertTriangle className="w-12 h-12 text-muted-foreground mb-4" />
            <Text className="text-lg font-semibold text-foreground mb-2">
              Không có bàn nào
            </Text>
            <Text className="text-muted-foreground text-center">
              Không có bàn nào phù hợp với bộ lọc hiện tại
            </Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
