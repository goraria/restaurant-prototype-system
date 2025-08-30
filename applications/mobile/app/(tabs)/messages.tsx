import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { UserMenu } from '@/components/auth/user-menu';
import { useUser } from '@clerk/clerk-expo';
import { Link, Stack } from 'expo-router';
import { HeadphonesIcon, SquarePen, User, XIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Image, type ImageStyle, View } from 'react-native';
import { ThemeToggle } from '@/components/element/ThemeToggle';
import { useState } from 'react';

export default function Screen() {
  const { colorScheme } = useColorScheme();
  const { user } = useUser();

  const [searchQuery, setSearchQuery] = useState('');

  const chatRooms = [
    {
      id: 1,
      name: 'Hỗ trợ khách hàng',
      lastMessage: 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ hỗ trợ bạn ngay!',
      time: '2 phút trước',
      unreadCount: 2,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      isOnline: true,
      type: 'support'
    },
    {
      id: 2,
      name: 'Nhân viên phục vụ - Bàn A1',
      lastMessage: 'Món ăn của bạn sẽ được phục vụ trong 5 phút nữa',
      time: '10 phút trước',
      unreadCount: 0,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      isOnline: true,
      type: 'service'
    },
    {
      id: 3,
      name: 'Quản lý nhà hàng',
      lastMessage: 'Xin lỗi vì sự cố. Chúng tôi sẽ bồi thường cho bạn',
      time: '1 giờ trước',
      unreadCount: 1,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      isOnline: false,
      type: 'manager'
    },
    {
      id: 4,
      name: 'Đầu bếp chính',
      lastMessage: 'Món ăn đã được chuẩn bị theo yêu cầu của bạn',
      time: '2 giờ trước',
      unreadCount: 0,
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      isOnline: true,
      type: 'chef'
    }
  ];

  const getChatTypeIcon = (type: string) => {
    switch (type) {
      case 'support':
        return <HeadphonesIcon className="w-4 h-4 text-blue-600" />;
      case 'service':
        return <User className="w-4 h-4 text-green-600" />;
      case 'manager':
        return <User className="w-4 h-4 text-purple-600" />;
      case 'chef':
        return <User className="w-4 h-4 text-orange-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getChatTypeColor = (type: string) => {
    switch (type) {
      case 'support':
        return 'bg-blue-100 text-blue-800';
      case 'service':
        return 'bg-green-100 text-green-800';
      case 'manager':
        return 'bg-purple-100 text-purple-800';
      case 'chef':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getChatTypeText = (type: string) => {
    switch (type) {
      case 'support':
        return 'Hỗ trợ';
      case 'service':
        return 'Phục vụ';
      case 'manager':
        return 'Quản lý';
      case 'chef':
        return 'Đầu bếp';
      default:
        return 'Khác';
    }
  };

  const filteredChats = chatRooms.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <View className="bg-background pt-16 pb-4 px-4 border-b border-border">
              <View className="flex-row items-center justify-between gap-3">
                <UserMenu />
                <View className="flex-1 justify-center items-center">
                  <Text className="text-lg font-semibold">Tin nhắn</Text>
                </View>
                <Button
                  onPress={() => {
                  }}
                  size="icon"
                  variant="ghost"
                  className="rounded-full p-4"
                >
                  <Icon
                    as={SquarePen}
                    className="size-6"
                  />
                </Button>
              </View>
            </View>
          ),
        }}
      />
      <View className="flex-1 items-center justify-center gap-8 p-4">
        <View className="flex-row items-center justify-center gap-3.5">
          <Image
            source={{
              light: require('@/assets/images/clerk-logo-light.png'),
              dark: require('@/assets/images/clerk-logo-dark.png'),
            }[colorScheme ?? 'light']}
            resizeMode="contain"
            style={{
              height: 36,
              width: 40,
            }}
          />
          <Icon as={XIcon} className="mr-1 size-5" />
          <Image
            source={{
              light: require('@/assets/images/react-native-reusables-light.png'),
              dark: require('@/assets/images/react-native-reusables-dark.png'),
            }[colorScheme ?? 'light']}
            style={{
              height: 36,
              width: 40,
            }}
            resizeMode="contain"
          />
        </View>
        <View className="max-w-sm gap-2 px-4">
          <Text variant="h1" className="text-3xl font-medium">
            Make it yours{user?.firstName ? `, ${user.firstName}` : ''}.
          </Text>
          <Text className="ios:text-foreground text-center font-mono text-sm text-muted-foreground">
            Update the screens and components to match your design and logic.
          </Text>
        </View>
        <View className="gap-2">
          <Link href="/(account)/chat" asChild>
            <Button size="sm">
              <Text>Explore Clerk Docs</Text>
            </Button>
          </Link>
        </View>
      </View>
    </>
  );
}