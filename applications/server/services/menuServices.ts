import { PrismaClient, menu_items, menus } from '@prisma/client';
import {
  CreateMenu,
  UpdateMenu,
  MenuQuery,
  CreateMenuItem,
  UpdateMenuItem,
  MenuItemQuery,
  BulkUpdateMenuItems,
  BulkToggleAvailability,
  FeaturedItemsQuery
} from '@/schemas/menuSchemas';
import { validate } from 'uuid';

const prisma = new PrismaClient();

// ================================
// 🍽️ MENU SERVICES
// ================================

// Tạo menu mới
export const createMenu = async (data: CreateMenu) => {
  try {
    // Kiểm tra nhà hàng có tồn tại không
    const restaurant = await prisma.restaurants.findUnique({
      where: { id: data.restaurant_id }
    });

    if (!restaurant) {
      throw new Error('Nhà hàng không tồn tại');
    }

    const menu = await prisma.menus.create({
      data: {
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        restaurants: {
          select: {
            id: true,
            name: true,
            code: true,
          }
        },
        menu_items: {
          where: { is_available: true },
          orderBy: { display_order: 'asc' },
        }
      }
    });
    return menu;
  } catch (error) {
    throw new Error(`Lỗi khi tạo menu: ${error}`);
  }
};

// Lấy menu theo ID
export const getMenuById = async (id: string) => {
  try {
    if (!validate(id)) {
      throw new Error('ID menu không hợp lệ');
    }

    const menu = await prisma.menus.findUnique({
      where: { id },
      include: {
        restaurants: {
          select: {
            id: true,
            name: true,
            code: true,
          }
        },
        menu_items: {
          where: { is_available: true },
          orderBy: { display_order: 'asc' },
          include: {
            categories: {
              select: {
                id: true,
                name: true,
                slug: true,
              }
            }
          }
        }
      }
    });

    if (!menu) {
      throw new Error('Không tìm thấy menu');
    }

    return menu;
  } catch (error) {
    throw new Error(`Lỗi khi lấy thông tin menu: ${error}`);
  }
};

// Lấy tất cả món ăn trong 1 page (không phân trang)
export const getAllMenus = async () => {
  try {
    const menus = await prisma.menus.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        display_order: true,
        image_url: true,
        restaurants: {
          select: {
            id: true,
            name: true,
            code: true,
          }
        },
        _count: {
          select: {
            menu_items: true,
          }
        }
      },
    });

    return {
      data: menus,
      total: menus.length,
      message: `Đã lấy ${menus.length} món ăn`
    };
  } catch (error) {
    throw new Error(`Lỗi khi lấy tất cả món ăn: ${error}`);
  }
};

