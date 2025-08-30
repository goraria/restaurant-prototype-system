import { Pressable, View } from 'react-native';
import { setAndroidNavigationBar } from '@/lib/android-navigation-bar';
import { useTheme } from '@react-navigation/native';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import {
  Moon,
  MoonStar,
  Sun,
  MoonStarIcon,
  XIcon,
  SunIcon
} from 'lucide-react-native';

import { useColorScheme } from 'nativewind';
// import { useColorScheme } from '@/hooks/useColorScheme';

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button
      onPress={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="rounded-full"
    >
      <Icon
        as={{
          light: Sun,
          dark: Moon,
        }[colorScheme ?? 'light']}
        className="size-6"
      />
    </Button>
  );
}

// export function ThemeToggleOld() {
//   const { isDarkColorScheme, setColorScheme } = useColorScheme();
//   const { colors } = useTheme();
//
//   function toggleColorScheme() {
//     const newTheme = isDarkColorScheme ? 'light' : 'dark';
//     setColorScheme(newTheme);
//     setAndroidNavigationBar(newTheme);
//   }
//
//   return (
//     <Pressable
//       onPress={toggleColorScheme}
//       className='web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 active:opacity-70'
//     >
//       <View className='flex-1 aspect-square pt-0.5 justify-center items-start web:px-5'>
//         {isDarkColorScheme ? (
//           <Moon className='text-foreground' color={colors.text} size={22}/>
//           // <Moon className='text-foreground' size={23} strokeWidth={1.25} />
//         ) : (
//           <Sun className='text-foreground' color={colors.text} size={22}/>
//           // <Sun className='text-foreground' size={24} strokeWidth={1.25} />
//         )}
//       </View>
//     </Pressable>
//   );
// }
