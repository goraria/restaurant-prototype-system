import { Stack } from 'expo-router';

export default function AccountLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="history" />
      <Stack.Screen name="payments" />
      <Stack.Screen name="chat" />
    </Stack>
  );
}
