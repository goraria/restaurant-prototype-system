import React, { ReactNode } from 'react';
import { Stack } from 'expo-router';
import { View, StatusBar } from 'react-native';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { LucideIcon } from "lucide-react-native";

interface HeaderStackProps {
  title?: string;
  position?: 'left' | 'right' | 'sides';
  iconLeft?: LucideIcon;
  iconRight?: LucideIcon;
  iconLeftAction?: () => void;
  iconRightAction?: () => void;
  showBorder?: boolean;
  backgroundColor?: string;
  children?: ReactNode;
}

export function HeaderStack({
  title,
  position,
  iconLeft,
  iconRight,
  iconLeftAction,
  iconRightAction,
  showBorder = true,
  backgroundColor = 'bg-background',
  children
}: HeaderStackProps) {
  const shouldShowLeftButton = (position === 'left' || position === 'sides') && iconLeft;
  const shouldShowRightButton = (position === 'right' || position === 'sides') && iconRight;

  return (
    <Stack.Screen
      options={{
        headerShown: true,
        header: () => (
          <View className="bg-background pt-16 pb-4 px-4 border-b border-border">
          {/* <View className={`${backgroundColor} pt-16 pb-4 px-4 ${showBorder ? 'border-b border-border' : ''}`}> */}
            <View className="flex-row items-center gap-3">

              {/* <View className="flex-1">
                <Icon
                  as={Search}
                  className="absolute left-2.5 top-2.5 size-4 z-10 text-muted-foreground"
                />
                <Input
                  placeholder="Tìm nhà hàng, món ăn..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  className="h-9 pl-8 border-muted-foreground"
                />
              </View> */}

              {shouldShowLeftButton && (
                <Button
                  onPress={iconLeftAction}
                  size="icon"
                  variant="ghost"
                  className="rounded-full p-4"
                >
                  <Icon
                    as={iconLeft!}
                    className="size-6"
                  />
                </Button>
              )}
              
              {/*<View className={position === 'center' ? 'flex-1' : position === 'sides' ? 'flex-1' : ''}>*/}
              {children}
              {/*</View>*/}
              
              {shouldShowRightButton && (
                <Button
                  onPress={iconRightAction}
                  size="icon"
                  variant="ghost"
                  className="rounded-full p-4"
                >
                  <Icon
                    as={iconRight!}
                    className="size-6"
                  />
                </Button>
              )}
            </View>
          </View>
        ),
      }}
    />
  );
}

interface HeaderAction {
  icon?: LucideIcon;
  onPress?: () => void;
  label?: string;
  variant?: 'ghost' | 'outline' | 'secondary' | 'destructive' | 'default';
  size?: 'sm' | 'lg' | 'icon';
  className?: string;
  disabled?: boolean;
}

interface HeaderStackScreenProps {
  // Basic props
  title?: string;
  subtitle?: string;
  
  // Layout props
  position?: 'left' | 'right' | 'center' | 'sides' | 'custom';
  alignment?: 'start' | 'center' | 'end' | 'between' | 'around';
  
  // Actions
  leftAction?: HeaderAction;
  rightAction?: HeaderAction;
  leftActions?: HeaderAction[];
  rightActions?: HeaderAction[];
  
  // Styling props
  showBorder?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  height?: 'compact' | 'normal' | 'large';
  paddingTop?: number;
  paddingBottom?: number;
  paddingHorizontal?: number;
  
  // Advanced props
  statusBarStyle?: 'light' | 'dark' | 'auto';
  transparent?: boolean;
  blur?: boolean;
  shadow?: boolean;
  
  // Content
  children?: ReactNode;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  centerContent?: ReactNode;
}

