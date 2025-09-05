import { PrismaClient } from "@prisma/client";
import { clerkConfigClient } from "@/config/clerk";
import { user_role_enum } from "@prisma/client";

const prisma = new PrismaClient();

// ================================
// 🏢 ORGANIZATION MANAGEMENT SERVICE
// ================================

export class OrganizationService {
  
  // ================================
  // 🆕 CREATE ORGANIZATION
  // ================================
  
  static async createOrganization(data: {
    name: string;
    description?: string;
    ownerId: string;
    code?: string;
    logoUrl?: string;
  }) {
    try {
      // Check if owner exists and is eligible
      const owner = await prisma.users.findUnique({
        where: { id: data.ownerId }
      });

      if (!owner) {
        throw new Error('Owner not found');
      }

      if (owner.role !== 'admin' && owner.role !== 'super_admin') {
        throw new Error('Only admin or super_admin can create organizations');
      }

      // Generate unique code if not provided
      const orgCode = data.code || this.generateOrganizationCode(data.name);

      // Create organization
      const organization = await prisma.organizations.create({
        data: {
          name: data.name,
          description: data.description,
          code: orgCode,
          logo_url: data.logoUrl,
          owner_id: data.ownerId,
        }
      });

      // Update owner role if needed
      if (owner.role === 'admin') {
        await prisma.users.update({
          where: { id: data.ownerId },
          data: { role: 'admin' as user_role_enum }
        });
      }

      // Create organization in Clerk if clerk_id exists
      if (owner.clerk_id) {
        await this.createClerkOrganization(organization, owner.clerk_id);
      }

      console.log(`✅ Organization created: ${organization.name}`);
      return organization;

    } catch (error) {
      console.error('❌ Error creating organization:', error);
      throw error;
    }
  }

  // ================================
  // 🏗️ CREATE RESTAURANT CHAIN
  // ================================
  
  static async createRestaurantChain(data: {
    organizationId: string;
    name: string;
    description?: string;
    logoUrl?: string;
  }) {
    try {
      // Validate organization exists
      const organization = await prisma.organizations.findUnique({
        where: { id: data.organizationId }
      });

      if (!organization) {
        throw new Error('Organization not found');
      }

      // Create restaurant chain
      const chain = await prisma.restaurant_chains.create({
        data: {
          organization_id: data.organizationId,
          name: data.name,
          description: data.description,
          logo_url: data.logoUrl,
        }
      });

      console.log(`✅ Restaurant chain created: ${chain.name}`);
      return chain;

    } catch (error) {
      console.error('❌ Error creating restaurant chain:', error);
      throw error;
    }
  }

  // ================================
  // 🏪 CREATE RESTAURANT
  // ================================
  
  static async createRestaurant(data: {
    organizationId: string;
    chainId?: string;
    name: string;
    description?: string;
    address: string;
    phone?: string;
    email?: string;
    managerId?: string;
    imageUrl?: string;
  }) {
    try {
      // Validate organization
      const organization = await prisma.organizations.findUnique({
        where: { id: data.organizationId }
      });

      if (!organization) {
        throw new Error('Organization not found');
      }

      // Validate chain if provided
      if (data.chainId) {
        const chain = await prisma.restaurant_chains.findFirst({
          where: {
            id: data.chainId,
            organization_id: data.organizationId
          }
        });

        if (!chain) {
          throw new Error('Restaurant chain not found or not in organization');
        }
      }

      // Validate manager if provided
      if (data.managerId) {
        const manager = await prisma.users.findUnique({
          where: { id: data.managerId }
        });

        if (!manager || (manager.role !== 'manager' && manager.role !== 'admin')) {
          throw new Error('Manager must have manager or admin role');
        }
      }

      // Create restaurant
      const restaurant = await prisma.restaurants.create({
        data: {
          organization_id: data.organizationId,
          chain_id: data.chainId,
          code: this.generateRestaurantCode(data.name),
          name: data.name,
          description: data.description,
          address: data.address,
          phone_number: data.phone,
          email: data.email,
          manager_id: data.managerId,
          logo_url: data.imageUrl,
          status: 'active',
        }
      });

      // Auto-assign manager as staff if provided
      if (data.managerId) {
        await this.assignStaffToRestaurant({
          userId: data.managerId,
          restaurantId: restaurant.id,
          role: 'manager',
        });
      }

      console.log(`✅ Restaurant created: ${restaurant.name}`);
      return restaurant;

    } catch (error) {
      console.error('❌ Error creating restaurant:', error);
      throw error;
    }
  }

