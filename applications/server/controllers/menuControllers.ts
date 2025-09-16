import { Request, Response } from 'express';
import {
  createMenu as createMenuService,
  getMenuById as getMenuByIdService,
  getAllMenus as getAllMenusService,
  getMenus as getMenusService,
  getMenusByRestaurantId as getMenusByRestaurantIdService,
  updateMenu as updateMenuService,
  deleteMenu as deleteMenuService,
  createMenuItem as createMenuItemService,
  getMenuItemById as getMenuItemByIdService,
  getMenuItems as getMenuItemsService,
  getAllMenuItems as getAllMenuItemsService,
  getFeaturedMenuItems as getFeaturedMenuItemsService,
  updateMenuItem as updateMenuItemService,
  deleteMenuItem as deleteMenuItemService,
  bulkUpdateMenuItems as bulkUpdateMenuItemsService,
  bulkToggleAvailability as bulkToggleAvailabilityService,
  getMenuStats as getMenuStatsService,
  //
  getAllMenuItemNames as getAllMenuItemNamesService,
} from '@/services/menuServices';
import {
  CreateMenuSchema,
  UpdateMenuSchema,
  MenuQuerySchema,
  CreateMenuItemSchema,
  UpdateMenuItemSchema,
  MenuItemQuerySchema,
  BulkUpdateMenuItemsSchema,
  BulkToggleAvailabilitySchema,
  FeaturedItemsQuerySchema
} from '@/schemas/menuSchemas';

// ================================
// 🍽️ MENU CONTROLLERS
// ================================

/**
 * Tạo menu mới
 */