// Lấy danh sách menu với filter
export const getMenus = async (filters: MenuQuery) => {
  try {
    const { page = 1, limit = 10, sort_by = 'display_order', sort_order = 'asc', ...whereFilters } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (whereFilters.restaurant_id) {
      where.restaurant_id = whereFilters.restaurant_id;
    }

    if (whereFilters.is_active !== undefined) {
      where.is_active = whereFilters.is_active;
    }

    if (whereFilters.name) {
      where.name = {
        contains: whereFilters.name,
        mode: 'insensitive'
      };
    }

    const [menus, total] = await Promise.all([
      prisma.menus.findMany({
        where,
        include: {
          restaurants: {
            select: {
              id: true,
              name: true,
              code: true,
            }
          },
          _count: {
            select: {
              menu_items: true,
            }
          }
        },
        orderBy: { [sort_by]: sort_order },
        skip,
        take: limit,
      }),
      prisma.menus.count({ where })
    ]);

    return {
      data: menus,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw new Error(`Lỗi khi lấy danh sách menu: ${error}`);
  }
};

// Lấy menu theo restaurant ID
export const getMenusByRestaurantId = async (restaurantId: string) => {
  try {
    if (!validate(restaurantId)) {
      throw new Error('ID nhà hàng không hợp lệ');
    }

    const menus = await prisma.menus.findMany({
      where: {
        restaurant_id: restaurantId,
        is_active: true
      },
      include: {
        menu_items: {
          where: { is_available: true },
          orderBy: { display_order: 'asc' },
          include: {
            categories: {
              select: {
                id: true,
                name: true,
                slug: true,
              }
            }
          }
        }
      },
      orderBy: { display_order: 'asc' },
    });

    return menus;
  } catch (error) {
    throw new Error(`Lỗi khi lấy menu của nhà hàng: ${error}`);
  }
};

// Cập nhật menu
export const updateMenu = async (id: string, data: UpdateMenu) => {
  try {
    if (!validate(id)) {
      throw new Error('ID menu không hợp lệ');
    }

    const existingMenu = await prisma.menus.findUnique({
      where: { id }
    });

    if (!existingMenu) {
      throw new Error('Không tìm thấy menu');
    }

    const updatedMenu = await prisma.menus.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
      include: {
        restaurants: {
          select: {
            id: true,
            name: true,
            code: true,
          }
        },
        menu_items: {
          where: { is_available: true },
          orderBy: { display_order: 'asc' },
        }
      }
    });

    return updatedMenu;
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật menu: ${error}`);
  }
};

// Xóa menu
export const deleteMenu = async (id: string) => {
  try {
    if (!validate(id)) {
      throw new Error('ID menu không hợp lệ');
    }

    const existingMenu = await prisma.menus.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            menu_items: true,
          }
        }
      }
    });

    if (!existingMenu) {
      throw new Error('Không tìm thấy menu');
    }

    if (existingMenu._count.menu_items > 0) {
      throw new Error('Không thể xóa menu có chứa món ăn. Vui lòng xóa tất cả món ăn trước.');
    }

    await prisma.menus.delete({
      where: { id }
    });

    return { message: 'Xóa menu thành công' };
  } catch (error) {
    throw new Error(`Lỗi khi xóa menu: ${error}`);
  }
};

// ================================
// 🍽️ MENU ITEM SERVICES
// ================================

// Tạo món ăn mới
export const createMenuItem = async (data: CreateMenuItem) => {
  try {
    // Kiểm tra menu có tồn tại không
    const menu = await prisma.menus.findUnique({
      where: { id: data.menu_id }
    });

    if (!menu) {
      throw new Error('Menu không tồn tại');
    }

    // Kiểm tra category nếu có
    if (data.category_id) {
      const category = await prisma.categories.findUnique({
        where: { id: data.category_id }
      });

      if (!category) {
        throw new Error('Danh mục không tồn tại');
      }
    }

    const menuItem = await prisma.menu_items.create({
      data: {
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        menus: {
          select: {
            id: true,
            name: true,
            restaurant_id: true,
            restaurants: {
              select: {
                id: true,
                name: true,
                code: true,
              }
            }
          }
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        }
      }
    });

    return menuItem;
  } catch (error) {
    throw new Error(`Lỗi khi tạo món ăn: ${error}`);
  }
};

// Lấy món ăn theo ID
export const getMenuItemById = async (id: string) => {
  try {
    if (!validate(id)) {
      throw new Error('ID món ăn không hợp lệ');
    }

    const menuItem = await prisma.menu_items.findUnique({
      where: { id },
      include: {
        menus: {
          select: {
            id: true,
            name: true,
            restaurant_id: true,
            restaurants: {
              select: {
                id: true,
                name: true,
                code: true,
              }
            }
          }
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        },
        recipes: {
          include: {
            ingredients: {
              include: {
                inventory_items: {
                  select: {
                    id: true,
                    name: true,
                    unit: true,
                  }
                }
              }
            }
          }
        },
        reviews: {
          where: { status: 'active' },
          select: {
            id: true,
            rating: true,
            title: true,
            content: true,
            created_at: true,
            customers: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                avatar_url: true,
              }
            }
          },
          orderBy: { created_at: 'desc' },
          take: 5,
        }
      }
    });

    if (!menuItem) {
      throw new Error('Không tìm thấy món ăn');
    }

    return menuItem;
  } catch (error) {
    throw new Error(`Lỗi khi lấy thông tin món ăn: ${error}`);
  }
};

// Lấy danh sách món ăn với filter
export const getMenuItems = async (filters: MenuItemQuery) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort_by = 'display_order',
      sort_order = 'asc',
      ...whereFilters
    } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (whereFilters.menu_id) {
      where.menu_id = whereFilters.menu_id;
    }

    if (whereFilters.category_id) {
      where.category_id = whereFilters.category_id;
    }

    if (whereFilters.is_available !== undefined) {
      where.is_available = whereFilters.is_available;
    }

    if (whereFilters.is_featured !== undefined) {
      where.is_featured = whereFilters.is_featured;
    }

    if (whereFilters.name) {
      where.name = {
        contains: whereFilters.name,
        mode: 'insensitive'
      };
    }

    if (whereFilters.min_price || whereFilters.max_price) {
      where.price = {};
      if (whereFilters.min_price) where.price.gte = whereFilters.min_price;
      if (whereFilters.max_price) where.price.lte = whereFilters.max_price;
    }

    if (whereFilters.allergens && whereFilters.allergens.length > 0) {
      where.allergens = {
        hasEvery: whereFilters.allergens
      };
    }

    if (whereFilters.dietary_info && whereFilters.dietary_info.length > 0) {
      where.dietary_info = {
        hasSome: whereFilters.dietary_info
      };
    }

    const [menuItems, total] = await Promise.all([
      prisma.menu_items.findMany({
        where,
        include: {
          menus: {
            select: {
              id: true,
              name: true,
              restaurant_id: true,
            }
          },
          categories: {
            select: {
              id: true,
              name: true,
              slug: true,
            }
          }
        },
        orderBy: { [sort_by]: sort_order },
        skip,
        take: limit,
      }),
      prisma.menu_items.count({ where })
    ]);

    return {
      data: menuItems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw new Error(`Lỗi khi lấy danh sách món ăn: ${error}`);
  }
};

// Lấy tất cả món ăn trong 1 page (không phân trang)
export const getAllMenuItems = async () => {
  try {
    const menuItems = await prisma.menu_items.findMany({
      include: {
        menus: {
          select: {
            id: true,
            name: true,
            restaurants: {
              select: {
                id: true,
                name: true,
                code: true,
              }
            }
          }
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        }
      }
    });

    return {
      data: menuItems,
      total: menuItems.length,
      message: `Đã lấy ${menuItems.length} món ăn`
    };
  } catch (error) {
    throw new Error(`Lỗi khi lấy tất cả món ăn: ${error}`);
  }
};

export const getAllMenuItemNames = async () => {
  try {
    const menuItems = await prisma.menu_items.findMany({
      select: {
        id: true,
        name: true,
      }
    });

    return {
      data: menuItems,
      total: menuItems.length,
      message: `Đã lấy ${menuItems.length} món ăn`
    };
  } catch (error) {
    throw new Error(`Lỗi khi lấy tất cả món ăn: ${error}`);
  }
};

// Lấy món ăn nổi bật
export const getFeaturedMenuItems = async (filters: FeaturedItemsQuery) => {
  try {
    const { restaurant_id, limit = 10 } = filters;

    const where: any = {
      is_featured: true,
      is_available: true,
    };

    if (restaurant_id) {
      where.menus = {
        restaurant_id: restaurant_id
      };
    }

    const featuredItems = await prisma.menu_items.findMany({
      where,
      include: {
        menus: {
          select: {
            id: true,
            name: true,
            restaurant_id: true,
            restaurants: {
              select: {
                id: true,
                name: true,
                code: true,
              }
            }
          }
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        }
      },
      orderBy: [
        { display_order: 'asc' },
        { created_at: 'desc' }
      ],
      take: limit,
    });

    return featuredItems;
  } catch (error) {
    throw new Error(`Lỗi khi lấy món ăn nổi bật: ${error}`);
  }
};

// Cập nhật món ăn
export const updateMenuItem = async (id: string, data: UpdateMenuItem) => {
  try {
    if (!validate(id)) {
      throw new Error('ID món ăn không hợp lệ');
    }

    const existingMenuItem = await prisma.menu_items.findUnique({
      where: { id }
    });

    if (!existingMenuItem) {
      throw new Error('Không tìm thấy món ăn');
    }

    // Kiểm tra category nếu có
    if (data.category_id) {
      const category = await prisma.categories.findUnique({
        where: { id: data.category_id }
      });

      if (!category) {
        throw new Error('Danh mục không tồn tại');
      }
    }

    const updatedMenuItem = await prisma.menu_items.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
      include: {
        menus: {
          select: {
            id: true,
            name: true,
            restaurant_id: true,
          }
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        }
      }
    });

    return updatedMenuItem;
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật món ăn: ${error}`);
  }
};

