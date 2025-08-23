import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="settings" />
      <Stack.Screen name="addresses" />
      <Stack.Screen name="payment-methods" />
      <Stack.Screen name="favorites" />
      <Stack.Screen name="vouchers" />
      <Stack.Screen name="help" />
      <Stack.Screen name="about" />
    </Stack>
  );
}
