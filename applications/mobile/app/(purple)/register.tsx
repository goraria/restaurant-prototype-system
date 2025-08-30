import React, { useState } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react-native';

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <Button variant="ghost" className="w-10 h-10 p-0 mb-4">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <Text className="text-3xl font-bold text-foreground mb-2">
            Tạo tài khoản
          </Text>
          <Text className="text-base text-muted-foreground">
            Đăng ký để trải nghiệm dịch vụ chăm sóc thú cưng tốt nhất
          </Text>
        </View>

        {/* Form */}
        <View className="px-6 mb-6">
          <Card className="p-6">
            {/* Full Name */}
            <View className="mb-4">
              <Label className="mb-2">Họ và tên</Label>
              <View className="relative">
                <Input
                  placeholder="Nhập họ và tên của bạn"
                  className="pl-10"
                />
                <User className="w-5 h-5 text-muted-foreground absolute left-3 top-3" />
              </View>
            </View>

            {/* Email */}
            <View className="mb-4">
              <Label className="mb-2">Email</Label>
              <View className="relative">
                <Input
                  placeholder="Nhập email của bạn"
                  keyboardType="email-address"
                  className="pl-10"
                />
                <Mail className="w-5 h-5 text-muted-foreground absolute left-3 top-3" />
              </View>
            </View>

            {/* Phone */}
            <View className="mb-4">
              <Label className="mb-2">Số điện thoại</Label>
              <View className="relative">
                <Input
                  placeholder="Nhập số điện thoại"
                  keyboardType="phone-pad"
                  className="pl-10"
                />
                <Phone className="w-5 h-5 text-muted-foreground absolute left-3 top-3" />
              </View>
            </View>

            {/* Password */}
            <View className="mb-4">
              <Label className="mb-2">Mật khẩu</Label>
              <View className="relative">
                <Input
                  placeholder="Nhập mật khẩu"
                  secureTextEntry={!showPassword}
                  className="pl-10 pr-10"
                />
                <Lock className="w-5 h-5 text-muted-foreground absolute left-3 top-3" />
                <Button
                  variant="ghost"
                  className="absolute right-2 top-2 w-6 h-6 p-0"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </View>
            </View>

            {/* Confirm Password */}
            <View className="mb-6">
              <Label className="mb-2">Xác nhận mật khẩu</Label>
              <View className="relative">
                <Input
                  placeholder="Nhập lại mật khẩu"
                  secureTextEntry={!showConfirmPassword}
                  className="pl-10 pr-10"
                />
                <Lock className="w-5 h-5 text-muted-foreground absolute left-3 top-3" />
                <Button
                  variant="ghost"
                  className="absolute right-2 top-2 w-6 h-6 p-0"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </View>
            </View>

            {/* Terms */}
            <View className="flex-row items-start mb-6">
              <Checkbox
                checked={agreeTerms}
                onCheckedChange={setAgreeTerms}
                className="mt-1 mr-3"
              />
              <Text className="text-sm text-muted-foreground flex-1">
                Tôi đồng ý với{' '}
                <Text className="text-primary font-semibold">Điều khoản sử dụng</Text>
                {' '}và{' '}
                <Text className="text-primary font-semibold">Chính sách bảo mật</Text>
              </Text>
            </View>

            {/* Submit Button */}
            <Button size="lg" disabled={!agreeTerms}>
              <Text className="text-white font-semibold">Đăng ký</Text>
            </Button>
          </Card>
        </View>

        {/* Login Link */}
        <View className="px-6 pb-8">
          <View className="flex-row justify-center">
            <Text className="text-muted-foreground">Đã có tài khoản? </Text>
            <Text className="text-primary font-semibold">Đăng nhập</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
