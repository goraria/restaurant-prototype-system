import { ScrollView, View } from "react-native";
import { Link, Stack } from "expo-router";
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
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-6">Thông báo</Text>
        
        <View style={{ gap: 8 }}>
          <Text className="text-lg font-semibold mb-4">Purple Screens:</Text>
          <Link href="../(purple)/home">
            <Button><Text>Trang chủ Purple</Text></Button>
          </Link>
          <Link href="../(purple)/appointment">
            <Button><Text>Đặt lịch</Text></Button>
          </Link>
          <Link href="../(purple)/appointment-history">
            <Button><Text>Lịch sử đặt lịch</Text></Button>
          </Link>
          <Link href="../(purple)/chat">
            <Button><Text>Chat</Text></Button>
          </Link>
          <Link href="../(purple)/login">
            <Button><Text>Đăng nhập</Text></Button>
          </Link>
          <Link href="../(purple)/register">
            <Button><Text>Đăng ký</Text></Button>
          </Link>
          <Link href="../(purple)/onboarding">
            <Button><Text>Onboarding</Text></Button>
          </Link>
          <Link href="../(purple)/notifications">
            <Button><Text>Thông báo</Text></Button>
          </Link>
          <Link href="../(purple)/payment">
            <Button><Text>Thanh toán</Text></Button>
          </Link>
          <Link href="../(purple)/pet-profile">
            <Button><Text>Hồ sơ thú cưng</Text></Button>
          </Link>
          <Link href="../(purple)/pets">
            <Button><Text>Danh sách thú cưng</Text></Button>
          </Link>
          <Link href="../(purple)/settings">
            <Button><Text>Cài đặt</Text></Button>
          </Link>
          
          <Text className="text-lg font-semibold mb-4 mt-6">Restaurant Screens:</Text>
          <Link href="../(booking)/reservations">
            <Button><Text>Đặt bàn</Text></Button>
          </Link>
          <Link href="../(booking)/tables">
            <Button><Text>Quản lý bàn</Text></Button>
          </Link>
          <Link href="../(booking)/cart">
            <Button><Text>Giỏ hàng</Text></Button>
          </Link>
          <Link href="../(account)/chat">
            <Button><Text>Chat nhà hàng</Text></Button>
          </Link>
          <Link href="../(restaurant)/promotions">
            <Button><Text>Khuyến mãi</Text></Button>
          </Link>
          <Link href="../(restaurant)/location">
            <Button><Text>Địa điểm</Text></Button>
          </Link>
          <Link href="../(restaurant)/support">
            <Button><Text>Hỗ trợ</Text></Button>
          </Link>
          <Link href="../(account)/payments">
            <Button><Text>Thanh toán</Text></Button>
          </Link>
          <Link href="../(account)/history">
            <Button><Text>Lịch sử</Text></Button>
          </Link>
        </View>
      </ScrollView>
    </>
  )
}