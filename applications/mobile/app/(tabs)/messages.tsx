import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { router, Stack } from 'expo-router';
import { Search, MessageCircle, Clock, SquarePen, Users, User, AlertCircle, ChefHat, Menu } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MessageScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - giống với dữ liệu từ chat.tsx
  const chatRooms = [
    {
      id: '1',
      name: 'Tư vấn viên Minh',
      lastMessage: 'Chúng tôi sẽ hỗ trợ bạn ngay!',
      time: '2 phút',
      isOnline: true,
      unreadCount: 3,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      type: 'support',
    },
    {
      id: '2',
      name: 'Quản lý An',
      lastMessage: 'Đơn hàng của bạn đang được chuẩn bị',
      time: '15 phút',
      isOnline: false,
      unreadCount: 1,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      type: 'manager',
    },
    {
      id: '3', 
      name: 'Đầu bếp Hải',
      lastMessage: 'Món ăn của bạn đã sẵn sàng!',
      time: '30 phút',
      isOnline: true,
      unreadCount: 0,
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face',
      type: 'chef',
    },
    {
      id: '4',
      name: 'Hỗ trợ khách hàng',
      lastMessage: 'Cảm ơn bạn đã phản hồi!',
      time: '1 giờ',
      isOnline: true,
      unreadCount: 0,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e0?w=150&h=150&fit=crop&crop=face',
      type: 'support',
    },
  ];

  const getChatTypeIcon = (type: string) => {
    switch(type) {
      case 'support':
        return <Users className="w-3 h-3 text-blue-600" />;
      case 'manager':
        return <User className="w-3 h-3 text-purple-600" />;
      case 'chef':
        return <ChefHat className="w-3 h-3 text-orange-600" />;
      default:
        return <MessageCircle className="w-3 h-3 text-gray-600" />;
    }
  };

  const getChatTypeColor = (type: string) => {
    switch(type) {
      case 'support':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'manager':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'chef':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getChatTypeText = (type: string) => {
    switch(type) {
      case 'support':
        return 'Hỗ trợ';
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

  const renderChatItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      onPress={() => router.push(`/(account)/chat?id=${item.id}`)}
      className="mb-4"
    >
      <Card className="bg-white dark:bg-card">
        <CardContent className="px-4 py-4">
          <View className="flex-row items-center">
            {/* Avatar với online indicator giống Messenger */}
            <View className="relative mr-4">
              <View className="w-14 h-14 rounded-full overflow-hidden">
                <Image 
                  source={{ uri: item.avatar }} 
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              {item.isOnline && (
                <View className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-card" />
              )}
            </View>
            
            {/* Nội dung tin nhắn */}
            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="font-semibold text-base text-foreground" numberOfLines={1}>
                  {item.name}
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-xs text-muted-foreground">{item.time}</Text>
                  {item.unreadCount > 0 && (
                    <View className="bg-primary rounded-full min-w-[18px] h-[18px] items-center justify-center ml-2">
                      <Text className="text-white text-xs font-bold">
                        {item.unreadCount > 9 ? '9+' : item.unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              
              <View className="flex-row items-center">
                <Text className={`text-sm flex-1 ${
                  item.unreadCount > 0 ? 'font-medium text-foreground' : 'text-muted-foreground'
                }`} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
              </View>
              
              {/* Type indicator */}
              <View className="flex-row items-center mt-1">
                {getChatTypeIcon(item.type)}
                <Text className={`text-xs px-2 py-0.5 rounded-full ml-1 ${getChatTypeColor(item.type)}`}>
                  {getChatTypeText(item.type)}
                </Text>
              </View>
            </View>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );

  // Quick Contacts Filter
  const supportStaff = chatRooms.filter(chat => chat.type === 'support');
  const managerStaff = chatRooms.filter(chat => chat.type === 'manager');
  const chefStaff = chatRooms.filter(chat => chat.type === 'chef');

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <View className="bg-background pt-16 pb-4 px-4 border-b border-border">
              <View className="flex-row items-center justify-between gap-3">
                <TouchableOpacity className="w-10 h-10 rounded-full items-center justify-center">
                  <Menu className="w-6 h-6 text-foreground" />
                </TouchableOpacity>
                <View className="flex-1 justify-center items-center">
                  <Text className="text-lg font-semibold">Tin nhắn</Text>
                </View>
                <TouchableOpacity
                  onPress={() => router.push('/(account)/chat?type=support')}
                  className="w-10 h-10 rounded-full items-center justify-center"
                >
                  <SquarePen className="w-6 h-6 text-foreground" />
                </TouchableOpacity>
              </View>
            </View>
          ),
        }}
      />
      <SafeAreaView className="flex-1 bg-background">
        <ScrollView className="flex-1">
          {/* Large Title iOS Style */}
          <View className="px-4 mb-4">
            <Card>
              <CardContent className="px-4 py-6">
                <Text className="text-3xl font-bold text-foreground mb-2">Trò chuyện</Text>
                <Text className="text-muted-foreground">Liên lạc với nhà hàng và nhận hỗ trợ</Text>
              </CardContent>
            </Card>
          </View>

          {/* Search Bar */}
          <View className="px-4 mb-4">
            <Card>
              <CardContent className="px-4 py-3">
                <View className="relative">
                  <Input
                    placeholder="Tìm kiếm cuộc trò chuyện..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    className="pl-10 bg-background border-border"
                  />
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                </View>
              </CardContent>
            </Card>
          </View>

          {/* Quick Access Cards */}
          <View className="px-4 mb-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Liên hệ nhanh
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {/* Hỗ trợ khách hàng */}
                  <TouchableOpacity 
                    onPress={() => router.push('/(account)/chat?type=support')}
                    className="mr-2"
                  >
                    <Card className="w-24 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                      <CardContent className="px-4 py-3 items-center">
                        <Users className="w-6 h-6 text-blue-600 mb-2" />
                        <Text className="text-xs font-medium text-blue-800 dark:text-blue-200 text-center">
                          Hỗ trợ
                        </Text>
                        <Badge variant="secondary" className="mt-1 bg-blue-100 dark:bg-blue-900">
                          <Text className="text-[10px] text-blue-800 dark:text-blue-200">24/7</Text>
                        </Badge>
                      </CardContent>
                    </Card>
                  </TouchableOpacity>

                  {/* Quản lý */}
                  <TouchableOpacity 
                    onPress={() => router.push('/(account)/chat?type=manager')}
                    className="mr-2"
                  >
                    <Card className="w-24 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800">
                      <CardContent className="px-4 py-3 items-center">
                        <User className="w-6 h-6 text-purple-600 mb-2" />
                        <Text className="text-xs font-medium text-purple-800 dark:text-purple-200 text-center">
                          Quản lý
                        </Text>
                        <Badge variant="secondary" className="mt-1 bg-purple-100 dark:bg-purple-900">
                          <Text className="text-[10px] text-purple-800 dark:text-purple-200">VIP</Text>
                        </Badge>
                      </CardContent>
                    </Card>
                  </TouchableOpacity>

                  {/* Đầu bếp */}
                  <TouchableOpacity 
                    onPress={() => router.push('/(account)/chat?type=chef')}
                    className="mr-2"
                  >
                    <Card className="w-24 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800">
                      <CardContent className="px-4 py-3 items-center">
                        <ChefHat className="w-6 h-6 text-orange-600 mb-2" />
                        <Text className="text-xs font-medium text-orange-800 dark:text-orange-200 text-center">
                          Đầu bếp
                        </Text>
                        <Badge variant="secondary" className="mt-1 bg-orange-100 dark:bg-orange-900">
                          <Text className="text-[10px] text-orange-800 dark:text-orange-200">PRO</Text>
                        </Badge>
                      </CardContent>
                    </Card>
                  </TouchableOpacity>

                  {/* Quick Contact với các staff đang online */}
                  {supportStaff.filter(s => s.isOnline).map((staff) => (
                    <TouchableOpacity 
                      key={staff.id}
                      onPress={() => router.push(`/(account)/chat?id=${staff.id}`)}
                      className="mr-2"
                    >
                      <Card className="w-20 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                        <CardContent className="px-2 py-3 items-center">
                          <View className="relative mb-2">
                            <View className="w-8 h-8 rounded-full overflow-hidden">
                              <Image 
                                source={{ uri: staff.avatar }} 
                                className="w-full h-full"
                                resizeMode="cover"
                              />
                            </View>
                            <View className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-card" />
                          </View>
                          <Text className="text-[10px] font-medium text-green-800 dark:text-green-200 text-center" numberOfLines={2}>
                            {staff.name.split(' ')[0]}
                          </Text>
                        </CardContent>
                      </Card>
                    </TouchableOpacity>
                  ))}

                  {managerStaff.filter(s => s.isOnline).map((staff) => (
                    <TouchableOpacity 
                      key={staff.id}
                      onPress={() => router.push(`/(account)/chat?id=${staff.id}`)}
                      className="mr-2"
                    >
                      <Card className="w-20 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800">
                        <CardContent className="px-2 py-3 items-center">
                          <View className="relative mb-2">
                            <View className="w-8 h-8 rounded-full overflow-hidden">
                              <Image 
                                source={{ uri: staff.avatar }} 
                                className="w-full h-full"
                                resizeMode="cover"
                              />
                            </View>
                            <View className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-card" />
                          </View>
                          <Text className="text-[10px] font-medium text-purple-800 dark:text-purple-200 text-center" numberOfLines={2}>
                            {staff.name.split(' ')[0]}
                          </Text>
                        </CardContent>
                      </Card>
                    </TouchableOpacity>
                  ))}

                  {chefStaff.filter(s => s.isOnline).map((staff) => (
                    <TouchableOpacity 
                      key={staff.id}
                      onPress={() => router.push(`/(account)/chat?id=${staff.id}`)}
                      className="mr-2"
                    >
                      <Card className="w-20 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800">
                        <CardContent className="px-2 py-3 items-center">
                          <View className="relative mb-2">
                            <View className="w-8 h-8 rounded-full overflow-hidden">
                              <Image 
                                source={{ uri: staff.avatar }} 
                                className="w-full h-full"
                                resizeMode="cover"
                              />
                            </View>
                            <View className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-card" />
                          </View>
                          <Text className="text-[10px] font-medium text-orange-800 dark:text-orange-200 text-center" numberOfLines={2}>
                            {staff.name.split(' ')[0]}
                          </Text>
                        </CardContent>
                      </Card>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </CardContent>
            </Card>
          </View>

          {/* Chat List */}
          <View className="px-4 mb-4">
            {filteredChats.length > 0 ? (
              <View>
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Cuộc trò chuyện
                    </CardTitle>
                  </CardHeader>
                </Card>
                {filteredChats.map((chat) => (
                  <View key={chat.id}>
                    {renderChatItem({ item: chat })}
                  </View>
                ))}
              </View>
            ) : (
              <Card>
                <CardContent className="p-8 items-center">
                  <MessageCircle className="w-16 h-16 text-gray-400 mb-4" />
                  <CardTitle className="text-lg mb-2">Không tìm thấy cuộc trò chuyện</CardTitle>
                  <Text className="text-muted-foreground text-center mb-4">
                    Thử tìm kiếm với từ khóa khác hoặc bắt đầu cuộc trò chuyện mới
                  </Text>
                  <Button
                    onPress={() => setSearchQuery('')}
                    variant="outline"
                  >
                    <Text>Xóa tìm kiếm</Text>
                  </Button>
                </CardContent>
              </Card>
            )}
          </View>

          {/* Footer spacing */}
          <View className="h-8" />
        </ScrollView>

        {/* FAB positioned absolutely */}
        <TouchableOpacity
          onPress={() => router.push('/(account)/chat?type=support')}
          className="absolute bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full items-center justify-center shadow-lg"
          style={{ elevation: 8 }}
        >
          <SquarePen className="w-6 h-6 text-white" />
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

export default MessageScreen;
