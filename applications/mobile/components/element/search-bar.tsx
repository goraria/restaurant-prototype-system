import React, { Ref } from 'react';
import { TouchableOpacity, ReturnKeyTypeOptions, TextInputProps } from 'react-native';
import { View } from 'react-native';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Search } from 'lucide-react-native';

export interface SearchBarHolderProps {
  placeholder?: string;
  onPress?: () => void;
}

interface SearchBarProps extends TextInputProps {
  ref?: Ref<any>;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  keyType?: ReturnKeyTypeOptions;
  disabled?: boolean;
  onSearchPress?: () => void;
}

export function SearchBar({
  ref,
  placeholder,
  value,
  onChangeText,
  keyType = "search",
  disabled = false,
  onSearchPress,
  ...props
}: SearchBarProps) {
  return (
    <View className="flex-1 relative">
      <Icon
        as={Search}
        className="absolute left-2.5 top-2.5 size-4 z-10 text-muted-foreground"
      />
      <Input
        ref={ref}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        className={`h-9 pl-8 border-muted-foreground ${onSearchPress ? 'pr-12' : ''}`}
        returnKeyType={keyType}
        editable={!disabled}
        {...props}
      />
      {onSearchPress && (
        <TouchableOpacity
          onPress={onSearchPress}
          className="absolute right-1 top-1 h-7 w-7 bg-primary rounded-md items-center justify-center"
          activeOpacity={0.7}
        >
          <Icon
            as={Search}
            className="size-4 text-primary-foreground"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

export function SearchBarHolder({
  placeholder = "Tìm kiếm...",
  onPress
}: SearchBarHolderProps) {
  return (
    <TouchableOpacity
      className="flex-1"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="h-9 relative justify-center rounded-md border border-muted-foreground">
        <Icon
          as={Search}
          className="absolute left-2.5 top-2.5 size-4 text-muted-foreground"
        />
        <Text className="pl-8 text-muted-foreground text-sm">
          {placeholder}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
