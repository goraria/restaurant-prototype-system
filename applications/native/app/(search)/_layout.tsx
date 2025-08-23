import { Stack } from 'expo-router';

export default function SearchLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="filters" />
      <Stack.Screen name="results" />
    </Stack>
  );
}
