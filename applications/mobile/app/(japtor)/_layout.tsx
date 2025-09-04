import { Stack } from 'expo-router';

export default function JaptorLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding-signup" />
      <Stack.Screen name="onboarding-welcome" />
      <Stack.Screen name="onboarding-allergies" />
      <Stack.Screen name="onboarding-diet" />
      <Stack.Screen name="notification-permission" />
      <Stack.Screen name="food-chat" />
      <Stack.Screen name="food-tracking" />
      <Stack.Screen name="meal-planner" />
      <Stack.Screen name="recipe-details" />
      <Stack.Screen name="search-results" />
      <Stack.Screen name="profile-meals" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
