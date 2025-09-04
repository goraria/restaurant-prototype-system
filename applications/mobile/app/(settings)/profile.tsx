import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Camera,
  Edit,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Nguyễn');
  const [lastName, setLastName] = useState('Văn A');
  const [email, setEmail] = useState('nguyenvana@email.com');
  const [phone, setPhone] = useState('0123456789');
  const [address, setAddress] = useState('123 Nguyễn Huệ, Quận 1, TP.HCM');

  const user = {
    firstName,
    lastName,
    email,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  };

  const handleSave = async () => {
    try {
      setIsEditing(false);
      Alert.alert("Thành công", "Thông tin đã được cập nhật");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật thông tin. Vui lòng thử lại.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header Card */}
      <Card className="mx-4 mt-4 mb-4">
        <CardHeader>
          <View className="flex-row items-center">
            <TouchableOpacity 
              className="p-2 rounded-md mr-3"
              onPress={() => router.back()}
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </TouchableOpacity>
            <CardTitle className="text-xl">Thông tin cá nhân</CardTitle>
          </View>
        </CardHeader>
      </Card>

      <ScrollView className="flex-1 px-4">
        {/* Avatar Card */}
        <Card className="mb-4">
          <CardContent className="p-6 items-center">
            <View className="relative mb-4">
              <Avatar className="w-24 h-24" alt="Ảnh đại diện">
                <AvatarImage source={{ uri: user.avatar }} />
                <AvatarFallback>
                  <Text className="text-2xl font-semibold">
                    {user.firstName?.charAt(0) + user.lastName?.charAt(0)}
                  </Text>
                </AvatarFallback>
              </Avatar>
              <TouchableOpacity className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </TouchableOpacity>
            </View>
            <Text className="text-sm text-muted-foreground text-center">
              Chạm để thay đổi ảnh đại diện
            </Text>
          </CardContent>
        </Card>

        {/* Profile Info Card */}
        <Card className="mb-4">
          <CardHeader>
            <View className="flex-row items-center justify-between">
              <CardTitle className="text-lg">Thông tin cá nhân</CardTitle>
              {!isEditing ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  <Text>Chỉnh sửa</Text>
                </Button>
              ) : (
                <View className="flex-row gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onPress={handleCancel}
                  >
                    <X className="w-4 h-4 mr-1" />
                    <Text>Hủy</Text>
                  </Button>
                  <Button
                    size="sm"
                    onPress={handleSave}
                  >
                    <Save className="w-4 h-4 mr-1 text-white" />
                    <Text className="text-white">Lưu</Text>
                  </Button>
                </View>
              )}
            </View>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* First Name */}
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">Họ</Text>
              {isEditing ? (
                <Input
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Nhập họ"
                />
              ) : (
                <View className="p-3 bg-muted rounded-lg">
                  <Text className="text-foreground">{firstName}</Text>
                </View>
              )}
            </View>

            {/* Last Name */}
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">Tên</Text>
              {isEditing ? (
                <Input
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Nhập tên"
                />
              ) : (
                <View className="p-3 bg-muted rounded-lg">
                  <Text className="text-foreground">{lastName}</Text>
                </View>
              )}
            </View>

            {/* Email */}
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">Email</Text>
              {isEditing ? (
                <Input
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Nhập email"
                  keyboardType="email-address"
                />
              ) : (
                <View className="p-3 bg-muted rounded-lg">
                  <Text className="text-foreground">{email}</Text>
                </View>
              )}
            </View>

            {/* Phone */}
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">Số điện thoại</Text>
              {isEditing ? (
                <Input
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Nhập số điện thoại"
                  keyboardType="phone-pad"
                />
              ) : (
                <View className="p-3 bg-muted rounded-lg">
                  <Text className="text-foreground">{phone}</Text>
                </View>
              )}
            </View>

            {/* Address */}
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">Địa chỉ</Text>
              {isEditing ? (
                <Input
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Nhập địa chỉ"
                  multiline
                />
              ) : (
                <View className="p-3 bg-muted rounded-lg">
                  <Text className="text-foreground">{address}</Text>
                </View>
              )}
            </View>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Liên kết tài khoản</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="space-y-3">
              <TouchableOpacity className="flex-row items-center justify-between py-3">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-blue-100 rounded-lg items-center justify-center mr-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </View>
                  <View>
                    <Text className="font-medium">Xác thực email</Text>
                    <Text className="text-sm text-green-600">Đã xác thực</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center justify-between py-3">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-green-100 rounded-lg items-center justify-center mr-3">
                    <Phone className="w-5 h-5 text-green-600" />
                  </View>
                  <View>
                    <Text className="font-medium">Xác thực số điện thoại</Text>
                    <Text className="text-sm text-green-600">Đã xác thực</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
