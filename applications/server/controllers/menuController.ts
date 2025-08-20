import { Request, Response } from 'express';
import { z } from 'zod';
import { BaseController, ValidationError, NotFoundError } from './baseController';
import { menuService } from '@/services/menuService';

// Validation schemas
const CreateMenuSchema = z.object({
  restaurant_id: z.string().uuid('Restaurant ID không hợp lệ'),
  name: z.string().min(1, 'Tên menu không được để trống'),
  description: z.string().optional(),
  image_url: z.string().url('URL hình ảnh không hợp lệ').optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().min(0).optional()
});

const UpdateMenuSchema = z.object({
  name: z.string().min(1, 'Tên menu không được để trống').optional(),
  description: z.string().optional(),
  image_url: z.string().url('URL hình ảnh không hợp lệ').optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().min(0).optional()
});

const CreateMenuItemSchema = z.object({
  menu_id: z.string().uuid('Menu ID không hợp lệ'),
  category_id: z.string().uuid('Category ID không hợp lệ').optional(),
  name: z.string().min(1, 'Tên món ăn không được để trống'),
  description: z.string().optional(),
  price: z.number().min(0, 'Giá phải lớn hơn hoặc bằng 0'),
  image_url: z.string().url('URL hình ảnh không hợp lệ').optional(),
  is_available: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  preparation_time: z.number().min(0).optional(),
  calories: z.number().min(0).optional(),
  allergens: z.array(z.string()).optional(),
  dietary_info: z.array(z.string()).optional(),
  display_order: z.number().min(0).optional()
});

const UpdateMenuItemSchema = z.object({
  category_id: z.string().uuid('Category ID không hợp lệ').optional(),
  name: z.string().min(1, 'Tên món ăn không được để trống').optional(),
  description: z.string().optional(),
  price: z.number().min(0, 'Giá phải lớn hơn hoặc bằng 0').optional(),
  image_url: z.string().url('URL hình ảnh không hợp lệ').optional(),
  is_available: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  preparation_time: z.number().min(0).optional(),
  calories: z.number().min(0).optional(),
  allergens: z.array(z.string()).optional(),
  dietary_info: z.array(z.string()).optional(),
  display_order: z.number().min(0).optional()
});

const UpdateItemsAvailabilitySchema = z.object({
  item_ids: z.array(z.string().uuid('Item ID không hợp lệ')).min(1, 'Phải có ít nhất 1 item'),
  is_available: z.boolean()
});

const IdParamSchema = z.object({
  id: z.string().uuid('ID không hợp lệ')
});

export class menuController extends BaseController {
  private menuService: menuService;

  constructor() {
    super();
    this.menuService = new menuService();
  }

  // ========================= MENU ROUTES =========================

  /**
   * Tạo menu mới
   * POST /api/menus
   */
  createMenu = this.asyncHandler(async (req: Request, res: Response) => {
    const data = this.validateBody(req, CreateMenuSchema) as any;
    
    const menu = await this.menuService.createMenu(data);
    
    this.sendSuccess(res, menu, 'Tạo menu thành công', 201);
  });

  /**
   * Lấy menu theo ID
   * GET /api/menus/:id
   */
  getMenuById = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = this.validateParams(req, IdParamSchema) as any;
    
    const menu = await this.menuService.findMenuById(id);
    
    if (!menu) {
      throw new NotFoundError('Không tìm thấy menu');
    }
    
