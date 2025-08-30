import { Stack } from 'expo-router';

export default function RestaurantLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="promotions" />
      <Stack.Screen name="location" />
      <Stack.Screen name="support" />
    </Stack>
  );
}
