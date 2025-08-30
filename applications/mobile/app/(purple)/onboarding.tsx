import React from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, Heart, Star, Users } from 'lucide-react-native';

export default function OnboardingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-8 pb-4">
          <Text className="text-3xl font-bold text-foreground mb-2">
            Chào mừng đến với
          </Text>
          <Text className="text-3xl font-bold text-primary mb-4">
            PetCare Pro
          </Text>
          <Text className="text-base text-muted-foreground leading-6">
            Nền tảng chăm sóc thú cưng hàng đầu với dịch vụ chất lượng cao và đội ngũ chuyên nghiệp
          </Text>
        </View>

        {/* Hero Image */}
        <View className="px-6 mb-8">
          <Card className="p-0 overflow-hidden">
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=600&fit=crop' }}
              className="w-full h-64"
              resizeMode="cover"
            />
          </Card>
        </View>

        {/* Features */}
        <View className="px-6 mb-8">
          <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center mr-4">
              <Heart className="w-6 h-6 text-primary" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-foreground">Chăm sóc tận tâm</Text>
              <Text className="text-sm text-muted-foreground">Dịch vụ chăm sóc thú cưng chất lượng cao</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center mr-4">
              <Star className="w-6 h-6 text-primary" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-foreground">Đánh giá 5 sao</Text>
              <Text className="text-sm text-muted-foreground">Hàng nghìn khách hàng hài lòng</Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center mr-4">
              <Users className="w-6 h-6 text-primary" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-foreground">Chuyên gia giàu kinh nghiệm</Text>
              <Text className="text-sm text-muted-foreground">Đội ngũ bác sĩ thú y chuyên nghiệp</Text>
            </View>
          </View>
        </View>

        {/* CTA Buttons */}
        <View className="px-6 pb-8">
          <Button className="mb-4" size="lg">
            <Text className="text-white font-semibold">Bắt đầu ngay</Text>
            <ArrowRight className="w-5 h-5 ml-2 text-white" />
          </Button>
          
          <Button variant="outline" size="lg">
            <Text className="font-semibold">Đăng nhập</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
