import { Request, Response } from 'express';
import {
  CreateRestaurantReviewSchema,
  CreateMenuItemReviewSchema,
  CreateOrderReviewSchema,
  UpdateReviewSchema,
  ReviewResponseSchema,
  ReviewQuerySchema,
  ReviewStatsQuerySchema,
  BulkReviewActionSchema
} from '../schemas/reviewSchemas';
import reviewServices from '../services/reviewServices';

// Extend Request interface
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// ================================
// 🌟 REVIEW CONTROLLERS
// ================================

// Create restaurant review
export const createRestaurantReview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập để đánh giá'
      });
    }

    const validatedData = CreateRestaurantReviewSchema.parse(req.body);
    const review = await reviewServices.createRestaurantReview(customerId, validatedData);

    res.status(201).json({
      success: true,
      message: 'Tạo đánh giá nhà hàng thành công',
      data: review
    });
  } catch (error: any) {
    console.error('Create restaurant review error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi tạo đánh giá nhà hàng'
    });
  }
};

// Create menu item review
export const createMenuItemReview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập để đánh giá'
      });
    }

    const validatedData = CreateMenuItemReviewSchema.parse(req.body);
    const review = await reviewServices.createMenuItemReview(customerId, validatedData);

    res.status(201).json({
      success: true,
      message: 'Tạo đánh giá món ăn thành công',
      data: review
    });
  } catch (error: any) {
    console.error('Create menu item review error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi tạo đánh giá món ăn'
    });
  }
};

// Create order review
export const createOrderReview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập để đánh giá'
      });
    }

    const validatedData = CreateOrderReviewSchema.parse(req.body);
    const review = await reviewServices.createOrderReview(customerId, validatedData);

    res.status(201).json({
      success: true,
      message: 'Tạo đánh giá đơn hàng thành công',
      data: review
    });
  } catch (error: any) {
    console.error('Create order review error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi tạo đánh giá đơn hàng'
    });
  }
};

// Get reviews with filters
export const getReviews = async (req: Request, res: Response) => {
  try {
    const validatedQuery = ReviewQuerySchema.parse(req.query);
    const result = await reviewServices.getReviews(validatedQuery);

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách đánh giá thành công',
      data: result
    });
  } catch (error: any) {
    console.error('Get reviews error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi lấy danh sách đánh giá'
    });
  }
};

// Get review by ID
export const getReviewById = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const review = await reviewServices.getReviewById(reviewId);

    res.status(200).json({
      success: true,
      message: 'Lấy thông tin đánh giá thành công',
      data: review
    });
  } catch (error: any) {
    console.error('Get review by ID error:', error);
    res.status(404).json({
      success: false,
      message: error.message || 'Lỗi lấy thông tin đánh giá'
    });
  }
};

// Update review
export const updateReview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { reviewId } = req.params;
    const customerId = req.user?.id;

    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập'
      });
    }

    const validatedData = UpdateReviewSchema.parse(req.body);
    const review = await reviewServices.updateReview(reviewId, customerId, validatedData);

    res.status(200).json({
      success: true,
      message: 'Cập nhật đánh giá thành công',
      data: review
    });
  } catch (error: any) {
    console.error('Update review error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi cập nhật đánh giá'
    });
  }
};

// Add restaurant response to review
export const addReviewResponse = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { reviewId } = req.params;
    const staffId = req.user?.id;

    if (!staffId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập'
      });
    }

    const validatedData = ReviewResponseSchema.parse(req.body);
    const review = await reviewServices.addReviewResponse(reviewId, staffId, validatedData);

    res.status(200).json({
      success: true,
      message: 'Phản hồi đánh giá thành công',
      data: review
    });
  } catch (error: any) {
    console.error('Add review response error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi phản hồi đánh giá'
    });
  }
};

// Delete review
export const deleteReview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { reviewId } = req.params;
    const customerId = req.user?.id;

    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập'
      });
    }

    const result = await reviewServices.deleteReview(reviewId, customerId);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error: any) {
    console.error('Delete review error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi xóa đánh giá'
    });
  }
};

