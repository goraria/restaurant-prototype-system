// ================================
// 🔄 CLERK USER SYNCHRONIZATION
// ================================

import { PrismaClient } from '@prisma/client';
import { User as ClerkUser } from '@clerk/express';
import { ClerkUserData, DatabaseUser, SyncResult } from '@/constants/types';

const prisma = new PrismaClient();

// ================================
// 🔄 SYNC CLERK USER TO DATABASE
// ================================

export async function syncClerkUserToDatabase(clerkUser: ClerkUserData) {
  try {
    console.log('🔄 Syncing Clerk user to database:', clerkUser.id);

    // 🔍 Kiểm tra user đã tồn tại trong database chưa
    const existingUser = await prisma.users.findUnique({
      where: { clerk_id: clerkUser.id }
    });

    // Lấy email chính từ email_addresses array
    const primaryEmail = clerkUser.email_addresses?.find(
      email => email.id === clerkUser.primary_email_address_id
    );

    // Lấy phone chính (nếu có)
    const primaryPhone = clerkUser.phone_numbers?.[0];

    // 📋 Mapping dữ liệu: ƯU TIÊN DỮ LIỆU DATABASE CỦA BẠN
    const userData = {
      // 🔧 DATABASE REQUIRED FIELDS - CHỈ CẬP NHẬT NẾU CHƯA CÓ
      username: existingUser?.username || clerkUser.username || 
                clerkUser.name?.toLowerCase().replace(/\s+/g, '_') ||
                `user_${clerkUser.id.substring(5, 15)}`,
      
      email: existingUser?.email || primaryEmail?.email_address || `${clerkUser.id}@temp.email`,
      
      first_name: existingUser?.first_name || clerkUser.first_name || '',
      last_name: existingUser?.last_name || clerkUser.last_name || '',
      full_name: existingUser?.full_name || clerkUser.name || 
                `${clerkUser.first_name || ''} ${clerkUser.last_name || ''}`.trim(),
      
      // 📞 PHONE DATA - Ưu tiên database
      phone_code: existingUser?.phone_code || 
                 (primaryPhone?.phone_number ? extractCountryCode(primaryPhone.phone_number) : null),
      phone_number: existingUser?.phone_number || 
                   (primaryPhone?.phone_number ? extractPhoneNumber(primaryPhone.phone_number) : null),
      phone_verified_at: existingUser?.phone_verified_at || 
                        (primaryPhone?.verification?.status === 'verified' 
                          ? new Date(primaryPhone.created_at || Date.now()) 
                          : null),

      // 📧 EMAIL VERIFICATION - Ưu tiên database
      email_verified_at: existingUser?.email_verified_at || 
                        (primaryEmail?.verification?.status === 'verified' 
                          ? new Date(primaryEmail.created_at || Date.now()) 
                          : null),

      // 🖼️ IMAGE - Ưu tiên database
      avatar_url: existingUser?.avatar_url || clerkUser.image_url || null,
      has_image: (existingUser as any)?.has_image ?? clerkUser.has_image ?? false,

      // 🔐 CLERK INTEGRATION FIELDS - Luôn cập nhật từ Clerk
      clerk_id: clerkUser.id,
      primary_email_address_id: clerkUser.primary_email_address_id,
      password_enabled: clerkUser.password_enabled || false,
      two_factor_enabled: clerkUser.two_factor_enabled || false,
      totp_enabled: clerkUser.totp_enabled || false,
      backup_code_enabled: clerkUser.backup_code_enabled || false,
      
      // 📅 TIMESTAMPS - Cập nhật từ Clerk
      last_activity_at: clerkUser.last_active_at ? new Date(clerkUser.last_active_at) : 
                       existingUser?.last_activity_at,
      
      // 🚫 ACCOUNT STATUS - Cập nhật từ Clerk 
      banned: clerkUser.banned || false,
      locked: clerkUser.locked || false,
      lockout_expires_in_seconds: clerkUser.lockout_expires_in_seconds,
      
      // ⚙️ ACCOUNT SETTINGS
      delete_self_enabled: clerkUser.delete_self_enabled ?? true,
      create_organization_enabled: clerkUser.create_organization_enabled || false,
      create_organizations_limit: clerkUser.create_organizations_limit,
      legal_accepted_at: clerkUser.legal_accepted_at ? new Date(clerkUser.legal_accepted_at) : null,

      // 📊 METADATA (JSON fields)
      public_metadata: clerkUser.public_metadata || {},
      private_metadata: clerkUser.private_metadata || {},
      unsafe_metadata: clerkUser.unsafe_metadata || {},
      
      // 📧📞 ARRAYS DATA
      email_addresses: clerkUser.email_addresses || [],
      phone_numbers: clerkUser.phone_numbers || [],
      external_accounts: clerkUser.external_accounts || [],
      web3_wallets: clerkUser.web3_wallets || [],
      enterprise_accounts: clerkUser.enterprise_accounts || [],
      passkeys: clerkUser.passkeys || [],

      // 📅 PRISMA TIMESTAMPS
      created_at: clerkUser.created_at ? new Date(clerkUser.created_at) : new Date(),
      updated_at: new Date(),
    };

    // Upsert user (tạo mới hoặc cập nhật)
    const user = await prisma.users.upsert({
      where: { 
        clerk_id: clerkUser.id 
      },
      update: {
        ...userData,
        // Không update created_at khi update
        created_at: undefined,
      },
      create: userData,
    });

    console.log('✅ User synced successfully:', user.id);
    return user;

  } catch (error) {
    console.error('❌ Error syncing Clerk user:', error);
    throw error;
  }
}

