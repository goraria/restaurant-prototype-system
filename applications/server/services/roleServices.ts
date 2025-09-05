import { PrismaClient } from '@prisma/client';
import { clerkConfigClient } from '../config/clerk';
import type { user_role_enum } from '@prisma/client';

const prisma = new PrismaClient();

export class ClerkRoleSyncService {
  /**
   * Mapping Clerk organization roles to Prisma user roles
   */
  private static clerkToPrismaRoleMap: Record<string, user_role_enum> = {
    // Clerk default roles
    'org:admin': 'admin',
    'org:member': 'manager',
    
    // Custom organization roles (you can customize these)
    'restaurant_owner': 'admin',
    'restaurant_manager': 'manager', 
    'area_manager': 'manager',
    'supervisor': 'staff',
    'staff': 'staff',
    
    // System roles
    'super_admin': 'super_admin',
    'admin': 'admin'
  };

  /**
   * Get user's organization role from Clerk
   */
  static async getClerkOrganizationRole(clerkUserId: string, organizationId: string) {
    try {
      const memberships = await clerkConfigClient.organizations.getOrganizationMembershipList({
        organizationId
      });

      const userMembership = memberships.data.find(
        membership => membership.publicUserData?.userId === clerkUserId
      );

      if (!userMembership) {
        return null;
      }

      return {
        role: userMembership.role,
        permissions: userMembership.permissions || []
      };
    } catch (error) {
      console.error('Error getting Clerk organization role:', error);
      return null;
    }
  }

  /**
   * Get all user's organization memberships from Clerk
   */
  static async getUserOrganizationMemberships(clerkUserId: string) {
    try {
      const memberships = await clerkConfigClient.users.getOrganizationMembershipList({
        userId: clerkUserId
      });

      return memberships.data.map((membership: any) => ({
        organizationId: membership.organization.id,
        organizationName: membership.organization.name,
        role: membership.role,
        permissions: membership.permissions || []
      }));
    } catch (error) {
      console.error('Error getting user organization memberships:', error);
      return [];
    }
  }

  /**
   * Sync user role from Clerk organization to Prisma database
   */
  static async syncUserRoleFromClerk(clerkUserId: string, organizationId?: string) {
    try {
      // Find user in database
      const user = await prisma.users.findUnique({
        where: { clerk_id: clerkUserId },
        include: {
          organizations_owned: true
        }
      });

      if (!user) {
        throw new Error('User not found in database');
      }

      let clerkRole: string | null = null;
      let targetOrgId = organizationId;

      if (!targetOrgId) {
        // If no specific org, get user's primary organization
        const memberships = await this.getUserOrganizationMemberships(clerkUserId);
        if (memberships.length > 0) {
          // Use the first organization or the one user owns
          const ownedOrg = memberships.find((m: any) => m.role === 'org:admin');
          const primaryMembership = ownedOrg || memberships[0];
          
          targetOrgId = primaryMembership.organizationId;
          clerkRole = primaryMembership.role;
        }
      } else {
        // Get role from specific organization
        const membership = await this.getClerkOrganizationRole(clerkUserId, targetOrgId);
        clerkRole = membership?.role || null;
      }

      if (!clerkRole) {
        console.warn(`No Clerk role found for user ${clerkUserId}`);
        return { success: false, error: 'No Clerk role found' };
      }

      // Map Clerk role to Prisma role
      const prismaRole = this.clerkToPrismaRoleMap[clerkRole] || 'customer';

      // Update user role in database
      const updatedUser = await prisma.users.update({
        where: { id: user.id },
        data: { role: prismaRole }
      });

      console.log(`Synced user ${user.email} role: ${clerkRole} -> ${prismaRole}`);

      return {
        success: true,
        user: updatedUser,
        clerkRole,
        prismaRole,
        organizationId: targetOrgId
      };
    } catch (error) {
      console.error('Error syncing user role:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Sync all organization members' roles
   */
  static async syncOrganizationMembersRoles(organizationId: string) {
    try {
      // Get all organization members from Clerk
      const members = await clerkConfigClient.organizations.getOrganizationMembershipList({
        organizationId
      });

      const results = [];

      for (const member of members.data) {
        if (!member.publicUserData?.userId) continue;
        
        const syncResult = await this.syncUserRoleFromClerk(
          member.publicUserData.userId,
          organizationId
        );
        
        results.push({
          clerkUserId: member.publicUserData.userId,
          email: member.publicUserData.identifier || 'unknown',
          ...syncResult
        });
      }

      return {
        success: true,
        organizationId,
        syncedMembers: results.length,
        results
      };
    } catch (error) {
      console.error('Error syncing organization members:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Auto-sync user role when they join/leave organization (for webhooks)
   */
  static async handleOrganizationMembershipChange(data: {
    type: 'organizationMembership.created' | 'organizationMembership.updated' | 'organizationMembership.deleted';
    object: any;
  }) {
    try {
      const { type, object } = data;
      const clerkUserId = object.public_user_data.user_id;
      const organizationId = object.organization.id;

      if (type === 'organizationMembership.deleted') {
        // User left organization - set role to customer
        const user = await prisma.users.findUnique({
          where: { clerk_id: clerkUserId }
        });

        if (user) {
          await prisma.users.update({
            where: { id: user.id },
            data: { role: 'customer' }
          });
        }

        return { success: true, action: 'role_reset_to_customer' };
      } else {
        // User joined or role updated - sync role
        return await this.syncUserRoleFromClerk(clerkUserId, organizationId);
      }
    } catch (error) {
      console.error('Error handling organization membership change:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get role mapping for reference
   */
  static getRoleMapping() {
    return this.clerkToPrismaRoleMap;
  }

  /**
   * Update role mapping (for dynamic configuration)
   */
  static updateRoleMapping(newMapping: Record<string, user_role_enum>) {
    this.clerkToPrismaRoleMap = { ...this.clerkToPrismaRoleMap, ...newMapping };
  }

  /**
   * Check if user has required role in organization
   */
  static async hasRequiredRole(
    clerkUserId: string, 
    organizationId: string, 
    requiredRole: user_role_enum
  ): Promise<boolean> {
    try {
      const membership = await this.getClerkOrganizationRole(clerkUserId, organizationId);
      if (!membership) return false;

      const userPrismaRole = this.clerkToPrismaRoleMap[membership.role];
      
      // Role hierarchy check
      const roleHierarchy: user_role_enum[] = [
        'customer', 'staff', 'manager', 'admin', 'super_admin'
      ];

      const userRoleIndex = roleHierarchy.indexOf(userPrismaRole);
      const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

      return userRoleIndex >= requiredRoleIndex;
    } catch (error) {
      console.error('Error checking required role:', error);
      return false;
    }
  }
}

export default ClerkRoleSyncService;
