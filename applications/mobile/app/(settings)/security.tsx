import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
import { HeaderStack } from '@/components/layout/header';
import { useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Shield,
  Lock,
  Key,
  Mail,
  Phone,
  ChevronRight,
  Check,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react-native';

export default function SecurityScreen() {
  const { user } = useUser();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      setIsChangingPassword(true);
      await user?.updatePassword({
        currentPassword,
        newPassword
      });
      
      Alert.alert("Thành công", "Mật khẩu đã được thay đổi");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      Alert.alert("Lỗi", error.errors?.[0]?.message || "Không thể thay đổi mật khẩu");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const securityOptions = [
    {
      title: "Email xác thực",
      subtitle: user?.emailAddresses[0]?.emailAddress,
      icon: Mail,
      verified: user?.emailAddresses[0]?.verification?.status === 'verified',
      action: () => {
        // Handle email verification
      }
    },
    {
      title: "Số điện thoại",
      subtitle: user?.phoneNumbers[0]?.phoneNumber || "Chưa thêm",
      icon: Phone,
      verified: user?.phoneNumbers[0]?.verification?.status === 'verified',
      action: () => {
        // Handle phone verification
      }
    }
  ];

  return (
    <>
      <HeaderStack
        position="left"
        iconLeft={ArrowLeft}
        iconLeftAction={() => router.back()}
        title="Bảo mật tài khoản"
      />

      <ScrollView className="flex-1 bg-background">
        {/* Tiêu đề lớn kiểu iOS 18 */}
        <View className="px-5 pt-2 pb-6">
          <Text className="text-4xl font-bold text-foreground tracking-tight">Bảo mật</Text>
        </View>

        {/* Trạng thái bảo mật */}
        <View className="px-4 mb-8">
          <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Trạng thái tài khoản
          </Text>
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="p-5">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-green-100 rounded-xl items-center justify-center mr-4">
                  <Icon as={Shield} size={24} className="text-green-600" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-green-700 mb-1">Tài khoản được bảo vệ</Text>
                  <Text className="text-sm text-muted-foreground">
                    Email đã được xác thực và mật khẩu an toàn
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Thay đổi mật khẩu */}
        <View className="px-4 mb-8">
          <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Mật khẩu
          </Text>
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="p-5 space-y-5">
              <View className="mb-2">
                <Text className="text-lg font-semibold text-foreground mb-1">Thay đổi mật khẩu</Text>
                <Text className="text-sm text-muted-foreground">Cập nhật mật khẩu để bảo vệ tài khoản</Text>
              </View>

              {/* Mật khẩu hiện tại */}
              <View>
                <Text className="text-sm font-medium text-muted-foreground mb-2">Mật khẩu hiện tại</Text>
                <View className="relative">
                  <Input
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Nhập mật khẩu hiện tại"
                    secureTextEntry={!showCurrentPassword}
                    className="bg-background border-border pr-12"
                  />
                  <TouchableOpacity
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-3"
                  >
                    <Icon as={showCurrentPassword ? EyeOff : Eye} size={20} className="text-muted-foreground" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Mật khẩu mới */}
              <View>
                <Text className="text-sm font-medium text-muted-foreground mb-2">Mật khẩu mới</Text>
                <View className="relative">
                  <Input
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Ít nhất 6 ký tự"
                    secureTextEntry={!showNewPassword}
                    className="bg-background border-border pr-12"
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3"
                  >
                    <Icon as={showNewPassword ? EyeOff : Eye} size={20} className="text-muted-foreground" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Xác nhận mật khẩu */}
              <View>
                <Text className="text-sm font-medium text-muted-foreground mb-2">Xác nhận mật khẩu mới</Text>
                <View className="relative">
                  <Input
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Nhập lại mật khẩu mới"
                    secureTextEntry={!showConfirmPassword}
                    className="bg-background border-border pr-12"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3"
                  >
                    <Icon as={showConfirmPassword ? EyeOff : Eye} size={20} className="text-muted-foreground" />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity 
                className={`w-full mt-2 py-3 px-4 rounded-lg ${!currentPassword || !newPassword || !confirmPassword || isChangingPassword ? 'bg-muted' : 'bg-primary'}`}
                onPress={handleChangePassword}
                disabled={!currentPassword || !newPassword || !confirmPassword || isChangingPassword}
              >
                <Text className={`text-center font-medium ${!currentPassword || !newPassword || !confirmPassword || isChangingPassword ? 'text-muted-foreground' : 'text-white'}`}>
                  {isChangingPassword ? "Đang thay đổi..." : "Cập nhật mật khẩu"}
                </Text>
              </TouchableOpacity>
            </CardContent>
          </Card>
        </View>

        {/* Phương thức xác thực */}
        <View className="px-4 mb-8">
          <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Xác thực
          </Text>
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="p-0">
              {/* Email */}
              <TouchableOpacity className="flex-row items-center py-4 px-5 active:bg-muted/50">
                <View className="w-8 h-8 bg-blue-100 rounded-lg items-center justify-center mr-4">
                  <Icon as={Mail} size={18} className="text-blue-600" />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-base font-medium text-foreground">Email xác thực</Text>
                    <View className="ml-2 px-2 py-1 bg-green-100 rounded-md">
                      <Text className="text-xs font-medium text-green-700">Đã xác thực</Text>
                    </View>
                  </View>
                  <Text className="text-sm text-muted-foreground">
                    {user?.emailAddresses[0]?.emailAddress}
                  </Text>
                </View>
                <Icon as={ChevronRight} size={16} className="text-muted-foreground" />
              </TouchableOpacity>

              <View className="border-b border-border/50 ml-12" />

              {/* Số điện thoại */}
              <TouchableOpacity className="flex-row items-center py-4 px-5 active:bg-muted/50">
                <View className="w-8 h-8 bg-orange-100 rounded-lg items-center justify-center mr-4">
                  <Icon as={Phone} size={18} className="text-orange-600" />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-base font-medium text-foreground">Số điện thoại</Text>
                    <View className="ml-2 px-2 py-1 bg-orange-100 rounded-md">
                      <Text className="text-xs font-medium text-orange-700">Chưa thêm</Text>
                    </View>
                  </View>
                  <Text className="text-sm text-muted-foreground">
                    Thêm số điện thoại để tăng bảo mật
                  </Text>
                </View>
                <Icon as={ChevronRight} size={16} className="text-muted-foreground" />
              </TouchableOpacity>
            </CardContent>
          </Card>
        </View>

        {/* Mẹo bảo mật */}
        <View className="px-4 mb-8">
          <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Mẹo bảo mật
          </Text>
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="p-5">
              <View className="flex-row items-start mb-3">
                <View className="w-8 h-8 bg-yellow-100 rounded-lg items-center justify-center mr-4 mt-0.5">
                  <Icon as={AlertTriangle} size={18} className="text-yellow-600" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground mb-2">Bảo vệ tài khoản của bạn</Text>
                </View>
              </View>
              
              <View className="space-y-3 ml-12">
                <Text className="text-sm text-muted-foreground leading-5">
                  • Sử dụng mật khẩu mạnh với ít nhất 8 ký tự
                </Text>
                <Text className="text-sm text-muted-foreground leading-5">
                  • Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt
                </Text>
                <Text className="text-sm text-muted-foreground leading-5">
                  • Không chia sẻ mật khẩu với bất kỳ ai
                </Text>
                <Text className="text-sm text-muted-foreground leading-5">
                  • Thay đổi mật khẩu định kỳ để đảm bảo an toàn
                </Text>
                <Text className="text-sm text-muted-foreground leading-5">
                  • Xác thực email và số điện thoại để tăng cường bảo mật
                </Text>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Khoảng trống cuối trang */}
        <View className="h-20" />
      </ScrollView>
    </>
  );
}
