import React, { useState } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User } from 'lucide-react-native';

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <Button variant="ghost" className="w-10 h-10 p-0 mb-4">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <Text className="text-3xl font-bold text-foreground mb-2">
            Đăng nhập
          </Text>
          <Text className="text-base text-muted-foreground">
            Chào mừng bạn trở lại! Vui lòng đăng nhập để tiếp tục
          </Text>
        </View>

        {/* Form */}
        <View className="px-6 mb-6">
          <Card className="p-6">
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

            {/* Remember Me & Forgot Password */}
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-row items-center">
                <Checkbox
                  checked={rememberMe}
                  onCheckedChange={setRememberMe}
                  className="mr-2"
                />
                <Text className="text-sm text-muted-foreground">Ghi nhớ đăng nhập</Text>
              </View>
              <Text className="text-sm text-primary font-semibold">Quên mật khẩu?</Text>
            </View>

            {/* Login Button */}
            <Button size="lg" className="mb-6">
              <Text className="text-white font-semibold">Đăng nhập</Text>
            </Button>

            {/* Divider */}
            <View className="flex-row items-center mb-6">
              <Separator className="flex-1" />
              <Text className="mx-4 text-sm text-muted-foreground">hoặc</Text>
              <Separator className="flex-1" />
            </View>

            {/* Social Login */}
            <View className="space-y-3">
              <Button variant="outline" size="lg">
                <View className="w-6 h-6 bg-blue-500 rounded-full mr-3" />
                <Text className="font-semibold">Tiếp tục với Google</Text>
              </Button>
              
              <Button variant="outline" size="lg">
                <View className="w-6 h-6 bg-blue-600 rounded-full mr-3" />
                <Text className="font-semibold">Tiếp tục với Facebook</Text>
              </Button>
              
              <Button variant="outline" size="lg">
                <View className="w-6 h-6 bg-black rounded-full mr-3" />
                <Text className="font-semibold">Tiếp tục với Apple</Text>
              </Button>
            </View>
          </Card>
        </View>

        {/* Register Link */}
        <View className="px-6 pb-8">
          <View className="flex-row justify-center">
            <Text className="text-muted-foreground">Chưa có tài khoản? </Text>
            <Text className="text-primary font-semibold">Đăng ký ngay</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
