import dotenv from 'dotenv';
import { createClerkClient } from "@clerk/express";

dotenv.config();

export const clerkConfigClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
  // apiKey: process.env.CLERK_API_KEY!,
  // apiVersion: 2,
});