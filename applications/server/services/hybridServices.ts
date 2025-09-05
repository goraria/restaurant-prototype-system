import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { restaurant_staff_role_enum, staff_status_enum } from '@prisma/client';
import { ClerkRoleSyncService } from './roleServices';

const prisma = new PrismaClient();

export class HybridAuthService {
  /**
   * Authentication for Clerk-managed users (owners, managers, admins)
   */
  static async authenticateClerkUser(clerkUserId: string, organizationId?: string) {
    try {
      // Auto-sync user role from Clerk organization
      if (organizationId) {
        await ClerkRoleSyncService.syncUserRoleFromClerk(clerkUserId, organizationId);
      }

      const user = await prisma.users.findUnique({
        where: { clerk_id: clerkUserId },
        include: {
          organizations_owned: true,
          restaurant_staffs: {
            include: {
              restaurants: {
                include: {
                  organizations: true
                }
              }
            }
          }
        }
      });

      if (!user) {
        return { success: false, error: 'User not found' };
      }

      return {
        success: true,
        user,
        access_type: 'clerk',
        organizations: user.organizations_owned,
        restaurants: user.restaurant_staffs.map(rs => rs.restaurants)
      };
    } catch (error) {
      console.error('Clerk authentication error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  /**
   * Authentication for database-only users (staff)
   */
  static async authenticateStaffUser(email: string, password: string) {
    try {
      const user = await prisma.users.findUnique({
        where: { email },
        include: {
          restaurant_staffs: {
            include: {
              restaurants: {
                include: {
                  organizations: true
                }
              }
            }
          }
        }
      });

      if (!user || user.clerk_id) {
        return { success: false, error: 'Invalid credentials or user managed by Clerk' };
      }

      // For staff users, we store hashed passwords
      if (!user.password_hash || !bcrypt.compareSync(password, user.password_hash)) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, type: 'staff' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '8h' }
      );

      return {
        success: true,
        user,
        token,
        access_type: 'database',
        restaurants: user.restaurant_staffs.map(rs => rs.restaurants)
      };
    } catch (error) {
      console.error('Staff authentication error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  /**
   * Generate JWT token for both auth types
   */
  static generateAuthToken(authResult: any) {
    const payload = {
      user_id: authResult.user.id,
      clerk_id: authResult.user.clerk_id,
      role: authResult.user.role,
      access_type: authResult.access_type,
      restaurants: authResult.restaurants.map((r: any) => r.id),
      organizations: authResult.organizations?.map((o: any) => o.id) || []
    };

    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '24h',
      issuer: 'restaurant-app'
    });
  }

  /**
   * Check if user has access to specific restaurant
   */
  static async hasRestaurantAccess(userId: string, restaurantId: string): Promise<boolean> {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        organizations_owned: {
          include: {
            restaurants: true
          }
        },
        restaurant_staffs: {
          where: {
            restaurant_id: restaurantId,
            status: 'active'
          }
        }
      }
    });

    if (!user) return false;

    // Check if user owns organization that contains this restaurant
    const ownsRestaurant = user.organizations_owned.some(org =>
      org.restaurants.some(r => r.id === restaurantId)
    );

    // Check if user is staff at this restaurant
    const isStaff = user.restaurant_staffs.length > 0;

