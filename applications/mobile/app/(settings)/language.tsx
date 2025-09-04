import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';
import { ArrowLeft, Globe, Check, Clock, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { HeaderStack } from '@/components/layout/header';
import { Card, CardContent } from '@/components/ui/card';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isPopular?: boolean;
  isComingSoon?: boolean;
}

export default function LanguageScreen() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('vi');

  const languages: Language[] = [
    {
      code: 'vi',
      name: 'Tiếng Việt',
      nativeName: 'Tiếng Việt',
      flag: '🇻🇳',
      isPopular: true
    },
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      isPopular: true
    },
    {
      code: 'zh',
      name: 'Chinese',
      nativeName: '中文',
      flag: '🇨🇳',
      isPopular: true
    },
    {
      code: 'ko',
      name: 'Korean',
      nativeName: '한국어',
      flag: '🇰🇷',
      isPopular: true
    },
    {
      code: 'ja',
      name: 'Japanese',
      nativeName: '日本語',
      flag: '🇯🇵',
      isPopular: true
    },
    {
      code: 'th',
      name: 'Thai',
      nativeName: 'ไทย',
      flag: '🇹🇭',
      isComingSoon: true
    },
    {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      flag: '🇫🇷',
      isComingSoon: true
    },
    {
      code: 'de',
      name: 'German',
      nativeName: 'Deutsch',
      flag: '🇩🇪',
      isComingSoon: true
    }
  ];

  const popularLanguages = languages.filter(lang => lang.isPopular);
  const comingSoonLanguages = languages.filter(lang => lang.isComingSoon);

  const handleLanguageSelect = (languageCode: string) => {
    if (languageCode === selectedLanguage) return;

    const language = languages.find(lang => lang.code === languageCode);
    if (!language) return;

    if (language.isComingSoon) {
      Alert.alert(
        'Sắp có',
        `${language.nativeName} sẽ sớm được hỗ trợ trong phiên bản tiếp theo!`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Thay đổi ngôn ngữ',
      `Bạn có muốn thay đổi ngôn ngữ thành ${language.nativeName}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: () => {
            setSelectedLanguage(languageCode);
            Alert.alert(
              'Thành công',
              `Ngôn ngữ đã được thay đổi thành ${language.nativeName}. Ứng dụng sẽ khởi động lại.`,
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };

  const renderLanguageItem = (language: Language, index: number, arr: Language[]) => (
    <View key={language.code}>
      <TouchableOpacity
        className={`flex-row items-center py-4 px-5 ${
          language.isComingSoon ? 'opacity-60' : 'active:bg-muted/50'
        }`}
        onPress={() => handleLanguageSelect(language.code)}
      >
        <View className="w-12 h-12 rounded-xl bg-white items-center justify-center mr-4 shadow-sm">
          <Text className="text-2xl">{language.flag}</Text>
        </View>
        
        <View className="flex-1">
          <Text className={`text-base font-medium mb-1 ${
            selectedLanguage === language.code ? 'text-primary font-semibold' : 'text-foreground'
          }`}>
            {language.nativeName}
          </Text>
          <Text className={`text-sm ${
            selectedLanguage === language.code ? 'text-primary' : 'text-muted-foreground'
          }`}>
            {language.name}
          </Text>
        </View>

        <View className="flex-row items-center">
          {language.isComingSoon ? (
            <View className="flex-row items-center px-2 py-1 bg-muted rounded-lg">
              <Clock size={12} color="#6b7280" />
              <Text className="text-xs text-muted-foreground ml-1 font-medium">Sắp có</Text>
            </View>
          ) : language.isPopular ? (
            <View className="mr-2">
              <Star size={16} color="#fbbf24" />
            </View>
          ) : null}
          
          {selectedLanguage === language.code && !language.isComingSoon && (
            <Check size={20} color="#EC6683" />
          )}
        </View>
      </TouchableOpacity>
      
      {index < arr.length - 1 && (
        <View className="border-b border-border/50 ml-16" />
      )}
    </View>
  );

  return (
    <>
      <HeaderStack
        position="left"
        iconLeft={ArrowLeft}
        iconLeftAction={() => router.back()}
        title="Ngôn ngữ"
      />
      
      <ScrollView className="flex-1 bg-background">
        {/* Tiêu đề lớn kiểu iOS 18 */}
        <View className="px-5 pt-2 pb-6">
          <Text className="text-4xl font-bold text-foreground tracking-tight">Ngôn ngữ</Text>
          <Text className="text-base text-muted-foreground mt-2 leading-6">
            Chọn ngôn ngữ hiển thị cho ứng dụng
          </Text>
        </View>

        {/* Biểu tượng trung tâm */}
        <View className="items-center py-8">
          <View className="w-20 h-20 bg-primary/10 rounded-2xl items-center justify-center mb-4">
            <Globe size={40} color="#EC6683" />
          </View>
          <Text className="text-lg font-semibold text-foreground">Chọn ngôn ngữ yêu thích</Text>
          <Text className="text-sm text-muted-foreground text-center px-8 mt-2 leading-5">
            Thay đổi ngôn ngữ sẽ ảnh hưởng đến toàn bộ giao diện ứng dụng
          </Text>
        </View>

        {/* Popular languages */}
        <View className="px-4 mb-8">
          <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
            ⭐ Phổ biến
          </Text>
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="p-0">
              {popularLanguages.map((language, index) => 
                renderLanguageItem(language, index, popularLanguages)
              )}
            </CardContent>
          </Card>
        </View>

        {/* Coming soon languages */}
        {comingSoonLanguages.length > 0 && (
          <View className="px-4 mb-8">
            <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
              ⏰ Sắp có
            </Text>
            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardContent className="p-0">
                {comingSoonLanguages.map((language, index) => 
                  renderLanguageItem(language, index, comingSoonLanguages)
                )}
              </CardContent>
            </Card>
          </View>
        )}

        {/* Thông tin lưu ý */}
        <View className="px-4 mb-8">
          <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
            📝 Lưu ý
          </Text>
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="p-5">
              <View className="space-y-3">
                <View className="flex-row items-start">
                  <Text className="text-2xl mr-3 mt-0.5">•</Text>
                  <Text className="text-sm text-muted-foreground leading-5 flex-1">
                    Thay đổi ngôn ngữ sẽ ảnh hưởng đến toàn bộ giao diện ứng dụng
                  </Text>
                </View>
                <View className="flex-row items-start">
                  <Text className="text-2xl mr-3 mt-0.5">•</Text>
                  <Text className="text-sm text-muted-foreground leading-5 flex-1">
                    Ứng dụng sẽ khởi động lại để áp dụng thay đổi
                  </Text>
                </View>
                <View className="flex-row items-start">
                  <Text className="text-2xl mr-3 mt-0.5">•</Text>
                  <Text className="text-sm text-muted-foreground leading-5 flex-1">
                    Một số ngôn ngữ có thể chưa được dịch hoàn toàn
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Khoảng trống cuối trang */}
        <View className="h-20" />
      </ScrollView>
    </>
  );
}