// Get review statistics
export const getReviewStats = async (req: Request, res: Response) => {
  try {
    const validatedQuery = ReviewStatsQuerySchema.parse(req.query);
    const stats = await reviewServices.getReviewStats(validatedQuery);

    res.status(200).json({
      success: true,
      message: 'Lấy thống kê đánh giá thành công',
      data: stats
    });
  } catch (error: any) {
    console.error('Get review stats error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi lấy thống kê đánh giá'
    });
  }
};

// Bulk review actions (admin/staff)
export const bulkReviewAction = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const staffId = req.user?.id;

    if (!staffId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập'
      });
    }

    const validatedData = BulkReviewActionSchema.parse(req.body);
    const result = await reviewServices.bulkReviewAction(staffId, validatedData);

    res.status(200).json({
      success: true,
      message: 'Thực hiện thao tác hàng loạt thành công',
      data: result
    });
  } catch (error: any) {
    console.error('Bulk review action error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi thực hiện thao tác hàng loạt'
    });
  }
};

// Get customer's reviews
export const getCustomerReviews = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const customerId = req.user?.id;

    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập'
      });
    }

    const validatedQuery = ReviewQuerySchema.parse({
      ...req.query,
      customer_id: customerId
    });

    const result = await reviewServices.getReviews(validatedQuery);

    res.status(200).json({
      success: true,
      message: 'Lấy đánh giá của khách hàng thành công',
      data: result
    });
  } catch (error: any) {
    console.error('Get customer reviews error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi lấy đánh giá của khách hàng'
    });
  }
};

// Get restaurant reviews
export const getRestaurantReviews = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;

    const validatedQuery = ReviewQuerySchema.parse({
      ...req.query,
      restaurant_id: restaurantId
    });

    const result = await reviewServices.getReviews(validatedQuery);

    res.status(200).json({
      success: true,
      message: 'Lấy đánh giá nhà hàng thành công',
      data: result
    });
  } catch (error: any) {
    console.error('Get restaurant reviews error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi lấy đánh giá nhà hàng'
    });
  }
};

// Get menu item reviews
export const getMenuItemReviews = async (req: Request, res: Response) => {
  try {
    const { menuItemId } = req.params;

    const validatedQuery = ReviewQuerySchema.parse({
      ...req.query,
      menu_item_id: menuItemId
    });

    const result = await reviewServices.getReviews(validatedQuery);

    res.status(200).json({
      success: true,
      message: 'Lấy đánh giá món ăn thành công',
      data: result
    });
  } catch (error: any) {
    console.error('Get menu item reviews error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi lấy đánh giá món ăn'
    });
  }
};

// Get restaurant review statistics
export const getRestaurantReviewStats = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;

    const validatedQuery = ReviewStatsQuerySchema.parse({
      ...req.query,
      restaurant_id: restaurantId
    });

    const stats = await reviewServices.getReviewStats(validatedQuery);

    res.status(200).json({
      success: true,
      message: 'Lấy thống kê đánh giá nhà hàng thành công',
      data: stats
    });
  } catch (error: any) {
    console.error('Get restaurant review stats error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi lấy thống kê đánh giá nhà hàng'
    });
  }
};

// Get menu item review statistics
export const getMenuItemReviewStats = async (req: Request, res: Response) => {
  try {
    const { menuItemId } = req.params;

    const validatedQuery = ReviewStatsQuerySchema.parse({
      ...req.query,
      menu_item_id: menuItemId
    });

    const stats = await reviewServices.getReviewStats(validatedQuery);

    res.status(200).json({
      success: true,
      message: 'Lấy thống kê đánh giá món ăn thành công',
      data: stats
    });
  } catch (error: any) {
    console.error('Get menu item review stats error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi lấy thống kê đánh giá món ăn'
    });
  }
};

export default {
  createRestaurantReview,
  createMenuItemReview,
  createOrderReview,
  getReviews,
  getReviewById,
  updateReview,
  addReviewResponse,
  deleteReview,
  getReviewStats,
  bulkReviewAction,
  getCustomerReviews,
  getRestaurantReviews,
  getMenuItemReviews,
  getRestaurantReviewStats,
  getMenuItemReviewStats
};
