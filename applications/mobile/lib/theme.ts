import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

export const THEME = {
  light: {
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(343 42% 13%)', // Restaurant text color
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(343 42% 13%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(343 42% 13%)',
    primary: 'hsl(345 81% 67%)', // Restaurant primary pink
    primaryForeground: 'hsl(0 0% 98%)',
    secondary: 'hsl(220 13% 97%)',
    secondaryForeground: 'hsl(345 81% 67%)',
    muted: 'hsl(220 13% 97%)',
    mutedForeground: 'hsl(215 28% 56%)',
    accent: 'hsl(345 81% 95%)', // Light pink accent
    accentForeground: 'hsl(345 81% 67%)',
    destructive: 'hsl(10 87% 56%)', // Restaurant danger color
    border: 'hsl(220 13% 91%)',
    input: 'hsl(220 13% 91%)',
    ring: 'hsl(345 81% 67%)',
    radius: '0.625rem',
    chart1: 'hsl(345 81% 67%)', // Restaurant primary
    chart2: 'hsl(185 73% 49%)', // Restaurant info
    chart3: 'hsl(46 100% 50%)', // Restaurant warning
    chart4: 'hsl(118 55% 55%)', // Restaurant success
    chart5: 'hsl(10 87% 56%)', // Restaurant danger
  },
  dark: {
    background: 'hsl(229 25% 25%)', // Restaurant dark background
    foreground: 'hsl(0 0% 98%)',
    card: 'hsl(229 25% 25%)',
    cardForeground: 'hsl(0 0% 98%)',
    popover: 'hsl(229 25% 25%)',
    popoverForeground: 'hsl(0 0% 98%)',
    primary: 'hsl(345 81% 77%)', // Restaurant primary light pink for dark
    primaryForeground: 'hsl(229 25% 25%)',
    secondary: 'hsl(229 25% 35%)',
    secondaryForeground: 'hsl(0 0% 98%)',
    muted: 'hsl(229 25% 35%)',
    mutedForeground: 'hsl(215 28% 65%)',
    accent: 'hsl(229 25% 35%)',
    accentForeground: 'hsl(0 0% 98%)',
    destructive: 'hsl(10 87% 56%)',
    border: 'hsl(229 25% 35%)',
    input: 'hsl(229 25% 35%)',
    ring: 'hsl(345 81% 77%)',
    radius: '0.625rem',
    chart1: 'hsl(345 81% 77%)',
    chart2: 'hsl(185 73% 59%)',
    chart3: 'hsl(46 100% 60%)',
    chart4: 'hsl(118 55% 65%)',
    chart5: 'hsl(10 87% 66%)',
  },
};

export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};
