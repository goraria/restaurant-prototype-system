import React, { ReactNode } from "react";
import { ScrollView, View } from "react-native";

export default function HistoryLayout({
  children
}: {
  children: ReactNode
}) {
  return (
    <View className="flex-1 bg-background">
      <ScrollView>{children}</ScrollView>
    </View>
  );
}
