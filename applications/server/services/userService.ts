import { users, Prisma } from '@prisma/client';
import { BaseService, PaginationOptions, PaginatedResult } from './baseService';
import bcrypt from 'bcryptjs';

export interface CreateUserInput {
  clerk_id?: string;
  email: string;
  username: string;
  phone_code?: string;
  phone_number?: string;
  first_name: string;
  last_name: string;
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
}

export class userService extends BaseService<users> {
  protected readonly modelName = 'users';

  /**
   * Tạo user mới
   */
  async create(data: CreateUserInput): Promise<users> {
    try {
      const user = await this.prisma.users.create({
        data: {
          ...data,
          full_name: `${data.first_name} ${data.last_name}`.trim(),
          created_at: new Date(),
          updated_at: new Date()
        }
      });

      return user;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Lấy user theo ID
   */
  async findById(id: string): Promise<users | null> {
    if (!this.validateUUID(id)) {
      throw new Error('ID không hợp lệ');
    }

    try {
      const user = await this.prisma.users.findUnique({
        where: { id },
        include: {
          addresses: true,
          restaurant_staffs: {
            include: {
              restaurants: true
            }
          }
        }
      });

      if (!user) return null;

      return user;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Lấy user theo email
   */
  async findByEmail(email: string): Promise<users | null> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { email },
        include: {
          addresses: true,
          restaurant_staffs: {
            include: {
              restaurants: true
            }
          }
        }
      });

      if (!user) return null;

      return user;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Lấy user theo clerk_id
   */
  async findByClerkId(clerkId: string): Promise<users | null> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { clerk_id: clerkId },
        include: {
          addresses: true,
          restaurant_staffs: {
            include: {
              restaurants: true
            }
          }
        }
      });

      if (!user) return null;

      return user;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Cập nhật user
   */
  async update(id: string, data: UpdateUserInput): Promise<users> {
    if (!this.validateUUID(id)) {
      throw new Error('ID không hợp lệ');
    }

    if (!(await this.exists(id))) {
      throw new Error('Không tìm thấy user');
    }

    try {
      let updateData: any = { ...data };

      // Cập nhật full_name nếu có thay đổi tên
      if (data.first_name || data.last_name) {
        const currentUser = await this.prisma.users.findUnique({
          where: { id },
          select: { first_name: true, last_name: true }
        });

        if (currentUser) {
          const firstName = data.first_name || currentUser.first_name;
          const lastName = data.last_name || currentUser.last_name;
          updateData.full_name = `${firstName} ${lastName}`.trim();
        }
      }

      updateData.updated_at = new Date();

      const user = await this.prisma.users.update({
        where: { id },
        data: updateData,
        include: {
          addresses: true,
          restaurant_staffs: {
            include: {
              restaurants: true
            }
          }
        }
      });

      return user;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Xóa user (soft delete)
   */
  async delete(id: string): Promise<void> {
    if (!this.validateUUID(id)) {
      throw new Error('ID không hợp lệ');
    }

    if (!(await this.exists(id))) {
      throw new Error('Không tìm thấy user');
    }

    try {
      await this.prisma.users.update({
        where: { id },
        data: {
          status: 'inactive',
          updated_at: new Date()
        }
      });
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Lấy danh sách users có phân trang và filter
   */
  async findMany(
    filters: UserFilters = {},
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<users>> {
    const { page, limit, skip, sortBy, sortOrder } = this.parsePaginationOptions(options);
    const where = this.buildWhereClause(filters);

    // Xử lý search name
    if (filters.name_search) {
      where.OR = [
        { first_name: { contains: filters.name_search, mode: 'insensitive' } },
        { last_name: { contains: filters.name_search, mode: 'insensitive' } },
        { full_name: { contains: filters.name_search, mode: 'insensitive' } }
      ];
      delete where.name_search;
    }

    try {
      const [users, total] = await Promise.all([
        this.prisma.users.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            addresses: true,
            restaurant_staffs: {
              include: {
                restaurants: {
                  select: { id: true, name: true }
                }
              }
            }
          }
        }),
        this.prisma.users.count({ where })
      ]);

      return this.createPaginatedResult(users, total, page, limit);
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Verify password (Deprecated - sử dụng Clerk authentication)
   */
  async verifyPassword(email: string, password: string): Promise<users | null> {
    throw new Error('Phương thức này không được hỗ trợ với Clerk authentication. Sử dụng Clerk để xác thực.');
  }

  /**
   * Lấy thống kê users
   */
  async getStats(): Promise<{
    total: number;
    byRole: Record<string, number>;
    byStatus: Record<string, number>;
    newThisMonth: number;
  }> {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const [total, byRole, byStatus, newThisMonth] = await Promise.all([
        this.prisma.users.count(),
        this.prisma.users.groupBy({
          by: ['role'],
          _count: { role: true }
        }),
        this.prisma.users.groupBy({
          by: ['status'],
          _count: { status: true }
        }),
        this.prisma.users.count({
          where: { created_at: { gte: startOfMonth } }
        })
      ]);

      return {
        total,
        byRole: Object.fromEntries(byRole.map(item => [item.role, item._count.role])),
        byStatus: Object.fromEntries(byStatus.map(item => [item.status, item._count.status])),
        newThisMonth
      };
    } catch (error) {
      throw this.formatError(error);
    }
  }
}
