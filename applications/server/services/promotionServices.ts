import { PrismaClient } from '@prisma/client';
import type {
  CreateVoucherRequest,
  CreatePromotionRequest,
  UpdateVoucherRequest,
  UpdatePromotionRequest,
  VoucherQueryRequest,
  PromotionQueryRequest,
  ApplyVoucherRequest,
  CheckPromotionsRequest,
  CalculateDiscountRequest,
  BulkVoucherActionRequest,
  BulkPromotionActionRequest,
  DiscountAnalyticsRequest
} from '@/schemas/promotionSchemas';

const prisma = new PrismaClient();

// ================================
// 🎟️ VOUCHER SERVICES
// ================================

// Create voucher
export const createVoucher = async (data: CreateVoucherRequest) => {
  try {
    // Check if code already exists
    const existingVoucher = await prisma.vouchers.findUnique({
      where: { code: data.code }
    });

    if (existingVoucher) {
      throw new Error('Mã voucher đã tồn tại');
    }

    // Validate dates
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);

    if (endDate <= startDate) {
      throw new Error('Ngày kết thúc phải sau ngày bắt đầu');
    }

    // Validate discount value
    if (data.discount_type === 'percentage' && data.discount_value > 100) {
      throw new Error('Phần trăm giảm giá không được quá 100%');
    }

    const voucher = await prisma.vouchers.create({
      data: {
        ...data,
        start_date: startDate,
        end_date: endDate
      }
    });

    return voucher;
  } catch (error) {
    throw error;
  }
};

// Get vouchers with filters
export const getVouchers = async (params: VoucherQueryRequest) => {
  try {
    const {
      restaurant_id,
      code,
      discount_type,
      is_active,
      is_expired,
      sort_by,
      sort_order,
      page,
      limit
    } = params;

    const skip = (page - 1) * limit;
    const now = new Date();

    // Build where clause
    const where: any = {};

    if (restaurant_id) where.restaurant_id = restaurant_id;
    if (code) where.code = { contains: code, mode: 'insensitive' };
    if (discount_type) where.discount_type = discount_type;
    if (is_active !== undefined) where.is_active = is_active;
    
    if (is_expired !== undefined) {
      if (is_expired) {
        where.end_date = { lt: now };
      } else {
        where.end_date = { gte: now };
      }
    }

    const [vouchers, total] = await Promise.all([
      prisma.vouchers.findMany({
        where,
        include: {
          restaurants: {
            select: {
              id: true,
              name: true,
              logo_url: true
            }
          },
          usages: {
            select: {
              id: true,
              used_at: true,
              users: {
                select: {
                  full_name: true
                }
              }
            },
            orderBy: { used_at: 'desc' },
            take: 5
          }
        },
        orderBy: {
          [sort_by]: sort_order
        },
        skip,
        take: limit
      }),
      prisma.vouchers.count({ where })
    ]);

    // Add computed fields
    const vouchersWithStats = vouchers.map(voucher => ({
      ...voucher,
      is_expired: voucher.end_date < now,
      is_valid: voucher.is_active && voucher.end_date >= now,
      usage_rate: voucher.usage_limit 
        ? (voucher.used_count / voucher.usage_limit) * 100 
        : 0,
      remaining_uses: voucher.usage_limit 
        ? Math.max(0, voucher.usage_limit - voucher.used_count)
        : null
    }));

    return {
      vouchers: vouchersWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw error;
  }
};

// Apply voucher to order
export const applyVoucher = async (userId: string, data: ApplyVoucherRequest) => {
  try {
    const { voucher_code, order_total, restaurant_id } = data;
    const now = new Date();

    // Find voucher
    const voucher = await prisma.vouchers.findUnique({
      where: { code: voucher_code },
      include: {
        usages: {
          where: { user_id: userId }
        }
      }
    });

    if (!voucher) {
      throw new Error('Mã voucher không tồn tại');
    }

    // Validation checks
    if (!voucher.is_active) {
      throw new Error('Voucher đã bị vô hiệu hóa');
    }

    if (voucher.start_date > now) {
      throw new Error('Voucher chưa có hiệu lực');
    }

    if (voucher.end_date < now) {
      throw new Error('Voucher đã hết hạn');
    }

    if (voucher.restaurant_id && voucher.restaurant_id !== restaurant_id) {
      throw new Error('Voucher không áp dụng cho nhà hàng này');
    }

    if (voucher.usage_limit && voucher.used_count >= voucher.usage_limit) {
      throw new Error('Voucher đã hết lượt sử dụng');
    }

    if (voucher.min_order_value && order_total < Number(voucher.min_order_value)) {
      throw new Error(`Đơn hàng tối thiểu ${voucher.min_order_value.toLocaleString()}đ`);
    }

    // Calculate discount
    let discountAmount = 0;
    if (voucher.discount_type === 'percentage') {
      discountAmount = (order_total * Number(voucher.discount_value)) / 100;
    } else {
      discountAmount = Number(voucher.discount_value);
    }

    // Apply max discount limit
    if (voucher.max_discount && discountAmount > Number(voucher.max_discount)) {
      discountAmount = Number(voucher.max_discount);
    }

    // Ensure discount doesn't exceed order total
    discountAmount = Math.min(discountAmount, order_total);

    return {
      voucher_id: voucher.id,
      voucher_code: voucher.code,
      voucher_name: voucher.name,
      discount_type: voucher.discount_type,
      discount_value: voucher.discount_value,
      discount_amount: discountAmount,
      final_amount: order_total - discountAmount,
      is_valid: true
    };
  } catch (error) {
    throw error;
  }
};

// ================================
// 🎯 PROMOTION SERVICES
// ================================

// Create promotion
export const createPromotion = async (data: CreatePromotionRequest) => {
  try {
    // Validate dates
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);

    if (endDate <= startDate) {
      throw new Error('Ngày kết thúc phải sau ngày bắt đầu');
    }

    // Validate discount value
    if (data.type === 'percentage' && data.discount_value > 100) {
      throw new Error('Phần trăm giảm giá không được quá 100%');
    }

    const promotion = await prisma.promotions.create({
      data: {
        ...data,
        start_date: startDate,
        end_date: endDate
      },
      include: {
        restaurants: {
          select: {
            id: true,
            name: true,
            logo_url: true
          }
        }
      }
    });

    return promotion;
  } catch (error) {
    throw error;
  }
};

