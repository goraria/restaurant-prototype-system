import { PrismaClient, restaurants } from '@prisma/client';

const prisma = new PrismaClient();

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
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

/**
 * Validate UUID format
 */
const validateUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

/**
 * Create a new restaurant
 */
export const createRestaurant = async (data: CreateRestaurantInput): Promise<restaurants> => {
  try {
    // Check if organization exists
    const organizationExists = await prisma.organizations.findUnique({
      where: { id: data.organization_id }
    });

    if (!organizationExists) {
      throw new Error('Organization không tồn tại');
    }

    // Check chain if provided
    if (data.chain_id) {
      const chainExists = await prisma.restaurant_chains.findUnique({
        where: { id: data.chain_id }
      });

      if (!chainExists) {
        throw new Error('Restaurant chain không tồn tại');
      }
    }

    // Check manager if provided
    if (data.manager_id) {
      const managerExists = await prisma.users.findUnique({
        where: { id: data.manager_id }
      });

      if (!managerExists) {
        throw new Error('Manager không tồn tại');
      }
    }

    // Check if code already exists for this organization
    const existingRestaurant = await prisma.restaurants.findFirst({
      where: {
        organization_id: data.organization_id,
        code: data.code
      }
    });

    if (existingRestaurant) {
      throw new Error('Mã restaurant đã tồn tại trong organization này');
    }

    const restaurant = await prisma.restaurants.create({
      data: {
        ...data,
        status: 'active'
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
    if (error instanceof Error) {
      throw new Error(`Failed to create restaurant: ${error.message}`);
    }
    throw new Error('Failed to create restaurant');
  }
};

/**
 * Get restaurant by ID
 */
export const getRestaurantById = async (id: string): Promise<restaurants | null> => {
  try {
    if (!validateUUID(id)) {
      throw new Error('ID không hợp lệ');
    }

    const restaurant = await prisma.restaurants.findUnique({
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
    if (error instanceof Error) {
      throw new Error(`Failed to get restaurant: ${error.message}`);
    }
    throw new Error('Failed to get restaurant');
  }
};

/**
 * Get restaurant by code and organization
 */
export const getRestaurantByCode = async (organizationId: string, code: string): Promise<restaurants | null> => {
  try {
    const restaurant = await prisma.restaurants.findFirst({
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
    if (error instanceof Error) {
      throw new Error(`Failed to get restaurant by code: ${error.message}`);
    }
    throw new Error('Failed to get restaurant by code');
  }
};

/**
 * Get restaurants with filtering and pagination
 */
export const getRestaurants = async (filters: RestaurantFilters) => {
  try {
    const {
      organization_id,
      chain_id,
      status,
      name_search,
      address_search,
      manager_id,
      created_from,
      created_to,
      page = 1,
      limit = 10,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = filters;

    const where: any = {};

    if (organization_id) {
      where.organization_id = organization_id;
    }

    if (chain_id) {
      where.chain_id = chain_id;
    }

    if (status && status.length > 0) {
      where.status = {
        in: status
      };
    }

    if (name_search) {
      where.name = {
        contains: name_search,
        mode: 'insensitive'
      };
    }

    if (address_search) {
      where.address = {
        contains: address_search,
        mode: 'insensitive'
      };
    }

    if (manager_id) {
      where.manager_id = manager_id;
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

    const total = await prisma.restaurants.count({ where });

    const restaurants = await prisma.restaurants.findMany({
      where,
      orderBy: {
        [sort_by]: sort_order
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        organizations: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        chains: {
          select: {
            id: true,
            name: true
          }
        },
        manager: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true
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
    });

    const totalPages = Math.ceil(total / limit);

    return {
      restaurants,
      total,
      page,
      limit,
      totalPages
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get restaurants: ${error.message}`);
    }
    throw new Error('Failed to get restaurants');
  }
};

/**
 * Update restaurant
 */
export const updateRestaurant = async (id: string, data: UpdateRestaurantInput): Promise<restaurants> => {
  try {
    if (!validateUUID(id)) {
      throw new Error('ID không hợp lệ');
    }

    // Check if restaurant exists
    const existingRestaurant = await prisma.restaurants.findUnique({
      where: { id }
    });

    if (!existingRestaurant) {
      throw new Error('Restaurant không tồn tại');
    }

    // Check manager if provided
    if (data.manager_id) {
      const managerExists = await prisma.users.findUnique({
        where: { id: data.manager_id }
      });

      if (!managerExists) {
        throw new Error('Manager không tồn tại');
      }
    }

    const restaurant = await prisma.restaurants.update({
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
    if (error instanceof Error) {
      throw new Error(`Failed to update restaurant: ${error.message}`);
    }
    throw new Error('Failed to update restaurant');
  }
};

/**
 * Delete restaurant (soft delete by setting status to inactive)
 */
export const deleteRestaurant = async (id: string): Promise<void> => {
  try {
    if (!validateUUID(id)) {
      throw new Error('ID không hợp lệ');
    }

    const existingRestaurant = await prisma.restaurants.findUnique({
      where: { id }
    });

    if (!existingRestaurant) {
      throw new Error('Restaurant không tồn tại');
    }

    await prisma.restaurants.update({
      where: { id },
      data: {
        status: 'inactive',
        updated_at: new Date()
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete restaurant: ${error.message}`);
    }
    throw new Error('Failed to delete restaurant');
  }
};

/**
 * Get restaurant statistics
 */
export const getRestaurantStats = async (id: string) => {
  try {
    if (!validateUUID(id)) {
      throw new Error('ID không hợp lệ');
    }

    const restaurant = await prisma.restaurants.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            tables: true,
            menus: true,
            staffs: true,
            orders: true
          }
        }
      }
    });

    if (!restaurant) {
      throw new Error('Restaurant không tồn tại');
    }

    // Get order statistics
    const orderStats = await prisma.orders.aggregate({
      where: {
        restaurant_id: id
      },
      _sum: {
        total_amount: true
      },
      _count: true
    });

    // Get revenue by status
    const revenueByStatus = await prisma.orders.groupBy({
      by: ['status'],
      where: {
        restaurant_id: id
      },
      _sum: {
        total_amount: true
      },
      _count: true
    });

    return {
      restaurant,
      total_orders: orderStats._count,
      total_revenue: Number(orderStats._sum?.total_amount || 0),
      total_tables: restaurant._count.tables,
      total_menus: restaurant._count.menus,
      total_staff: restaurant._count.staffs,
      revenue_by_status: revenueByStatus.map(item => ({
        status: item.status,
        total_orders: item._count,
        total_revenue: Number(item._sum.total_amount || 0)
      }))
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get restaurant stats: ${error.message}`);
    }
    throw new Error('Failed to get restaurant stats');
  }
};

/**
 * Get restaurants by organization
 */
export const getRestaurantsByOrganization = async (organizationId: string) => {
  try {
    if (!validateUUID(organizationId)) {
      throw new Error('Organization ID không hợp lệ');
    }

    const restaurants = await prisma.restaurants.findMany({
      where: {
        organization_id: organizationId
      },
      include: {
        chains: {
          select: {
            id: true,
            name: true
          }
        },
        manager: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true
          }
        },
        _count: {
          select: {
            tables: true,
            orders: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return restaurants;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get restaurants by organization: ${error.message}`);
    }
    throw new Error('Failed to get restaurants by organization');
  }
};
