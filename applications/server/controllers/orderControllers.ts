import { Request, Response } from 'express';
import { AuthenticatedRequest } from '@/types/auth';
import { z, ZodError } from 'zod';
import {
  createValidationError,
  createNotFoundError,
  createAuthError,
  createForbiddenError,
  sendSuccess,
  sendPaginatedSuccess,
  asyncHandler,
  validateBody,
  validateQuery,
  validateIdParam,
  getCurrentUserId
} from './baseControllers';
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
} from '@/schemas/orderSchemas';
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
} from '@/services/orderServices';

// Universal error handler function
const handleError = (error: any, res: Response) => {
  console.error('Order Controller Error:', error);

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: error.message,
      errors: (error as any).errors
    });
  }

  if (error.name === 'NotFoundError') {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }

  if (error.name === 'AuthError') {
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

/**
 * Tạo đơn hàng mới
 */
export const createOrderController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedData = validateBody(req, CreateOrderSchema) as any;
    const result = await createOrder(validatedData);

    if (!result.success) {
      throw createValidationError(result.error!);
    }

    sendSuccess(res, result.data, 'Tạo đơn hàng thành công', 201);
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Lấy thông tin đơn hàng theo ID
 */
export const getOrderByIdController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = validateIdParam(req);
    const result = await getOrderById(id);

    if (!result.success) {
      throw createNotFoundError(result.error!);
    }

    sendSuccess(res, result.data);
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Lấy đơn hàng theo mã order
 */
export const getOrderByCodeController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { orderCode } = req.params;
    const result = await getOrderByCode(orderCode);

    if (!result.success) {
      throw createNotFoundError(result.error!);
    }

    sendSuccess(res, result.data);
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Lấy danh sách đơn hàng với bộ lọc
 */
export const getOrdersController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedQuery = validateQuery(req, OrderQuerySchema) as any;
    const result = await getOrders(validatedQuery);

    if (!result.success) {
      throw createValidationError(result.error!);
    }

    sendPaginatedSuccess(res, result.data?.orders || [], result.data?.pagination);
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Cập nhật đơn hàng
 */
export const updateOrderController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = validateIdParam(req);
    const validatedData = validateBody(req, UpdateOrderSchema) as any;
    const result = await updateOrder(id, validatedData);

    if (!result.success) {
      throw createValidationError(result.error!);
    }

    sendSuccess(res, result.data, 'Cập nhật đơn hàng thành công');
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Hủy đơn hàng
 */
export const cancelOrderController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = validateIdParam(req);
    const validatedData = validateBody(req, CancelOrderSchema) as any;
    const result = await cancelOrder(id, validatedData);

    if (!result.success) {
      throw createValidationError(result.error!);
    }

    sendSuccess(res, result.data, 'Hủy đơn hàng thành công');
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Lấy thống kê đơn hàng
 */
export const getOrderStatsController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedQuery = validateQuery(req, OrderStatsSchema) as any;
    const result = await getOrderStatistics(validatedQuery);

    if (!result.success) {
      throw createValidationError(result.error!);
    }

    sendSuccess(res, result.data);
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Lấy danh sách đơn hàng cho nhà bếp
 */
export const getKitchenOrdersController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedQuery = validateQuery(req, KitchenOrderQuerySchema) as any;
    const result = await getKitchenOrderList(validatedQuery);

    if (!result.success) {
      throw createValidationError(result.error!);
    }

    sendPaginatedSuccess(res, result.data?.kitchen_orders || [], result.data?.pagination);
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Cập nhật trạng thái nấu ăn
 */
export const updateCookingStatusController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedData = validateBody(req, UpdateCookingStatusSchema) as any;
    const result = await updateCookingOrderStatus(validatedData);

    if (!result.success) {
      throw createValidationError(result.error!);
    }

    sendSuccess(res, result.data, 'Cập nhật trạng thái nấu ăn thành công');
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Thực hiện hành động hàng loạt
 */
export const bulkOrderActionsController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedData = validateBody(req, BulkOrderActionSchema) as any;
    const result = await bulkUpdateOrders(validatedData);

    if (!result.success) {
      throw createValidationError(result.error!);
    }

    sendSuccess(res, result.data, 'Thực hiện hành động hàng loạt thành công');
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Lấy dữ liệu phân tích đơn hàng
 */
export const getOrderAnalyticsController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedQuery = validateQuery(req, OrderAnalyticsSchema) as any;
    const result = await getOrderAnalyticsData(validatedQuery);

    if (!result.success) {
      throw createValidationError(result.error!);
    }

    sendSuccess(res, result.data);
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Lấy đơn hàng của tôi
 */
export const getMyOrdersController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const validatedQuery = validateQuery(req, OrderQuerySchema) as any;
    const result = await getOrders({ ...validatedQuery, customer_id: userId });

    if (!result.success) {
      throw createValidationError(result.error!);
    }

    sendPaginatedSuccess(res, result.data?.orders || [], result.data?.pagination);
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Lấy đơn hàng hiện tại
 */
export const getCurrentOrderController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const result = await getOrders({
      customer_id: userId,
      status: ['pending', 'confirmed', 'preparing', 'ready'],
      page: 1,
      limit: 1,
      sort_by: 'created_at',
      sort_order: 'desc'
    });

    if (!result.success) {
      throw createValidationError(result.error!);
    }

    const currentOrder = result.data?.orders && result.data.orders.length > 0 ? result.data.orders[0] : null;
    sendSuccess(res, currentOrder);
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Lấy đơn hàng của nhà hàng
 */
export const getRestaurantOrdersController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const restaurantId = req.user?.restaurant_context?.restaurant_id;
    if (!restaurantId) {
      throw createAuthError('Không có quyền truy cập nhà hàng');
    }

    const validatedQuery = validateQuery(req, OrderQuerySchema) as any;
    const result = await getOrders({ ...validatedQuery, restaurant_id: restaurantId });

    if (!result.success) {
      throw createValidationError(result.error!);
    }

    sendPaginatedSuccess(res, result.data?.orders || [], result.data?.pagination);
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Lấy đơn hàng đang chờ
 */
export const getPendingOrdersController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const restaurantId = req.user?.restaurant_context?.restaurant_id;
    if (!restaurantId) {
      throw createAuthError('Không có quyền truy cập nhà hàng');
    }

    const validatedQuery = validateQuery(req, OrderQuerySchema) as any;
    const result = await getOrders({
      ...validatedQuery,
      restaurant_id: restaurantId,
      status: ['pending', 'confirmed', 'preparing']
    });

    if (!result.success) {
      throw createValidationError(result.error!);
    }

    sendPaginatedSuccess(res, result.data?.orders || [], result.data?.pagination);
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Lấy dashboard nhà hàng
 */
export const getRestaurantDashboardController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const restaurantId = req.user?.restaurant_context?.restaurant_id;
    if (!restaurantId) {
      throw createAuthError('Không có quyền truy cập nhà hàng');
    }

    const validatedQuery = validateQuery(req, OrderStatsSchema) as any;
    const result = await getOrderStatistics({ ...validatedQuery, restaurant_id: restaurantId });

    if (!result.success) {
      throw createValidationError(result.error!);
    }

    sendSuccess(res, result.data);
  } catch (error) {
    handleError(error, res);
  }
});
