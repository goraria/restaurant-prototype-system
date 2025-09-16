// ================================
// 👤 USER TYPE DEFINITIONS
// ================================

import {
  user_status_enum,
  user_role_enum,
  user_activity_status_enum,
  users
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

// Re-export enums
export { user_status_enum, user_role_enum, user_activity_status_enum };

// ================================
// 📊 CLERK USER INTERFACE
// ================================

export interface ClerkUserData {
  id: string;
  object: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  has_image?: boolean;
  image_url?: string;
  primary_email_address_id?: string;
  password_enabled?: boolean;
  passkeys?: any[];
  two_factor_enabled?: boolean;
  email_addresses?: ClerkEmailAddress[];
  phone_numbers?: ClerkPhoneNumber[];
  web3_wallets?: any[];
  external_accounts?: ClerkExternalAccount[];
  enterprise_accounts?: any[];
  public_metadata?: Record<string, any>;
  private_metadata?: Record<string, any>;
  unsafe_metadata?: Record<string, any>;
  last_sign_in_at?: number;
  last_active_at?: number;
  created_at?: number;
  updated_at?: number;
  banned?: boolean;
  locked?: boolean;
  lockout_expires_in_seconds?: number | null;
  delete_self_enabled?: boolean;
  create_organization_enabled?: boolean;
  create_organizations_limit?: number | null;
  totp_enabled?: boolean;
  backup_code_enabled?: boolean;
  legal_accepted_at?: number | null;
}

// ================================
// 📧 CLERK EMAIL ADDRESS
// ================================

export interface ClerkEmailAddress {
  id: string;
  object: 'email_address';
  email_address: string;
  verification: {
    status: 'verified' | 'unverified' | 'pending';
    strategy: string;
    attempts: number;
    expire_at: number;
    error: string | null;
  };
  linked_to: any[];
  created_at: number;
  updated_at: number;
}

// ================================
// 📱 CLERK PHONE NUMBER
// ================================

export interface ClerkPhoneNumber {
  id: string;
  object: 'phone_number';
  phone_number: string;
  reserved_for_second_factor: boolean;
  default_second_factor: boolean;
  verification: {
    status: 'verified' | 'unverified' | 'pending';
    strategy: string;
    attempts: number;
    expire_at: number;
    error: string | null;
  };
  linked_to: any[];
  backup_codes: string[];
  created_at: number;
  updated_at: number;
}

// ================================
// 🔗 CLERK EXTERNAL ACCOUNT
// ================================

export interface ClerkExternalAccount {
  id: string;
  object: 'external_account';
  provider: string;
  identification_id: string;
  provider_user_id: string;
  approved_scopes: string;
  email_address: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  public_metadata: Record<string, any>;
  created_at: number;
  updated_at: number;
}

// ================================
// 🎯 DATABASE USER INTERFACE
// ================================

export interface DatabaseUser {
  id: string;
  username?: string | null;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  phone_code?: string | null;
  phone_number?: string | null;
  avatar_url?: string | null;
  email_verified_at?: Date | null;
  phone_verified_at?: Date | null;
  status: user_status_enum;
  role: user_role_enum;
  created_at: Date;
  updated_at: Date;
  clerk_id?: string | null;
  date_of_birth?: Date | null;
  gender?: string | null;
  loyalty_points: number;
  total_orders: number;
  total_spent: Decimal;
  password_hash?: string | null;
  activity_status: user_activity_status_enum;
  is_online?: boolean | null;
  last_activity_at?: Date | null;
  last_seen_at?: Date | null;

  // Clerk integration fields
  has_image?: boolean | null;
  primary_email_address_id?: string | null;
  password_enabled?: boolean | null;
  two_factor_enabled?: boolean | null;
  totp_enabled?: boolean | null;
  backup_code_enabled?: boolean | null;
  banned?: boolean | null;
  locked?: boolean | null;
  lockout_expires_in_seconds?: number | null;
  delete_self_enabled?: boolean | null;
  create_organization_enabled?: boolean | null;
  create_organizations_limit?: number | null;
  legal_accepted_at?: Date | null;
  last_sign_in_at?: Date | null;

  // JSON fields
  public_metadata?: any;
  private_metadata?: any;
  unsafe_metadata?: any;
  email_addresses?: any;
  phone_numbers?: any;
  web3_wallets?: any;
  external_accounts?: any;
  enterprise_accounts?: any;
  passkeys?: any;
}

// ================================
// 🔄 SYNC RESULT INTERFACES
// ================================

export interface SyncResult {
  success: number;
  failed: number;
  errors: string[];
}

export interface UserSyncData {
  clerkUser: ClerkUserData;
  existingUser?: DatabaseUser | null;
  operation: 'create' | 'update' | 'skip';
}

// ================================
// 🎭 REQUEST EXTENSIONS
// ================================

declare global {
  namespace Express {
    interface Request {
      user?: DatabaseUser;
      clerkUserId?: string;
    }
  }
}

// ================================
// 📋 UTILITY TYPES
// ================================

export type UserRole = user_role_enum;
export type UserStatus = user_status_enum;
export type UserActivityStatus = user_activity_status_enum;

export type CreateUserInput = Omit<DatabaseUser, 'id' | 'created_at' | 'updated_at'>;
export type UpdateUserInput = Partial<Omit<DatabaseUser, 'id' | 'created_at'>>;

// ================================
// 🚀 WEBHOOK TYPES
// ================================

export interface ClerkWebhookEvent {
  type: string;
  data: ClerkUserData;
  object: string;
  timestamp: number;
}

export type ClerkWebhookType =
  | 'user.created'
  | 'user.updated'
  | 'user.deleted'
  | 'session.created'
  | 'session.ended'
  | 'email.created'
  | 'email.updated'
  | 'email.deleted'
  | 'phone.created'
  | 'phone.updated'
  | 'phone.deleted';

// ================================
// 🔍 SEARCH AND FILTER TYPES
// ================================

export interface UserSearchParams {
  email?: string;
  username?: string;
  clerk_id?: string;
  role?: UserRole;
  status?: UserStatus;
  page?: number;
  limit?: number;
  sort_by?: 'created_at' | 'updated_at' | 'last_activity_at' | 'total_orders';
  sort_order?: 'asc' | 'desc';
}

export interface UserStatsResponse {
  total_users: number;
  active_users: number;
  new_users_today: number;
  users_by_role: Record<UserRole, number>;
  users_by_status: Record<UserStatus, number>;
}

// ================================
// 🔧 ADDITIONAL SERVICE INTERFACES
// ================================

export interface UserSearchParams {
  query?: string;
  email?: string;
  username?: string;
  phone_number?: string;
  clerk_id?: string;
  role?: user_role_enum;
  status?: user_status_enum;
  page?: number;
  limit?: number;
  sort_by?: 'created_at' | 'updated_at' | 'last_activity_at' | 'total_orders';
  sort_order?: 'asc' | 'desc';
}
