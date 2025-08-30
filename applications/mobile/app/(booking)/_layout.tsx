import { Stack } from 'expo-router';

export default function BookingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="reservations" />
      <Stack.Screen name="create-reservation" />
      <Stack.Screen name="tables" />
      <Stack.Screen name="cart" />
    </Stack>
  );
}
