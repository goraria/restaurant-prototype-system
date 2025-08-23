/**
 * Restaurant App Color Scheme
 * Primary colors: Using shadcn default primary (dark gray/black) 
 * Supporting colors for different UI states
 */

const primaryColor = '#09090b'; // shadcn default primary (dark)
const primaryColorDark = '#fafafa'; // shadcn default primary for dark mode

export const Colors = {
  light: {
    text: '#09090b',
    background: '#ffffff',
    tint: primaryColor,
    icon: '#71717a',
    tabIconDefault: '#a1a1aa',
    tabIconSelected: primaryColor,
    primary: primaryColor,
    secondary: '#f4f4f5', // shadcn secondary
    accent: '#f4f4f5', // shadcn accent
    muted: '#f4f4f5', // shadcn muted
    border: '#e4e4e7', // shadcn border
    destructive: '#ef4444', // Red-500
    success: '#22c55e', // Green-500
    warning: '#eab308', // Yellow-500
  },
  dark: {
    text: '#fafafa',
    background: '#09090b',
    tint: primaryColorDark,
    icon: '#71717a',
    tabIconDefault: '#52525b',
    tabIconSelected: primaryColorDark,
    primary: primaryColorDark,
    secondary: '#27272a', // shadcn secondary dark
    accent: '#27272a', // shadcn accent dark
    muted: '#27272a', // shadcn muted dark
    border: '#27272a', // shadcn border dark
    destructive: '#f87171', // Red-400
    success: '#4ade80', // Green-400
    warning: '#facc15', // Yellow-400
  },
};
