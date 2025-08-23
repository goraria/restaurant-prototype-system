import React from 'react';
import { View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { ArrowLeft, MoreVertical, Search, ShoppingCart, Bell } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showCart?: boolean;
  cartItemCount?: number;
  showNotifications?: boolean;
  notificationCount?: number;
  showProfile?: boolean;
  showMore?: boolean;
  onBack?: () => void;
  onSearch?: () => void;
  onCart?: () => void;
  onNotifications?: () => void;
  onProfile?: () => void;
  onMore?: () => void;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
  transparent?: boolean;
}

export function Header({
  title,
  showBack = false,
  showSearch = false,
  showCart = false,
  cartItemCount = 0,
  showNotifications = false,
  notificationCount = 0,
  showProfile = false,
  showMore = false,
  onBack,
  onSearch,
  onCart,
  onNotifications,
  onProfile,
  onMore,
  rightComponent,
  leftComponent,
  transparent = false,
}: HeaderProps) {
  return (
    <SafeAreaView 
      edges={['top']} 
      className={transparent ? 'bg-transparent' : 'bg-background'}
    >
      <View className={`flex-row items-center justify-between px-4 py-3 ${
        transparent ? 'bg-transparent' : 'bg-background border-b border-border'
      }`}>
        {/* Left Section */}
        <View className="flex-row items-center flex-1">
          {leftComponent ? (
            leftComponent
          ) : showBack ? (
            <Pressable onPress={onBack} className="mr-3">
              <ArrowLeft size={24} className="text-foreground" />
            </Pressable>
          ) : null}
          
          {title && (
            <Text className="text-lg font-semibold text-foreground">{title}</Text>
          )}
        </View>

        {/* Right Section */}
        <View className="flex-row items-center space-x-3">
          {rightComponent ? (
            rightComponent
          ) : (
            <>
              {showSearch && (
                <Pressable onPress={onSearch}>
                  <Search size={24} className="text-foreground" />
                </Pressable>
              )}
              
              {showCart && (
                <Pressable onPress={onCart} className="relative">
                  <ShoppingCart size={24} className="text-foreground" />
                  {cartItemCount > 0 && (
                    <View className="absolute -top-2 -right-2 bg-primary rounded-full w-5 h-5 items-center justify-center">
                      <Text className="text-xs text-white font-bold">
                        {cartItemCount > 99 ? '99+' : cartItemCount}
                      </Text>
                    </View>
                  )}
                </Pressable>
              )}
              
              {showNotifications && (
                <Pressable onPress={onNotifications} className="relative">
                  <Bell size={24} className="text-foreground" />
                  {notificationCount > 0 && (
                    <View className="absolute -top-2 -right-2 bg-destructive rounded-full w-5 h-5 items-center justify-center">
                      <Text className="text-xs text-destructive-foreground font-bold">
                        {notificationCount > 99 ? '99+' : notificationCount}
                      </Text>
                    </View>
                  )}
                </Pressable>
              )}
              
              {showProfile && (
                <Pressable onPress={onProfile}>
                  <Avatar alt="User Avatar" className="w-8 h-8">
                    <AvatarImage source={{ uri: 'https://github.com/shadcn.png' }} />
                    <AvatarFallback>
                      <Text>U</Text>
                    </AvatarFallback>
                  </Avatar>
                </Pressable>
              )}
              
              {showMore && (
                <Pressable onPress={onMore}>
                  <MoreVertical size={24} className="text-foreground" />
                </Pressable>
              )}
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
