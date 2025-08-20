import { Request, Response } from 'express';
import { z } from 'zod';
import { BaseController, ValidationError, NotFoundError } from './baseController';
import { restaurantService } from '@/services/restaurantService';

// Validation schemas
const CreateRestaurantSchema = z.object({
  organization_id: z.string().uuid('Organization ID không hợp lệ'),
  chain_id: z.string().uuid('Chain ID không hợp lệ').optional(),
  code: z.string().min(1, 'Mã nhà hàng không được để trống'),
  name: z.string().min(1, 'Tên nhà hàng không được để trống'),
  address: z.string().min(1, 'Địa chỉ không được để trống'),
  phone_number: z.string().optional(),
  email: z.string().email('Email không hợp lệ').optional(),
  description: z.string().optional(),
  logo_url: z.string().url('URL logo không hợp lệ').optional(),
  cover_url: z.string().url('URL cover không hợp lệ').optional(),
  opening_hours: z.any().optional(),
  manager_id: z.string().uuid('Manager ID không hợp lệ').optional()
});

const UpdateRestaurantSchema = z.object({
  name: z.string().min(1, 'Tên nhà hàng không được để trống').optional(),
  address: z.string().min(1, 'Địa chỉ không được để trống').optional(),
  phone_number: z.string().optional(),
  email: z.string().email('Email không hợp lệ').optional(),
  description: z.string().optional(),
  logo_url: z.string().url('URL logo không hợp lệ').optional(),
  cover_url: z.string().url('URL cover không hợp lệ').optional(),
  opening_hours: z.any().optional(),
  status: z.enum(['active', 'inactive', 'maintenance']).optional(),
  manager_id: z.string().uuid('Manager ID không hợp lệ').optional()
});

const OpeningHoursSchema = z.object({
  opening_hours: z.any()
});

const IdParamSchema = z.object({
  id: z.string().uuid('ID không hợp lệ')
});

export class restaurantController extends BaseController {
  private restaurantService: restaurantService;

  constructor() {
    super();
    this.restaurantService = new restaurantService();
  }

  /**
   * Tạo restaurant mới
   * POST /api/restaurants
   */
  createRestaurant = this.asyncHandler(async (req: Request, res: Response) => {
    const data = this.validateBody(req, CreateRestaurantSchema) as any;
    
    const restaurant = await this.restaurantService.create(data);
    
    this.sendSuccess(res, restaurant, 'Tạo nhà hàng thành công', 201);
  });

  /**
   * Lấy restaurant theo ID
   * GET /api/restaurants/:id
   */
  getRestaurantById = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = this.validateParams(req, IdParamSchema) as any;
    
    const restaurant = await this.restaurantService.findById(id);
    
    if (!restaurant) {
      throw new NotFoundError('Không tìm thấy nhà hàng');
    }
    