    this.sendSuccess(res, menu);
  });

  /**
   * Cập nhật menu
   * PUT /api/menus/:id
   */
  updateMenu = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = this.validateParams(req, IdParamSchema) as any;
    const data = this.validateBody(req, UpdateMenuSchema) as any;
    
    const menu = await this.menuService.updateMenu(id, data);
    
    this.sendSuccess(res, menu, 'Cập nhật menu thành công');
  });

  /**
   * Xóa menu (soft delete)
   * DELETE /api/menus/:id
   */
  deleteMenu = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = this.validateParams(req, IdParamSchema) as any;
    
    await this.menuService.deleteMenu(id);
    
    this.sendSuccess(res, null, 'Xóa menu thành công');
  });

  /**
   * Lấy danh sách menus với phân trang và filter
   * GET /api/menus
   */
  getMenus = this.asyncHandler(async (req: Request, res: Response) => {
    const pagination = this.parsePagination(req);
    const filters = this.parseFilters(req, [
      'restaurant_id',
      'name_search',
      'is_active'
    ]);

    const result = await this.menuService.findMenus(filters, pagination);
    
    this.sendPaginatedSuccess(
      res,
      result.data,
      result.pagination,
      'Lấy danh sách menu thành công'
    );
  });

  /**
   * Lấy menus theo restaurant
   * GET /api/restaurants/:restaurantId/menus
   */
  getMenusByRestaurant = this.asyncHandler(async (req: Request, res: Response) => {
    const { restaurantId } = req.params;
    
    if (!restaurantId || !this.validateUUID(restaurantId)) {
      throw new ValidationError('Restaurant ID không hợp lệ');
    }

    const pagination = this.parsePagination(req);
    const result = await this.menuService.findMenusByRestaurant(restaurantId, pagination);
    
    this.sendPaginatedSuccess(
      res,
      result.data,
      result.pagination,
      'Lấy menu theo nhà hàng thành công'
    );
  });

  // ========================= MENU ITEM ROUTES =========================

  /**
   * Tạo menu item mới
   * POST /api/menu-items
   */
  createMenuItem = this.asyncHandler(async (req: Request, res: Response) => {
    const data = this.validateBody(req, CreateMenuItemSchema) as any;
    
    const menuItem = await this.menuService.createMenuItem(data);
    
    this.sendSuccess(res, menuItem, 'Tạo món ăn thành công', 201);
  });

  /**
   * Lấy menu item theo ID
   * GET /api/menu-items/:id
   */
  getMenuItemById = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = this.validateParams(req, IdParamSchema) as any;
    
    const menuItem = await this.menuService.findMenuItemById(id);
    
    if (!menuItem) {
      throw new NotFoundError('Không tìm thấy món ăn');
    }
    
    this.sendSuccess(res, menuItem);
  });

  /**
   * Cập nhật menu item
   * PUT /api/menu-items/:id
   */
  updateMenuItem = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = this.validateParams(req, IdParamSchema) as any;
    const data = this.validateBody(req, UpdateMenuItemSchema) as any;
    
    const menuItem = await this.menuService.updateMenuItem(id, data);
    
    this.sendSuccess(res, menuItem, 'Cập nhật món ăn thành công');
  });

  /**
   * Xóa menu item (soft delete)
   * DELETE /api/menu-items/:id
   */
  deleteMenuItem = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = this.validateParams(req, IdParamSchema) as any;
    
    await this.menuService.deleteMenuItem(id);
    
    this.sendSuccess(res, null, 'Xóa món ăn thành công');
  });

  /**
   * Lấy danh sách menu items với phân trang và filter
   * GET /api/menu-items
   */
  getMenuItems = this.asyncHandler(async (req: Request, res: Response) => {
    const pagination = this.parsePagination(req);
    const filters = this.parseFilters(req, [
      'menu_id',
      'category_id',
      'name_search',
      'is_available',
      'is_featured',
      'price_from',
      'price_to',
      'allergens',
      'dietary_info'
    ]);

    const result = await this.menuService.findMenuItems(filters, pagination);
    
    this.sendPaginatedSuccess(
      res,
      result.data,
      result.pagination,
      'Lấy danh sách món ăn thành công'
    );
  });

  /**
   * Lấy menu items theo menu
   * GET /api/menus/:menuId/items
   */
  getMenuItemsByMenu = this.asyncHandler(async (req: Request, res: Response) => {
    const { menuId } = req.params;
    
    if (!menuId || !this.validateUUID(menuId)) {
      throw new ValidationError('Menu ID không hợp lệ');
    }

    const pagination = this.parsePagination(req);
    const filters = this.parseFilters(req, [
      'category_id',
      'name_search',
      'is_available',
      'is_featured',
      'price_from',
      'price_to',
      'allergens',
      'dietary_info'
    ]);

    const result = await this.menuService.findMenuItemsByMenu(menuId, filters, pagination);
    
    this.sendPaginatedSuccess(
      res,
      result.data,
      result.pagination,
      'Lấy món ăn theo menu thành công'
    );
  });

  /**
   * Lấy menu items theo category
   * GET /api/categories/:categoryId/menu-items
   */
  getMenuItemsByCategory = this.asyncHandler(async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    
    if (!categoryId || !this.validateUUID(categoryId)) {
      throw new ValidationError('Category ID không hợp lệ');
    }

    const pagination = this.parsePagination(req);
    const filters = this.parseFilters(req, [
      'menu_id',
      'name_search',
      'is_available',
      'is_featured',
      'price_from',
      'price_to',
      'allergens',
      'dietary_info'
    ]);

    const result = await this.menuService.findMenuItemsByCategory(categoryId, filters, pagination);
    
    this.sendPaginatedSuccess(
      res,
      result.data,
      result.pagination,
      'Lấy món ăn theo danh mục thành công'
    );
  });

  /**
   * Lấy featured menu items
   * GET /api/menu-items/featured
   */
  getFeaturedMenuItems = this.asyncHandler(async (req: Request, res: Response) => {
    const { restaurantId } = req.query;
    
    if (restaurantId && !this.validateUUID(restaurantId as string)) {
      throw new ValidationError('Restaurant ID không hợp lệ');
    }

    const pagination = this.parsePagination(req);
    const result = await this.menuService.findFeaturedMenuItems(restaurantId as string, pagination);
    
    this.sendPaginatedSuccess(
      res,
      result.data,
      result.pagination,
      'Lấy món ăn nổi bật thành công'
    );
  });

  /**
   * Tìm kiếm menu items
   * GET /api/menu-items/search
   */
  searchMenuItems = this.asyncHandler(async (req: Request, res: Response) => {
    const { q: query, restaurantId } = req.query;
    
    if (!query || typeof query !== 'string') {
      throw new ValidationError('Query không được để trống');
    }

    if (restaurantId && !this.validateUUID(restaurantId as string)) {
      throw new ValidationError('Restaurant ID không hợp lệ');
    }

    const pagination = this.parsePagination(req);
    const result = await this.menuService.searchMenuItems(query, restaurantId as string, pagination);
    
    this.sendPaginatedSuccess(
      res,
      result.data,
      result.pagination,
      'Tìm kiếm món ăn thành công'
    );
  });

  /**
   * Cập nhật availability của nhiều items
   * PUT /api/menu-items/bulk/availability
   */
  updateItemsAvailability = this.asyncHandler(async (req: Request, res: Response) => {
    const { item_ids, is_available } = this.validateBody(req, UpdateItemsAvailabilitySchema) as any;
    
    const count = await this.menuService.updateItemsAvailability(item_ids, is_available);
    
    this.sendSuccess(res, { updated_count: count }, `Cập nhật ${count} món ăn thành công`);
  });

  /**
   * Lấy thống kê menu items
   * GET /api/menu-items/stats
   */
  getMenuItemStats = this.asyncHandler(async (req: Request, res: Response) => {
    const { menuId, restaurantId } = req.query;
    
    if (menuId && !this.validateUUID(menuId as string)) {
      throw new ValidationError('Menu ID không hợp lệ');
    }

    if (restaurantId && !this.validateUUID(restaurantId as string)) {
      throw new ValidationError('Restaurant ID không hợp lệ');
    }

    const stats = await this.menuService.getMenuItemStats(menuId as string, restaurantId as string);
    
    this.sendSuccess(res, stats, 'Lấy thống kê món ăn thành công');
  });
}