  // ================================
  // 👥 STAFF MANAGEMENT
  // ================================
  
  static async assignStaffToRestaurant(data: {
    userId: string;
    restaurantId: string;
    role: 'staff' | 'manager';
    salary?: number;
    hourlyRate?: number;
  }) {
    try {
      // Validate user
      const user = await prisma.users.findUnique({
        where: { id: data.userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Validate restaurant
      const restaurant = await prisma.restaurants.findUnique({
        where: { id: data.restaurantId },
        include: { organization: true }
      });

      if (!restaurant) {
        throw new Error('Restaurant not found');
      }

      // Check if already assigned
      const existingStaff = await prisma.restaurant_staffs.findFirst({
        where: {
          user_id: data.userId,
          restaurant_id: data.restaurantId,
          status: 'active'
        }
      });

      if (existingStaff) {
        // Update existing assignment
        const updatedStaff = await prisma.restaurant_staffs.update({
          where: { id: existingStaff.id },
          data: {
            role: data.role,
            salary: data.salary,
            hourly_rate: data.hourlyRate,
            updated_at: new Date(),
          }
        });

        console.log(`✅ Staff assignment updated: ${user.email} -> ${restaurant.name} (${data.role})`);
        return updatedStaff;
      }

      // Create new staff assignment
      const staffAssignment = await prisma.restaurant_staffs.create({
        data: {
          user_id: data.userId,
          restaurant_id: data.restaurantId,
          role: data.role,
          salary: data.salary,
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

      // Update Clerk metadata if user has clerk_id
      if (user.clerk_id) {
        await this.updateClerkUserMetadata(user.clerk_id, {
          role: newUserRole,
          organization_id: restaurant.organization_id,
          restaurant_id: data.restaurantId,
        });
      }

      console.log(`✅ Staff assigned: ${user.email} -> ${restaurant.name} (${data.role})`);
      return staffAssignment;

    } catch (error) {
      console.error('❌ Error assigning staff:', error);
      throw error;
    }
  }

  static async removeStaffFromRestaurant(userId: string, restaurantId: string) {
    try {
      // Find active staff assignment
      const staffAssignment = await prisma.restaurant_staffs.findFirst({
        where: {
          user_id: userId,
          restaurant_id: restaurantId,
          status: 'active'
        },
        include: {
          user: true,
          restaurant: true
        }
      });

      if (!staffAssignment) {
        throw new Error('Staff assignment not found');
      }

      // Deactivate staff assignment
      await prisma.restaurant_staffs.update({
        where: { id: staffAssignment.id },
        data: {
          status: 'inactive',
          left_at: new Date(),
        }
      });

      // Check if user has other active staff assignments
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

        // Update Clerk metadata
        if (staffAssignment.user.clerk_id) {
          await this.updateClerkUserMetadata(staffAssignment.user.clerk_id, {
            role: 'customer',
            organization_id: null,
            restaurant_id: null,
          });
        }
      }

      console.log(`✅ Staff removed: ${staffAssignment.user.email} from ${staffAssignment.restaurant.name}`);
      return staffAssignment;

    } catch (error) {
      console.error('❌ Error removing staff:', error);
      throw error;
    }
  }

  // ================================
  // 🔍 QUERY METHODS
  // ================================
  
  static async getOrganizationWithDetails(organizationId: string) {
    return await prisma.organizations.findUnique({
      where: { id: organizationId },
      include: {
        owner: true,
        restaurant_chains: {
          include: {
            manager: true,
            restaurants: {
              include: {
                manager: true,
                restaurant_staffs: {
                  where: { status: 'active' },
                  include: { user: true }
                }
              }
            }
          }
        },
        restaurants: {
          where: { chain_id: null }, // Direct restaurants (not in chains)
          include: {
            manager: true,
            restaurant_staffs: {
              where: { status: 'active' },
              include: { user: true }
            }
          }
        }
      }
    });
  }

  static async getUserOrganizations(userId: string) {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        owned_organizations: {
          include: {
            restaurant_chains: true,
            restaurants: true
          }
        },
        managed_chains: {
          include: {
            organization: true,
            restaurants: true
          }
        },
        managed_restaurants: {
          include: {
            organization: true,
            chain: true
          }
        },
        restaurant_staff_assignments: {
          where: { status: 'active' },
          include: {
            restaurant: {
              include: {
                organization: true,
                chain: true
              }
            }
          }
        }
      }
    });

    return user;
  }

  // ================================
  // 🔧 HELPER METHODS
  // ================================
  
  private static generateOrganizationCode(name: string): string {
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const timestamp = Date.now().toString(36).toUpperCase();
    return `${cleanName.substring(0, 6)}_${timestamp}`;
  }

  private static async createClerkOrganization(organization: any, creatorClerkId: string) {
    try {
      const clerkOrg = await clerkConfigClient.organizations.createOrganization({
        name: organization.name,
        slug: organization.code,
        createdBy: creatorClerkId,
        publicMetadata: {
          database_id: organization.id,
          description: organization.description,
        }
      });

      console.log(`✅ Clerk organization created: ${clerkOrg.name}`);
      return clerkOrg;
    } catch (error) {
      console.error('❌ Error creating Clerk organization:', error);
      // Don't throw - organization was created in database
    }
  }

  private static async updateClerkUserMetadata(clerkId: string, metadata: any) {
    try {
      await clerkConfigClient.users.updateUser(clerkId, {
        publicMetadata: metadata
      });

      console.log(`✅ Clerk user metadata updated: ${clerkId}`);
    } catch (error) {
      console.error('❌ Error updating Clerk metadata:', error);
      // Don't throw - database was updated successfully
    }
  }
}

// ================================
// 🎯 ORGANIZATION VALIDATION SERVICE
// ================================

export class OrganizationValidationService {
  
  static async validateUserCanAccessOrganization(userId: string, organizationId: string): Promise<boolean> {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        owned_organizations: true,
        managed_chains: true,
        managed_restaurants: true,
        restaurant_staff_assignments: {
          where: { status: 'active' },
          include: { restaurant: true }
        }
      }
    });