// Get promotions with filters
export const getPromotions = async (params: PromotionQueryRequest) => {
  try {
    const {
      restaurant_id,
      type,
      is_active,
      is_expired,
      applicable_to_item,
      sort_by,
      sort_order,
      page,
      limit
    } = params;

    const skip = (page - 1) * limit;
    const now = new Date();

    // Build where clause
    const where: any = {};

    if (restaurant_id) where.restaurant_id = restaurant_id;
    if (type) where.type = type;
    if (is_active !== undefined) where.is_active = is_active;
    if (applicable_to_item) {
      where.applicable_items = {
        has: applicable_to_item
      };
    }
    
    if (is_expired !== undefined) {
      if (is_expired) {
        where.end_date = { lt: now };
      } else {
        where.end_date = { gte: now };
      }
    }

    const [promotions, total] = await Promise.all([
      prisma.promotions.findMany({
        where,
        include: {
          restaurants: {
            select: {
              id: true,
              name: true,
              logo_url: true
            }
          }
        },
        orderBy: {
          [sort_by]: sort_order
        },
        skip,
        take: limit
      }),
      prisma.promotions.count({ where })
    ]);

    // Add computed fields
    const promotionsWithStats = promotions.map(promotion => ({
      ...promotion,
      is_expired: promotion.end_date < now,
      is_valid: promotion.is_active && promotion.end_date >= now,
      applicable_items_count: promotion.applicable_items.length
    }));

    return {
      promotions: promotionsWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw error;
  }
};

// Check applicable promotions for order
export const checkPromotions = async (data: CheckPromotionsRequest) => {
  try {
    const { restaurant_id, order_total, order_type, customer_id, menu_items, order_time } = data;
    const checkTime = order_time ? new Date(order_time) : new Date();

    // Get active promotions for restaurant
    const promotions = await prisma.promotions.findMany({
      where: {
        restaurant_id,
        is_active: true,
        start_date: { lte: checkTime },
        end_date: { gte: checkTime }
      }
    });

    const applicablePromotions = [];

    for (const promotion of promotions) {
      let isApplicable = true;
      let discountAmount = 0;

      // Check conditions
      if (promotion.conditions) {
        const conditions = promotion.conditions as any;

        // Check minimum order value
        if (conditions.min_order_value && order_total < conditions.min_order_value) {
          isApplicable = false;
          continue;
        }

        // Check minimum quantity
        if (conditions.min_quantity) {
          const totalQuantity = menu_items.reduce((sum, item) => sum + item.quantity, 0);
          if (totalQuantity < conditions.min_quantity) {
            isApplicable = false;
            continue;
          }
        }

        // Check order type
        if (conditions.order_type && conditions.order_type !== order_type) {
          isApplicable = false;
          continue;
        }

        // Check day of week
        if (conditions.day_of_week) {
          const dayOfWeek = checkTime.getDay();
          if (!conditions.day_of_week.includes(dayOfWeek)) {
            isApplicable = false;
            continue;
          }
        }
      }

      // Check time restrictions
      if (promotion.time_restrictions) {
        const timeRestrictions = promotion.time_restrictions as any;

        // Check time of day
        if (timeRestrictions.start_time && timeRestrictions.end_time) {
          const currentTime = checkTime.toTimeString().slice(0, 5);
          if (currentTime < timeRestrictions.start_time || currentTime > timeRestrictions.end_time) {
            isApplicable = false;
            continue;
          }
        }

        // Check days of week
        if (timeRestrictions.days_of_week) {
          const dayOfWeek = checkTime.getDay();
          if (!timeRestrictions.days_of_week.includes(dayOfWeek)) {
            isApplicable = false;
            continue;
          }
        }
      }

      // Check applicable items
      if (promotion.applicable_items.length > 0) {
        const hasApplicableItems = menu_items.some(item => 
          promotion.applicable_items.includes(item.id)
        );
        if (!hasApplicableItems) {
          isApplicable = false;
          continue;
        }
      }

      // Calculate discount
      if (isApplicable) {
        switch (promotion.type) {
          case 'percentage':
            if (promotion.applicable_items.length > 0) {
              // Apply to specific items only
              const applicableTotal = menu_items
                .filter(item => promotion.applicable_items.includes(item.id))
                .reduce((sum, item) => sum + (item.price * item.quantity), 0);
              discountAmount = (applicableTotal * Number(promotion.discount_value)) / 100;
            } else {
              // Apply to entire order
              discountAmount = (order_total * Number(promotion.discount_value)) / 100;
            }
            break;
          case 'fixed_amount':
            discountAmount = Number(promotion.discount_value);
            break;
          case 'buy_one_get_one':
            // Calculate BOGO discount for applicable items
            menu_items
              .filter(item => promotion.applicable_items.includes(item.id))
              .forEach(item => {
                const freeItems = Math.floor(item.quantity / 2);
                discountAmount += freeItems * item.price;
              });
            break;
          default:
            discountAmount = Number(promotion.discount_value);
        }

        applicablePromotions.push({
          promotion_id: promotion.id,
          promotion_name: promotion.name,
          promotion_type: promotion.type,
          discount_amount: discountAmount,
          description: promotion.description
        });
      }
    }

    return applicablePromotions;
  } catch (error) {
    throw error;
  }
};

// ================================
// 🧮 COMBINED DISCOUNT SERVICES
// ================================

// Calculate best discount (voucher vs promotions)
export const calculateBestDiscount = async (userId: string, data: CalculateDiscountRequest) => {
  try {
    const discounts = [];

    // Check voucher if provided
    if (data.voucher_code) {
      try {
        const voucherDiscount = await applyVoucher(userId, {
          voucher_code: data.voucher_code,
          order_total: data.order_total,
          restaurant_id: data.restaurant_id,
          menu_items: data.menu_items
        });
        discounts.push({
          type: 'voucher',
          ...voucherDiscount
        });
      } catch (error) {
        // Continue to check promotions even if voucher fails
      }
    }

    // Check applicable promotions
    const promotions = await checkPromotions({
      restaurant_id: data.restaurant_id,
      order_total: data.order_total,
      order_type: data.order_type,
      customer_id: data.customer_id,
      menu_items: data.menu_items,
      order_time: data.order_time
    });

    promotions.forEach(promotion => {
      discounts.push({
        type: 'promotion',
        discount_amount: promotion.discount_amount,
        final_amount: data.order_total - promotion.discount_amount,
        promotion_id: promotion.promotion_id,
        promotion_name: promotion.promotion_name,
        promotion_type: promotion.promotion_type,
        description: promotion.description
      });
    });

    // Find best discount
    const bestDiscount = discounts.reduce((best, current) => {
      return current.discount_amount > best.discount_amount ? current : best;
    }, { discount_amount: 0, final_amount: data.order_total });

    return {
      all_discounts: discounts,
      best_discount: bestDiscount,
      savings: bestDiscount.discount_amount
    };
  } catch (error) {
    throw error;
  }
};

// Update voucher
export const updateVoucher = async (voucherId: string, data: UpdateVoucherRequest) => {
  try {
    const voucher = await prisma.vouchers.findUnique({
      where: { id: voucherId }
    });

    if (!voucher) {
      throw new Error('Voucher không tồn tại');
    }

    const updatedVoucher = await prisma.vouchers.update({
      where: { id: voucherId },
      data: {
        ...data,
        start_date: data.start_date ? new Date(data.start_date) : undefined,
        end_date: data.end_date ? new Date(data.end_date) : undefined
      }
    });

    return updatedVoucher;
  } catch (error) {
    throw error;
  }
};

// Update promotion
export const updatePromotion = async (promotionId: string, data: UpdatePromotionRequest) => {
  try {
    const promotion = await prisma.promotions.findUnique({
      where: { id: promotionId }
    });

    if (!promotion) {
      throw new Error('Khuyến mãi không tồn tại');
    }

    const updatedPromotion = await prisma.promotions.update({
      where: { id: promotionId },
      data: {
        ...data,
        start_date: data.start_date ? new Date(data.start_date) : undefined,
        end_date: data.end_date ? new Date(data.end_date) : undefined
      }
    });

    return updatedPromotion;
  } catch (error) {
    throw error;
  }
};

// Delete voucher
export const deleteVoucher = async (voucherId: string) => {
  try {
    await prisma.vouchers.delete({
      where: { id: voucherId }
    });

    return { message: 'Xóa voucher thành công' };
  } catch (error) {
    throw error;
  }
};

// Delete promotion
export const deletePromotion = async (promotionId: string) => {
  try {
    await prisma.promotions.delete({
      where: { id: promotionId }
    });

    return { message: 'Xóa khuyến mãi thành công' };
  } catch (error) {
    throw error;
  }
};

// Get discount analytics
export const getDiscountAnalytics = async (params: DiscountAnalyticsRequest) => {
  try {
    const { restaurant_id, period, type, date_from, date_to } = params;

    // Calculate date range
    let startDate: Date;
    let endDate = new Date();

    if (date_from && date_to) {
      startDate = new Date(date_from);
      endDate = new Date(date_to);
    } else {
      switch (period) {
        case '7d':
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '1y':
          startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date('2020-01-01');
      }
    }

    const where: any = {
      created_at: {
        gte: startDate,
        lte: endDate
      }
    };

    if (restaurant_id) where.restaurant_id = restaurant_id;

    // Get voucher analytics
    let voucherStats = null;
    if (type === 'vouchers' || type === 'both') {
      const [voucherCount, voucherUsages] = await Promise.all([
        prisma.vouchers.count({ where }),
        prisma.voucher_usages.findMany({
          where: {
            used_at: {
              gte: startDate,
              lte: endDate
            },
            ...(restaurant_id && {
              vouchers: { restaurant_id }
            })
          },
          include: {
            vouchers: true
          }
        })
      ]);

      voucherStats = {
        total_vouchers: voucherCount,
        total_usage: voucherUsages.length,
        total_savings: voucherUsages.reduce((sum, usage) => {
          // Calculate savings based on voucher type
          return sum + 0; // This would need order data to calculate properly
        }, 0)
      };
    }

    // Get promotion analytics
    let promotionStats = null;
    if (type === 'promotions' || type === 'both') {
      const promotionCount = await prisma.promotions.count({ where });

      promotionStats = {
        total_promotions: promotionCount
      };
    }

    return {
      period: {
        start_date: startDate,
        end_date: endDate,
        type: period || 'custom'
      },
      voucher_stats: voucherStats,
      promotion_stats: promotionStats
    };
  } catch (error) {
    throw error;
  }
};

export default {
  // Voucher services
  createVoucher,
  getVouchers,
  applyVoucher,
  updateVoucher,
  deleteVoucher,

  // Promotion services
  createPromotion,
  getPromotions,
  checkPromotions,
  updatePromotion,
  deletePromotion,

  // Combined services
  calculateBestDiscount,
  getDiscountAnalytics
};
