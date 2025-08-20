import { restaurants, Prisma } from '@prisma/client';
import { BaseService, PaginationOptions, PaginatedResult } from './baseService';

export interface CreateRestaurantInput {
  organization_id: string;
  chain_id?: string;
  code: string;
  name: string;
  address: string;
  phone_number?: string;
  email?: string;
  description?: string;
  logo_url?: string;
  cover_url?: string;
  opening_hours?: any; // JSON
  manager_id?: string;
}

export interface UpdateRestaurantInput {
  name?: string;
  address?: string;
  phone_number?: string;
  email?: string;
  description?: string;
  logo_url?: string;
  cover_url?: string;
  opening_hours?: any; // JSON
  status?: 'active' | 'inactive' | 'maintenance';
  manager_id?: string;
}

export interface RestaurantFilters {
  organization_id?: string;
  chain_id?: string;
  status?: string[];
  name_search?: string;
  address_search?: string;
  manager_id?: string;
  created_from?: Date;
  created_to?: Date;
}

export class restaurantService extends BaseService<restaurants> {
  protected readonly modelName = 'restaurants';

  /**
   * Tạo restaurant mới
   */
  async create(data: CreateRestaurantInput): Promise<restaurants> {
    try {
      // Kiểm tra organization tồn tại
      const organizationExists = await this.prisma.organizations.findUnique({
        where: { id: data.organization_id }
      });

      if (!organizationExists) {
        throw new Error('Organization không tồn tại');
      }

      // Kiểm tra chain nếu có
      if (data.chain_id) {
        const chainExists = await this.prisma.restaurant_chains.findUnique({
          where: { id: data.chain_id }
        });

        if (!chainExists) {
          throw new Error('Restaurant chain không tồn tại');
        }
      }

      // Kiểm tra manager nếu có
      if (data.manager_id) {
        const managerExists = await this.prisma.users.findUnique({
          where: { id: data.manager_id }
        });

        if (!managerExists) {
          throw new Error('Manager không tồn tại');
        }
      }

      const restaurant = await this.prisma.restaurants.create({
        data: {
          ...data,
          created_at: new Date(),
          updated_at: new Date()
        },
        include: {
          organizations: true,
          chains: true,
          manager: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              phone_number: true
            }
          }
        }
      });

      return restaurant;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Lấy restaurant theo ID
   */
  async findById(id: string): Promise<restaurants | null> {
    if (!this.validateUUID(id)) {
      throw new Error('ID không hợp lệ');
    }

    try {
      const restaurant = await this.prisma.restaurants.findUnique({
        where: { id },
        include: {
          organizations: true,
          chains: true,
          manager: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              phone_number: true
            }
          },
          tables: {
            orderBy: { table_number: 'asc' }
          },
          menus: {
            where: { is_active: true },
            orderBy: { display_order: 'asc' }
          },
          staffs: {
            include: {
              users: {
                select: {
                  id: true,
                  first_name: true,
                  last_name: true,
                  email: true,
                  phone_number: true
                }
              }
            }
          }
        }
      });

      return restaurant;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Lấy restaurant theo code và organization
   */
  async findByCode(organizationId: string, code: string): Promise<restaurants | null> {
    try {
      const restaurant = await this.prisma.restaurants.findFirst({
        where: {
          organization_id: organizationId,
          code: code
        },
        include: {
          organizations: true,
          chains: true,
          manager: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              phone_number: true
            }
          }
        }
      });

      return restaurant;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Cập nhật restaurant
   */
  async update(id: string, data: UpdateRestaurantInput): Promise<restaurants> {
    if (!this.validateUUID(id)) {
      throw new Error('ID không hợp lệ');
    }

    if (!(await this.exists(id))) {
      throw new Error('Không tìm thấy restaurant');
    }

    try {
      // Kiểm tra manager nếu có cập nhật
      if (data.manager_id) {
        const managerExists = await this.prisma.users.findUnique({
          where: { id: data.manager_id }
        });

        if (!managerExists) {
          throw new Error('Manager không tồn tại');
        }
      }

      const restaurant = await this.prisma.restaurants.update({
        where: { id },
        data: {
          ...data,
          updated_at: new Date()
        },
        include: {
          organizations: true,
          chains: true,
          manager: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              phone_number: true
            }
          }
        }
      });