export function HeaderStackScreen({
  title,
  subtitle,
  position = 'center',
  alignment = 'center',
  leftAction,
  rightAction,
  leftActions,
  rightActions,
  showBorder = true,
  backgroundColor = 'bg-background',
  borderColor = 'border-border',
  height = 'normal',
  paddingTop,
  paddingBottom,
  paddingHorizontal = 4,
  statusBarStyle = 'auto',
  transparent = false,
  blur = false,
  shadow = false,
  children,
  leftContent,
  rightContent,
  centerContent
}: HeaderStackScreenProps) {

  // Calculate heights
  const getHeightClasses = () => {
    switch (height) {
      case 'compact': return 'pt-12 pb-2';
      case 'large': return 'pt-20 pb-6';
      default: return 'pt-16 pb-4';
    }
  };

  // Get padding classes
  const getPaddingClasses = () => {
    const pt = paddingTop ? `pt-${paddingTop}` : '';
    const pb = paddingBottom ? `pb-${paddingBottom}` : '';
    const px = `px-${paddingHorizontal}`;
    return `${pt} ${pb} ${px}`.trim();
  };

  // Get alignment classes
  const getAlignmentClass = () => {
    switch (alignment) {
      case 'start': return 'justify-start';
      case 'end': return 'justify-end';
      case 'between': return 'justify-between';
      case 'around': return 'justify-around';
      default: return 'justify-center';
    }
  };

  // Render action button
  const renderAction = (action: HeaderAction, key: string) => (
    <Button
      key={key}
      onPress={action.onPress}
      size={action.size || 'icon'}
      variant={action.variant || 'ghost'}
      className={`rounded-full ${action.className || 'p-3'}`}
      disabled={action.disabled}
    >
      {action.icon && (
        <Icon
          as={action.icon}
          className="size-5"
        />
      )}
      {action.label && !action.icon && (
        <Text className="text-sm font-medium">{action.label}</Text>
      )}
    </Button>
  );

  // Render multiple actions
  const renderActions = (actions: HeaderAction[], side: 'left' | 'right') => (
    <View className={`flex-row items-center ${side === 'left' ? 'gap-1' : 'gap-1'}`}>
      {actions.map((action, index) => renderAction(action, `${side}-${index}`))}
    </View>
  );

  // Determine what to show on left
  const getLeftContent = () => {
    if (leftContent) return leftContent;
    if (leftActions && leftActions.length > 0) return renderActions(leftActions, 'left');
    if (leftAction) return renderAction(leftAction, 'left-single');
    return null;
  };

  // Determine what to show on right
  const getRightContent = () => {
    if (rightContent) return rightContent;
    if (rightActions && rightActions.length > 0) return renderActions(rightActions, 'right');
    if (rightAction) return renderAction(rightAction, 'right-single');
    return null;
  };

  // Determine center content
  const getCenterContent = () => {
    if (centerContent) return centerContent;
    if (children) return children;
    if (title || subtitle) {
      return (
        <View className="items-center">
          {title && <Text className="text-lg font-semibold">{title}</Text>}
          {subtitle && <Text className="text-sm text-muted-foreground">{subtitle}</Text>}
        </View>
      );
    }
    return null;
  };

  const headerStyles = [
    transparent ? 'bg-transparent' : backgroundColor,
    showBorder ? `border-b ${borderColor}` : '',
    shadow ? 'shadow-sm' : '',
    blur ? 'backdrop-blur-md' : '',
    paddingTop !== undefined || paddingBottom !== undefined ? getPaddingClasses() : getHeightClasses(),
    paddingHorizontal !== 4 ? `px-${paddingHorizontal}` : 'px-4'
  ].filter(Boolean).join(' ');

  return (
    <Stack.Screen
      options={{
        headerShown: true,
        header: () => (
          <View className={headerStyles}>
            {statusBarStyle !== 'auto' && (
              <StatusBar barStyle={statusBarStyle === 'light' ? 'light-content' : 'dark-content'} />
            )}
            <View className={`flex-row items-center ${getAlignmentClass()}`}>
              {/* Left side */}
              {getLeftContent()}
              
              {/* Center content */}
              {position === 'center' && (
                <View className="flex-1 items-center">
                  {getCenterContent()}
                </View>
              )}
              
              {/* Custom layout */}
              {position === 'custom' && getCenterContent()}
              
              {/* Right side */}
              {getRightContent()}
            </View>
          </View>
        ),
      }}
    />
  );
}