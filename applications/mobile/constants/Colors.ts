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

// const primaryColor = '#EC6683'; // Restaurant main brand color (pink)
// const primaryColorDark = '#F4B2BD'; // Restaurant sub brand color (light pink)

// export const Colors = {
//   light: {
//     text: '#22303e',
//     background: '#ffffff',
//     tint: primaryColor,
//     icon: '#7a838b',
//     tabIconDefault: '#8592a3',
//     tabIconSelected: primaryColor,
//     primary: primaryColor,
//     secondary: '#f8f9fa',
//     accent: '#fce4e7',
//     muted: '#f5f5f5',
//     border: '#e4e4e7',
//     destructive: '#ff3e1d', // Restaurant danger color
//     success: '#71dd37', // Restaurant success color
//     warning: '#ffab00', // Restaurant warning color
//     info: '#03c3ec', // Restaurant info color
    
//     // Restaurant specific colors
//     restaurantPrimary: '#EC6683',
//     restaurantSecondary: '#8592A3',
//     restaurantOrange: '#FD7E14',
//     restaurantBlue: '#2092EC',
//     restaurantPurple: '#696CFF',
//     restaurantTeal: '#0D9394',
//     restaurantYellow: '#FFAB1D',
//     restaurantRed: '#EB3D63',
//   },
//   dark: {
//     text: '#fafafa',
//     background: '#2b2c40',
//     tint: primaryColorDark,
//     icon: '#91979f',
//     tabIconDefault: '#8592a3',
//     tabIconSelected: primaryColorDark,
//     primary: primaryColorDark,
//     secondary: '#494a5d',
//     accent: '#6b6c9d',
//     muted: '#494a5d',
//     border: '#6b6c9d',
//     destructive: '#ff3e1d',
//     success: '#71dd37',
//     warning: '#ffab00',
//     info: '#03c3ec',
    
//     // Restaurant specific colors (adjusted for dark mode)
//     restaurantPrimary: '#F4B2BD',
//     restaurantSecondary: '#8592A3',
//     restaurantOrange: '#FD7E14',
//     restaurantBlue: '#2092EC',
//     restaurantPurple: '#696CFF',
//     restaurantTeal: '#0D9394',
//     restaurantYellow: '#FFAB1D',
//     restaurantRed: '#EB3D63',
//   },
// };
