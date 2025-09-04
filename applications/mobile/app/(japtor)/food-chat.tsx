import React, { useState } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Mic, Image as ImageIcon, Bot, User } from 'lucide-react-native';

const messages = [
  {
    id: 1,
    type: 'bot',
    text: 'Xin chào! Tôi là trợ lý dinh dưỡng của bạn. Bạn muốn tìm hiểu gì về dinh dưỡng hôm nay?',
    time: '10:30'
  },
  {
    id: 2,
    type: 'user',
    text: 'Bạn có thể gợi ý bữa sáng lành mạnh được không?',
    time: '10:31'
  },
  {
    id: 3,
    type: 'bot',
    text: 'Tất nhiên! Dựa trên sở thích ăn uống của bạn, tôi gợi ý:',
    time: '10:31'
  },
  {
    id: 4,
    type: 'bot',
    text: '• Bánh mì bơ với trứng\n• Sữa chua Hy Lạp với quả mọng\n• Yến mạch với hạt và trái cây',
    time: '10:32'
  }
];

export default function FoodChatDemo() {
  const [inputText, setInputText] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <Card className="mx-4 mt-4 mb-4">
          <CardHeader>
            <View className="flex-row items-center">
              <TouchableOpacity 
                onPress={() => router.back()} 
                className="w-10 h-10 items-center justify-center mr-3"
              >
                <ArrowLeft className="w-5 h-5" />
              </TouchableOpacity>
              <View className="flex-1">
                <CardTitle className="text-lg">Trợ lý dinh dưỡng</CardTitle>
                <View className="flex-row items-center mt-1">
                  <Badge variant="secondary" className="mr-2">
                    <Text className="text-xs">Đang hoạt động</Text>
                  </Badge>
                </View>
              </View>
              <View className="w-12 h-12 bg-primary rounded-full items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </View>
            </View>
          </CardHeader>
        </Card>

        {/* Messages */}
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {messages.map((message) => (
            <View
              key={message.id}
              className={`mb-4 ${message.type === 'user' ? 'items-end' : 'items-start'}`}
            >
              <Card className={`max-w-[80%] ${message.type === 'user' ? 'bg-primary' : ''}`}>
                <CardContent className="p-3">
                  <View className="flex-row items-start">
                    {message.type === 'bot' && (
                      <View className="w-6 h-6 bg-muted rounded-full items-center justify-center mr-2 mt-1">
                        <Bot className="w-4 h-4 text-muted-foreground" />
                      </View>
                    )}
                    <View className="flex-1">
                      <Text className={`${message.type === 'user' ? 'text-white' : 'text-foreground'}`}>
                        {message.text}
                      </Text>
                      <Text className={`text-xs mt-1 ${message.type === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                        {message.time}
                      </Text>
                    </View>
                    {message.type === 'user' && (
                      <View className="w-6 h-6 bg-white/20 rounded-full items-center justify-center ml-2 mt-1">
                        <User className="w-4 h-4 text-white" />
                      </View>
                    )}
                  </View>
                </CardContent>
              </Card>
            </View>
          ))}
        </ScrollView>

        {/* Input Area */}
        <Card className="mx-4 mb-4">
          <CardContent className="p-4">
            <View className="flex-row items-center">
              <TouchableOpacity className="w-10 h-10 items-center justify-center mr-2">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
              </TouchableOpacity>
              
              <View className="flex-1 bg-muted rounded-full px-4 py-2 mr-2">
                <TextInput
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Nhập tin nhắn..."
                  className="text-foreground"
                  multiline
                />
              </View>
              
              {inputText.trim() ? (
                <TouchableOpacity 
                  className="bg-primary w-10 h-10 rounded-full items-center justify-center"
                  onPress={() => setInputText('')}
                >
                  <Send className="w-4 h-4 text-white" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity className="w-10 h-10 items-center justify-center">
                  <Mic className="w-5 h-5 text-muted-foreground" />
                </TouchableOpacity>
              )}
            </View>
          </CardContent>
        </Card>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
