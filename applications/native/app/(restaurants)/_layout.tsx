import { Stack } from 'expo-router';

export default function RestaurantsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="index" 
        options={{ title: 'Nhà hàng' }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ title: 'Chi tiết nhà hàng' }} 
      />
    </Stack>
  );
}
