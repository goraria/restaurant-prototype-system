import { PrismaClient, users } from '@prisma/client';
// ================================
// 👤 USER SERVICE
// ================================
import { Decimal } from '@prisma/client/runtime/library';
import {
  DatabaseUser,
  ClerkUserData,
  CreateUserInput,
  UpdateUserInput,
  UserSearchParams,
  UserStatsResponse,
  user_status_enum,
  user_role_enum,
  user_activity_status_enum
} from '@/constants/types';

const prisma = new PrismaClient();

// ================================
// 🔍 USER QUERY OPERATIONS
// ================================

export class UserService {

  /**
   * Tìm user theo ID
   */
  static async findById(id: string): Promise<DatabaseUser | null> {
    try {
      const user = await prisma.users.findUnique({
        where: { id },
        include: {
          user_statistics: true,
          addresses: true,
          organizations_owned: true,
          organization_memberships: true,
        },
      });
      return user as DatabaseUser | null;
    } catch (error) {
      console.error('❌ Error finding user by ID:', error);
      return null;
    }
  }

  /**
   * Tìm user theo Clerk ID
   */
  static async findByClerkId(clerkId: string): Promise<DatabaseUser | null> {
    try {
      const user = await prisma.users.findUnique({
        where: { clerk_id: clerkId },
        include: {
          user_statistics: true,
          addresses: true,
          organizations_owned: true,
          organization_memberships: true,
        },
      });
      return user as DatabaseUser | null;
    } catch (error) {
      console.error('❌ Error finding user by Clerk ID:', error);
      return null;
    }
  }

  /**
   * Tìm user theo email
   */
  static async findByEmail(email: string): Promise<DatabaseUser | null> {
    try {
      const user = await prisma.users.findUnique({
        where: { email },
        include: {
          user_statistics: true,
          addresses: true,
        },
      });
      return user as DatabaseUser | null;
    } catch (error) {
      console.error('❌ Error finding user by email:', error);
      return null;
    }
  }

  /**
   * Tìm user theo username
   */
  static async findByUsername(username: string): Promise<DatabaseUser | null> {
    try {
      const user = await prisma.users.findUnique({
        where: { username },
        include: {
          user_statistics: true,
          addresses: true,
        },
      });
      return user as DatabaseUser | null;
    } catch (error) {
      console.error('❌ Error finding user by username:', error);
      return null;
    }
  }

