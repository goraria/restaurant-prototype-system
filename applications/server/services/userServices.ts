import { PrismaClient, users } from '@prisma/client';

const prisma = new PrismaClient();

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
