import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Linking
} from 'react-native';
import { ArrowLeft, Globe, MapPin, Clock, DollarSign, Star, Phone, Mail, MessageCircle, Shield, FileText, Heart, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Application from 'expo-application';
import { Platform } from 'react-native';
import { HeaderStack } from '@/components/layout/header';
import { Card, CardContent } from '@/components/ui/card';

interface InfoItem {
  id: string;
  title: string;
  value: string;
  icon: any;
  type: 'text' | 'link' | 'phone' | 'email';
  action?: string;
  emoji?: string;
}

export default function AboutScreen() {
  const router = useRouter();
  const [appVersion, setAppVersion] = useState<string>('');
  const [deviceInfo, setDeviceInfo] = useState<string>('');

  useEffect(() => {
    const version = Application.nativeApplicationVersion || '1.0.0';
    const buildNumber = Application.nativeBuildVersion || '1';
    setAppVersion(`${version} (${buildNumber})`);

    const deviceModel = Platform.OS === 'ios' ? 'iPhone' : 'Android Device';
    const osVersion = Platform.Version;
    setDeviceInfo(`${deviceModel} - ${Platform.OS} ${osVersion}`);
  }, []);

  const restaurantInfo: InfoItem[] = [
    {
      id: 'name',
      title: 'Tên nhà hàng',
      value: 'Waddles Vietnamese Restaurant',
      icon: Heart,
      type: 'text',
      emoji: '🏪'
    },
    {
      id: 'address',
      title: 'Địa chỉ',
      value: '123 Phố Ẩm Thực, Quận 1, TP.HCM',
      icon: MapPin,
      type: 'link',
      action: 'https://maps.google.com/?q=123+Pho+Am+Thuc+Quan+1+HCMC',
      emoji: '📍'
    },
    {
      id: 'phone',
      title: 'Số điện thoại',
      value: '(028) 1234-5678',
      icon: Phone,
      type: 'phone',
      action: 'tel:+842812345678',
      emoji: '📞'
    },
    {
      id: 'email',
      title: 'Email',
      value: 'hello@waddles.vn',
      icon: Mail,
      type: 'email',
      action: 'mailto:hello@waddles.vn',
      emoji: '✉️'
    },
    {
      id: 'hours',
      title: 'Giờ mở cửa',
      value: 'T2-CN: 10:00 - 22:00',
      icon: Clock,
      type: 'text',
      emoji: '🕐'
    },
    {
      id: 'website',
      title: 'Website',
      value: 'www.waddles.vn',
      icon: Globe,
      type: 'link',
      action: 'https://www.waddles.vn',
      emoji: '🌐'
    }
  ];

  const supportInfo: InfoItem[] = [
    {
      id: 'support_phone',
      title: 'Hỗ trợ khách hàng',
      value: '1900-WADDLES',
      icon: Phone,
      type: 'phone',
      action: 'tel:1900923353',
      emoji: '🎧'
    },
    {
      id: 'support_email',
      title: 'Email hỗ trợ',
      value: 'support@waddles.vn',
      icon: Mail,
      type: 'email',
      action: 'mailto:support@waddles.vn',
      emoji: '💬'
    },
    {
      id: 'feedback',
      title: 'Gửi phản hồi',
      value: 'Đánh giá ứng dụng',
      icon: Star,
      type: 'link',
      action: 'https://apps.apple.com/app/waddles',
      emoji: '⭐'
    }
  ];

  const legalInfo: InfoItem[] = [
    {
      id: 'privacy',
      title: 'Chính sách bảo mật',
      value: 'Xem chi tiết',
      icon: Shield,
      type: 'link',
      action: 'https://www.waddles.vn/privacy',
      emoji: '🔒'
    },
    {
      id: 'terms',
      title: 'Điều khoản sử dụng',
      value: 'Xem chi tiết',
      icon: FileText,
      type: 'link',
      action: 'https://www.waddles.vn/terms',
      emoji: '📋'
    }
  ];

  const handlePress = (item: InfoItem) => {
    if (item.type === 'text') return;

    if (item.action) {
      if (item.type === 'link') {
        Linking.openURL(item.action).catch(err => {
          Alert.alert('Lỗi', 'Không thể mở liên kết này');
        });
      } else if (item.type === 'phone') {
        Linking.openURL(item.action).catch(err => {
          Alert.alert('Lỗi', 'Không thể thực hiện cuộc gọi');
        });
      } else if (item.type === 'email') {
        Linking.openURL(item.action).catch(err => {
          Alert.alert('Lỗi', 'Không thể mở ứng dụng email');
        });
      }
    }
  };

  const renderInfoSection = (title: string, items: InfoItem[], sectionEmoji: string) => (
    <View className="px-4 mb-8">
      <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
        {sectionEmoji} {title}
      </Text>
      <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          {items.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity
                className={`flex-row items-center py-4 px-5 ${
                  item.type === 'text' ? '' : 'active:bg-muted/50'
                }`}
                onPress={() => handlePress(item)}
                disabled={item.type === 'text'}
              >
                <View className="w-10 h-10 bg-primary/10 rounded-xl items-center justify-center mr-4">
                  <Text className="text-lg">{item.emoji}</Text>
                </View>
                
                <View className="flex-1">
                  <Text className="text-base font-medium text-foreground mb-1">
                    {item.title}
                  </Text>
                  <Text className={`text-sm leading-5 ${
                    item.type !== 'text' ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {item.value}
                  </Text>
                </View>

                {item.type !== 'text' && (
                  <ChevronRight size={16} className="text-muted-foreground" />
                )}
              </TouchableOpacity>
              
              {index < items.length - 1 && (
                <View className="border-b border-border/50 ml-14" />
              )}
            </View>
          ))}
        </CardContent>
      </Card>
    </View>
  );

  return (
    <>
      <HeaderStack
        position="left"
        iconLeft={ArrowLeft}
        iconLeftAction={() => router.back()}
        title="Về chúng tôi"
      />
      
      <ScrollView className="flex-1 bg-background">
        {/* Tiêu đề lớn kiểu iOS 18 */}
        <View className="px-5 pt-2 pb-6">
          <Text className="text-4xl font-bold text-foreground tracking-tight">Về chúng tôi</Text>
        </View>

        {/* App info header */}
        <View className="items-center py-8 px-5">
          <View className="w-24 h-24 bg-primary/10 rounded-3xl items-center justify-center mb-6 shadow-lg">
            <Heart size={48} color="#EC6683" />
          </View>
          <Text className="text-2xl font-bold text-foreground mb-2">Waddles</Text>
          <Text className="text-lg text-muted-foreground mb-2">Ứng dụng đặt món Việt Nam</Text>
          <View className="px-3 py-1 bg-muted rounded-lg">
            <Text className="text-sm font-medium text-muted-foreground">
              Phiên bản {appVersion}
            </Text>
          </View>
        </View>

        {/* Restaurant info */}
        {renderInfoSection('Thông tin nhà hàng', restaurantInfo, '🏪')}

        {/* Support info */}
        {renderInfoSection('Hỗ trợ & phản hồi', supportInfo, '🎧')}

        {/* Legal info */}
        {renderInfoSection('Pháp lý', legalInfo, '📋')}

        {/* Technical info */}
        <View className="px-4 mb-8">
          <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
            📱 Thông tin kỹ thuật
          </Text>
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="p-0">
              <View className="flex-row items-center py-4 px-5">
                <View className="w-10 h-10 bg-blue-100 rounded-xl items-center justify-center mr-4">
                  <Text className="text-lg">📱</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-foreground mb-1">
                    Thiết bị
                  </Text>
                  <Text className="text-sm text-muted-foreground leading-5">
                    {deviceInfo}
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Footer */}
        <View className="items-center py-8 px-5">
          <Text className="text-sm font-medium text-foreground mb-2 text-center">
            © 2024 Waddles Vietnamese Restaurant
          </Text>
          <Text className="text-sm text-muted-foreground text-center">
            Được phát triển với ❤️ tại Việt Nam
          </Text>
        </View>

        {/* Khoảng trống cuối trang */}
        <View className="h-20" />
      </ScrollView>
    </>
  );
}