// ================================
// � GET USER BY CLERK ID
// ================================

export async function getUserByClerkId(clerkUserId: string) {
  try {
    const user = await prisma.users.findUnique({
      where: { clerk_id: clerkUserId },
      include: {
        user_statistics: true,
        addresses: true,
        organizations_owned: true,
        organization_memberships: true,
      },
    });

    return user;
  } catch (error) {
    console.error('❌ Error getting user by Clerk ID:', error);
    return null;
  }
}

// ================================
// 🔄 SYNC ALL CLERK USERS
// ================================

export async function syncAllClerkUsers(clerkUsers: ClerkUserData[]) {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[],
  };

  for (const clerkUser of clerkUsers) {
    try {
      await syncClerkUserToDatabase(clerkUser);
      results.success++;
    } catch (error) {
      results.failed++;
      results.errors.push(`${clerkUser.id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  console.log('🔄 Sync completed:', results);
  return results;
}

// ================================
// 🧹 CLEANUP ORPHANED USERS
// ================================

export async function cleanupOrphanedUsers(activeClerkUserIds: string[]) {
  try {
    // Tìm users có clerk_id nhưng không còn tồn tại trong Clerk
    const orphanedUsers = await prisma.users.findMany({
      where: {
        clerk_id: {
          not: null,
          notIn: activeClerkUserIds,
        },
      },
    });

    console.log(`🧹 Found ${orphanedUsers.length} orphaned users`);

    // Có thể deactivate thay vì xóa
    for (const user of orphanedUsers) {
      await prisma.users.update({
        where: { id: user.id },
        data: {
          status: 'inactive',
          updated_at: new Date(),
        },
      });
    }

    return orphanedUsers.length;
  } catch (error) {
    console.error('❌ Error cleaning orphaned users:', error);
    return 0;
  }
}

// ================================
// 🛠️ UTILITY FUNCTIONS
// ================================

function extractCountryCode(phoneNumber: string): string | null {
  // Lấy country code từ phone number (ví dụ: +84123456789 -> +84)
  const match = phoneNumber.match(/^(\+\d{1,4})/);
  return match?.[1] || null;
}

function extractPhoneNumber(phoneNumber: string): string | null {
  // Lấy số phone không có country code
  const cleaned = phoneNumber.replace(/^(\+\d{1,4})/, '');
  return cleaned || null;
}

// ================================
// 📊 ROLE MAPPING HELPER
// ================================

export function mapClerkRoleToLocalRole(clerkRole: string): string {
  const roleMapping: Record<string, string> = {
    'admin': 'admin',
    'manager': 'manager',
    'staff': 'staff',
    'member': 'customer',
    'customer': 'customer',
    'user': 'customer',
  };

  return roleMapping[clerkRole] || 'customer';
}

// ================================
// 🔄 WEBHOOK HANDLER
// ================================

export async function handleClerkWebhook(eventType: string, userData: ClerkUserData) {
  try {
    switch (eventType) {
      case 'user.created':
        console.log('🆕 User created webhook');
        return await syncClerkUserToDatabase(userData);
        
      case 'user.updated':
        console.log('📝 User updated webhook');
        return await syncClerkUserToDatabase(userData);
        
      case 'user.deleted':
        console.log('🗑️ User deleted webhook');
        return await prisma.users.update({
          where: { clerk_id: userData.id },
          data: { 
            status: 'inactive',
            updated_at: new Date(),
          },
        });

      default:
        console.log('❓ Unknown webhook event:', eventType);
        return null;
    }
  } catch (error) {
    console.error('❌ Webhook handler error:', error);
    throw error;
  }
}

export default {
  syncClerkUserToDatabase,
  getUserByClerkId,
  syncAllClerkUsers,
  cleanupOrphanedUsers,
  mapClerkRoleToLocalRole,
  handleClerkWebhook,
};
