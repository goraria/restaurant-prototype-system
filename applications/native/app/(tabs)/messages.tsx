import React, { useState } from 'react';
import { View, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Header } from '@/components/layout/Header';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare,
  Search,
  Phone,
  Video,
  MoreHorizontal,
  Send,
  Star,
  Clock,
  CheckCheck
} from 'lucide-react-native';

interface Message {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  isRestaurant?: boolean;
}

interface ChatMessage {
  id: string;
  message: string;
  time: string;
  isUser: boolean;
  isRead: boolean;
}

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const conversations: Message[] = [
    {
      id: '1',
      name: 'Waddles Restaurant',
      avatar: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100',
      lastMessage: 'Cảm ơn bạn đã đặt bàn. Chúng tôi đã xác nhận đơn của bạn.',
      time: '2 phút',
      unread: 2,
      online: true,
      isRestaurant: true
    },
    {
      id: '2',
      name: 'Hỗ trợ khách hàng',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      lastMessage: 'Chúng tôi có thể giúp gì cho bạn?',
      time: '1 giờ',
      unread: 0,
      online: true,
      isRestaurant: true
    },
    {
      id: '3',
      name: 'Delivery Team',
      avatar: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100',
      lastMessage: 'Đơn hàng của bạn đang được giao.',
      time: '3 giờ',
      unread: 1,
      online: false,
      isRestaurant: true
    }
  ];

  const openChat = (conversation: Message) => {
    router.push({
      pathname: '/chat',
      params: {
        chatId: conversation.id,
        name: conversation.name,
        avatar: conversation.avatar
      }
    } as any);
  };

  if (false) { // Remove chat view - use separate screen
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Simple Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-background border-b border-border">
        <Text className="text-xl font-bold text-foreground">Tin nhắn</Text>
        <Pressable>
          <Search size={24} className="text-muted-foreground" />
        </Pressable>
      </View>
      
      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View className="mb-4">
          <View className="flex-row items-center bg-muted px-3 py-2 rounded-xl">
            <Search size={18} className="text-muted-foreground mr-2" />
            <Input
              placeholder="Tìm kiếm cuộc trò chuyện..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 border-0 bg-transparent"
            />
          </View>
        </View>

        {/* Online Support */}
        <Card className="p-4 mb-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-primary/20 rounded-full items-center justify-center mr-3">
              <MessageSquare size={24} className="text-primary" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-foreground">Hỗ trợ trực tuyến</Text>
              <Text className="text-sm text-muted-foreground">
                Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
              </Text>
            </View>
            <Button 
              size="sm" 
              onPress={() => openChat(conversations.find(c => c.id === '2')!)}
              className="bg-primary"
            >
              <Text className="text-primary-foreground">Chat</Text>
            </Button>
          </View>
        </Card>

        {/* Conversations */}
        <View>
          <Text className="text-lg font-semibold text-foreground mb-3">
            Cuộc trò chuyện
          </Text>
          
          {conversations.map((conversation) => (
            <Pressable
              key={conversation.id}
              onPress={() => openChat(conversation)}
              className="flex-row items-center py-4 border-b border-border/50"
            >
              <View className="relative mr-3">
                <Image 
                  source={{ uri: conversation.avatar }}
                  className="w-14 h-14 rounded-full"
                />
                {conversation.online && (
                  <View className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                )}
              </View>
              
              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="font-semibold text-foreground text-base">
                    {conversation.name}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    {conversation.time}
                  </Text>
                </View>
                
                <View className="flex-row items-center justify-between">
                  <Text 
                    className="text-sm text-muted-foreground flex-1 mr-2"
                    numberOfLines={1}
                  >
                    {conversation.lastMessage}
                  </Text>
                  
                  {conversation.unread > 0 && (
                    <View className="w-6 h-6 bg-primary rounded-full items-center justify-center">
                      <Text className="text-xs text-white font-semibold">
                        {conversation.unread}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              
              {conversation.isRestaurant && (
                <Star size={16} className="text-yellow-500 ml-2" />
              )}
            </Pressable>
          ))}
        </View>

        {/* Empty State */}
        {conversations.length === 0 && (
          <View className="items-center justify-center py-20">
            <MessageSquare size={64} className="text-muted-foreground mb-4" />
            <Text className="text-lg font-semibold text-foreground mb-2">
              Chưa có tin nhắn
            </Text>
            <Text className="text-muted-foreground text-center px-8">
              Bắt đầu cuộc trò chuyện với nhà hàng hoặc đội ngũ hỗ trợ
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
