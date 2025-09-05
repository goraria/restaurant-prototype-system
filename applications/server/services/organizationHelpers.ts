import { PrismaClient } from "@prisma/client";
import { user_role_enum } from "@prisma/client";

const prisma = new PrismaClient();

// ================================
// 🔧 ORGANIZATION HELPER FUNCTIONS
// ================================

export class OrganizationHelper {
  
  // Generate unique restaurant code
  static generateRestaurantCode(name: string): string {
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const timestamp = Date.now().toString(36).toUpperCase();
    return `${cleanName.substring(0, 6)}_${timestamp}`;
  }

  // Generate organization code
  static generateOrganizationCode(name: string): string {
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const timestamp = Date.now().toString(36).toUpperCase();
    return `${cleanName.substring(0, 6)}_${timestamp}`;
  }

  // Map Clerk roles to system roles
  static mapClerkRoleToUserRole(clerkRole: string): user_role_enum {
    switch (clerkRole.toLowerCase()) {
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

  // Check if user can access organization
  static async canUserAccessOrganization(userId: string, organizationId: string): Promise<boolean> {
    try {
      const user = await prisma.users.findUnique({
        where: { id: userId }
      });

      if (!user) return false;

      // Super admin can access all
      if (user.role === 'super_admin') return true;

      // Check if user owns the organization
      const ownedOrg = await prisma.organizations.findFirst({
        where: {
          id: organizationId,
          owner_id: userId
        }
      });

      if (ownedOrg) return true;

      // Check if user manages a restaurant in this organization
      const managedRestaurant = await prisma.restaurants.findFirst({
        where: {
          organization_id: organizationId,
          manager_id: userId
        }
      });

      if (managedRestaurant) return true;

      // Check if user is staff in any restaurant of this organization
      const staffAssignment = await prisma.restaurant_staffs.findFirst({
        where: {
          user_id: userId,
          status: 'active',
          restaurants: {
            organization_id: organizationId
          }
        }
      });

      return !!staffAssignment;

    } catch (error) {
      console.error('❌ Error checking organization access:', error);
      return false;
    }
  }

  // Check if user can access restaurant
  static async canUserAccessRestaurant(userId: string, restaurantId: string): Promise<boolean> {
    try {
      const user = await prisma.users.findUnique({
        where: { id: userId }
      });

      if (!user) return false;

      // Super admin can access all
      if (user.role === 'super_admin') return true;

      // Check if user manages this restaurant
      const managedRestaurant = await prisma.restaurants.findFirst({
        where: {
          id: restaurantId,
          manager_id: userId
        }
      });

      if (managedRestaurant) return true;

      // Check if user owns the organization
      const restaurant = await prisma.restaurants.findUnique({
        where: { id: restaurantId },
        include: { organizations: true }
      });

      if (restaurant && restaurant.organizations.owner_id === userId) return true;

      // Check if user is staff in this restaurant
      const staffAssignment = await prisma.restaurant_staffs.findFirst({
        where: {
          user_id: userId,
          restaurant_id: restaurantId,
          status: 'active'
        }
      });

      return !!staffAssignment;

    } catch (error) {
      console.error('❌ Error checking restaurant access:', error);
      return false;
    }
  }

  // Create restaurant staff assignment
  static async assignStaffToRestaurant(data: {
    userId: string;
    restaurantId: string;
    role: 'staff' | 'manager';
    hourlyRate?: number;
  }) {
    try {
      // Validate user and restaurant
      const user = await prisma.users.findUnique({
        where: { id: data.userId }
      });

      const restaurant = await prisma.restaurants.findUnique({
        where: { id: data.restaurantId }
      });

      if (!user || !restaurant) {
        throw new Error('User or restaurant not found');
      }

      // Check for existing assignment
      const existingStaff = await prisma.restaurant_staffs.findFirst({
        where: {
          user_id: data.userId,
          restaurant_id: data.restaurantId,
          status: 'active'
        }
      });

      if (existingStaff) {
        // Update existing assignment
        return await prisma.restaurant_staffs.update({
          where: { id: existingStaff.id },
          data: {
            role: data.role,
            hourly_rate: data.hourlyRate,
          }
        });
      }

      // Create new assignment
      const staffAssignment = await prisma.restaurant_staffs.create({
        data: {
          user_id: data.userId,
          restaurant_id: data.restaurantId,
          role: data.role,
          hourly_rate: data.hourlyRate,
          status: 'active',
          joined_at: new Date(),
        }
      });

      // Update user role if needed
      const newUserRole = data.role === 'manager' ? 'manager' : 'staff';
      if (user.role === 'customer' || (user.role === 'staff' && data.role === 'manager')) {
        await prisma.users.update({
          where: { id: data.userId },
          data: { role: newUserRole as user_role_enum }
        });
      }

      console.log(`✅ Staff assigned: ${user.email} -> ${restaurant.name} (${data.role})`);
      return staffAssignment;

    } catch (error) {
      console.error('❌ Error assigning staff:', error);
      throw error;
    }
  }

  // Remove staff from restaurant
  static async removeStaffFromRestaurant(userId: string, restaurantId: string) {
    try {
      const staffAssignment = await prisma.restaurant_staffs.findFirst({
        where: {
          user_id: userId,
          restaurant_id: restaurantId,
          status: 'active'
        }
      });

      if (!staffAssignment) {
        throw new Error('Staff assignment not found');
      }

      // Deactivate assignment
      await prisma.restaurant_staffs.update({
        where: { id: staffAssignment.id },
        data: {
          status: 'inactive',
          left_at: new Date(),
        }
      });

      // Check if user has other active assignments
      const otherAssignments = await prisma.restaurant_staffs.findMany({
        where: {
          user_id: userId,
          status: 'active',
          id: { not: staffAssignment.id }
        }
      });

      // If no other assignments, revert to customer role
      if (otherAssignments.length === 0) {
        await prisma.users.update({
          where: { id: userId },
          data: { role: 'customer' as user_role_enum }
        });
      }

      console.log(`✅ Staff removed from restaurant`);
      return staffAssignment;

    } catch (error) {
      console.error('❌ Error removing staff:', error);
      throw error;
    }
  }

  // Get user's organization context
  static async getUserOrganizationContext(userId: string) {
    try {
      const user = await prisma.users.findUnique({
        where: { id: userId }
      });

      if (!user) return null;

      // Get owned organizations
      const ownedOrgs = await prisma.organizations.findMany({
        where: { owner_id: userId }
      });

      // Get managed restaurants
      const managedRestaurants = await prisma.restaurants.findMany({
        where: { manager_id: userId },
        include: { organizations: true }
      });

      // Get staff assignments
      const staffAssignments = await prisma.restaurant_staffs.findMany({
        where: {
          user_id: userId,
          status: 'active'
        },
        include: {
          restaurants: {
            include: { organizations: true }
          }
        }
      });

      return {
        user,
        ownedOrganizations: ownedOrgs,
        managedRestaurants,
        staffAssignments,
      };

    } catch (error) {
      console.error('❌ Error getting user organization context:', error);
      return null;
    }
  }
}

export default OrganizationHelper;
