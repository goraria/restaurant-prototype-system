import React, { useState } from 'react';
import { View, ScrollView, Image, TextInput } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Search, 
  MoreVertical, 
  Send, 
  Paperclip,
  Camera,
  Phone,
  Video,
  User,
  Clock,
  Check,
  CheckCheck
} from 'lucide-react-native';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chats');

  const chats = [
    {
      id: 1,
      name: 'Dr. Nguyễn Văn A',
      lastMessage: 'Kết quả khám của Lucky rất tốt, bạn có thể yên tâm',
      time: '14:30',
      unreadCount: 2,
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      isOnline: true
    },
    {
      id: 2,
      name: 'Dr. Trần Thị B',
      lastMessage: 'Milo cần tiêm vaccine vào tuần tới',
      time: '09:15',
      unreadCount: 0,
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
      isOnline: false
    },
    {
      id: 3,
      name: 'Hỗ trợ khách hàng',
      lastMessage: 'Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi',
      time: 'Hôm qua',
      unreadCount: 1,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      isOnline: true
    }
  ];

  const messages = [
    {
      id: 1,
      text: 'Chào bạn! Tôi là Dr. Nguyễn Văn A, bác sĩ thú y phụ trách Lucky',
      time: '14:00',
      isFromMe: false,
      status: 'sent'
    },
    {
      id: 2,
      text: 'Chào bác sĩ! Cảm ơn bác sĩ đã khám cho Lucky',
      time: '14:02',
      isFromMe: true,
      status: 'read'
    },
    {
      id: 3,
      text: 'Kết quả khám của Lucky rất tốt, bạn có thể yên tâm',
      time: '14:05',
      isFromMe: false,
      status: 'sent'
    },
    {
      id: 4,
      text: 'Lucky có cần uống thuốc gì không ạ?',
      time: '14:10',
      isFromMe: true,
      status: 'read'
    },
    {
      id: 5,
      text: 'Không cần thuốc gì cả, chỉ cần duy trì chế độ ăn và tập luyện như hiện tại',
      time: '14:15',
      isFromMe: false,
      status: 'sent'
    },
    {
      id: 6,
      text: 'Cảm ơn bác sĩ nhiều!',
      time: '14:20',
      isFromMe: true,
      status: 'sent'
    }
  ];

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="w-3 h-3 text-muted-foreground" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return <Clock className="w-3 h-3 text-muted-foreground" />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-4 pb-6 border-b border-border">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Button variant="ghost" className="w-10 h-10 p-0 mr-3">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Text className="text-2xl font-bold text-foreground">Tin nhắn</Text>
          </View>
          <View className="flex-row space-x-2">
            <Button variant="ghost" size="sm">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row space-x-4">
          <Button
            variant={activeTab === 'chats' ? 'default' : 'ghost'}
            size="sm"
            onPress={() => setActiveTab('chats')}
          >
            <Text className={activeTab === 'chats' ? 'text-white' : 'text-foreground'}>
              Trò chuyện
            </Text>
          </Button>
          <Button
            variant={activeTab === 'calls' ? 'default' : 'ghost'}
            size="sm"
            onPress={() => setActiveTab('calls')}
          >
            <Text className={activeTab === 'calls' ? 'text-white' : 'text-foreground'}>
              Cuộc gọi
            </Text>
          </Button>
        </View>
      </View>

      {activeTab === 'chats' ? (
        <>
          {/* Chats List */}
          <ScrollView className="flex-1 px-6">
            {chats.map((chat) => (
              <Card key={chat.id} className="p-4 mb-3">
                <View className="flex-row items-center">
                  <View className="relative mr-4">
                    <Avatar className="w-12 h-12">
                      <Image
                        source={{ uri: chat.avatar }}
                        className="w-full h-full rounded-full"
                      />
                    </Avatar>
                    {chat.isOnline && (
                      <View className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </View>
                  <View className="flex-1">
                    <View className="flex-row justify-between items-start mb-1">
                      <Text className="font-semibold text-foreground">{chat.name}</Text>
                      <Text className="text-xs text-muted-foreground">{chat.time}</Text>
                    </View>
                    <Text className="text-sm text-muted-foreground mb-2" numberOfLines={1}>
                      {chat.lastMessage}
                    </Text>
                    {chat.unreadCount > 0 && (
                      <Badge className="bg-primary text-white w-5 h-5 rounded-full items-center justify-center">
                        <Text className="text-xs text-white">{chat.unreadCount}</Text>
                      </Badge>
                    )}
                  </View>
                </View>
              </Card>
            ))}
          </ScrollView>

          {/* Chat Detail View */}
          <View className="flex-1 px-6 py-4 border-t border-border">
            {/* Chat Header */}
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <Avatar className="w-10 h-10 mr-3">
                  <Image
                    source={{ uri: chats[0].avatar }}
                    className="w-full h-full rounded-full"
                  />
                </Avatar>
                <View>
                  <Text className="font-semibold text-foreground">{chats[0].name}</Text>
                  <Text className="text-xs text-green-600">Đang hoạt động</Text>
                </View>
              </View>
              <View className="flex-row space-x-2">
                <Button variant="ghost" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="w-4 h-4" />
                </Button>
              </View>
            </View>

            {/* Messages */}
            <ScrollView className="flex-1 mb-4">
              {messages.map((msg) => (
                <View
                  key={msg.id}
                  className={`mb-3 ${msg.isFromMe ? 'items-end' : 'items-start'}`}
                >
                  <View
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.isFromMe
                        ? 'bg-primary text-white'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <Text className={msg.isFromMe ? 'text-white' : 'text-foreground'}>
                      {msg.text}
                    </Text>
                    <View className="flex-row items-center justify-end mt-1">
                      <Text className={`text-xs mr-1 ${
                        msg.isFromMe ? 'text-white/70' : 'text-muted-foreground'
                      }`}>
                        {msg.time}
                      </Text>
                      {msg.isFromMe && getMessageStatusIcon(msg.status)}
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Message Input */}
            <View className="flex-row items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Camera className="w-5 h-5" />
              </Button>
              <View className="flex-1 bg-muted rounded-full px-4 py-2">
                <TextInput
                  placeholder="Nhập tin nhắn..."
                  value={message}
                  onChangeText={setMessage}
                  className="text-foreground"
                  multiline
                />
              </View>
              <Button
                variant="ghost"
                size="sm"
                disabled={!message.trim()}
                className={!message.trim() ? 'opacity-50' : ''}
              >
                <Send className="w-5 h-5 text-primary" />
              </Button>
            </View>
          </View>
        </>
      ) : (
        /* Calls History */
        <ScrollView className="flex-1 px-6">
          <Card className="p-8 items-center">
            <Phone className="w-12 h-12 text-muted-foreground mb-4" />
            <Text className="text-lg font-semibold text-foreground mb-2">Chưa có cuộc gọi</Text>
            <Text className="text-muted-foreground text-center">
              Lịch sử cuộc gọi sẽ xuất hiện ở đây
            </Text>
          </Card>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
