import { Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { ValidationError, NotFoundError, AuthError } from './baseControllers';
import {
  CreateOrderSchema,
  UpdateOrderSchema,
  CancelOrderSchema,
  OrderQuerySchema,
  OrderStatsSchema,
  KitchenOrderQuerySchema,
  UpdateCookingStatusSchema,
  BulkOrderActionSchema,
  OrderAnalyticsSchema
} from '../schemas/orderSchemas';
import {
  createOrder,
  getOrderById,
  getOrderByCode,
  getOrders,
  updateOrder,
  cancelOrder,
  getOrderStatistics,
  getKitchenOrderList,
  updateCookingOrderStatus,
  bulkUpdateOrders,
  getOrderAnalyticsData
} from '../services/orderServices';

// AuthenticatedRequest interface
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
  restaurant?: {
    id: string;
    name: string;
  };
}

// Universal error handler function
const handleError = (error: any, res: Response) => {
  console.error('Order Controller Error:', error);

  if (error instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      message: error.message,
      errors: error.errors
    });
  }

  if (error instanceof NotFoundError) {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }

  if (error instanceof AuthError) {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }

  if (error instanceof ZodError) {
    const errors = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`);
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors
    });
  }

  // Default server error
  return res.status(500).json({
    success: false,
    message: 'Lỗi server không xác định'
  });
};

// ================================
// 🛒 ORDER CONTROLLERS
// ================================

export class OrderController {
  constructor() {
    // Bind methods to maintain context
    this.createOrder = this.createOrder.bind(this);
    this.getOrderById = this.getOrderById.bind(this);
    this.getOrderByCode = this.getOrderByCode.bind(this);
    this.getOrders = this.getOrders.bind(this);
    this.updateOrder = this.updateOrder.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
    this.getOrderStats = this.getOrderStats.bind(this);
    this.getKitchenOrders = this.getKitchenOrders.bind(this);
    this.updateCookingStatus = this.updateCookingStatus.bind(this);
    this.bulkOrderActions = this.bulkOrderActions.bind(this);
    this.getOrderAnalytics = this.getOrderAnalytics.bind(this);
    this.getMyOrders = this.getMyOrders.bind(this);
    this.getCurrentOrder = this.getCurrentOrder.bind(this);
    this.getRestaurantOrders = this.getRestaurantOrders.bind(this);
    this.getPendingOrders = this.getPendingOrders.bind(this);
    this.getRestaurantDashboard = this.getRestaurantDashboard.bind(this);
  }

  /**
   * Tạo đơn hàng mới
   */
  async createOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedData = CreateOrderSchema.parse(req.body);
      const result = await createOrder(validatedData);

      if (!result.success) {
        throw new ValidationError(result.error!);
      }

      res.status(201).json({
        success: true,
        message: 'Tạo đơn hàng thành công',
        data: result.data
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Lấy thông tin đơn hàng theo ID
   */
  async getOrderById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const result = await getOrderById(id);

      if (!result.success) {
        throw new NotFoundError(result.error!);
      }

      res.json({
        success: true,
        data: result.data
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Lấy đơn hàng theo mã order
   */
  async getOrderByCode(req: AuthenticatedRequest, res: Response) {
    try {
      const { orderCode } = req.params;
      const result = await getOrderByCode(orderCode);

      if (!result.success) {
        throw new NotFoundError(result.error!);
      }

      res.json({
        success: true,
        data: result.data
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Lấy danh sách đơn hàng với bộ lọc
   */
  async getOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedQuery = OrderQuerySchema.parse(req.query);
      const result = await getOrders(validatedQuery);

      if (!result.success) {
        throw new ValidationError(result.error!);
      }

      res.json({
        success: true,
        data: result.data?.orders || [],
        pagination: result.data?.pagination
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Cập nhật đơn hàng
   */
  async updateOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const validatedData = UpdateOrderSchema.parse(req.body);
      const result = await updateOrder(id, validatedData);

      if (!result.success) {
        if (result.error === 'Đơn hàng không tồn tại') {
          throw new NotFoundError(result.error);
        }
        throw new ValidationError(result.error!);
      }

      res.json({
        success: true,
        message: 'Cập nhật đơn hàng thành công',
        data: result.data
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Hủy đơn hàng
   */
  async cancelOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const validatedData = CancelOrderSchema.parse(req.body);
      const userId = req.user?.id;

      const result = await cancelOrder(id, validatedData.reason, userId);

      if (!result.success) {
        if (result.error === 'Đơn hàng không tồn tại') {
          throw new NotFoundError(result.error);
        }
        throw new ValidationError(result.error!);
      }

      res.json({
        success: true,
        message: 'Hủy đơn hàng thành công',
        data: result.data
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Lấy thống kê đơn hàng
   */
  async getOrderStats(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedQuery = OrderStatsSchema.parse(req.query);
      const result = await getOrderStatistics(validatedQuery);

      if (!result.success) {
        throw new ValidationError(result.error!);
      }

      res.json({
        success: true,
        data: result.data
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  // ================================
  // 🍳 KITCHEN MANAGEMENT
  // ================================

  /**
   * Lấy danh sách đơn hàng cho bếp
   */
  async getKitchenOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedQuery = KitchenOrderQuerySchema.parse(req.query);
      const result = await getKitchenOrderList(validatedQuery);

      if (!result.success) {
        throw new ValidationError(result.error!);
      }

      res.json({
        success: true,
        data: result.data?.kitchen_orders || [],
        pagination: result.data?.pagination
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Cập nhật trạng thái nấu ăn
   */
  async updateCookingStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedData = UpdateCookingStatusSchema.parse(req.body);
      const result = await updateCookingOrderStatus(validatedData);

      if (!result.success) {
        throw new ValidationError(result.error!);
      }

      res.json({
        success: true,
        message: 'Cập nhật trạng thái nấu ăn thành công',
        data: result.data
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Thực hiện hành động hàng loạt trên orders
   */
  async bulkOrderActions(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedData = BulkOrderActionSchema.parse(req.body);
      const result = await bulkUpdateOrders(validatedData);

      if (!result.success) {
        throw new ValidationError(result.error!);
      }

      res.json({
        success: true,
        message: 'Thực hiện hành động hàng loạt thành công',
        data: result.data
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Lấy analytics chi tiết cho orders
   */
  async getOrderAnalytics(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedQuery = OrderAnalyticsSchema.parse(req.query);
      const result = await getOrderAnalyticsData(validatedQuery);

      if (!result.success) {
        throw new ValidationError(result.error!);
      }

      res.json({
        success: true,
        data: result.data
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  // ================================
  // 🚀 CUSTOMER-SPECIFIC ENDPOINTS
  // ================================

  /**
   * Lấy đơn hàng của customer hiện tại
   */
  async getMyOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        throw new ValidationError('Vui lòng đăng nhập');
      }

      const query = {
        ...req.query,
        customer_id: userId
      };

      const validatedQuery = OrderQuerySchema.parse(query);
      const result = await getOrders(validatedQuery);

      if (!result.success) {
        throw new ValidationError(result.error!);
      }

      res.json({
        success: true,
        data: result.data?.orders || [],
        pagination: result.data?.pagination
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Lấy đơn hàng hiện tại của customer (đang active)
   */
  async getCurrentOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        throw new ValidationError('Vui lòng đăng nhập');
      }

    const query = {
      customer_id: userId,
      status: ['pending', 'confirmed', 'preparing', 'ready'] as ('pending' | 'confirmed' | 'preparing' | 'ready')[],
      page: 1,
      limit: 1,
      sort_by: 'created_at' as const,
      sort_order: 'desc' as const
    };      const result = await getOrders(query);

      if (!result.success) {
        throw new ValidationError(result.error!);
      }

      const currentOrder = result.data?.orders && result.data.orders.length > 0 ? result.data.orders[0] : null;

      res.json({
        success: true,
        data: currentOrder
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  // ================================
  // 🏪 RESTAURANT-SPECIFIC ENDPOINTS
  // ================================

  /**
   * Lấy đơn hàng của restaurant hiện tại
   */
  async getRestaurantOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const restaurantId = req.restaurant?.id;
      
      if (!restaurantId) {
        throw new ValidationError('Không tìm thấy thông tin restaurant');
      }

      const query = {
        ...req.query,
        restaurant_id: restaurantId
      };

      const validatedQuery = OrderQuerySchema.parse(query);
      const result = await getOrders(validatedQuery);

      if (!result.success) {
        throw new ValidationError(result.error!);
      }

      res.json({
        success: true,
        data: result.data?.orders || [],
        pagination: result.data?.pagination
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Lấy đơn hàng đang chờ xử lý của restaurant
   */
  async getPendingOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const restaurantId = req.restaurant?.id;
      
      if (!restaurantId) {
        throw new ValidationError('Không tìm thấy thông tin restaurant');
      }

    const query = {
      restaurant_id: restaurantId,
      status: ['pending'] as ('pending')[],
      page: 1,
      sort_by: 'created_at' as const,
      sort_order: 'asc' as const,
      limit: 50
    };      const result = await getOrders(query);

      if (!result.success) {
        throw new ValidationError(result.error!);
      }

      res.json({
        success: true,
        data: result.data?.orders || []
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Dashboard cho restaurant
   */
  async getRestaurantDashboard(req: AuthenticatedRequest, res: Response) {
    try {
      const restaurantId = req.restaurant?.id;
      
      if (!restaurantId) {
        throw new ValidationError('Không tìm thấy thông tin restaurant');
      }

      // Get today's stats
      const todayStatsResult = await getOrderStatistics({
        restaurant_id: restaurantId,
        period: 'today',
        group_by: 'day'
      });

      // Get pending orders count
      const pendingResult = await getOrders({
        restaurant_id: restaurantId,
        status: ['pending'] as ('pending')[],
        page: 1,
        sort_by: 'created_at' as const,
        sort_order: 'desc' as const,
        limit: 1
      });

      // Get preparing orders count
      const preparingResult = await getOrders({
        restaurant_id: restaurantId,
        status: ['confirmed', 'preparing'] as ('confirmed' | 'preparing')[],
        page: 1,
        sort_by: 'created_at' as const,
        sort_order: 'desc' as const,
        limit: 1
      });

      // Get ready orders count
      const readyResult = await getOrders({
        restaurant_id: restaurantId,
        status: ['ready'] as ('ready')[],
        page: 1,
        sort_by: 'created_at' as const,
        sort_order: 'desc' as const,
        limit: 1
      });

      res.json({
        success: true,
        data: {
          today_stats: todayStatsResult.data,
          order_counts: {
            pending: pendingResult.data?.pagination.total || 0,
            preparing: preparingResult.data?.pagination.total || 0,
            ready: readyResult.data?.pagination.total || 0
          }
        }
      });
    } catch (error) {
      handleError(error, res);
    }
  }
}

// Export singleton instance
export const orderController = new OrderController();
