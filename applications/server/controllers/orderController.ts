import { Request, Response } from 'express';
import { z } from 'zod';
import { BaseController, ValidationError, NotFoundError } from './baseController';
import { orderService } from '@/services/orderService';

// Validation schemas
const CreateOrderItemSchema = z.object({
  menu_item_id: z.string().uuid('Menu item ID không hợp lệ'),
  quantity: z.number().min(1, 'Số lượng phải lớn hơn 0'),
  special_instructions: z.string().optional()
});

const CreateOrderSchema = z.object({
  restaurant_id: z.string().uuid('Restaurant ID không hợp lệ'),
  customer_id: z.string().uuid('Customer ID không hợp lệ'),
  address_id: z.string().uuid('Address ID không hợp lệ').optional(),
  order_type: z.enum(['dine_in', 'takeaway', 'delivery']),
  delivery_fee: z.number().min(0).optional(),
  discount_amount: z.number().min(0).optional(),
  tax_amount: z.number().min(0).optional(),
  notes: z.string().optional(),
  estimated_time: z.number().min(0).optional(),
  items: z.array(CreateOrderItemSchema).min(1, 'Phải có ít nhất 1 item')
});

const UpdateOrderSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled']).optional(),
  payment_status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded']).optional(),
  notes: z.string().optional(),
  estimated_time: z.number().min(0).optional()
});

const CancelOrderSchema = z.object({
  reason: z.string().min(1, 'Lý do hủy không được để trống')
});

const UpdateCookingStatusSchema = z.object({
  status: z.enum(['pending', 'preparing', 'cooking', 'ready', 'served', 'cancelled'])
});

const IdParamSchema = z.object({
  id: z.string().uuid('ID không hợp lệ')
});

export class orderController extends BaseController {
  private orderService: orderService;

  constructor() {
    super();
    this.orderService = new orderService();
  }

  /**
   * Tạo order mới
   * POST /api/orders
   */
  createOrder = this.asyncHandler(async (req: Request, res: Response) => {
    const data = this.validateBody(req, CreateOrderSchema) as any;
    
    const order = await this.orderService.create(data);
    
    this.sendSuccess(res, order, 'Tạo đơn hàng thành công', 201);
  });

  /**
   * Lấy order theo ID
   * GET /api/orders/:id
   */
  getOrderById = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = this.validateParams(req, IdParamSchema) as any;
    
    const order = await this.orderService.findById(id);
    
    if (!order) {
      throw new NotFoundError('Không tìm thấy đơn hàng');
    }
    
