"use client"

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { dark, shadcn } from '@clerk/themes';

export function useClerkTheme() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Tránh hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Xử lý theme: system sẽ sử dụng resolvedTheme
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  
  // Trả về base theme cho Clerk
  const clerkBaseTheme = currentTheme === "dark" ? dark : shadcn;

  return {
    mounted,
    theme: currentTheme,
    clerkBaseTheme,
  };
}
