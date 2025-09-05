import dotenv from 'dotenv';
import { createClerkClient } from "@clerk/express";

dotenv.config();

export const clerkConfigClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

// Clerk configuration
export const clerkConfig = {
  secretKey: process.env.CLERK_SECRET_KEY!,
  publishableKey: process.env.EXPRESS_PUBLIC_CLERK_PUBLISHABLE_KEY!,
  webhookSecret: process.env.EXPRESS_CLERK_WEBHOOK_SECRET!,
  apiUrl: process.env.CLERK_API_URL || 'https://api.clerk.com',
  apiVersion: 'v1',
};

// Validate required environment variables
if (!clerkConfig.secretKey) {
  throw new Error('CLERK_SECRET_KEY is required');
}

if (!clerkConfig.publishableKey) {
  throw new Error('CLERK_PUBLISHABLE_KEY is required');
}

if (!clerkConfig.webhookSecret) {
  console.warn('CLERK_WEBHOOK_SECRET is not set - webhooks will not work');
}