export const createMenu = async (req: Request, res: Response) => {
  try {
    // Validate dữ liệu đầu vào
    const result = CreateMenuSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: result.error.issues
      });
    }

    const menu = await createMenuService(result.data);

    res.status(201).json({
      success: true,
      message: 'Tạo menu thành công',
      data: menu
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Lỗi khi tạo menu';
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

/**
 * Lấy menu theo ID
 */
export const getMenuById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID menu là bắt buộc'
      });
    }

    const menu = await getMenuByIdService(id);

    res.status(200).json({
      success: true,
      message: 'Lấy thông tin menu thành công',
      data: menu
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Lỗi khi lấy thông tin menu';

    if (errorMessage.includes('không tìm thấy') || errorMessage.includes('không hợp lệ')) {
      return res.status(404).json({
        success: false,
        message: errorMessage
      });
    }

    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};


export const getAllMenus = async (req: Request, res: Response) => {
  try {
    const menus = await getAllMenusService();

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách menu thành công',
      data: menus.data,
      total: menus.total
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Lỗi khi lấy danh sách menu';
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

/**
 * Lấy danh sách menu với filter và pagination
 */
export const getMenus = async (req: Request, res: Response) => {
  try {
    // Validate query parameters
    const result = MenuQuerySchema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Tham số truy vấn không hợp lệ',
        errors: result.error.issues
      });
    }

    const menus = await getMenusService(result.data);

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách menu thành công',
      data: menus.data,
      pagination: menus.pagination
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Lỗi khi lấy danh sách menu';
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

/**
 * Lấy menu theo restaurant ID
 */
export const getMenusByRestaurantId = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: 'ID nhà hàng là bắt buộc'
      });
    }

    const menus = await getMenusByRestaurantIdService(restaurantId);

    res.status(200).json({
      success: true,
      message: 'Lấy menu của nhà hàng thành công',
      data: menus
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Lỗi khi lấy menu của nhà hàng';

    if (errorMessage.includes('không hợp lệ')) {
      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }

    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

/**
 * Cập nhật menu
 */
export const updateMenu = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID menu là bắt buộc'
      });
    }

    // Validate dữ liệu đầu vào
    const result = UpdateMenuSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: result.error.issues
      });
    }

    const menu = await updateMenuService(id, result.data);

    res.status(200).json({
      success: true,
      message: 'Cập nhật menu thành công',
      data: menu
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Lỗi khi cập nhật menu';

    if (errorMessage.includes('không tìm thấy') || errorMessage.includes('không hợp lệ')) {
      return res.status(404).json({
        success: false,
        message: errorMessage
      });
    }

    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

/**
 * Xóa menu
 */
export const deleteMenu = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID menu là bắt buộc'
      });
    }

    await deleteMenuService(id);

    res.status(200).json({
      success: true,
      message: 'Xóa menu thành công'
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Lỗi khi xóa menu';

    if (errorMessage.includes('không tìm thấy') || errorMessage.includes('không hợp lệ')) {
      return res.status(404).json({
        success: false,
        message: errorMessage
      });
    }

    if (errorMessage.includes('không thể xóa')) {
      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }

    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

// ================================
// 🍽️ MENU ITEM CONTROLLERS
// ================================

/**
 * Tạo món ăn mới
 */
export const createMenuItem = async (req: Request, res: Response) => {
  try {
    // Validate dữ liệu đầu vào
    const result = CreateMenuItemSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: result.error.issues
      });
    }

    const menuItem = await createMenuItemService(result.data);

    res.status(201).json({
      success: true,
      message: 'Tạo món ăn thành công',
      data: menuItem
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Lỗi khi tạo món ăn';

    if (errorMessage.includes('không tồn tại')) {
      return res.status(404).json({
        success: false,
        message: errorMessage
      });
    }

    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

/**
 * Lấy món ăn theo ID
 */
export const getMenuItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID món ăn là bắt buộc'
      });
    }

    const menuItem = await getMenuItemByIdService(id);

    res.status(200).json({
      success: true,
      message: 'Lấy thông tin món ăn thành công',
      data: menuItem
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Lỗi khi lấy thông tin món ăn';

    if (errorMessage.includes('không tìm thấy') || errorMessage.includes('không hợp lệ')) {
      return res.status(404).json({
        success: false,
        message: errorMessage
      });
    }

    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

/**
 * Lấy danh sách món ăn với filter và pagination
 */
export const getMenuItems = async (req: Request, res: Response) => {
  try {
    // Validate query parameters
    const result = MenuItemQuerySchema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Tham số truy vấn không hợp lệ',
        errors: result.error.issues
      });
    }

    const menuItems = await getMenuItemsService(result.data);

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách món ăn thành công',
      data: menuItems.data,
      pagination: menuItems.pagination
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Lỗi khi lấy danh sách món ăn';
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

export const getAllMenuItems = async (req: Request, res: Response) => {
  try {
    const menuItems = await getAllMenuItemsService();

    res.status(200).json({
      success: true,
      message: 'Lấy tất cả món ăn thành công',
      data: menuItems.data,
      total: menuItems.total
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Lỗi khi lấy tất cả món ăn';
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

export function getAllMenuItemNames(req: Request, res: Response) {
  try {
    const names = getAllMenuItemNamesService();
    res.status(200).json({
      success: true,
      message: 'Lấy tên tất cả món ăn thành công',
      data: names
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Lỗi khi lấy tên tất cả món ăn';
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
}

/**
 * Lấy món ăn nổi bật
 */
export const getFeaturedMenuItems = async (req: Request, res: Response) => {
  try {
    // Validate query parameters
    const result = FeaturedItemsQuerySchema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Tham số truy vấn không hợp lệ',
        errors: result.error.issues
      });
    }

    const featuredItems = await getFeaturedMenuItemsService(result.data);

    res.status(200).json({
      success: true,
      message: 'Lấy món ăn nổi bật thành công',
      data: featuredItems
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Lỗi khi lấy món ăn nổi bật';
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

/**
 * Cập nhật món ăn
 */
export const updateMenuItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID món ăn là bắt buộc'
      });
    }

    // Validate dữ liệu đầu vào
    const result = UpdateMenuItemSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: result.error.issues
      });
    }

    const menuItem = await updateMenuItemService(id, result.data);

    res.status(200).json({
      success: true,
      message: 'Cập nhật món ăn thành công',
      data: menuItem
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Lỗi khi cập nhật món ăn';

    if (errorMessage.includes('không tìm thấy') || errorMessage.includes('không hợp lệ') || errorMessage.includes('không tồn tại')) {
      return res.status(404).json({
        success: false,
        message: errorMessage
      });
    }

    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

/**
 * Xóa món ăn
 */
export const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID món ăn là bắt buộc'
      });
    }

    await deleteMenuItemService(id);

    res.status(200).json({
      success: true,
      message: 'Xóa món ăn thành công'
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Lỗi khi xóa món ăn';

    if (errorMessage.includes('không tìm thấy') || errorMessage.includes('không hợp lệ')) {
      return res.status(404).json({
        success: false,
        message: errorMessage
      });
    }

    if (errorMessage.includes('không thể xóa')) {
      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }

    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

// ================================
// 🔧 BULK OPERATIONS CONTROLLERS
// ================================

/**
 * Cập nhật hàng loạt món ăn
 */
export const bulkUpdateMenuItems = async (req: Request, res: Response) => {
  try {
    // Validate dữ liệu đầu vào
    const result = BulkUpdateMenuItemsSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: result.error.issues
      });
    }

    const updateResult = await bulkUpdateMenuItemsService(result.data);

    res.status(200).json({
      success: true,
      message: updateResult.message,
      data: { count: updateResult.count }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Lỗi khi cập nhật hàng loạt món ăn';

    if (errorMessage.includes('không hợp lệ')) {
      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }

    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

/**
 * Bật/tắt trạng thái có sẵn hàng loạt
 */
export const bulkToggleAvailability = async (req: Request, res: Response) => {
  try {
    // Validate dữ liệu đầu vào
    const result = BulkToggleAvailabilitySchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: result.error.issues
      });
    }

    const toggleResult = await bulkToggleAvailabilityService(result.data);

    res.status(200).json({
      success: true,
      message: toggleResult.message,
      data: { count: toggleResult.count }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Lỗi khi thay đổi trạng thái hàng loạt';

    if (errorMessage.includes('không hợp lệ')) {
      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }

    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};



// ================================
// 📊 STATISTICS CONTROLLERS
// ================================

/**
 * Lấy thống kê menu
 */
export const getMenuStats = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: 'ID nhà hàng là bắt buộc'
      });
    }

    const stats = await getMenuStatsService(restaurantId);

    res.status(200).json({
      success: true,
      message: 'Lấy thống kê menu thành công',
      data: stats
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Lỗi khi lấy thống kê menu';

    if (errorMessage.includes('không hợp lệ')) {
      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }

    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};