  /**
   * Tìm kiếm users với filters và pagination
   */
  static async searchUsers(params: UserSearchParams) {
    try {
      const {
        email,
        username,
        clerk_id,
        role,
        status,
        page = 1,
        limit = 20,
        sort_by = 'created_at',
        sort_order = 'desc',
      } = params;

      const skip = (page - 1) * limit;

      const where: any = {};

      if (email) where.email = { contains: email, mode: 'insensitive' };
      if (username) where.username = { contains: username, mode: 'insensitive' };
      if (clerk_id) where.clerk_id = clerk_id;
      if (role) where.role = role;
      if (status) where.status = status;

      const [users, total] = await Promise.all([
        prisma.users.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sort_by]: sort_order },
          include: {
            user_statistics: true,
            addresses: true,
          },
        }),
        prisma.users.count({ where }),
      ]);

      return {
        users: users as DatabaseUser[],
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('❌ Error searching users:', error);
      throw error;
    }
  }

  /**
   * Tạo user mới
   */
  static async createUser(userData: CreateUserInput): Promise<DatabaseUser> {
    try {
      const user = await prisma.users.create({
        data: {
          email: userData.email,
          ...(userData.username && { username: userData.username }),
          ...(userData.first_name && { first_name: userData.first_name }),
          ...(userData.last_name && { last_name: userData.last_name }),
          ...(userData.phone_code && { phone_code: userData.phone_code }),
          ...(userData.phone_number && { phone_number: userData.phone_number }),
          ...(userData.avatar_url && { avatar_url: userData.avatar_url }),
          ...(userData.date_of_birth && { date_of_birth: userData.date_of_birth }),
          ...(userData.gender && { gender: userData.gender }),
          ...(userData.clerk_id && { clerk_id: userData.clerk_id }),
          role: userData.role || user_role_enum.customer,
          status: userData.status || user_status_enum.active,
          ...(userData.password_hash && { password_hash: userData.password_hash }),
          loyalty_points: 0,
          total_orders: 0,
          total_spent: new Decimal(0),
          activity_status: user_activity_status_enum.available,
        } as any,
      });
      return user as DatabaseUser;
    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw error;
    }
  }

  /**
   * Cập nhật user
   */
  static async updateUser(id: string, userData: UpdateUserInput): Promise<DatabaseUser | null> {
    try {
      // Filter out null values and prepare update data
      const updateData: any = {
        updated_at: new Date(),
      };

      // Only include fields that are defined and not null
      Object.keys(userData).forEach(key => {
        const value = (userData as any)[key];
        if (value !== null && value !== undefined) {
          updateData[key] = value;
        }
      });

      const user = await prisma.users.update({
        where: { id },
        data: updateData,
      });
      return user as DatabaseUser;
    } catch (error) {
      console.error('❌ Error updating user:', error);
      return null;
    }
  }

  /**
   * Xóa mềm user (set status = inactive)
   */
  static async softDeleteUser(id: string): Promise<boolean> {
    try {
      await prisma.users.update({
        where: { id },
        data: {
          status: user_status_enum.inactive,
          updated_at: new Date(),
        },
      });
      return true;
    } catch (error) {
      console.error('❌ Error soft deleting user:', error);
      return false;
    }
  }

  /**
   * Lấy thống kê users
   */
  static async getUserStats(): Promise<UserStatsResponse> {
    try {
      const [
        totalUsers,
        activeUsers,
        newUsersToday,
        usersByRole,
        usersByStatus,
      ] = await Promise.all([
        prisma.users.count(),
        prisma.users.count({ where: { status: 'active' } }),
        prisma.users.count({
          where: {
            created_at: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        }),
        prisma.users.groupBy({
          by: ['role'],
          _count: { role: true },
        }),
        prisma.users.groupBy({
          by: ['status'],
          _count: { status: true },
        }),
      ]);

      const roleStats = usersByRole.reduce((acc, item) => {
        acc[item.role] = item._count.role;
        return acc;
      }, {} as Record<string, number>);

      const statusStats = usersByStatus.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {} as Record<string, number>);

      return {
        total_users: totalUsers,
        active_users: activeUsers,
        new_users_today: newUsersToday,
        users_by_role: roleStats as any,
        users_by_status: statusStats as any,
      };
    } catch (error) {
      console.error('❌ Error getting user stats:', error);
      throw error;
    }
  }

  /**
   * Cập nhật last activity
   */
  static async updateLastActivity(userId: string): Promise<void> {
    try {
      await prisma.users.update({
        where: { id: userId },
        data: {
          last_activity_at: new Date(),
          is_online: true,
        },
      });
    } catch (error) {
      console.error('❌ Error updating last activity:', error);
    }
  }

  /**
   * Set user offline
   */
  static async setUserOffline(userId: string): Promise<void> {
    try {
      await prisma.users.update({
        where: { id: userId },
        data: {
          is_online: false,
          last_seen_at: new Date(),
        },
      });
    } catch (error) {
      console.error('❌ Error setting user offline:', error);
    }
  }

  /**
   * Lấy users online
   */
  static async getOnlineUsers(limit: number = 50): Promise<DatabaseUser[]> {
    try {
      const users = await prisma.users.findMany({
        where: {
          is_online: true,
          status: 'active',
        },
        take: limit,
        orderBy: { last_activity_at: 'desc' },
        include: {
          user_statistics: true,
        },
      });
      return users as DatabaseUser[];
    } catch (error) {
      console.error('❌ Error getting online users:', error);
      return [];
    }
  }

  /**
   * Bulk update user status
   */
  static async bulkUpdateStatus(userIds: string[], status: string): Promise<number> {
    try {
      const result = await prisma.users.updateMany({
        where: { id: { in: userIds } },
        data: {
          status: status as any,
          updated_at: new Date(),
        },
      });
      return result.count;
    } catch (error) {
      console.error('❌ Error bulk updating user status:', error);
      return 0;
    }
  }
}

export interface CreateUserInput {
  clerk_id?: string;
  email: string;
  username: string;
  phone_code?: string;
  phone_number?: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role?: 'customer' | 'staff' | 'manager' | 'admin' | 'super_admin';
  avatar_url?: string;
  date_of_birth?: Date;
  gender?: string;
  status?: 'active' | 'inactive' | 'suspended' | 'banned';
}

export interface UpdateUserInput {
  email?: string;
  username?: string;
  phone_code?: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar_url?: string;
  date_of_birth?: Date;
  gender?: string;
  status?: 'active' | 'inactive' | 'suspended' | 'banned';
}

