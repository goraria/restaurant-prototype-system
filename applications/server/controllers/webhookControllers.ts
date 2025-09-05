import { Request, Response } from "express";
import { clerkConfigClient } from "@/config/clerk";
import { PrismaClient } from "@prisma/client";
import { Webhook } from "svix";
import { user_role_enum, user_status_enum } from "@prisma/client";
import { publishRealtimeUpdate } from "@/config/realtime";
import { rlsManager } from "@/services/rlsManagers";

const prisma = new PrismaClient();

// ================================
// 🔗 COMPREHENSIVE CLERK WEBHOOK HANDLER
// ================================

export const webhookHandler = async (req: Request, res: Response): Promise<void> => {
  const WEBHOOK_SECRET = process.env.EXPRESS_CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    res.status(500).json({
      success: false,
      message: 'CLERK_WEBHOOK_SECRET not configured',
    });
    return;
  }

  // Get the headers
  const headerPayload = req.headers;
  const svix_id = headerPayload['svix-id'] as string;
  const svix_timestamp = headerPayload['svix-timestamp'] as string;
  const svix_signature = headerPayload['svix-signature'] as string;

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    res.status(400).json({
      success: false,
      message: 'Error occurred -- no svix headers',
    });
    return;
  }

  // Get the body
  const payload = req.body;
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    res.status(400).json({
      success: false,
      message: 'Error occurred while verifying webhook',
    });
    return;
  }

  // Handle the webhook
  const eventType = evt.type;
  console.log(`🔔 Clerk Webhook received: ${eventType} for user ${evt.data?.id}`);

  try {
    switch (eventType) {
      // ================================
      // 👤 USER EVENTS
      // ================================
      case 'user.created':
        await handleUserCreated(evt.data);
        // Sync to Supabase with RLS
        await rlsManager.syncUserFromClerk(evt.data, 'created');
        break;
      case 'user.updated':
        await handleUserUpdated(evt.data);
        // Sync to Supabase with RLS
        await rlsManager.syncUserFromClerk(evt.data, 'updated');
        break;
      case 'user.deleted':
        await handleUserDeleted(evt.data);
        // Sync to Supabase with RLS
        await rlsManager.syncUserFromClerk(evt.data, 'deleted');
        break;

      // ================================
      // 🏢 ORGANIZATION EVENTS  
      // ================================
      case 'organization.created':
        await handleOrganizationCreated(evt.data);
        // Sync to Supabase with RLS
        await rlsManager.syncOrganizationFromClerk(evt.data, 'created');
        break;
      case 'organization.updated':
        await handleOrganizationUpdated(evt.data);
        // Sync to Supabase with RLS
        await rlsManager.syncOrganizationFromClerk(evt.data, 'updated');
        break;
      case 'organization.deleted':
        await handleOrganizationDeleted(evt.data);
        // Sync to Supabase with RLS
        await rlsManager.syncOrganizationFromClerk(evt.data, 'deleted');
        break;

      // ================================
      // 👥 ORGANIZATION MEMBERSHIP EVENTS
      // ================================
      case 'organizationMembership.created':
        await handleOrganizationMembershipCreated(evt.data);
        break;
      case 'organizationMembership.updated':
        await handleOrganizationMembershipUpdated(evt.data);
        break;
      case 'organizationMembership.deleted':
        await handleOrganizationMembershipDeleted(evt.data);
        break;

      // ================================
      // 🔐 SESSION EVENTS
      // ================================
      case 'session.created':
        await handleSessionCreated(evt.data);
        break;
      case 'session.ended':
        await handleSessionEnded(evt.data);
        break;
      case 'session.removed':
        await handleSessionRemoved(evt.data);
        break;
      case 'session.revoked':
        await handleSessionRevoked(evt.data);
        break;

      // ================================
      // 📧 EMAIL EVENTS
      // ================================
      case 'email.created':
        await handleEmailCreated(evt.data);
        break;

      // ================================
      // 📱 PHONE EVENTS
      // ================================
      case 'phoneNumber.created':
        await handlePhoneNumberCreated(evt.data);
        break;

      default:
        console.log(`⚠️ Unhandled Clerk event type: ${eventType}`);
    }

    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
      eventType,
    });
  } catch (error) {
    console.error(`❌ Error handling webhook ${eventType}:`, error);
    res.status(500).json({
      success: false,
      message: 'Error handling webhook',
      eventType,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// ================================
// 👤 USER EVENT HANDLERS
// ================================

async function handleUserCreated(userData: any): Promise<any> {
  console.log('🆕 Creating user from Clerk:', userData.id);
  
  const emailAddresses = userData.email_addresses || [];
  const primaryEmail = emailAddresses.find((email: any) => email.id === userData.primary_email_address_id);
  
  if (!primaryEmail) {
    console.error('❌ No primary email found for user:', userData.id);
    return;
  }

  const phoneNumbers = userData.phone_numbers || [];
  const primaryPhone = phoneNumbers.find((phone: any) => phone.id === userData.primary_phone_number_id);

  // Extract role and organization info from publicMetadata
  const publicMetadata = userData.public_metadata || {};
  const role = publicMetadata.role || 'customer';
  const organizationId = publicMetadata.organization_id;
  const restaurantId = publicMetadata.restaurant_id;

  try {
    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { clerk_id: userData.id }
    });

    if (existingUser) {
      console.log('👤 User already exists, updating:', userData.id);
      return await handleUserUpdated(userData);
    }

    // Create new user
    const newUser = await prisma.users.create({
      data: {
        clerk_id: userData.id,
        username: userData.username || userData.id,
        email: primaryEmail.email_address,
        phone_code: primaryPhone?.phone_number?.split(' ')[0] || null,
        phone_number: primaryPhone?.phone_number || null,
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        full_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
        avatar_url: userData.image_url,
        role: role as user_role_enum,
        status: 'active' as user_status_enum,
        email_verified_at: primaryEmail.verification?.status === 'verified' ? new Date() : null,
        phone_verified_at: primaryPhone?.verification?.status === 'verified' ? new Date() : null,
      }
    });

    // Create user statistics
    await prisma.user_statistics.create({
      data: {
        user_id: newUser.id,
      }
    });

    // Handle organization/restaurant assignments based on role
    if (organizationId && restaurantId && (role === 'staff' || role === 'manager')) {
      await handleRestaurantStaffAssignment(newUser.id, organizationId, restaurantId, role);
    }

    console.log(`✅ User created successfully: ${newUser.email} (${role})`);

    // 🔄 SYNC TO EXPO & NEXTJS CLIENTS VIA SUPABASE REALTIME
    publishRealtimeUpdate('user.created', {
      event: 'USER_CREATED',
      user: newUser,
      clerk_id: userData.id,
      role: role,
      organization_id: organizationId,
      restaurant_id: restaurantId
    });

    return newUser;
  } catch (error) {
    console.error('❌ Error creating user:', error);
    throw error;
  }
}

async function handleUserUpdated(userData: any): Promise<any> {
  console.log('🔄 Updating user from Clerk:', userData.id);

  const emailAddresses = userData.email_addresses || [];
  const primaryEmail = emailAddresses.find((email: any) => email.id === userData.primary_email_address_id);
  
  const phoneNumbers = userData.phone_numbers || [];
  const primaryPhone = phoneNumbers.find((phone: any) => phone.id === userData.primary_phone_number_id);

  // Extract updated metadata
  const publicMetadata = userData.public_metadata || {};
  const role = publicMetadata.role;
  const organizationId = publicMetadata.organization_id;
  const restaurantId = publicMetadata.restaurant_id;

  try {
    const existingUser = await prisma.users.findUnique({
      where: { clerk_id: userData.id }
    });

    if (!existingUser) {
      console.log('👤 User not found in DB, creating:', userData.id);
      return await handleUserCreated(userData);
    }

    // Update user data
    const updatedUser = await prisma.users.update({
      where: { clerk_id: userData.id },
      data: {
        username: userData.username || existingUser.username,
        email: primaryEmail?.email_address || existingUser.email,
        phone_code: primaryPhone?.phone_number?.split(' ')[0] || existingUser.phone_code,
        phone_number: primaryPhone?.phone_number || existingUser.phone_number,
        first_name: userData.first_name || existingUser.first_name,
        last_name: userData.last_name || existingUser.last_name,
        full_name: `${userData.first_name || existingUser.first_name} ${userData.last_name || existingUser.last_name}`.trim(),
        avatar_url: userData.image_url || existingUser.avatar_url,
        role: role ? (role as user_role_enum) : existingUser.role,
        email_verified_at: primaryEmail?.verification?.status === 'verified' ? new Date() : existingUser.email_verified_at,
        phone_verified_at: primaryPhone?.verification?.status === 'verified' ? new Date() : existingUser.phone_verified_at,
        updated_at: new Date(),
      }
    });

    // Handle role changes and staff assignments
    if (role && role !== existingUser.role) {
      await handleRoleChange(existingUser.id, existingUser.role, role, organizationId, restaurantId);
    }

    // Update restaurant staff assignment if needed
    if (organizationId && restaurantId && (role === 'staff' || role === 'manager')) {
      await handleRestaurantStaffAssignment(existingUser.id, organizationId, restaurantId, role);
    }

    console.log(`✅ User updated successfully: ${updatedUser.email}`);

    // 🔄 SYNC TO EXPO & NEXTJS CLIENTS VIA SUPABASE REALTIME
    publishRealtimeUpdate('user.updated', {
      event: 'USER_UPDATED',
      user: updatedUser,
      clerk_id: userData.id,
      role: role || existingUser.role,
      organization_id: organizationId,
      restaurant_id: restaurantId,
      changes: {
        role_changed: role && role !== existingUser.role,
        profile_updated: true
      }
    });

    return updatedUser;
  } catch (error) {
    console.error('❌ Error updating user:', error);
    throw error;
  }
}

async function handleUserDeleted(userData: any): Promise<void> {
  console.log('🗑️ Deleting user from Clerk:', userData.id);

  try {
    const existingUser = await prisma.users.findUnique({
      where: { clerk_id: userData.id }
    });

    if (!existingUser) {
      console.log('👤 User not found in DB:', userData.id);
      return;
    }

    // Soft delete or hard delete based on business logic
    const deletedUser = await prisma.users.update({
      where: { clerk_id: userData.id },
      data: {
        status: 'inactive' as user_status_enum,
        clerk_id: null, // Remove Clerk association
        updated_at: new Date(),
      }
    });

    console.log(`✅ User soft deleted: ${existingUser.email}`);

    // 🔄 SYNC TO EXPO & NEXTJS CLIENTS VIA SUPABASE REALTIME
    publishRealtimeUpdate('user.deleted', {
      event: 'USER_DELETED',
      user: deletedUser,
      original_clerk_id: userData.id,
      user_id: existingUser.id,
      status: 'deleted'
    });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    throw error;
  }
}

// ================================
// 🏢 ORGANIZATION EVENT HANDLERS  
// ================================

async function handleOrganizationCreated(orgData: any): Promise<any> {
  console.log('🏢 Creating organization from Clerk:', orgData.id);

  try {
    // Get organization owner from Clerk
    const ownerId = orgData.created_by;
    const owner = await prisma.users.findUnique({
      where: { clerk_id: ownerId }
    });

    if (!owner) {
      console.error('❌ Organization owner not found:', ownerId);
      return;
    }

    // Create organization
    const newOrg = await prisma.organizations.create({
      data: {
        name: orgData.name,
        code: orgData.slug || generateOrgCode(),
        description: orgData.public_metadata?.description || null,
        logo_url: orgData.image_url || null,
        owner_id: owner.id,
      }
    });

    console.log(`✅ Organization created: ${newOrg.name}`);

    // 🔄 SYNC TO EXPO & NEXTJS CLIENTS VIA SUPABASE REALTIME
    publishRealtimeUpdate('organization.created', {
      event: 'ORGANIZATION_CREATED',
      organization: newOrg,
      owner: owner,
      clerk_org_id: orgData.id
    });

    return newOrg;
  } catch (error) {
    console.error('❌ Error creating organization:', error);
    throw error;
  }
}

async function handleOrganizationUpdated(orgData: any): Promise<any> {
  console.log('🔄 Updating organization from Clerk:', orgData.id);
  
  try {
    // Find organization by Clerk metadata or name
    const existingOrg = await prisma.organizations.findFirst({
      where: {
        OR: [
          { name: orgData.name },
          { code: orgData.slug }
        ]
      }
    });

    if (!existingOrg) {
      console.log('🏢 Organization not found, creating:', orgData.id);
      return await handleOrganizationCreated(orgData);
    }

    // Update organization
    const updatedOrg = await prisma.organizations.update({
      where: { id: existingOrg.id },
      data: {
        name: orgData.name,
        code: orgData.slug || existingOrg.code,
        description: orgData.public_metadata?.description || existingOrg.description,
        logo_url: orgData.image_url || existingOrg.logo_url,
        updated_at: new Date(),
      }
    });

    console.log(`✅ Organization updated: ${updatedOrg.name}`);
    
    // 📡 Broadcast realtime update to clients
    publishRealtimeUpdate('organization.updated', {
      event: 'ORGANIZATION_UPDATED',
      organization: updatedOrg,
      clerkId: orgData.id,
      changes: {
        name: orgData.name !== existingOrg.name,
        description: (orgData.public_metadata?.description || '') !== (existingOrg.description || ''),
        logo: (orgData.image_url || '') !== (existingOrg.logo_url || '')
      }
    });
    
    return updatedOrg;
  } catch (error) {
    console.error('❌ Error updating organization:', error);
    throw error;
  }
}

async function handleOrganizationDeleted(orgData: any): Promise<void> {
  console.log('🗑️ Deleting organization from Clerk:', orgData.id);
  
  try {
    const existingOrg = await prisma.organizations.findFirst({
      where: {
        OR: [
          { name: orgData.name },
          { code: orgData.slug }
        ]
      }
    });

    if (!existingOrg) {
      console.log('🏢 Organization not found:', orgData.id);
      return;
    }

    // Note: Manual intervention required for organization deletion
    console.log(`⚠️ Organization deletion requested: ${existingOrg.name}`);
    console.log('Manual intervention required for organization deletion');
    
    // 📡 Broadcast realtime update to clients
    publishRealtimeUpdate('organization.deleted', {
      event: 'ORGANIZATION_DELETE_REQUESTED',
      organization: existingOrg,
      clerkId: orgData.id,
      requiresManualIntervention: true,
      message: 'Organization deletion requested - manual intervention required'
    });
    
  } catch (error) {
    console.error('❌ Error deleting organization:', error);
    throw error;
  }
}

// ================================
// 👥 ORGANIZATION MEMBERSHIP HANDLERS
// ================================

async function handleOrganizationMembershipCreated(membershipData: any): Promise<void> {
  console.log('👥 Creating organization membership:', membershipData.id);
  
  try {
    const userId = membershipData.user_id;
    const orgId = membershipData.organization_id;
    const role = membershipData.role;

    // Find user and organization
    const user = await prisma.users.findUnique({
      where: { clerk_id: userId }
    });

    if (!user) {
      console.error('❌ User not found for membership:', userId);
      return;
    }

    // Update user role based on organization membership
    const newRole = mapClerkRoleToUserRole(role);
    
    await prisma.users.update({
      where: { id: user.id },
      data: {
        role: newRole,
        updated_at: new Date(),
      }
    });

    console.log(`✅ User role updated to ${newRole} for organization membership`);
    
    // 📡 Broadcast realtime update to clients
    publishRealtimeUpdate('membership.created', {
      event: 'MEMBERSHIP_CREATED',
      user: user,
      organizationId: orgId,
      role: newRole,
      clerkMembershipId: membershipData.id
    });
    
  } catch (error) {
    console.error('❌ Error creating organization membership:', error);
    throw error;
  }
}

async function handleOrganizationMembershipUpdated(membershipData: any): Promise<void> {
  console.log('🔄 Updating organization membership:', membershipData.id);
  
  try {
    const userId = membershipData.user_id;
    const role = membershipData.role;

    const user = await prisma.users.findUnique({
      where: { clerk_id: userId }
    });

    if (!user) {
      console.error('❌ User not found for membership update:', userId);
      return;
    }

    // Update user role
    const newRole = mapClerkRoleToUserRole(role);
    
    await prisma.users.update({
      where: { id: user.id },
      data: {
        role: newRole,
        updated_at: new Date(),
      }
    });

    console.log(`✅ User role updated to ${newRole}`);
    
    // 📡 Broadcast realtime update to clients
    publishRealtimeUpdate('membership.updated', {
      event: 'MEMBERSHIP_UPDATED',
      user: user,
      newRole: newRole,
      clerkMembershipId: membershipData.id,
      organizationId: membershipData.organization_id
    });
    
  } catch (error) {
    console.error('❌ Error updating organization membership:', error);
    throw error;
  }
}

async function handleOrganizationMembershipDeleted(membershipData: any): Promise<void> {
  console.log('🗑️ Deleting organization membership:', membershipData.id);
  
  try {
    const userId = membershipData.user_id;

    const user = await prisma.users.findUnique({
      where: { clerk_id: userId }
    });

    if (!user) {
      console.error('❌ User not found for membership deletion:', userId);
      return;
    }

    // Revert to customer role when removed from organization
    await prisma.users.update({
      where: { id: user.id },
      data: {
        role: 'customer' as user_role_enum,
        updated_at: new Date(),
      }
    });

    // Remove from restaurant staff if applicable
    await prisma.restaurant_staffs.updateMany({
      where: { user_id: user.id },
      data: {
        status: 'inactive',
        left_at: new Date(),
      }
    });

    console.log(`✅ User reverted to customer role and removed from staff`);
    
    // 📡 Broadcast realtime update to clients
    publishRealtimeUpdate('membership.deleted', {
      event: 'MEMBERSHIP_DELETED',
      user: user,
      revertedToRole: 'customer',
      clerkMembershipId: membershipData.id,
      organizationId: membershipData.organization_id,
      removedFromStaff: true
    });
    
  } catch (error) {
    console.error('❌ Error deleting organization membership:', error);
    throw error;
  }
}

// ================================
// 🔐 SESSION EVENT HANDLERS
// ================================

async function handleSessionCreated(sessionData: any): Promise<void> {
  console.log('🔑 Session created for user:', sessionData.user_id);
  
  try {
    await prisma.users.updateMany({
      where: { clerk_id: sessionData.user_id },
      data: {
        updated_at: new Date(),
      }
    });
  } catch (error) {
    console.error('❌ Error handling session created:', error);
  }
}

async function handleSessionEnded(sessionData: any): Promise<void> {
  console.log('🚪 Session ended for user:', sessionData.user_id);
  // Track session end times, logout events
}

async function handleSessionRemoved(sessionData: any): Promise<void> {
  console.log('🗑️ Session removed for user:', sessionData.user_id);
}

async function handleSessionRevoked(sessionData: any): Promise<void> {
  console.log('❌ Session revoked for user:', sessionData.user_id);
  // Handle security events, force logout, etc.
}

// ================================
// 📧 EMAIL & PHONE EVENT HANDLERS
// ================================

async function handleEmailCreated(emailData: any): Promise<void> {
  console.log('📧 Email created for user:', emailData.user_id);
  // Handle additional email addresses
}

async function handlePhoneNumberCreated(phoneData: any): Promise<void> {
  console.log('📱 Phone number created for user:', phoneData.user_id);
  // Handle additional phone numbers
}

// ================================
// 🔧 HELPER FUNCTIONS
// ================================

async function handleRestaurantStaffAssignment(userId: string, organizationId: string, restaurantId: string, role: string): Promise<void> {
  try {
    // Check if restaurant exists and belongs to organization
    const restaurant = await prisma.restaurants.findFirst({
      where: {
        id: restaurantId,
        organization_id: organizationId,
      }
    });

    if (!restaurant) {
      console.error('❌ Restaurant not found or not in organization:', restaurantId);
      return;
    }

    // Check if staff assignment already exists
    const existingStaff = await prisma.restaurant_staffs.findFirst({
      where: {
        user_id: userId,
        restaurant_id: restaurantId,
      }
    });

    const staffRole = role === 'manager' ? 'manager' : 'staff';

    if (existingStaff) {
      // Update existing assignment
      await prisma.restaurant_staffs.update({
        where: { id: existingStaff.id },
        data: {
          role: staffRole as any,
          status: 'active',
          left_at: null,
        }
      });
    } else {
      // Create new staff assignment
      await prisma.restaurant_staffs.create({
        data: {
          user_id: userId,
          restaurant_id: restaurantId,
          role: staffRole as any,
          status: 'active',
        }
      });
    }

    console.log(`✅ Staff assignment created/updated: ${userId} -> ${restaurantId} (${staffRole})`);
  } catch (error) {
    console.error('❌ Error handling restaurant staff assignment:', error);
    throw error;
  }
}

async function handleRoleChange(userId: string, oldRole: string, newRole: string, organizationId?: string, restaurantId?: string): Promise<void> {
  console.log(`🔄 Role change: ${oldRole} -> ${newRole} for user ${userId}`);
  
  try {
    // Handle staff/manager role changes
    if ((oldRole === 'staff' || oldRole === 'manager') && (newRole !== 'staff' && newRole !== 'manager')) {
      // User is no longer staff/manager, deactivate staff assignments
      await prisma.restaurant_staffs.updateMany({
        where: { user_id: userId },
        data: {
          status: 'inactive',
          left_at: new Date(),
        }
      });
    }

    // Handle new staff/manager assignments
    if ((newRole === 'staff' || newRole === 'manager') && organizationId && restaurantId) {
      await handleRestaurantStaffAssignment(userId, organizationId, restaurantId, newRole);
    }

    console.log(`✅ Role change handled successfully`);
  } catch (error) {
    console.error('❌ Error handling role change:', error);
    throw error;
  }
}

function mapClerkRoleToUserRole(clerkRole: string): user_role_enum {
  switch (clerkRole) {
    case 'admin':
    case 'org:admin':
      return 'admin';
    case 'manager':
    case 'org:manager':
      return 'manager';
    case 'staff':
    case 'org:member':
      return 'staff';
    default:
      return 'customer';
  }
}

function generateOrgCode(): string {
  return `ORG_${Date.now().toString(36).toUpperCase()}`;
}

// ================================
// 🧪 WEBHOOK TESTING HELPERS
// ================================

export const testWebhookHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('🧪 Test webhook received');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  
  res.status(200).json({
    success: true,
    message: 'Test webhook received',
    timestamp: new Date().toISOString(),
  });
};

