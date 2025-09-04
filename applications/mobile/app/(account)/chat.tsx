import React, { useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MessageCircle,
  Search,
  MoreVertical,
  Plus,
  HeadphonesIcon,
  User,
  Phone,
  Video,
  Dot
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function ChatListScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const chatRooms = [
    {
      id: 1,
      name: 'Hỗ trợ khách hàng',
      lastMessage: 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ hỗ trợ bạn ngay!',
      time: '2 phút trước',
      unreadCount: 2,
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      isOnline: true,
      type: 'support',
    },
    {
      id: 2,
      name: 'Nhân viên phục vụ - Bàn A1',
      lastMessage: 'Món ăn của bạn sẽ được phục vụ trong 5 phút nữa',
      time: '10 phút trước',
      unreadCount: 0,
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      isOnline: true,
      type: 'service',
    },
    {
      id: 3,
      name: 'Quản lý nhà hàng',
      lastMessage: 'Xin lỗi vì sự cố. Chúng tôi sẽ bồi thường cho bạn',
      time: '1 giờ trước',
      unreadCount: 1,
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      isOnline: false,
      type: 'manager',
    },
    {
      id: 4,
      name: 'Đầu bếp chính',
      lastMessage: 'Món ăn đã được chuẩn bị theo yêu cầu của bạn',
      time: '2 giờ trước',
      unreadCount: 0,
      avatar:
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      isOnline: true,
      type: 'chef',
    },
  ];

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

  const filteredChats = chatRooms.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header Card */}
      <Card className="mx-4 mt-4 mb-4">
        <CardHeader>
          <View className="flex-row items-center justify-between">
            <CardTitle className="text-2xl">Tin nhắn</CardTitle>
            <View className="flex-row gap-2">
              <Button variant="ghost" size="sm">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </View>
          </View>
        </CardHeader>
      </Card>

      {/* Search Card */}
      <Card className="mx-4 mb-4">
        <CardContent className="p-4">
          <View className="relative">
            <Input
              placeholder="Tìm kiếm tin nhắn..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="pl-10"
            />
            <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-3" />
          </View>
        </CardContent>
      </Card>

      {/* Quick Actions Card */}
      <Card className="mx-4 mb-4">
        <CardContent className="p-4">
          <View className="flex-row gap-2">
            <Button 
              variant="outline"
              className="flex-1 mr-2"
              onPress={() => router.push('/support-chat' as any)}
            >
              <HeadphonesIcon className="mr-2 h-4 w-4" />
              <Text>Hỗ trợ</Text>
            </Button>
            <Button 
              variant="outline"
              className="flex-1"
              onPress={() => router.push('/new-chat' as any)}
            >
              <Plus className="mr-2 h-4 w-4" />
              <Text>Tin mới</Text>
            </Button>
          </View>
        </CardContent>
      </Card>

      {/* Chat List */}
      <ScrollView className="flex-1 px-4">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              onPress={() => router.push(`/chat/${chat.id}` as any)}
            >
              <Card className="mb-4">
                <CardContent className="p-4">
                  <View className="flex-row items-center">
                    {/* Avatar with Online Status */}
                    <View className="relative mr-4">
                      <Image
                        source={{ uri: chat.avatar }}
                        className="h-16 w-16 rounded-full"
                      />
                      {chat.isOnline && (
                        <View className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-background bg-green-500" />
                      )}
                    </View>

                    {/* Message Content */}
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between mb-1">
                        <Text className="font-semibold text-foreground text-base flex-1" numberOfLines={1}>
                          {chat.name}
                        </Text>
                        <Text className="text-xs text-muted-foreground ml-2">{chat.time}</Text>
                      </View>

                      <View className="flex-row items-center justify-between">
                        <Text
                          className="text-sm text-muted-foreground flex-1 mr-2"
                          numberOfLines={2}
                        >
                          {chat.lastMessage}
                        </Text>
                        {chat.unreadCount > 0 && (
                          <View className="bg-primary rounded-full min-w-[24px] h-6 items-center justify-center px-2">
                            <Text className="text-white text-xs font-bold">
                              {chat.unreadCount}
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Chat Type Badge */}
                      <View className="mt-2">
                        <Badge variant="secondary" className="self-start">
                          <Text className="text-xs">
                            {getChatTypeText(chat.type)}
                          </Text>
                        </Badge>
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
            </TouchableOpacity>
          ))
        ) : (
          <Card className="mb-4">
            <CardContent className="p-8 items-center">
              <MessageCircle className="mb-4 h-16 w-16 text-muted-foreground" />
              <CardTitle className="text-lg mb-2 text-center">
                {searchQuery ? 'Không tìm thấy cuộc trò chuyện' : 'Chưa có tin nhắn'}
              </CardTitle>
              <CardDescription className="text-center mb-4">
                {searchQuery
                  ? 'Không có cuộc trò chuyện nào phù hợp với tìm kiếm của bạn'
                  : 'Bắt đầu trò chuyện với nhân viên để được hỗ trợ'}
              </CardDescription>
              {!searchQuery && (
                <Button onPress={() => router.push('/support-chat' as any)}>
                  <HeadphonesIcon className="mr-2 h-5 w-5 text-white" />
                  <Text className="font-semibold text-white">Liên hệ hỗ trợ</Text>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </ScrollView>

      {/* Quick Support Button Card */}
      <Card className="mx-4 mb-4">
        <CardContent className="p-4">
          <Button 
            variant="outline" 
            size="lg" 
            onPress={() => router.push('/support-chat' as any)}
            className="w-full"
          >
            <HeadphonesIcon className="mr-2 h-5 w-5" />
            <Text className="font-semibold">Cần hỗ trợ ngay?</Text>
          </Button>
        </CardContent>
      </Card>
    </SafeAreaView>
  );
}
