import { Request, Response } from 'express';
import {
  CreateVoucherSchema,
  CreatePromotionSchema,
  UpdateVoucherSchema,
  UpdatePromotionSchema,
  VoucherQuerySchema,
  PromotionQuerySchema,
  ApplyVoucherSchema,
  CheckPromotionsSchema,
  CalculateDiscountSchema,
  DiscountAnalyticsSchema
} from '../schemas/promotionSchemas';
import promotionServices from '../services/promotionServices';

// Extend Request interface to include user information
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    restaurant_id?: string;
  };
}

// ================================
// 🎟️ VOUCHER CONTROLLERS
// ================================

// Create voucher
export const createVoucher = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedData = CreateVoucherSchema.parse(req.body);
    const voucher = await promotionServices.createVoucher(validatedData);

    res.status(201).json({
      success: true,
      message: 'Tạo voucher thành công',
      data: voucher
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi tạo voucher',
      error: error
    });
  }
};

// Get vouchers
export const getVouchers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedQuery = VoucherQuerySchema.parse(req.query);
    const result = await promotionServices.getVouchers(validatedQuery);

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách voucher thành công',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi lấy danh sách voucher',
      error: error
    });
  }
};

// Get voucher by ID
export const getVoucherById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await promotionServices.getVouchers({ 
      page: 1, 
      limit: 1,
      sort_by: 'created_at',
      sort_order: 'desc'
    });

    // Find specific voucher (in real implementation, create a separate service method)
    const voucher = result.vouchers.find(v => v.id === id);
    
    if (!voucher) {
      return res.status(404).json({
        success: false,
        message: 'Voucher không tồn tại'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lấy thông tin voucher thành công',
      data: voucher
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi lấy thông tin voucher',
      error: error
    });
  }
};

// Apply voucher
export const applyVoucher = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedData = ApplyVoucherSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Yêu cầu đăng nhập'
      });
    }

    const result = await promotionServices.applyVoucher(userId, validatedData);

    res.status(200).json({
      success: true,
      message: 'Áp dụng voucher thành công',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi áp dụng voucher',
      error: error
    });
  }
};

// Update voucher
export const updateVoucher = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = UpdateVoucherSchema.parse(req.body);
    
    const voucher = await promotionServices.updateVoucher(id, validatedData);

    res.status(200).json({
      success: true,
      message: 'Cập nhật voucher thành công',
      data: voucher
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi cập nhật voucher',
      error: error
    });
  }
};

// Delete voucher
export const deleteVoucher = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await promotionServices.deleteVoucher(id);

    res.status(200).json({
      success: true,
      message: result.message,
      data: null
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi xóa voucher',
      error: error
    });
  }
};

// ================================
// 🎯 PROMOTION CONTROLLERS
// ================================

// Create promotion
export const createPromotion = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedData = CreatePromotionSchema.parse(req.body);
    const promotion = await promotionServices.createPromotion(validatedData);

    res.status(201).json({
      success: true,
      message: 'Tạo khuyến mãi thành công',
      data: promotion
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi tạo khuyến mãi',
      error: error
    });
  }
};

// Get promotions
export const getPromotions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedQuery = PromotionQuerySchema.parse(req.query);
    const result = await promotionServices.getPromotions(validatedQuery);

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách khuyến mãi thành công',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi lấy danh sách khuyến mãi',
      error: error
    });
  }
};

// Get promotion by ID
export const getPromotionById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await promotionServices.getPromotions({ 
      page: 1, 
      limit: 1,
      sort_by: 'created_at',
      sort_order: 'desc'
    });

    // Find specific promotion (in real implementation, create a separate service method)
    const promotion = result.promotions.find(p => p.id === id);
    
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Khuyến mãi không tồn tại'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lấy thông tin khuyến mãi thành công',
      data: promotion
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi lấy thông tin khuyến mãi',
      error: error
    });
  }
};

// Check applicable promotions
export const checkPromotions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedData = CheckPromotionsSchema.parse(req.body);
    const promotions = await promotionServices.checkPromotions(validatedData);

    res.status(200).json({
      success: true,
      message: 'Kiểm tra khuyến mãi thành công',
      data: promotions
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi kiểm tra khuyến mãi',
      error: error
    });
  }
};

// Update promotion
export const updatePromotion = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = UpdatePromotionSchema.parse(req.body);
    
    const promotion = await promotionServices.updatePromotion(id, validatedData);

    res.status(200).json({
      success: true,
      message: 'Cập nhật khuyến mãi thành công',
      data: promotion
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi cập nhật khuyến mãi',
      error: error
    });
  }
};