export interface UserFilters {
  role?: string[];
  status?: string[];
  email_search?: string;
  name_search?: string;
  phone_search?: string;
  created_from?: Date;
  created_to?: Date;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

/**
 * Create a new user
 */
export const createUser = async (data: CreateUserInput): Promise<users> => {
  try {
    // Check if email already exists
    const existingUser = await prisma.users.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Check if username already exists
    const existingUsername = await prisma.users.findUnique({
      where: { username: data.username }
    });

    if (existingUsername) {
      throw new Error('Username already exists');
    }

    const user = await prisma.users.create({
      data: {
        ...data,
        full_name: `${data.first_name} ${data.last_name}`,
        role: data.role || 'customer',
        status: data.status || 'active'
      }
    });

    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
    throw new Error('Failed to create user');
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string): Promise<users | null> => {
  try {
    const user = await prisma.users.findUnique({
      where: { id },
      include: {
        addresses: true,
        orders: {
          take: 5,
          orderBy: {
            created_at: 'desc'
          }
        }
      }
    });

    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
    throw new Error('Failed to get user');
  }
};

/**
 * Get user by email
 */
export const getUserByEmail = async (email: string): Promise<users | null> => {
  try {
    const user = await prisma.users.findUnique({
      where: { email }
    });

    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get user by email: ${error.message}`);
    }
    throw new Error('Failed to get user by email');
  }
};

/**
 * Get user by clerk ID
 */
export const getUserByClerkId = async (clerk_id: string): Promise<users | null> => {
  try {
    const user = await prisma.users.findUnique({
      where: { clerk_id }
    });

    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get user by clerk ID: ${error.message}`);
    }
    throw new Error('Failed to get user by clerk ID');
  }
};

/**
 * Get users with filtering and pagination
 */
export const getUsers = async (filters: UserFilters) => {
  try {
    const {
      role,
      status,
      email_search,
      name_search,
      phone_search,
      created_from,
      created_to,
      page = 1,
      limit = 10,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = filters;

    const where: any = {};

    if (role && role.length > 0) {
      where.role = {
        in: role
      };
    }

    if (status && status.length > 0) {
      where.status = {
        in: status
      };
    }

    if (email_search) {
      where.email = {
        contains: email_search,
        mode: 'insensitive'
      };
    }

    if (name_search) {
      where.OR = [
        {
          first_name: {
            contains: name_search,
            mode: 'insensitive'
          }
        },
        {
          last_name: {
            contains: name_search,
            mode: 'insensitive'
          }
        }
      ];
    }

    if (phone_search) {
      where.phone_number = {
        contains: phone_search,
        mode: 'insensitive'
      };
    }

    if (created_from || created_to) {
      where.created_at = {};
      if (created_from) {
        where.created_at.gte = created_from;
      }
      if (created_to) {
        where.created_at.lte = created_to;
      }
    }

    const total = await prisma.users.count({ where });

    const users = await prisma.users.findMany({
      where,
      orderBy: {
        [sort_by]: sort_order
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: {
          select: {
            orders: true,
            addresses: true
          }
        }
      }
    });

    const totalPages = Math.ceil(total / limit);

    return {
      users,
      total,
      page,
      limit,
      totalPages
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get users: ${error.message}`);
    }
    throw new Error('Failed to get users');
  }
};

/**
 * Update user
 */
export const updateUser = async (id: string, data: UpdateUserInput): Promise<users> => {
  try {
    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { id }
    });

    if (!existingUser) {
      throw new Error('User not found');
    }

    // Check if new email already exists (if email is being updated)
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await prisma.users.findUnique({
        where: { email: data.email }
      });

      if (emailExists) {
        throw new Error('Email already exists');
      }
    }

    // Check if new username already exists (if username is being updated)
    if (data.username && data.username !== existingUser.username) {
      const usernameExists = await prisma.users.findUnique({
        where: { username: data.username }
      });

      if (usernameExists) {
        throw new Error('Username already exists');
      }
    }

    const user = await prisma.users.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date()
      }
    });

    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
    throw new Error('Failed to update user');
  }
};

/**
 * Delete user (soft delete by setting status to inactive)
 */
export const deleteUser = async (id: string): Promise<void> => {
  try {
    const existingUser = await prisma.users.findUnique({
      where: { id }
    });

    if (!existingUser) {
      throw new Error('User not found');
    }

    await prisma.users.update({
      where: { id },
      data: {
        status: 'inactive',
        updated_at: new Date()
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
    throw new Error('Failed to delete user');
  }
};

/**
 * Update user password
 */
export const updateUserPassword = async (id: string, newPassword: string): Promise<void> => {
  try {
    const existingUser = await prisma.users.findUnique({
      where: { id }
    });

    if (!existingUser) {
      throw new Error('User not found');
    }

    // Note: Users table doesn't have password field - using external auth (Clerk)
    // This function would need to be implemented with Clerk API
    throw new Error('Password updates should be handled through Clerk Auth system');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update password: ${error.message}`);
    }
    throw new Error('Failed to update password');
  }
};

/**
 * Get user statistics
 */
export const getUserStats = async (id: string) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orders: true,
            addresses: true
          }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const orderStats = await prisma.orders.aggregate({
      where: {
        customer_id: id
      },
      _sum: {
        total_amount: true
      },
      _count: true
    });

    return {
      user,
      total_orders: orderStats._count,
      total_spent: Number(orderStats._sum?.total_amount || 0),
      total_addresses: user._count.addresses
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get user stats: ${error.message}`);
    }
    throw new Error('Failed to get user stats');
  }
};
