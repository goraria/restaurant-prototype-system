import { View } from "react-native";
import { Stack } from "expo-router";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ArrowLeft, SquarePen } from "lucide-react-native";

export default function Notifications() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <View className="bg-background pt-16 pb-4 px-4 border-b border-border">
              <View className="flex-row items-center justify-between gap-3">
                <Button
                  onPress={() => {
                  }}
                  size="icon"
                  variant="ghost"
                  className="rounded-full p-4"
                >
                  <Icon
                    as={ArrowLeft}
                    className="size-6"
                  />
                </Button>
                <Button
                  onPress={() => {
                  }}
                  size="icon"
                  variant="ghost"
                  className="rounded-full p-4"
                >
                  <Icon
                    as={SquarePen}
                    className="size-6"
                  />
                </Button>
              </View>
            </View>
          ),
        }}
      />
      <Text>Notifications</Text>
    </>
  )
}