    if (!user) return false;

    // Super admin can access all
    if (user.role === 'super_admin') return true;

    // Organization owner
    if (user.owned_organizations.some(org => org.id === organizationId)) return true;

    // Chain manager in organization
    if (user.managed_chains.some(chain => chain.organization_id === organizationId)) return true;

    // Restaurant manager in organization
    if (user.managed_restaurants.some(restaurant => restaurant.organization_id === organizationId)) return true;

    // Staff member in organization
    if (user.restaurant_staff_assignments.some(staff => staff.restaurant.organization_id === organizationId)) return true;

    return false;
  }

  static async validateUserCanAccessRestaurant(userId: string, restaurantId: string): Promise<boolean> {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        owned_organizations: true,
        managed_restaurants: true,
        restaurant_staff_assignments: {
          where: { status: 'active' }
        }
      }
    });

    if (!user) return false;

    // Super admin can access all
    if (user.role === 'super_admin') return true;

    // Restaurant manager
    if (user.managed_restaurants.some(restaurant => restaurant.id === restaurantId)) return true;

    // Staff member
    if (user.restaurant_staff_assignments.some(staff => staff.restaurant_id === restaurantId)) return true;

    // Organization owner
    const restaurant = await prisma.restaurants.findUnique({
      where: { id: restaurantId }
    });

    if (restaurant && user.owned_organizations.some(org => org.id === restaurant.organization_id)) return true;

    return false;
  }
}

export default {
  OrganizationService,
  OrganizationValidationService,
};
