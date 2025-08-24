import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { ShoppingCart } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

interface ShoppingCartButtonProps {
  itemCount?: number;
  onPress?: () => void;
  size?: number;
  color?: string;
}

export const ShoppingCartButton: React.FC<ShoppingCartButtonProps> = ({
  itemCount = 0,
  onPress,
  size = 24,
  color = '#09090b'
}) => {
  return (
    <TouchableOpacity onPress={onPress} className="relative p-2">
      <ShoppingCart size={size} color={color} />
      {itemCount > 0 && (
        <View className="absolute -top-1 -right-1 bg-primary rounded-full min-w-[18px] h-[18px] items-center justify-center">
          <Text className="text-primary-foreground text-xs font-bold">
            {itemCount > 99 ? '99+' : itemCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