    this.sendSuccess(res, order);
  });

  /**
   * Lấy order theo code
   * GET /api/orders/code/:code
   */
  getOrderByCode = this.asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.params;
    
    if (!code) {
      throw new ValidationError('Mã đơn hàng không được để trống');
    }

    const order = await this.orderService.findByCode(code);
    
    if (!order) {
      throw new NotFoundError('Không tìm thấy đơn hàng');
    }
    
    this.sendSuccess(res, order);
  });

  /**
   * Cập nhật order
   * PUT /api/orders/:id
   */
  updateOrder = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = this.validateParams(req, IdParamSchema) as any;
    const data = this.validateBody(req, UpdateOrderSchema) as any;
    const userId = this.getCurrentUserId(req);
    
    const order = await this.orderService.update(id, data, userId);
    
    this.sendSuccess(res, order, 'Cập nhật đơn hàng thành công');
  });

  /**
   * Hủy order
   * POST /api/orders/:id/cancel
   */
  cancelOrder = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = this.validateParams(req, IdParamSchema) as any;
    const { reason } = this.validateBody(req, CancelOrderSchema) as any;
    const userId = this.getCurrentUserId(req);
    
    const order = await this.orderService.cancel(id, reason, userId);
    
    this.sendSuccess(res, order, 'Hủy đơn hàng thành công');
  });

  /**
   * Lấy danh sách orders với phân trang và filter
   * GET /api/orders
   */
  getOrders = this.asyncHandler(async (req: Request, res: Response) => {
    const pagination = this.parsePagination(req);
    const filters = this.parseFilters(req, [
      'restaurant_id',
      'customer_id',
      'status',
      'order_type',
      'payment_status',
      'created_from',
      'created_to',
      'amount_from',
      'amount_to'
    ]);

    const result = await this.orderService.findMany(filters, pagination);
    
    this.sendPaginatedSuccess(
      res,
      result.data,
      result.pagination,
      'Lấy danh sách đơn hàng thành công'
    );
  });

  /**
   * Lấy orders theo restaurant
   * GET /api/restaurants/:restaurantId/orders
   */
  getOrdersByRestaurant = this.asyncHandler(async (req: Request, res: Response) => {
    const { restaurantId } = req.params;
    
    if (!restaurantId || !this.validateUUID(restaurantId)) {
      throw new ValidationError('Restaurant ID không hợp lệ');
    }

    const pagination = this.parsePagination(req);
    const filters = this.parseFilters(req, [
      'status',
      'order_type',
      'payment_status',
      'created_from',
      'created_to',
      'amount_from',
      'amount_to'
    ]);

    const result = await this.orderService.findByRestaurant(restaurantId, filters, pagination);
    
    this.sendPaginatedSuccess(
      res,
      result.data,
      result.pagination,
      'Lấy đơn hàng theo nhà hàng thành công'
    );
  });

  /**
   * Lấy orders theo customer
   * GET /api/customers/:customerId/orders
   */
  getOrdersByCustomer = this.asyncHandler(async (req: Request, res: Response) => {
    const { customerId } = req.params;
    
    if (!customerId || !this.validateUUID(customerId)) {
      throw new ValidationError('Customer ID không hợp lệ');
    }

    const pagination = this.parsePagination(req);
    const filters = this.parseFilters(req, [
      'status',
      'order_type',
      'payment_status',
      'created_from',
      'created_to',
      'amount_from',
      'amount_to'
    ]);

    const result = await this.orderService.findByCustomer(customerId, filters, pagination);
    
    this.sendPaginatedSuccess(
      res,
      result.data,
      result.pagination,
      'Lấy đơn hàng theo khách hàng thành công'
    );
  });

  /**
   * Lấy orders của user hiện tại
   * GET /api/orders/my-orders
   */
  getMyOrders = this.asyncHandler(async (req: Request, res: Response) => {
    const userId = this.getCurrentUserId(req);
    
    const pagination = this.parsePagination(req);
    const filters = this.parseFilters(req, [
      'status',
      'order_type',
      'payment_status',
      'created_from',
      'created_to',
      'amount_from',
      'amount_to'
    ]);

    const result = await this.orderService.findByCustomer(userId, filters, pagination);
    
    this.sendPaginatedSuccess(
      res,
      result.data,
      result.pagination,
      'Lấy đơn hàng của tôi thành công'
    );
  });

  /**
   * Cập nhật cooking status của order item
   * PUT /api/orders/items/:itemId/cooking-status
   */
  updateItemCookingStatus = this.asyncHandler(async (req: Request, res: Response) => {
    const { itemId } = req.params;
    const { status } = this.validateBody(req, UpdateCookingStatusSchema) as any;
    const userId = this.getCurrentUserId(req);
    
    if (!itemId || !this.validateUUID(itemId)) {
      throw new ValidationError('Item ID không hợp lệ');
    }

    await this.orderService.updateItemCookingStatus(itemId, status, userId);
    
    this.sendSuccess(res, null, 'Cập nhật trạng thái chế biến thành công');
  });

  /**
   * Lấy thống kê orders
   * GET /api/orders/stats
   */
  getOrderStats = this.asyncHandler(async (req: Request, res: Response) => {
    const { restaurantId } = req.query;
    
    if (restaurantId && !this.validateUUID(restaurantId as string)) {
      throw new ValidationError('Restaurant ID không hợp lệ');
    }

    const stats = await this.orderService.getStats(restaurantId as string);
    
    this.sendSuccess(res, stats, 'Lấy thống kê đơn hàng thành công');
  });
}
