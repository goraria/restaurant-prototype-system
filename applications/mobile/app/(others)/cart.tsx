import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { HeaderStack } from "@/components/layout/header";

export default function CartScreen() {
  return (
    <>
      <HeaderStack>

      </HeaderStack>
      <View className="flex-1 bg-background">
        <Text className="text-lg font-bold">Giỏ hàng</Text>
      </View>
    </>
  );
}