// ================================
// 🚀 REALTIME SYNC HELPER FOR CLIENTS
// ================================

/**
 * Broadcasts webhook events to Expo and NextJS clients via Supabase Realtime
 * This ensures all clients stay synchronized with Clerk user/organization changes
 */
export async function syncWebhookToClients(
  eventType: string,
  data: any,
  additionalData?: any
): Promise<void> {
  try {
    // Determine which table and operation based on event type
    const eventMap: Record<string, { table: string; operation: 'INSERT' | 'UPDATE' | 'DELETE' }> = {
      'user.created': { table: 'users', operation: 'INSERT' },
      'user.updated': { table: 'users', operation: 'UPDATE' },
      'user.deleted': { table: 'users', operation: 'UPDATE' }, // Soft delete
      'organization.created': { table: 'organizations', operation: 'INSERT' },
      'organization.updated': { table: 'organizations', operation: 'UPDATE' },
      'organization.deleted': { table: 'organizations', operation: 'UPDATE' },
      'organizationMembership.created': { table: 'restaurant_staffs', operation: 'INSERT' },
      'organizationMembership.updated': { table: 'restaurant_staffs', operation: 'UPDATE' },
      'organizationMembership.deleted': { table: 'restaurant_staffs', operation: 'UPDATE' },
    };

    const eventConfig = eventMap[eventType];
    if (eventConfig) {
      const realtimeEvent = `${eventConfig.table}.${eventConfig.operation.toLowerCase()}`;
      const payload = {
        table: eventConfig.table,
        operation: eventConfig.operation,
        data,
        webhook_event: eventType,
        timestamp: new Date().toISOString(),
        ...additionalData
      };
      
      publishRealtimeUpdate(realtimeEvent, payload);
      console.log(`📡 Synced ${eventType} to clients via Supabase Realtime`);
    }
  } catch (error) {
    console.error(`❌ Failed to sync ${eventType} to clients:`, error);
  }
}

export default {
  webhookHandler,
  testWebhookHandler,
  syncWebhookToClients,
};