    this.sendSuccess(res, restaurant);
  });

  /**
   * Cập nhật restaurant
   * PUT /api/restaurants/:id
   */
  updateRestaurant = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = this.validateParams(req, IdParamSchema) as any;
    const data = this.validateBody(req, UpdateRestaurantSchema) as any;
    
    const restaurant = await this.restaurantService.update(id, data);
    
    this.sendSuccess(res, restaurant, 'Cập nhật nhà hàng thành công');
  });

  /**
   * Xóa restaurant (soft delete)
   * DELETE /api/restaurants/:id
   */
  deleteRestaurant = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = this.validateParams(req, IdParamSchema) as any;
    
    await this.restaurantService.delete(id);
    
    this.sendSuccess(res, null, 'Xóa nhà hàng thành công');
  });

  /**
   * Lấy danh sách restaurants với phân trang và filter
   * GET /api/restaurants
   */
  getRestaurants = this.asyncHandler(async (req: Request, res: Response) => {
    const pagination = this.parsePagination(req);
    const filters = this.parseFilters(req, [
      'organization_id',
      'chain_id',
      'status',
      'name_search',
      'address_search',
      'manager_id',
      'created_from',
      'created_to'
    ]);

    const result = await this.restaurantService.findMany(filters, pagination);
    
    this.sendPaginatedSuccess(
      res,
      result.data,
      result.pagination,
      'Lấy danh sách nhà hàng thành công'
    );
  });

  /**
   * Lấy restaurants theo organization
   * GET /api/organizations/:organizationId/restaurants
   */
  getRestaurantsByOrganization = this.asyncHandler(async (req: Request, res: Response) => {
    const { organizationId } = req.params;
    
    if (!organizationId || !this.validateUUID(organizationId)) {
      throw new ValidationError('Organization ID không hợp lệ');
    }

    const pagination = this.parsePagination(req);
    const result = await this.restaurantService.findByOrganization(organizationId, pagination);
    
    this.sendPaginatedSuccess(
      res,
      result.data,
      result.pagination,
      'Lấy danh sách nhà hàng theo organization thành công'
    );
  });

  /**
   * Lấy restaurants theo chain
   * GET /api/chains/:chainId/restaurants
   */
  getRestaurantsByChain = this.asyncHandler(async (req: Request, res: Response) => {
    const { chainId } = req.params;
    
    if (!chainId || !this.validateUUID(chainId)) {
      throw new ValidationError('Chain ID không hợp lệ');
    }

    const pagination = this.parsePagination(req);
    const result = await this.restaurantService.findByChain(chainId, pagination);
    
    this.sendPaginatedSuccess(
      res,
      result.data,
      result.pagination,
      'Lấy danh sách nhà hàng theo chain thành công'
    );
  });

  /**
   * Lấy restaurant theo code và organization
   * GET /api/organizations/:organizationId/restaurants/code/:code
   */
  getRestaurantByCode = this.asyncHandler(async (req: Request, res: Response) => {
    const { organizationId, code } = req.params;
    
    if (!organizationId || !this.validateUUID(organizationId)) {
      throw new ValidationError('Organization ID không hợp lệ');
    }

    if (!code) {
      throw new ValidationError('Mã nhà hàng không được để trống');
    }

    const restaurant = await this.restaurantService.findByCode(organizationId, code);
    
    if (!restaurant) {
      throw new NotFoundError('Không tìm thấy nhà hàng');
    }
    
    this.sendSuccess(res, restaurant);
  });

  /**
   * Cập nhật giờ mở cửa
   * PUT /api/restaurants/:id/opening-hours
   */
  updateOpeningHours = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = this.validateParams(req, IdParamSchema) as any;
    const { opening_hours } = this.validateBody(req, OpeningHoursSchema) as any;
    
    const restaurant = await this.restaurantService.updateOpeningHours(id, opening_hours);
    
    this.sendSuccess(res, restaurant, 'Cập nhật giờ mở cửa thành công');
  });

  /**
   * Kiểm tra restaurant có hoạt động không
   * GET /api/restaurants/:id/operational
   */
  checkOperational = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = this.validateParams(req, IdParamSchema) as any;
    
    const isOperational = await this.restaurantService.isOperational(id);
    
    this.sendSuccess(res, { 
      is_operational: isOperational,
      message: isOperational ? 'Nhà hàng đang hoạt động' : 'Nhà hàng không hoạt động'
    });
  });

  /**
   * Lấy thống kê restaurants
   * GET /api/restaurants/stats
   */
  getRestaurantStats = this.asyncHandler(async (req: Request, res: Response) => {
    const { restaurantId } = req.query;
    
    if (restaurantId && !this.validateUUID(restaurantId as string)) {
      throw new ValidationError('Restaurant ID không hợp lệ');
    }

    const stats = await this.restaurantService.getStats(restaurantId as string);
    
    this.sendSuccess(res, stats, 'Lấy thống kê nhà hàng thành công');
  });

  /**
   * Tìm kiếm restaurants
   * GET /api/restaurants/search
   */
  searchRestaurants = this.asyncHandler(async (req: Request, res: Response) => {
    const { q: query } = req.query;
    
    if (!query || typeof query !== 'string') {
      throw new ValidationError('Query không được để trống');
    }

    const pagination = this.parsePagination(req);
    const filters = {
      name_search: query
    };

    const result = await this.restaurantService.findMany(filters, pagination);
    
    this.sendPaginatedSuccess(
      res,
      result.data,
      result.pagination,
      'Tìm kiếm nhà hàng thành công'
    );
  });
}
