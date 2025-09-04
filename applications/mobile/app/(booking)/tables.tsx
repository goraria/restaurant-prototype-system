import React, { useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Camera,
  Calendar
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
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'occupied':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'maintenance':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
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
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 mb-4">
          <Card>
            <CardContent className="px-4 py-6">
              <View className="flex-row justify-between items-center mb-4">
                <View>
                  <Text className="text-3xl font-bold text-foreground mb-2">Quản lý bàn</Text>
                  <Text className="text-muted-foreground">Theo dõi trạng thái bàn ăn</Text>
                </View>
                <View className="flex-row space-x-2">
                  <TouchableOpacity className="w-10 h-10 bg-muted rounded-lg items-center justify-center">
                    <Search className="w-5 h-5 text-muted-foreground" />
                  </TouchableOpacity>
                  <TouchableOpacity className="w-10 h-10 bg-muted rounded-lg items-center justify-center">
                    <Filter className="w-5 h-5 text-muted-foreground" />
                  </TouchableOpacity>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Quick Stats */}
        <View className="px-4 mb-4">
          <View className="flex-row space-x-2">
            <Card className="flex-1">
              <CardContent className="px-4 py-4 items-center">
                <Text className="text-2xl font-bold text-foreground">{tableStats.total}</Text>
                <Text className="text-xs text-muted-foreground">Tổng bàn</Text>
              </CardContent>
            </Card>
            
            <Card className="flex-1">
              <CardContent className="px-4 py-4 items-center">
                <Text className="text-2xl font-bold text-green-600">{tableStats.available}</Text>
                <Text className="text-xs text-muted-foreground">Trống</Text>
              </CardContent>
            </Card>
            
            <Card className="flex-1">
              <CardContent className="px-4 py-4 items-center">
                <Text className="text-2xl font-bold text-red-600">{tableStats.occupied}</Text>
                <Text className="text-xs text-muted-foreground">Có khách</Text>
              </CardContent>
            </Card>
            
            <Card className="flex-1">
              <CardContent className="px-4 py-4 items-center">
                <Text className="text-2xl font-bold text-yellow-600">{tableStats.reserved}</Text>
                <Text className="text-xs text-muted-foreground">Đã đặt</Text>
              </CardContent>
            </Card>
          </View>
        </View>

        {/* QR Scanner Card */}
        <View className="px-4 mb-4">
          <TouchableOpacity onPress={() => console.log('QR Scanner')}>
            <Card className="bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
              <CardContent className="px-4 py-6">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-primary rounded-full items-center justify-center mr-4">
                    <QrCode className="w-6 h-6 text-white" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-foreground mb-1">Quét QR Code bàn</Text>
                    <Text className="text-sm text-muted-foreground">Xác nhận khách hàng đã ngồi bàn</Text>
                  </View>
                  <Camera className="w-5 h-5 text-primary" />
                </View>
              </CardContent>
            </Card>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className="px-4 mb-4">
          <Card>
            <CardContent className="px-4 py-3">
              <View className="flex-row bg-muted rounded-lg p-1">
                {[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'available', label: 'Trống' },
                  { value: 'occupied', label: 'Có khách' },
                  { value: 'reserved', label: 'Đã đặt' }
                ].map((tab) => (
                  <TouchableOpacity
                    key={tab.value}
                    className={`flex-1 py-2 rounded-md ${activeTab === tab.value ? 'bg-background shadow-sm' : ''}`}
                    onPress={() => setActiveTab(tab.value)}
                  >
                    <Text className={`text-center font-medium text-sm ${
                      activeTab === tab.value ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Tables Grid */}
        <View className="px-4 mb-4">
          <View className="flex-row flex-wrap justify-between">
            {filteredTables.map((table) => (
              <View key={table.id} className="w-[48%] mb-4">
                <Card>
                  <CardContent className="px-4 py-4">
                    {/* Table Image & Status */}
                    <View className="relative mb-3 items-center">
                      <View className="w-20 h-20 rounded-lg overflow-hidden">
                        <Image
                          source={{ uri: table.image }}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      </View>
                      <View className="absolute -top-2 -right-2">
                        <Badge className={getStatusColor(table.status)}>
                          <Text className="text-xs">{getStatusText(table.status)}</Text>
                        </Badge>
                      </View>
                    </View>

                    {/* Table Info */}
                    <View className="items-center mb-3">
                      <Text className="text-lg font-bold text-foreground mb-1">
                        Bàn {table.tableNumber}
                      </Text>
                      <View className="flex-row items-center mb-1">
                        <Users className="w-4 h-4 text-muted-foreground mr-1" />
                        <Text className="text-sm text-muted-foreground">
                          {table.capacity} người
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <MapPin className="w-4 h-4 text-muted-foreground mr-1" />
                        <Text className="text-xs text-muted-foreground text-center">
                          {table.location}
                        </Text>
                      </View>
                    </View>

                    {/* Current Reservation Info */}
                    {table.currentReservation && (
                      <View className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg mb-3">
                        <View className="flex-row items-center mb-2">
                          <Calendar className="w-4 h-4 text-blue-600 mr-2" />
                          <Text className="text-xs font-semibold text-blue-800 dark:text-blue-200">
                            Thông tin đặt bàn
                          </Text>
                        </View>
                        <Text className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                          {table.currentReservation.customerName}
                        </Text>
                        <Text className="text-xs text-blue-600 dark:text-blue-400">
                          {table.currentReservation.partySize} người • {table.currentReservation.startTime}
                        </Text>
                      </View>
                    )}

                    {/* Action Buttons */}
                    <View className="space-y-2">
                      <TouchableOpacity 
                        className="border border-border rounded-lg py-2 px-3"
                        onPress={() => console.log('Table detail:', table.id)}
                      >
                        <Text className="text-center text-sm text-foreground">Chi tiết</Text>
                      </TouchableOpacity>
                      
                      {table.status === 'available' && (
                        <TouchableOpacity 
                          className="bg-primary rounded-lg py-2 px-3"
                          onPress={() => console.log('Create reservation')}
                        >
                          <Text className="text-center text-sm text-white font-medium">Đặt bàn</Text>
                        </TouchableOpacity>
                      )}
                      
                      {table.status === 'occupied' && (
                        <TouchableOpacity 
                          className="bg-blue-500 rounded-lg py-2 px-3 flex-row items-center justify-center"
                          onPress={() => console.log('QR Scanner for table:', table.id)}
                        >
                          <QrCode className="w-4 h-4 text-white mr-1" />
                          <Text className="text-sm text-white font-medium">Quét QR</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </CardContent>
                </Card>
              </View>
            ))}
          </View>

          {filteredTables.length === 0 && (
            <Card>
              <CardContent className="p-8 items-center">
                <AlertTriangle className="w-12 h-12 text-muted-foreground mb-4" />
                <Text className="text-lg font-semibold text-foreground mb-2">
                  Không có bàn nào
                </Text>
                <Text className="text-muted-foreground text-center">
                  Không có bàn nào phù hợp với bộ lọc hiện tại
                </Text>
              </CardContent>
            </Card>
          )}
        </View>

        {/* Footer spacing */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
