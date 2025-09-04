import { Request } from 'express';
import { user_role_enum, user_status_enum, restaurant_staff_role_enum } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

// Thông tin restaurant context cho staff
export interface RestaurantContext {
  restaurant_id: string;
  restaurant_name: string;
  staff_role: restaurant_staff_role_enum;
}

// User interface với tất cả thuộc tính từ Clerk
export interface AuthenticatedUser {
  id: string;
  clerk_id: string | null;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar_url: string | null;
  phone_number: string | null;
  phone_code: string | null;
  date_of_birth: Date | null;
  gender: string | null;
  role: user_role_enum;
  status: user_status_enum;
  total_orders: number;
  total_spent: Decimal;
  loyalty_points: number;
  email_verified_at: Date | null;
  phone_verified_at: Date | null;
  restaurant_context?: RestaurantContext | null;
}

// Extended Request interface
export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}
