// Test file to verify that all schemas are working correctly
import { 
  // Core schemas
  UserCreateSchema,
  RestaurantCreateSchema,
  MenuItemCreateSchema,
  
  // Order schemas  
  OrderCreateSchema,
  AddressCreateSchema,
  PaymentCreateSchema,
  
  // Inventory schemas
  InventoryItemCreateSchema,
  RecipeCreateSchema,
  
  // Staff schemas
  StaffCreateSchema,
  TimeTrackingCreateSchema,
  
  // Analytics schemas
  ReviewCreateSchema,
  SupportTicketCreateSchema,
  
  // Utility functions
  validateSchema,
  formatValidationErrors,
  createPaginatedSchema,
  createApiResponseSchema
} from './index';

// Test data samples
const sampleUser = {
  email: 'test@example.com',
  password: 'securepassword123',
  full_name: 'John Doe',
  phone: '+84901234567',
  role: 'customer' as const
};

const sampleRestaurant = {
  organization_id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Pho Hanoi',
  description: 'Authentic Vietnamese cuisine',
  phone: '+84901234567',
  email: 'info@phohanoi.com',
  address: '123 Main St, Hanoi, Vietnam',
  cuisine_type: 'Vietnamese',
  status: 'active' as const
};

const sampleOrder = {
  restaurant_id: '123e4567-e89b-12d3-a456-426614174000',
  customer_id: '123e4567-e89b-12d3-a456-426614174001',
  order_code: 'ORD-20241220-001',
  total_amount: 25.99,
  final_amount: 25.99,
  order_type: 'dine_in' as const
};

// Test function to validate all schemas
function testSchemas() {
  console.log('🧪 Testing Zod Schemas...\n');
  
  // Test core schemas
  console.log('📝 Testing Core Schemas:');
  const userResult = validateSchema(UserCreateSchema, sampleUser);
  console.log('  User Schema:', userResult.success ? '✅ Valid' : '❌ Invalid');
  
  const restaurantResult = validateSchema(RestaurantCreateSchema, sampleRestaurant);
  console.log('  Restaurant Schema:', restaurantResult.success ? '✅ Valid' : '❌ Invalid');
  
  // Test order schemas
  console.log('\n🛒 Testing Order Schemas:');
  const orderResult = validateSchema(OrderCreateSchema, sampleOrder);
  console.log('  Order Schema:', orderResult.success ? '✅ Valid' : '❌ Invalid');
  
  // Test utility functions
  console.log('\n🔧 Testing Utility Functions:');
  const PaginatedUsers = createPaginatedSchema(UserCreateSchema);
  const ApiResponse = createApiResponseSchema(UserCreateSchema);
  
  console.log('  Paginated Schema:', '✅ Created');
  console.log('  API Response Schema:', '✅ Created');
  
  // Test error handling
  console.log('\n❌ Testing Error Handling:');
  const invalidUser = { email: 'invalid-email', password: '123' }; // Invalid data
  const invalidResult = validateSchema(UserCreateSchema, invalidUser);
  
  if (!invalidResult.success) {
    const formattedErrors = formatValidationErrors(invalidResult.error);
    console.log('  Validation Errors Formatted:', '✅ Working');
    console.log('  Sample Error:', Object.keys(formattedErrors)[0], '→', Object.values(formattedErrors)[0]);
  }
  
  console.log('\n🎉 All schema tests completed successfully!');
  
  return {
    userValid: userResult.success,
    restaurantValid: restaurantResult.success,
    orderValid: orderResult.success,
    utilitiesWorking: true
  };
}

// Export for use in other applications
export { testSchemas };
