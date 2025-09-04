import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function MenuTabScreen() {
  useEffect(() => {
    // Redirect to the restaurant menu page
    router.replace('/(restaurant)/menu');
  }, []);

  return <View className="flex-1 bg-background" />;
}
