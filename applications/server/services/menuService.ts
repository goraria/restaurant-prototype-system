import { menu_items, menus, categories, Prisma } from '@prisma/client';
import { BaseService, PaginationOptions, PaginatedResult } from './baseService';

export interface CreateMenuItemInput {
  menu_id: string;
  category_id?: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available?: boolean;
  is_featured?: boolean;
  preparation_time?: number;
  calories?: number;
  allergens?: string[];
  dietary_info?: string[];
  display_order?: number;
}

export interface UpdateMenuItemInput {
  category_id?: string;
  name?: string;
  description?: string;
  price?: number;
  image_url?: string;
  is_available?: boolean;
  is_featured?: boolean;
  preparation_time?: number;
  calories?: number;
  allergens?: string[];
  dietary_info?: string[];
  display_order?: number;
}

export interface MenuItemFilters {
  menu_id?: string;
  category_id?: string;
  name_search?: string;
  is_available?: boolean;
  is_featured?: boolean;
  price_from?: number;
  price_to?: number;
  allergens?: string[];
  dietary_info?: string[];
}

export interface CreateMenuInput {
  restaurant_id: string;
  name: string;
  description?: string;
  image_url?: string;
  is_active?: boolean;
  display_order?: number;
}

export interface UpdateMenuInput {
  name?: string;
  description?: string;
  image_url?: string;
  is_active?: boolean;
  display_order?: number;
}

export interface MenuFilters {
  restaurant_id?: string;
  name_search?: string;
  is_active?: boolean;
}

export class menuService extends BaseService<menus> {
  protected readonly modelName = 'menus';

