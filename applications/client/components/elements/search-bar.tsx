import React, { Ref } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export interface SearchBarHolderProps {
  placeholder?: string;
  onPress?: () => void;
}

// export function SearchBar({
//   ref,
//   placeholder,
//   value,
//   onChangeText,
//   keyType = "search",
//   disabled = false,
//   onSearchPress,
//   ...props
// }: SearchBarProps) {
//   return (
//     <div className="flex-1 relative">
//       <Search
//         className="absolute left-2.5 top-2.5 size-4 z-10 text-muted-foreground"
//       />
//       <Input
//         ref={ref}
//         placeholder={placeholder}
//         value={value}
//         onChange={() => onChangeText}
//         className={`h-9 pl-8 border-muted-foreground ${onSearchPress ? 'pr-12' : ''}`}
//         // editable={!disabled}
//       />
//       {onSearchPress && (
//         <TouchableOpacity
//           onPress={onSearchPress}
//           className="absolute right-1 top-1 h-7 w-7 bg-primary rounded-md items-center justify-center"
//           activeOpacity={0.7}
//         >
//           <Search
//             className="size-4 text-primary-foreground"
//           />
//         </TouchableOpacity>
//       )}
//     </div>
//   );
// }

export function SearchBarHolder({
  placeholder = "Tìm kiếm...",
  onPress
}: SearchBarHolderProps) {
  return (
    <div
      className="flex-1 opacity-[0.7]"
      // onPress={onPress}
      // activeOpacity={0.7}
    >
      <div className="h-9 relative justify-center rounded-md border border-muted-foreground">
        <Search
          className="absolute left-2.5 top-2.5 size-4 text-muted-foreground"
        />
        <span className="pl-8 text-muted-foreground text-sm">
          {placeholder}
        </span>
      </div>
    </div>
  );
}
