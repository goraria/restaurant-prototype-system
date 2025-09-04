import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  Heart,
  Star,
  ShoppingBag,
  MapPin,
  Clock,
  Truck,
  CreditCard,
  Tag,
  Gift
} from 'lucide-react-native';

export default function HyperMartCartDemo() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Modern Chair',
      price: 3599,
      originalPrice: 4999,
      rating: 4.8,
      reviews: 243,
      image: '🪑',
      quantity: 1,
      isFavorite: false,
      variant: 'Black Color',
      seller: 'FurniturePlus',
    },
    {
      id: 2,
      name: 'LG Washing Machine',
      price: 45999,
      originalPrice: 52999,
      rating: 4.8,
      reviews: 156,
      image: '🧺',
      quantity: 1,
      isFavorite: true,
      variant: '7 kg, Front Load',
      seller: 'LG Store',
    },
    {
      id: 3,
      name: 'Fresh Strawberries',
      price: 199,
      originalPrice: 250,
      rating: 4.6,
      reviews: 89,
      image: '🍓',
      quantity: 2,
      isFavorite: false,
      variant: '500g Pack',
      seller: 'Fresh Fruits Co.',
    },
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const discount = appliedPromo === 'SAVE10' ? subtotal * 0.1 : 0;
  const total = subtotal + deliveryFee - discount;

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeItem = (id: number) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => updateQuantity(id, 0) }
      ]
    );
  };

  const toggleFavorite = (id: number) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const applyPromoCode = () => {
    if (promoCode === 'SAVE10') {
      setAppliedPromo('SAVE10');
      Alert.alert('Success', '10% discount applied!');
    } else {
      Alert.alert('Invalid Code', 'Please enter a valid promo code.');
    }
  };

  const proceedToCheckout = () => {
    Alert.alert(
      'Proceed to Checkout',
      `Total Amount: ₹${total.toLocaleString()}\n\nThis is a demo app. Checkout functionality would be implemented here.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#2D3748" />
          </TouchableOpacity>
          <Text className="font-bold text-lg text-gray-900">Shopping Cart</Text>
          <View className="w-6" />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Cart Items Count */}
        <View className="px-4 py-3 bg-white border-b border-gray-200">
          <Text className="text-gray-600 text-sm">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
          </Text>
        </View>

        {/* Delivery Info */}
        <View className="bg-green-50 mx-4 mt-4 p-4 rounded-xl border border-green-200">
          <View className="flex-row items-center space-x-3">
            <View className="w-10 h-10 bg-green-500 rounded-full items-center justify-center">
              <Truck size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-green-800">Free Delivery Available</Text>
              <Text className="text-green-600 text-sm">Your order qualifies for free delivery!</Text>
            </View>
          </View>
        </View>

        {/* Delivery Address */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-xl">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="font-medium text-gray-900">Delivery Address</Text>
            <TouchableOpacity>
              <Text className="text-blue-500 font-medium">Change</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-start space-x-3">
            <MapPin size={20} color="#4AB7B6" />
            <View className="flex-1">
              <Text className="font-medium text-gray-900">Home</Text>
              <Text className="text-gray-600 text-sm">BTM Layout, Bengaluru, Karnataka 500628</Text>
            </View>
          </View>
          <View className="flex-row items-center mt-3 space-x-2">
            <Clock size={16} color="#7D8FAB" />
            <Text className="text-gray-600 text-sm">Estimated delivery: 45-60 mins</Text>
          </View>
        </View>

        {/* Cart Items */}
        <View className="px-4 mt-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="bg-white mb-4 overflow-hidden">
              <CardContent className="p-0">
                <View className="flex-row">
                  {/* Product Image */}
                  <View className="w-24 h-24 bg-gray-100 items-center justify-center">
                    <Text className="text-3xl">{item.image}</Text>
                  </View>
                  
                  {/* Product Details */}
                  <View className="flex-1 p-4">
                    <View className="flex-row items-start justify-between mb-2">
                      <View className="flex-1 pr-2">
                        <Text className="font-medium text-gray-900 mb-1">{item.name}</Text>
                        <Text className="text-gray-500 text-sm mb-1">{item.variant}</Text>
                        <Text className="text-gray-500 text-xs">Sold by: {item.seller}</Text>
                      </View>
                      <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                        <Heart 
                          size={20} 
                          color={item.isFavorite ? "#E91E63" : "#7D8FAB"} 
                          fill={item.isFavorite ? "#E91E63" : "transparent"}
                        />
                      </TouchableOpacity>
                    </View>
                    
                    {/* Rating */}
                    <View className="flex-row items-center space-x-1 mb-3">
                      <Star size={12} color="#FFA902" fill="#FFA902" />
                      <Text className="text-sm text-gray-600">{item.rating}</Text>
                      <Text className="text-sm text-gray-500">({item.reviews})</Text>
                    </View>
                    
                    {/* Price and Quantity */}
                    <View className="flex-row items-center justify-between">
                      <View>
                        <Text className="font-bold text-green-600">₹{item.price.toLocaleString()}</Text>
                        <Text className="text-gray-500 text-sm line-through">₹{item.originalPrice.toLocaleString()}</Text>
                      </View>
                      
                      <View className="flex-row items-center space-x-3">
                        <TouchableOpacity onPress={() => removeItem(item.id)}>
                          <Trash2 size={18} color="#EF4444" />
                        </TouchableOpacity>
                        
                        <View className="flex-row items-center bg-gray-100 rounded-lg">
                          <TouchableOpacity 
                            className="p-2"
                            onPress={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus size={16} color="#7D8FAB" />
                          </TouchableOpacity>
                          <Text className="mx-3 font-medium">{item.quantity}</Text>
                          <TouchableOpacity 
                            className="p-2"
                            onPress={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus size={16} color="#7D8FAB" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>

        {/* Promo Code Section */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-xl">
          <Text className="font-medium text-gray-900 mb-3">Promo Code</Text>
          {appliedPromo ? (
            <View className="flex-row items-center bg-green-50 p-3 rounded-lg border border-green-200">
              <Gift size={20} color="#059669" />
              <Text className="ml-3 text-green-700 font-medium">SAVE10 applied - 10% off</Text>
            </View>
          ) : (
            <View className="flex-row space-x-3">
              <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 py-3">
                <Tag size={20} color="#7D8FAB" />
                <Text className="ml-3 text-gray-500">Enter promo code (try: SAVE10)</Text>
              </View>
              <TouchableOpacity 
                className="bg-blue-500 px-6 py-3 rounded-lg"
                onPress={applyPromoCode}
              >
                <Text className="text-white font-medium">Apply</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Bill Summary */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-xl">
          <Text className="font-medium text-gray-900 mb-4">Bill Summary</Text>
          
          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Subtotal ({cartItems.length} items)</Text>
              <Text className="font-medium">₹{subtotal.toLocaleString()}</Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Delivery Fee</Text>
              <Text className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </Text>
            </View>
            
            {appliedPromo && (
              <View className="flex-row justify-between">
                <Text className="text-green-600">Discount (SAVE10)</Text>
                <Text className="font-medium text-green-600">-₹{discount.toLocaleString()}</Text>
              </View>
            )}
            
            <View className="border-t border-gray-200 pt-3">
              <View className="flex-row justify-between">
                <Text className="font-bold text-lg text-gray-900">Total Amount</Text>
                <Text className="font-bold text-lg text-green-600">₹{total.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-xl">
          <Text className="font-medium text-gray-900 mb-3">Payment Method</Text>
          <View className="flex-row items-center space-x-3">
            <View className="w-10 h-10 bg-blue-100 rounded-lg items-center justify-center">
              <CreditCard size={20} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-gray-900">Credit/Debit Card</Text>
              <Text className="text-gray-500 text-sm">Secure payment via card</Text>
            </View>
            <TouchableOpacity>
              <Text className="text-blue-500 font-medium">Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View className="h-24" />
      </ScrollView>

      {/* Checkout Button */}
      <View className="bg-white border-t border-gray-200 px-4 py-4">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-gray-600 text-sm">Total Amount</Text>
            <Text className="font-bold text-xl text-green-600">₹{total.toLocaleString()}</Text>
          </View>
          <TouchableOpacity 
            className="bg-orange-500 px-8 py-4 rounded-xl flex-row items-center space-x-2"
            onPress={proceedToCheckout}
          >
            <ShoppingBag size={20} color="white" />
            <Text className="text-white font-bold text-lg ml-2">Checkout</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-center text-gray-500 text-xs">
          By placing this order, you agree to our Terms & Conditions
        </Text>
      </View>
    </SafeAreaView>
  );
}
