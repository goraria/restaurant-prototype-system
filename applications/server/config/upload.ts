import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Supabase configuration for upload service
export const uploadConfig = {
  supabaseUrl: process.env.EXPRESS_SUPABASE_URL || '',
  supabaseServiceKey: process.env.EXPRESS_SUPABASE_SERVICE_ROLE_KEY || '',
  serverUrl: process.env.EXPRESS_SERVER_URL || 'http://localhost:8080',
  port: process.env.EXPRESS_PORT || 8080,
  environment: process.env.EXPRESS_ENV || 'development'
};

// Validate configuration
export function validateUploadConfig() {
  const errors: string[] = [];

  if (!uploadConfig.supabaseUrl) {
    errors.push('EXPRESS_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL is not set');
  }

  if (!uploadConfig.supabaseServiceKey) {
    errors.push('EXPRESS_SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_ROLE_KEY is not set');
  }

  if (uploadConfig.supabaseUrl) {
    try {
      new URL(uploadConfig.supabaseUrl);
    } catch (error) {
      errors.push(`Invalid Supabase URL format: ${uploadConfig.supabaseUrl}`);
    }
  }

  if (errors.length > 0) {
    console.error('❌ Upload configuration errors:');
    errors.forEach(error => console.error(`  - ${error}`));
    console.error('\n📝 Please create a .env file in the server directory with:');
    console.error('EXPRESS_SUPABASE_URL=https://your-project.supabase.co');
    console.error('EXPRESS_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
    return false;
  }

  console.log('✅ Upload configuration validated');
  console.log(`  - Supabase URL: ${uploadConfig.supabaseUrl}`);
  console.log(`  - Service Key: ${uploadConfig.supabaseServiceKey ? 'Set' : 'Not set'}`);
  console.log(`  - Server URL: ${uploadConfig.serverUrl}`);
  console.log(`  - Port: ${uploadConfig.port}`);
  console.log(`  - Environment: ${uploadConfig.environment}`);

  return true;
}