// Xóa món ăn
export const deleteMenuItem = async (id: string) => {
  try {
    if (!validate(id)) {
      throw new Error('ID món ăn không hợp lệ');
    }

    const existingMenuItem = await prisma.menu_items.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            order_items: true,
            recipes: true,
            reviews: true,
          }
        }
      }
    });

    if (!existingMenuItem) {
      throw new Error('Không tìm thấy món ăn');
    }

    if (existingMenuItem._count.order_items > 0) {
      throw new Error('Không thể xóa món ăn đã có trong đơn hàng');
    }

    await prisma.menu_items.delete({
      where: { id }
    });

    return { message: 'Xóa món ăn thành công' };
  } catch (error) {
    throw new Error(`Lỗi khi xóa món ăn: ${error}`);
  }
};

// ================================
// 🔧 BULK OPERATIONS
// ================================

// Cập nhật hàng loạt món ăn
export const bulkUpdateMenuItems = async (data: BulkUpdateMenuItems) => {
  try {
    const { menu_item_ids, updates } = data;

    // Kiểm tra tất cả IDs hợp lệ
    for (const id of menu_item_ids) {
      if (!validate(id)) {
        throw new Error(`ID món ăn không hợp lệ: ${id}`);
      }
    }

    const updatedItems = await prisma.menu_items.updateMany({
      where: {
        id: { in: menu_item_ids }
      },
      data: {
        ...updates,
        updated_at: new Date(),
      }
    });

    return {
      message: `Đã cập nhật ${updatedItems.count} món ăn`,
      count: updatedItems.count
    };
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật hàng loạt món ăn: ${error}`);
  }
};

// Bật/tắt trạng thái có sẵn hàng loạt
export const bulkToggleAvailability = async (data: BulkToggleAvailability) => {
  try {
    const { menu_item_ids, is_available } = data;

    // Kiểm tra tất cả IDs hợp lệ
    for (const id of menu_item_ids) {
      if (!validate(id)) {
        throw new Error(`ID món ăn không hợp lệ: ${id}`);
      }
    }

    const updatedItems = await prisma.menu_items.updateMany({
      where: {
        id: { in: menu_item_ids }
      },
      data: {
        is_available,
        updated_at: new Date(),
      }
    });

    return {
      message: `Đã ${is_available ? 'bật' : 'tắt'} trạng thái có sẵn cho ${updatedItems.count} món ăn`,
      count: updatedItems.count
    };
  } catch (error) {
    throw new Error(`Lỗi khi thay đổi trạng thái hàng loạt: ${error}`);
  }
};

// ================================
// 📊 STATISTICS FUNCTIONS
// ================================

// Thống kê menu
export const getMenuStats = async (restaurantId: string) => {
  try {
    if (!validate(restaurantId)) {
      throw new Error('ID nhà hàng không hợp lệ');
    }

    const [
      totalMenus,
      activeMenus,
      totalMenuItems,
      availableMenuItems,
      featuredMenuItems,
      avgPrice
    ] = await Promise.all([
      prisma.menus.count({
        where: { restaurant_id: restaurantId }
      }),
      prisma.menus.count({
        where: {
          restaurant_id: restaurantId,
          is_active: true
        }
      }),
      prisma.menu_items.count({
        where: {
          menus: { restaurant_id: restaurantId }
        }
      }),
      prisma.menu_items.count({
        where: {
          menus: { restaurant_id: restaurantId },
          is_available: true
        }
      }),
      prisma.menu_items.count({
        where: {
          menus: { restaurant_id: restaurantId },
          is_featured: true,
          is_available: true
        }
      }),
      prisma.menu_items.aggregate({
        where: {
          menus: { restaurant_id: restaurantId },
          is_available: true
        },
        _avg: {
          price: true
        }
      })
    ]);

    return {
      total_menus: totalMenus,
      active_menus: activeMenus,
      total_menu_items: totalMenuItems,
      available_menu_items: availableMenuItems,
      featured_menu_items: featuredMenuItems,
      average_price: avgPrice._avg.price || 0,
    };
  } catch (error) {
    throw new Error(`Lỗi khi lấy thống kê menu: ${error}`);
  }
};