  /**
   * Tạo menu mới
   */
  async createMenu(data: CreateMenuInput): Promise<menus> {
    try {
      // Kiểm tra restaurant tồn tại
      const restaurant = await this.prisma.restaurants.findUnique({
        where: { id: data.restaurant_id }
      });

      if (!restaurant) {
        throw new Error('Restaurant không tồn tại');
      }

      const menu = await this.prisma.menus.create({
        data: {
          ...data,
          created_at: new Date(),
          updated_at: new Date()
        },
        include: {
          restaurants: {
            select: { id: true, name: true }
          },
          _count: {
            select: { menu_items: true }
          }
        }
      });

      return menu;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Lấy menu theo ID
   */
  async findMenuById(id: string): Promise<menus | null> {
    if (!this.validateUUID(id)) {
      throw new Error('ID không hợp lệ');
    }

    try {
      const menu = await this.prisma.menus.findUnique({
        where: { id },
        include: {
          restaurants: {
            select: { id: true, name: true }
          },
          menu_items: {
            where: { is_available: true },
            include: {
              categories: {
                select: { id: true, name: true, slug: true }
              }
            },
            orderBy: [
              { display_order: 'asc' },
              { name: 'asc' }
            ]
          }
        }
      });

      return menu;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Cập nhật menu
   */
  async updateMenu(id: string, data: UpdateMenuInput): Promise<menus> {
    if (!this.validateUUID(id)) {
      throw new Error('ID không hợp lệ');
    }

    if (!(await this.exists(id))) {
      throw new Error('Không tìm thấy menu');
    }

    try {
      const menu = await this.prisma.menus.update({
        where: { id },
        data: {
          ...data,
          updated_at: new Date()
        },
        include: {
          restaurants: {
            select: { id: true, name: true }
          },
          _count: {
            select: { menu_items: true }
          }
        }
      });

      return menu;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Xóa menu (soft delete)
   */
  async deleteMenu(id: string): Promise<void> {
    if (!this.validateUUID(id)) {
      throw new Error('ID không hợp lệ');
    }

    if (!(await this.exists(id))) {
      throw new Error('Không tìm thấy menu');
    }

    try {
      await this.prisma.menus.update({
        where: { id },
        data: {
          is_active: false,
          updated_at: new Date()
        }
      });
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Lấy danh sách menus
   */
  async findMenus(
    filters: MenuFilters = {},
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<menus>> {
    const { page, limit, skip, sortBy, sortOrder } = this.parsePaginationOptions(options);
    const where = this.buildWhereClause(filters);

    try {
      const [menus, total] = await Promise.all([
        this.prisma.menus.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            restaurants: {
              select: { id: true, name: true }
            },
            _count: {
              select: { menu_items: true }
            }
          }
        }),
        this.prisma.menus.count({ where })
      ]);

      return this.createPaginatedResult(menus, total, page, limit);
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Lấy menus theo restaurant
   */
  async findMenusByRestaurant(
    restaurantId: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<menus>> {
    return this.findMenus({ restaurant_id: restaurantId, is_active: true }, options);
  }

  // ========================= MENU ITEMS =========================

  /**
   * Tạo menu item mới
   */
  async createMenuItem(data: CreateMenuItemInput): Promise<menu_items> {
    try {
      // Kiểm tra menu tồn tại
      const menu = await this.prisma.menus.findUnique({
        where: { id: data.menu_id }
      });

      if (!menu) {
        throw new Error('Menu không tồn tại');
      }

      // Kiểm tra category nếu có
      if (data.category_id) {
        const category = await this.prisma.categories.findUnique({
          where: { id: data.category_id }
        });

        if (!category) {
          throw new Error('Category không tồn tại');
        }
      }

      const menuItem = await this.prisma.menu_items.create({
        data: {
          ...data,
          created_at: new Date(),
          updated_at: new Date()
        },
        include: {
          menus: {
            select: { id: true, name: true, restaurant_id: true }
          },
          categories: {
            select: { id: true, name: true, slug: true }
          }
        }
      });

      return menuItem;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Lấy menu item theo ID
   */
  async findMenuItemById(id: string): Promise<menu_items | null> {
    if (!this.validateUUID(id)) {
      throw new Error('ID không hợp lệ');
    }

    try {
      const menuItem = await this.prisma.menu_items.findUnique({
        where: { id },
        include: {
          menus: {
            include: {
              restaurants: {
                select: { id: true, name: true }
              }
            }
          },
          categories: {
            select: { id: true, name: true, slug: true }
          },
          reviews: {
            include: {
              customers: {
                select: { id: true, first_name: true, last_name: true }
              }
            },
            orderBy: { created_at: 'desc' },
            take: 5
          }
        }
      });

      return menuItem;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Cập nhật menu item
   */
  async updateMenuItem(id: string, data: UpdateMenuItemInput): Promise<menu_items> {
    if (!this.validateUUID(id)) {
      throw new Error('ID không hợp lệ');
    }

    const exists = await this.prisma.menu_items.findUnique({
      where: { id }
    });

    if (!exists) {
      throw new Error('Không tìm thấy menu item');
    }

    try {
      // Kiểm tra category nếu có cập nhật
      if (data.category_id) {
        const category = await this.prisma.categories.findUnique({
          where: { id: data.category_id }
        });

        if (!category) {
          throw new Error('Category không tồn tại');
        }
      }

      const menuItem = await this.prisma.menu_items.update({
        where: { id },
        data: {
          ...data,
          updated_at: new Date()
        },
        include: {
          menus: {
            select: { id: true, name: true, restaurant_id: true }
          },
          categories: {
            select: { id: true, name: true, slug: true }
          }
        }
      });

      return menuItem;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Xóa menu item (soft delete)
   */
  async deleteMenuItem(id: string): Promise<void> {
    if (!this.validateUUID(id)) {
      throw new Error('ID không hợp lệ');
    }

    const exists = await this.prisma.menu_items.findUnique({
      where: { id }
    });

    if (!exists) {
      throw new Error('Không tìm thấy menu item');
    }

    try {
      await this.prisma.menu_items.update({
        where: { id },
        data: {
          is_available: false,
          updated_at: new Date()
        }
      });
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Lấy danh sách menu items có phân trang và filter
   */
  async findMenuItems(
    filters: MenuItemFilters = {},
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<menu_items>> {
    const { page, limit, skip, sortBy, sortOrder } = this.parsePaginationOptions(options);
    const where = this.buildWhereClause(filters);

    // Handle price range filters
    if (filters.price_from || filters.price_to) {
      where.price = {};
      if (filters.price_from) {
        where.price.gte = filters.price_from;
      }
      if (filters.price_to) {
        where.price.lte = filters.price_to;
      }
      delete where.price_from;
      delete where.price_to;
    }

    // Handle allergens filter
    if (filters.allergens && filters.allergens.length > 0) {
      where.allergens = {
        hasSome: filters.allergens
      };
    }

    // Handle dietary_info filter
    if (filters.dietary_info && filters.dietary_info.length > 0) {
      where.dietary_info = {
        hasSome: filters.dietary_info
      };
    }

    try {
      const [menuItems, total] = await Promise.all([
        this.prisma.menu_items.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            menus: {
              select: { id: true, name: true, restaurant_id: true }
            },
            categories: {
              select: { id: true, name: true, slug: true }
            }
          }
        }),
        this.prisma.menu_items.count({ where })
      ]);

      return this.createPaginatedResult(menuItems, total, page, limit);
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Lấy menu items theo menu
   */
  async findMenuItemsByMenu(
    menuId: string,
    filters: Omit<MenuItemFilters, 'menu_id'> = {},
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<menu_items>> {
    return this.findMenuItems({ ...filters, menu_id: menuId }, options);
  }

  /**
   * Lấy menu items theo category
   */
  async findMenuItemsByCategory(
    categoryId: string,
    filters: Omit<MenuItemFilters, 'category_id'> = {},
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<menu_items>> {
    return this.findMenuItems({ ...filters, category_id: categoryId }, options);
  }

  /**
   * Lấy featured menu items
   */
  async findFeaturedMenuItems(
    restaurantId?: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<menu_items>> {
    const filters: MenuItemFilters = { 
      is_featured: true,
      is_available: true
    };

    // If restaurant specified, find all menus of that restaurant
    if (restaurantId) {
      const menus = await this.prisma.menus.findMany({
        where: { restaurant_id: restaurantId, is_active: true },
        select: { id: true }
      });

      if (menus.length === 0) {
        return this.createPaginatedResult([], 0, 1, options.limit || 10);
      }

      return this.findMenuItems({
        ...filters,
        menu_id: { in: menus.map(m => m.id) } as any
      }, options);
    }

    return this.findMenuItems(filters, options);
  }

  /**
   * Tìm kiếm menu items
   */
  async searchMenuItems(
    query: string,
    restaurantId?: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<menu_items>> {
    const filters: MenuItemFilters = {
      name_search: query,
      is_available: true
    };

    if (restaurantId) {
      const menus = await this.prisma.menus.findMany({
        where: { restaurant_id: restaurantId, is_active: true },
        select: { id: true }
      });

      if (menus.length === 0) {
        return this.createPaginatedResult([], 0, 1, options.limit || 10);
      }

      return this.findMenuItems({
        ...filters,
        menu_id: { in: menus.map(m => m.id) } as any
      }, options);
    }

    return this.findMenuItems(filters, options);
  }

  /**
   * Cập nhật availability của nhiều items
   */
  async updateItemsAvailability(
    itemIds: string[],
    isAvailable: boolean
  ): Promise<number> {
    if (!itemIds.every(id => this.validateUUID(id))) {
      throw new Error('Có ID không hợp lệ');
    }

    try {
      const result = await this.prisma.menu_items.updateMany({
        where: { id: { in: itemIds } },
        data: {
          is_available: isAvailable,
          updated_at: new Date()
        }
      });

      return result.count;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Lấy thống kê menu items
   */
  async getMenuItemStats(menuId?: string, restaurantId?: string): Promise<{
    total: number;
    available: number;
    unavailable: number;
    featured: number;
    byCategory: Record<string, number>;
    averagePrice: number;
    priceRange: { min: number; max: number };
  }> {
    try {
      let whereClause: any = {};

      if (menuId) {
        whereClause.menu_id = menuId;
      } else if (restaurantId) {
        const menus = await this.prisma.menus.findMany({
          where: { restaurant_id: restaurantId, is_active: true },
          select: { id: true }
        });
        whereClause.menu_id = { in: menus.map(m => m.id) };
      }

      const [total, available, featured, byCategory, priceStats] = await Promise.all([
        this.prisma.menu_items.count({ where: whereClause }),
        this.prisma.menu_items.count({ where: { ...whereClause, is_available: true } }),
        this.prisma.menu_items.count({ where: { ...whereClause, is_featured: true } }),
        this.prisma.menu_items.groupBy({
          by: ['category_id'],
          _count: { category_id: true },
          where: whereClause
        }),
        this.prisma.menu_items.aggregate({
          _avg: { price: true },
          _min: { price: true },
          _max: { price: true },
          where: whereClause
        })
      ]);

      // Get category names
      const categoryIds = byCategory.map(item => item.category_id).filter(Boolean);
      const categories = await this.prisma.categories.findMany({
        where: { id: { in: categoryIds as string[] } },
        select: { id: true, name: true }
      });

      const categoriesMap = Object.fromEntries(
        categories.map(cat => [cat.id, cat.name])
      );

      const byCategoryWithNames = Object.fromEntries(
        byCategory.map(item => [
          item.category_id ? categoriesMap[item.category_id] || 'Không có danh mục' : 'Không có danh mục',
          item._count.category_id
        ])
      );

      return {
        total,
        available,
        unavailable: total - available,
        featured,
        byCategory: byCategoryWithNames,
        averagePrice: Number(priceStats._avg.price || 0),
        priceRange: {
          min: Number(priceStats._min.price || 0),
          max: Number(priceStats._max.price || 0)
        }
      };
    } catch (error) {
      throw this.formatError(error);
    }
  }
}
