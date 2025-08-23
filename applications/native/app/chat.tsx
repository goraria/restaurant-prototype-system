import React, { useState } from 'react';
import { View, ScrollView, Pressable, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft,
  Phone,
  Video,
  MoreHorizontal,
  Send,
  CheckCheck,
  Camera,
  Image as ImageIcon,
  Paperclip
} from 'lucide-react-native';

interface ChatMessage {
  id: string;
  message: string;
  time: string;
  isUser: boolean;
  isRead: boolean;
}

export default function ChatScreen() {
  const { chatId, name, avatar } = useLocalSearchParams();
  const [messageText, setMessageText] = useState('');

  const chatMessages: ChatMessage[] = [
    {
      id: '1',
      message: 'Xin chào! Tôi muốn đặt bàn cho 4 người vào tối nay.',
      time: '19:30',
      isUser: true,
      isRead: true
    },
    {
      id: '2',
      message: 'Chào bạn! Chúng tôi có bàn trống lúc 20:00. Bạn có muốn đặt không?',
      time: '19:32',
      isUser: false,
      isRead: true
    },
    {
      id: '3',
      message: 'Được ạ, tôi đặt bàn lúc 20:00 nhé.',
      time: '19:33',
      isUser: true,
      isRead: true
    },
    {
      id: '4',
      message: 'Cảm ơn bạn! Chúng tôi đã xác nhận đặt bàn. Hẹn gặp bạn lúc 20:00.',
      time: '19:35',
      isUser: false,
      isRead: false
    }
  ];

  const sendMessage = () => {
    if (messageText.trim()) {
      // TODO: Implement send message logic
      setMessageText('');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Chat Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-border shadow-sm">
        <Pressable onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} className="text-foreground" />
        </Pressable>
        
        <Image 
          source={{ uri: avatar as string }}
          className="w-10 h-10 rounded-full mr-3"
        />
        
        <View className="flex-1">
          <Text className="font-semibold text-foreground text-base">
            {name}
          </Text>
          <Text className="text-sm text-green-500">Đang hoạt động</Text>
        </View>
        
        <View className="flex-row space-x-4">
          <Pressable className="w-10 h-10 bg-muted rounded-full items-center justify-center">
            <Phone size={20} className="text-primary" />
          </Pressable>
          <Pressable className="w-10 h-10 bg-muted rounded-full items-center justify-center">
            <Video size={20} className="text-primary" />
          </Pressable>
          <Pressable className="w-10 h-10 bg-muted rounded-full items-center justify-center">
            <MoreHorizontal size={20} className="text-muted-foreground" />
          </Pressable>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Messages */}
        <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
          {chatMessages.map((msg) => (
            <View
              key={msg.id}
              className={`mb-4 ${msg.isUser ? 'items-end' : 'items-start'}`}
            >
              <View
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  msg.isUser
                    ? 'bg-primary rounded-br-md'
                    : 'bg-muted rounded-bl-md'
                }`}
              >
                <Text className={`${msg.isUser ? 'text-white' : 'text-foreground'}`}>
                  {msg.message}
                </Text>
              </View>
              <View className="flex-row items-center mt-1 px-1">
                <Text className="text-xs text-muted-foreground mr-1">
                  {msg.time}
                </Text>
                {msg.isUser && (
                  <CheckCheck 
                    size={14} 
                    className={msg.isRead ? 'text-primary' : 'text-muted-foreground'} 
                  />
                )}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input Area */}
        <View className="px-4 py-3 bg-white border-t border-border">
          <View className="flex-row items-end space-x-2">
            {/* Attachment Button */}
            <Pressable className="w-10 h-10 bg-muted rounded-full items-center justify-center">
              <Paperclip size={20} className="text-muted-foreground" />
            </Pressable>
            
            {/* Message Input */}
            <View className="flex-1 max-h-32">
              <Input
                placeholder="Nhập tin nhắn..."
                value={messageText}
                onChangeText={setMessageText}
                multiline
                className="min-h-[40px] max-h-32 bg-muted border-0 rounded-2xl px-4 py-2"
                style={{ textAlignVertical: 'top' }}
              />
            </View>
            
            {/* Camera Button */}
            <Pressable className="w-10 h-10 bg-muted rounded-full items-center justify-center">
              <Camera size={20} className="text-muted-foreground" />
            </Pressable>
            
            {/* Send Button */}
            <Pressable
              onPress={sendMessage}
              className={`w-10 h-10 rounded-full items-center justify-center ${
                messageText.trim() ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <Send 
                size={20} 
                color={messageText.trim() ? 'white' : '#6b7280'} 
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
