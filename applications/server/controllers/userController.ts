import { Request, Response } from 'express';
import { z } from 'zod';
import { BaseController, ValidationError, NotFoundError } from './baseController';
import { userService } from '@/services/userService';

// Validation schemas
const CreateUserSchema = z.object({
  clerk_id: z.string().optional(),
  email: z.string().email('Email không hợp lệ'),
  phone_number: z.string().optional(),
  first_name: z.string().min(1, 'Tên không được để trống'),
  last_name: z.string().min(1, 'Họ không được để trống'),
  role: z.enum(['admin', 'restaurant_manager', 'staff', 'customer']).optional(),
  avatar_url: z.string().url('URL avatar không hợp lệ').optional(),
  date_of_birth: z.string().optional().transform(val => val ? new Date(val) : undefined),
  gender: z.enum(['male', 'female', 'other']).optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional()
});

const UpdateUserSchema = z.object({
  email: z.string().email('Email không hợp lệ').optional(),
  phone_number: z.string().optional(),
  first_name: z.string().min(1, 'Tên không được để trống').optional(),
  last_name: z.string().min(1, 'Họ không được để trống').optional(),
  avatar_url: z.string().url('URL avatar không hợp lệ').optional(),
  date_of_birth: z.string().optional().transform(val => val ? new Date(val) : undefined),
  gender: z.enum(['male', 'female', 'other']).optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional()
});

const IdParamSchema = z.object({
  id: z.string().uuid('ID không hợp lệ')
});

export class userController extends BaseController {
  private userService: userService;

  constructor() {
    super();
    this.userService = new userService();
  }

  /**
   * Tạo user mới
   * POST /api/users
   */
  createUser = this.asyncHandler(async (req: Request, res: Response) => {
    const data = this.validateBody(req, CreateUserSchema) as any;
    
    const user = await this.userService.create(data);
    
    this.sendSuccess(res, user, 'Tạo user thành công', 201);
  });

  /**
   * Lấy user theo ID
   * GET /api/users/:id
   */
  getUserById = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = this.validateParams(req, IdParamSchema) as any;
    
    const user = await this.userService.findById(id);
    
    if (!user) {
      throw new NotFoundError('Không tìm thấy user');
    }
    
    this.sendSuccess(res, user);
  });

  /**
   * Lấy thông tin user hiện tại
   * GET /api/users/me
   */
  getMe = this.asyncHandler(async (req: Request, res: Response) => {
    const userId = this.getCurrentUserId(req);
    
    const user = await this.userService.findById(userId);
    
    if (!user) {
      throw new NotFoundError('Không tìm thấy user');
    }
    
    this.sendSuccess(res, user);
  });

  /**
   * Cập nhật user
   * PUT /api/users/:id
   */
  updateUser = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = this.validateParams(req, IdParamSchema) as any;
    const data = this.validateBody(req, UpdateUserSchema) as any;
    
    const user = await this.userService.update(id, data);
    
    this.sendSuccess(res, user, 'Cập nhật user thành công');
  });

  /**
   * Cập nhật profile user hiện tại
   * PUT /api/users/me
   */
  updateCurrentUser = this.asyncHandler(async (req: Request, res: Response) => {
    const userId = this.getCurrentUserId(req);
    const data = this.validateBody(req, UpdateUserSchema) as any;
    
    const user = await this.userService.update(userId, data);
    
    this.sendSuccess(res, user, 'Cập nhật profile thành công');
  });

  /**
   * Xóa user (soft delete)
   * DELETE /api/users/:id
   */
  deleteUser = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = this.validateParams(req, IdParamSchema) as any;
    
    await this.userService.delete(id);
    
    this.sendSuccess(res, null, 'Xóa user thành công');
  });

  /**
   * Lấy danh sách users với phân trang và filter
   * GET /api/users
   */
  getUsers = this.asyncHandler(async (req: Request, res: Response) => {
    const pagination = this.parsePagination(req);
    const filters = this.parseFilters(req, [
      'role',
      'status', 
      'email_search',
      'name_search',
      'phone_search',
      'created_from',
      'created_to'
    ]);

    const result = await this.userService.findMany(filters, pagination);
    
    this.sendPaginatedSuccess(
      res,
      result.data,
      result.pagination,
      'Lấy danh sách users thành công'
    );
  });

  /**
   * Lấy user theo email
   * GET /api/users/email/:email
   */
  getUserByEmail = this.asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.params;
    
    if (!email) {
      throw new ValidationError('Email không được để trống');
    }

    const user = await this.userService.findByEmail(email);
    
    if (!user) {
      throw new NotFoundError('Không tìm thấy user');
    }
    
    this.sendSuccess(res, user);
  });

  /**
   * Lấy user theo clerk_id
   * GET /api/users/clerk/:clerkId
   */
  getUserByClerkId = this.asyncHandler(async (req: Request, res: Response) => {
    const { clerkId } = req.params;
    
    if (!clerkId) {
      throw new ValidationError('Clerk ID không được để trống');
    }

    const user = await this.userService.findByClerkId(clerkId);
    
    if (!user) {
      throw new NotFoundError('Không tìm thấy user');
    }
    
    this.sendSuccess(res, user);
  });

  /**
   * Lấy thống kê users
   * GET /api/users/stats
   */
  getUserStats = this.asyncHandler(async (req: Request, res: Response) => {
    const stats = await this.userService.getStats();
    
    this.sendSuccess(res, stats, 'Lấy thống kê users thành công');
  });

  /**
   * Tìm kiếm users
   * GET /api/users/search
   */
  searchUsers = this.asyncHandler(async (req: Request, res: Response) => {
    const { q: query } = req.query;
    
    if (!query || typeof query !== 'string') {
      throw new ValidationError('Query không được để trống');
    }

    const pagination = this.parsePagination(req);
    const filters = {
      name_search: query
    };

    const result = await this.userService.findMany(filters, pagination);
    
    this.sendPaginatedSuccess(
      res,
      result.data,
      result.pagination,
      'Tìm kiếm users thành công'
    );
  });
}