// Delete promotion
export const deletePromotion = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await promotionServices.deletePromotion(id);

    res.status(200).json({
      success: true,
      message: result.message,
      data: null
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi xóa khuyến mãi',
      error: error
    });
  }
};

// ================================
// 🧮 COMBINED DISCOUNT CONTROLLERS
// ================================

// Calculate best discount
export const calculateBestDiscount = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedData = CalculateDiscountSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Yêu cầu đăng nhập'
      });
    }

    const result = await promotionServices.calculateBestDiscount(userId, validatedData);

    res.status(200).json({
      success: true,
      message: 'Tính toán giảm giá thành công',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi tính toán giảm giá',
      error: error
    });
  }
};

// Get discount analytics
export const getDiscountAnalytics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedQuery = DiscountAnalyticsSchema.parse(req.query);
    const analytics = await promotionServices.getDiscountAnalytics(validatedQuery);

    res.status(200).json({
      success: true,
      message: 'Lấy thống kê giảm giá thành công',
      data: analytics
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi lấy thống kê giảm giá',
      error: error
    });
  }
};

// ================================
// 📊 RESTAURANT SPECIFIC CONTROLLERS
// ================================

// Get restaurant vouchers
export const getRestaurantVouchers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { restaurant_id } = req.params;
    const validatedQuery = VoucherQuerySchema.parse({
      ...req.query,
      restaurant_id
    });

    const result = await promotionServices.getVouchers(validatedQuery);

    res.status(200).json({
      success: true,
      message: 'Lấy voucher nhà hàng thành công',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi lấy voucher nhà hàng',
      error: error
    });
  }
};

// Get restaurant promotions
export const getRestaurantPromotions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { restaurant_id } = req.params;
    const validatedQuery = PromotionQuerySchema.parse({
      ...req.query,
      restaurant_id
    });

    const result = await promotionServices.getPromotions(validatedQuery);

    res.status(200).json({
      success: true,
      message: 'Lấy khuyến mãi nhà hàng thành công',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi lấy khuyến mãi nhà hàng',
      error: error
    });
  }
};

// Get restaurant discount analytics
export const getRestaurantDiscountAnalytics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { restaurant_id } = req.params;
    const validatedQuery = DiscountAnalyticsSchema.parse({
      ...req.query,
      restaurant_id
    });

    const analytics = await promotionServices.getDiscountAnalytics(validatedQuery);

    res.status(200).json({
      success: true,
      message: 'Lấy thống kê giảm giá nhà hàng thành công',
      data: analytics
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi lấy thống kê giảm giá nhà hàng',
      error: error
    });
  }
};

// ================================
// 👤 CUSTOMER CONTROLLERS
// ================================

// Get customer vouchers
export const getCustomerVouchers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Yêu cầu đăng nhập'
      });
    }

    // In a real implementation, you would filter vouchers by user eligibility
    const validatedQuery = VoucherQuerySchema.parse({
      ...req.query,
      is_active: true,
      is_expired: false
    });

    const result = await promotionServices.getVouchers(validatedQuery);

    res.status(200).json({
      success: true,
      message: 'Lấy voucher khách hàng thành công',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi lấy voucher khách hàng',
      error: error
    });
  }
};

// Get customer available promotions
export const getCustomerPromotions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Yêu cầu đăng nhập'
      });
    }

    const validatedQuery = PromotionQuerySchema.parse({
      ...req.query,
      is_active: true,
      is_expired: false
    });

    const result = await promotionServices.getPromotions(validatedQuery);

    res.status(200).json({
      success: true,
      message: 'Lấy khuyến mãi khách hàng thành công',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi lấy khuyến mãi khách hàng',
      error: error
    });
  }
};

export default {
  // Voucher controllers
  createVoucher,
  getVouchers,
  getVoucherById,
  applyVoucher,
  updateVoucher,
  deleteVoucher,

  // Promotion controllers
  createPromotion,
  getPromotions,
  getPromotionById,
  checkPromotions,
  updatePromotion,
  deletePromotion,

  // Combined controllers
  calculateBestDiscount,
  getDiscountAnalytics,

  // Restaurant specific
  getRestaurantVouchers,
  getRestaurantPromotions,
  getRestaurantDiscountAnalytics,

  // Customer specific
  getCustomerVouchers,
  getCustomerPromotions
};
