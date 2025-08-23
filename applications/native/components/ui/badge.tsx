import React from 'react';
import { View, ViewStyle, TextStyle } from 'react-native';
import { Text } from './text';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
  className?: string;
}

const badgeVariants = {
  default: {
    backgroundColor: '#09090b',
    borderColor: 'transparent',
  },
  secondary: {
    backgroundColor: '#f4f4f5',
    borderColor: 'transparent',
  },
  destructive: {
    backgroundColor: '#ef4444',
    borderColor: 'transparent',
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: '#e4e4e7',
    borderWidth: 1,
  },
  success: {
    backgroundColor: '#22c55e',
    borderColor: 'transparent',
  },
  warning: {
    backgroundColor: '#eab308',
    borderColor: 'transparent',
  },
};

const textVariants = {
  default: '#fafafa',
  secondary: '#09090b',
  destructive: '#fafafa',
  outline: '#09090b',
  success: '#fafafa',
  warning: '#09090b',
};

const sizeVariants = {
  sm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 10,
    lineHeight: 14,
  },
  md: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    lineHeight: 16,
  },
  lg: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,
    lineHeight: 18,
  },
};

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  style, 
  textStyle,
  className,
  ...props 
}: BadgeProps) {
  const variantStyle = badgeVariants[variant];
  const textColor = textVariants[variant];
  const sizeStyle = sizeVariants[size];

  return (
    <View
      style={[
        {
          borderRadius: 6,
          alignSelf: 'flex-start',
          ...variantStyle,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          paddingVertical: sizeStyle.paddingVertical,
        },
        style,
      ]}
      {...props}
    >
      <Text
        style={[
          {
            color: textColor,
            fontSize: sizeStyle.fontSize,
            lineHeight: sizeStyle.lineHeight,
            fontWeight: '500',
            textAlign: 'center',
          },
          textStyle,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}