      return restaurant;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Xóa restaurant (soft delete)
   */
  async delete(id: string): Promise<void> {
    if (!this.validateUUID(id)) {
      throw new Error('ID không hợp lệ');
    }

    if (!(await this.exists(id))) {
      throw new Error('Không tìm thấy restaurant');
    }

    try {
      await this.prisma.restaurants.update({
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
   * Lấy danh sách restaurants có phân trang và filter
   */
  async findMany(
    filters: RestaurantFilters = {},
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<restaurants>> {
    const { page, limit, skip, sortBy, sortOrder } = this.parsePaginationOptions(options);
    const where = this.buildWhereClause(filters);

    try {
      const [restaurants, total] = await Promise.all([
        this.prisma.restaurants.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            organizations: {
              select: { id: true, name: true }
            },
            chains: {
              select: { id: true, name: true }
            },
            manager: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone_number: true
              }
            },
            _count: {
              select: {
                tables: true,
                menus: true,
                staffs: true,
                orders: true
              }
            }
          }
        }),
        this.prisma.restaurants.count({ where })
      ]);

      return this.createPaginatedResult(restaurants, total, page, limit);
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Lấy restaurants theo organization
   */
  async findByOrganization(
    organizationId: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<restaurants>> {
    return this.findMany({ organization_id: organizationId }, options);
  }

  /**
   * Lấy restaurants theo chain
   */
  async findByChain(
    chainId: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<restaurants>> {
    return this.findMany({ chain_id: chainId }, options);
  }

  /**
   * Cập nhật giờ mở cửa
   */
  async updateOpeningHours(id: string, openingHours: any): Promise<restaurants> {
    if (!this.validateUUID(id)) {
      throw new Error('ID không hợp lệ');
    }

    if (!(await this.exists(id))) {
      throw new Error('Không tìm thấy restaurant');
    }

    try {
      const restaurant = await this.prisma.restaurants.update({
        where: { id },
        data: {
          opening_hours: openingHours,
          updated_at: new Date()
        },
        include: {
          organizations: true,
          chains: true,
          manager: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              phone_number: true
            }
          }
        }
      });

      return restaurant;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Lấy thống kê restaurant
   */
  async getStats(restaurantId?: string): Promise<{
    total: number;
    byStatus: Record<string, number>;
    newThisMonth: number;
    averageTablesPerRestaurant: number;
    averageMenusPerRestaurant: number;
  }> {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const whereClause = restaurantId ? { id: restaurantId } : {};

      const [total, byStatus, newThisMonth, restaurantsWithCounts] = await Promise.all([
        this.prisma.restaurants.count({ where: whereClause }),
        this.prisma.restaurants.groupBy({
          by: ['status'],
          _count: { status: true },
          where: whereClause
        }),
        this.prisma.restaurants.count({
          where: { ...whereClause, created_at: { gte: startOfMonth } }
        }),
        this.prisma.restaurants.findMany({
          where: whereClause,
          include: {
            _count: {
              select: {
                tables: true,
                menus: true
              }
            }
          }
        })
      ]);

      // Tính trung bình
      const totalRestaurants = restaurantsWithCounts.length;
      const avgTables = totalRestaurants > 0 
        ? restaurantsWithCounts.reduce((sum, r) => sum + r._count.tables, 0) / totalRestaurants
        : 0;
      const avgMenus = totalRestaurants > 0
        ? restaurantsWithCounts.reduce((sum, r) => sum + r._count.menus, 0) / totalRestaurants
        : 0;

      return {
        total,
        byStatus: Object.fromEntries(byStatus.map(item => [item.status, item._count.status])),
        newThisMonth,
        averageTablesPerRestaurant: Math.round(avgTables * 100) / 100,
        averageMenusPerRestaurant: Math.round(avgMenus * 100) / 100
      };
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Kiểm tra restaurant có hoạt động không
   */
  async isOperational(id: string): Promise<boolean> {
    try {
      const restaurant = await this.prisma.restaurants.findUnique({
        where: { id },
        select: { status: true, opening_hours: true }
      });

      if (!restaurant || restaurant.status !== 'active') {
        return false;
      }

      // Kiểm tra giờ mở cửa nếu có
      if (restaurant.opening_hours) {
        const now = new Date();
        const dayOfWeek = now.toLocaleDateString('en', { weekday: 'short' }).toLowerCase();
        const currentTime = now.toTimeString().substring(0, 5);

        const todayHours = (restaurant.opening_hours as any)[dayOfWeek];
        if (todayHours && todayHours.open && todayHours.close) {
          return currentTime >= todayHours.open && currentTime <= todayHours.close;
        }
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}
