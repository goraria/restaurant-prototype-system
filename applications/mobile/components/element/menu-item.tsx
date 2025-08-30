import { Image, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, UtensilsCrossed } from 'lucide-react-native';
import { Card } from '@/components/ui/card';
import React from 'react';

export interface CartItemProps {
  item: {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    category: string;
    cookingTime: number;
    specialRequests?: string | null;
  };
  update: (id: string, quantity: number) => void;
  remove: (id: string) => void;
}

export function MenuItem({
  item,
  update,
  remove,
}: CartItemProps) {
  return (
    <>
      <Card className="p-4">
        <View className="flex-row">
          <Image
            source={{ uri: item.image }}
            className="w-20 h-20 rounded-lg mr-4"
          />
          <View className="flex-1"></View>
        </View>
      </Card>
    </>
  )
}

export function CartItem({
  item,
  update,
  remove,
}: CartItemProps) {
  return (
    <>
      <Card className="p-4">
        <View className="flex-row">
          <Image
            source={{ uri: item.image }}
            className="w-20 h-20 rounded-lg mr-4"
          />
          <View className="flex-1">
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1">
                <Text className="font-semibold text-foreground text-lg">
                  {item.name}
                </Text>
                <Text className="text-sm text-muted-foreground">
                  {item.category}
                </Text>
              </View>
              <Button
                variant="ghost"
                size="sm"
                onPress={() => remove(item.id)}
                // onPress={() => removeItem(item.id)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </View>

            <View className="flex-row items-center mb-3">
              <UtensilsCrossed className="w-4 h-4 text-muted-foreground mr-1" />
              <Text className="text-sm text-muted-foreground">
                {item.cookingTime} phút
              </Text>
            </View>

            {item.specialRequests && (
              <View className="bg-yellow-50 p-2 rounded-lg mb-3">
                <Text className="text-xs text-yellow-800">
                  💡 {item.specialRequests}
                </Text>
              </View>
            )}

            <View className="flex-row justify-between items-center">
              <Text className="font-bold text-foreground text-lg">
                {item.price.toLocaleString()}đ
              </Text>
              <View className="flex-row items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0"
                  onPress={() => update(item.id, item.quantity - 1)}
                  // onPress={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Text className="font-semibold text-foreground w-8 text-center">
                  {item.quantity}
                </Text>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0"
                  onPress={() => update(item.id, item.quantity + 1)}
                  // onPress={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Card>
    </>
  )
}
