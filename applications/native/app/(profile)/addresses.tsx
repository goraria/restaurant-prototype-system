import React, { useState } from 'react';
import { View, ScrollView, Pressable, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Header } from '@/components/layout/Header';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus,
  MapPin,
  Home,
  Building2,
  Edit,
  Trash2,
  CheckCircle
} from 'lucide-react-native';

export default function AddressesScreen() {
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      type: 'home',
      title: 'Nhà riêng',
      address: '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',
      name: 'Nguyễn Văn A',
      phone: '0987654321',
      isDefault: true
    },
    {
      id: '2',
      type: 'office',
      title: 'Công ty',
      address: '456 Đường DEF, Phường UVW, Quận 3, TP.HCM',
      name: 'Nguyễn Văn A',
      phone: '0987654321',
      isDefault: false
    }
  ]);

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home':
        return Home;
      case 'office':
        return Building2;
      default:
        return MapPin;
    }
  };

  const setDefaultAddress = (addressId: string) => {
    setAddresses(prev => 
      prev.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }))
    );
  };

  const deleteAddress = (addressId: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== addressId));
  };

  const renderAddress = ({ item }: { item: typeof addresses[0] }) => {
    const IconComponent = getAddressIcon(item.type);
    
    return (
      <Card className="mb-4">
        <View className="p-4">
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 bg-muted rounded-full items-center justify-center mr-3">
                <IconComponent size={20} className="text-foreground" />
              </View>
              
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text className="font-medium text-foreground mr-2">
                    {item.title}
                  </Text>
                  {item.isDefault && (
                    <View className="bg-primary px-2 py-1 rounded-full">
                      <Text className="text-xs text-primary-foreground font-medium">
                        Mặc định
                      </Text>
                    </View>
                  )}
                </View>
                
                <Text className="text-sm text-muted-foreground mt-1">
                  {item.address}
                </Text>
                
                <Text className="text-sm text-muted-foreground mt-1">
                  {item.name} • {item.phone}
                </Text>
              </View>
            </View>
          </View>
          
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              {!item.isDefault && (
                <Pressable 
                  onPress={() => setDefaultAddress(item.id)}
                  className="flex-row items-center mr-4"
                >
                  <CheckCircle size={16} className="text-muted-foreground mr-1" />
                  <Text className="text-sm text-muted-foreground">
                    Đặt làm mặc định
                  </Text>
                </Pressable>
              )}
            </View>
            
            <View className="flex-row items-center">
              <Pressable className="flex-row items-center mr-4">
                <Edit size={16} className="text-primary mr-1" />
                <Text className="text-sm text-primary">Sửa</Text>
              </Pressable>
              
              <Pressable 
                onPress={() => deleteAddress(item.id)}
                className="flex-row items-center"
              >
                <Trash2 size={16} className="text-destructive mr-1" />
                <Text className="text-sm text-destructive">Xóa</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <Header 
        title="Địa chỉ giao hàng"
        showBack
        onBack={() => router.back()}
      />
      
      <View className="flex-1">
        {addresses.length > 0 ? (
          <FlatList
            data={addresses}
            renderItem={renderAddress}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className="flex-1 items-center justify-center px-8">
            <MapPin size={64} className="text-muted-foreground mb-4" />
            <Text className="text-xl font-bold text-foreground mb-2 text-center">
              Chưa có địa chỉ giao hàng
            </Text>
            <Text className="text-muted-foreground text-center mb-6">
              Thêm địa chỉ để việc đặt hàng trở nên thuận tiện hơn
            </Text>
          </View>
        )}
      </View>

      {/* Add Address Button */}
      <View className="p-4 border-t border-border bg-background">
        <Button className="flex-row items-center justify-center">
          <Plus size={20} className="text-primary-foreground mr-2" />
          <Text className="text-primary-foreground font-semibold">
            Thêm địa chỉ mới
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
