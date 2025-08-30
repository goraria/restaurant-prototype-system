import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin,
  Clock,
  FileText,
  ChevronRight,
  HeadphonesIcon,
  Settings,
  Info
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function SupportScreen() {
  const supportCategories = [
    {
      id: 1,
      title: 'Đặt bàn',
      description: 'Hỗ trợ đặt bàn và quản lý lịch hẹn',
      icon: HelpCircle,
      color: 'bg-blue-100 text-blue-600',
      route: '/(reservations)/'
    },
    {
      id: 2,
      title: 'Đặt món',
      description: 'Hỗ trợ đặt món và thanh toán',
      icon: MessageCircle,
      color: 'bg-green-100 text-green-600',
      route: '/(cart)/'
    },
    {
      id: 3,
      title: 'Tài khoản',
      description: 'Quản lý thông tin tài khoản',
      icon: Settings,
      color: 'bg-purple-100 text-purple-600',
      route: '/(tabs)/profile'
    },
    {
      id: 4,
      title: 'Thanh toán',
      description: 'Hỗ trợ thanh toán và hoàn tiền',
      icon: FileText,
      color: 'bg-orange-100 text-orange-600',
      route: '/(payments)/'
    }
  ];

  const contactMethods = [
    {
      id: 1,
      title: 'Chat trực tuyến',
      description: 'Hỗ trợ 24/7',
      icon: MessageCircle,
      color: 'bg-green-100 text-green-600',
      action: () => router.push('../(chat)/support')
    },
    {
      id: 2,
      title: 'Gọi điện',
      description: '+84 28 1234 5678',
      icon: Phone,
      color: 'bg-blue-100 text-blue-600',
      action: () => console.log('Call support')
    },
    {
      id: 3,
      title: 'Email',
      description: 'support@restaurant.com',
      icon: Mail,
      color: 'bg-purple-100 text-purple-600',
      action: () => console.log('Send email')
    }
  ];

  const faqItems = [
    {
      id: 1,
      question: 'Làm thế nào để đặt bàn?',
      answer: 'Bạn có thể đặt bàn thông qua ứng dụng bằng cách chọn ngày, giờ và số người.'
    },
    {
      id: 2,
      question: 'Có thể hủy đặt bàn không?',
      answer: 'Có, bạn có thể hủy đặt bàn trước 2 giờ so với thời gian đặt bàn.'
    },
    {
      id: 3,
      question: 'Nhà hàng có phục vụ giao hàng không?',
      answer: 'Hiện tại nhà hàng chỉ phục vụ tại chỗ, không có dịch vụ giao hàng.'
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <Text className="text-2xl font-bold text-foreground mb-4">Trung tâm hỗ trợ</Text>
        </View>

        {/* Quick Contact */}
        <View className="px-6 mb-6">
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
            <View className="flex-row items-center mb-4">
              <HeadphonesIcon className="w-8 h-8 text-primary mr-3" />
              <View className="flex-1">
                <Text className="text-lg font-bold text-foreground">Cần hỗ trợ ngay?</Text>
                <Text className="text-sm text-muted-foreground">
                  Đội ngũ hỗ trợ sẵn sàng giúp bạn 24/7
                </Text>
              </View>
            </View>
            <Button 
              size="lg"
              onPress={() => router.push('../(chat)/support')}
            >
              <MessageCircle className="w-5 h-5 mr-2 text-white" />
              <Text className="text-white font-semibold">Chat ngay</Text>
            </Button>
          </Card>
        </View>

        {/* Support Categories */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-4">Danh mục hỗ trợ</Text>
          <View className="space-y-3">
            {supportCategories.map((category) => (
              <Card key={category.id} className="p-4">
                <View className="flex-row items-center">
                  <View className={`w-12 h-12 ${category.color} rounded-full items-center justify-center mr-4`}>
                    <category.icon className="w-6 h-6" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-foreground">{category.title}</Text>
                    <Text className="text-sm text-muted-foreground">{category.description}</Text>
                  </View>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onPress={() => router.push(category.route as any)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Contact Methods */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-4">Liên hệ với chúng tôi</Text>
          <View className="space-y-3">
            {contactMethods.map((method) => (
              <Card key={method.id} className="p-4">
                <View className="flex-row items-center">
                  <View className={`w-12 h-12 ${method.color} rounded-full items-center justify-center mr-4`}>
                    <method.icon className="w-6 h-6" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-foreground">{method.title}</Text>
                    <Text className="text-sm text-muted-foreground">{method.description}</Text>
                  </View>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onPress={method.action}
                  >
                    <Text className="text-xs">Liên hệ</Text>
                  </Button>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* FAQ */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-foreground">Câu hỏi thường gặp</Text>
            <Button variant="ghost" onPress={() => router.push('../(support)/faq')}>
              <Text className="text-primary">Xem tất cả</Text>
            </Button>
          </View>
          
          <View className="space-y-3">
            {faqItems.map((faq) => (
              <Card key={faq.id} className="p-4">
                <View>
                  <Text className="font-semibold text-foreground mb-2">{faq.question}</Text>
                  <Text className="text-sm text-muted-foreground">{faq.answer}</Text>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Restaurant Info */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-4">Thông tin nhà hàng</Text>
          <Card className="p-4">
            <View className="space-y-3">
              <View className="flex-row items-center">
                <MapPin className="w-5 h-5 text-primary mr-3" />
                <View>
                  <Text className="font-semibold text-foreground">Địa chỉ</Text>
                  <Text className="text-sm text-muted-foreground">
                    123 Nguyễn Huệ, Quận 1, TP.HCM
                  </Text>
                </View>
              </View>
              
              <View className="flex-row items-center">
                <Phone className="w-5 h-5 text-primary mr-3" />
                <View>
                  <Text className="font-semibold text-foreground">Điện thoại</Text>
                  <Text className="text-sm text-muted-foreground">
                    +84 28 1234 5678
                  </Text>
                </View>
              </View>
              
              <View className="flex-row items-center">
                <Clock className="w-5 h-5 text-primary mr-3" />
                <View>
                  <Text className="font-semibold text-foreground">Giờ mở cửa</Text>
                  <Text className="text-sm text-muted-foreground">
                    07:00 - 22:00 (Thứ 2 - Chủ nhật)
                  </Text>
                </View>
              </View>
              
              <View className="flex-row items-center">
                <Mail className="w-5 h-5 text-primary mr-3" />
                <View>
                  <Text className="font-semibold text-foreground">Email</Text>
                  <Text className="text-sm text-muted-foreground">
                    info@restaurant.com
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