    return ownsRestaurant || isStaff || ['admin', 'super_admin'].includes(user.role);
  }

  /**
   * Create staff user (database only)
   */
  static async createStaffUser(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    username: string;
  }, restaurantId: string, role: restaurant_staff_role_enum, hourlyRate?: number) {
    try {
      const passwordHash = bcrypt.hashSync(userData.password, 10);

      const user = await prisma.users.create({
        data: {
          email: userData.email,
          password_hash: passwordHash,
          first_name: userData.first_name,
          last_name: userData.last_name,
          full_name: `${userData.first_name} ${userData.last_name}`,
          username: userData.username,
          role: 'staff',
          clerk_id: null // Database only user
        }
      });

      // Assign to restaurant
      await prisma.restaurant_staffs.create({
        data: {
          user_id: user.id,
          restaurant_id: restaurantId,
          role: role,
          status: 'active',
          hourly_rate: hourlyRate
        }
      });

      return { success: true, user };
    } catch (error) {
      console.error('Create staff user error:', error);
      return { success: false, error: 'Failed to create staff user' };
    }
  }

  /**
   * Get restaurant staff
   */
  static async getRestaurantStaff(restaurantId: string) {
    try {
      const staff = await prisma.restaurant_staffs.findMany({
        where: { restaurant_id: restaurantId },
        include: {
          users: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
              full_name: true,
              username: true,
              role: true,
              status: true
            }
          },
          restaurants: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      return staff;
    } catch (error) {
      console.error('Get restaurant staff error:', error);
      throw error;
    }
  }

  /**
   * Get staff by ID
   */
  static async getStaffById(staffId: string) {
    try {
      const user = await prisma.users.findUnique({
        where: { id: staffId },
        include: {
          restaurant_staffs: {
            include: {
              restaurants: true
            }
          }
        }
      });

      return user;
    } catch (error) {
      console.error('Get staff by ID error:', error);
      return null;
    }
  }

  /**
   * Update staff
   */
  static async updateStaff(staffId: string, updates: {
    role?: string;
    status?: string;
    hourly_rate?: number;
  }) {
    try {
      const result = await prisma.restaurant_staffs.updateMany({
        where: { user_id: staffId },
        data: {
          role: updates.role as restaurant_staff_role_enum,
          status: updates.status as staff_status_enum,
          hourly_rate: updates.hourly_rate
        }
      });

      return { success: true, result };
    } catch (error) {
      console.error('Update staff error:', error);
      return { success: false, error: 'Failed to update staff' };
    }
  }

  /**
   * Verify staff token
   */
  static async verifyStaffToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      
      if (decoded.type !== 'staff') {
        return false;
      }

      const user = await prisma.users.findUnique({
        where: { id: decoded.userId }
      });

      return user && user.status === 'active';
    } catch (error) {
      console.error('Verify staff token error:', error);
      return false;
    }
  }

  /**
   * Update staff assignment
   */
  static async updateStaffAssignment(staffId: string, updates: {
    role?: string;
    status?: string;
    hourly_rate?: number;
  }) {
    return await prisma.restaurant_staffs.update({
      where: { id: staffId },
        data: {
          role: updates.role as restaurant_staff_role_enum,
          status: updates.status as staff_status_enum,
          hourly_rate: updates.hourly_rate
        }
    });
  }

  /**
   * Get user permissions summary
   */
  static async getUserPermissions(userId: string) {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        organizations_owned: {
          include: {
            restaurants: true
          }
        },
        restaurant_staffs: {
          include: {
            restaurants: true
          }
        }
      }
    });

    if (!user) throw new Error('User not found');

    const ownedRestaurants = user.organizations_owned.flatMap(org => org.restaurants);
    const staffRestaurants = user.restaurant_staffs.map(rs => rs.restaurants);
    const allRestaurants = [...ownedRestaurants, ...staffRestaurants];

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        clerk_id: user.clerk_id,
        auth_type: user.clerk_id ? 'clerk' : 'database'
      },
      permissions: {
        is_system_admin: ['admin', 'super_admin'].includes(user.role),
        owned_organizations: user.organizations_owned.length,
        accessible_restaurants: allRestaurants.length,
        staff_assignments: user.restaurant_staffs.length
      },
      restaurants: allRestaurants.map(r => ({
        id: r.id,
        name: r.name,
        access_type: ownedRestaurants.some(or => or.id === r.id) ? 'owner' : 'staff'
      }))
    };
  }
}

// Middleware for hybrid authentication
export const hybridAuthMiddleware = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Verify user still exists and is active
    const user = await prisma.users.findUnique({
      where: { id: decoded.user_id }
    });

    if (!user || user.status !== 'active') {
      return res.status(401).json({ error: 'Invalid or inactive user' });
    }

    req.user = {
      ...decoded,
      full_user: user
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export default HybridAuthService;
