import { PrismaClient } from '@prisma/client';
import { 
  CreateVoucher, 
  UpdateVoucher, 
  VoucherQuery, 
  ApplyVoucher,
  VoucherValidationResult,
  Voucher
} from '@/schemas/voucherSchemas';

const prisma = new PrismaClient();

// Helper function to convert Prisma voucher to our schema format
const formatVoucher = (voucher: any): Voucher => {
  return {
    ...voucher,
    discount_value: Number(voucher.discount_value),
    min_order_value: voucher.min_order_value ? Number(voucher.min_order_value) : null,
    max_discount: voucher.max_discount ? Number(voucher.max_discount) : null,
  };
};

/**
 * Create a new voucher
 */
export const createVoucher = async (data: CreateVoucher): Promise<Voucher> => {
  try {
    // Check if voucher code already exists
    const existingVoucher = await prisma.vouchers.findUnique({
      where: { code: data.code }
    });

    if (existingVoucher) {
      throw new Error('Voucher code already exists');
    }

    // Validate restaurant exists if restaurant_id is provided
    if (data.restaurant_id) {
      const restaurant = await prisma.restaurants.findUnique({
        where: { id: data.restaurant_id }
      });

      if (!restaurant) {
        throw new Error('Restaurant not found');
      }
    }

    const voucher = await prisma.vouchers.create({
      data: {
        ...data,
        min_order_value: data.min_order_value,
        max_discount: data.max_discount,
      },
      include: {
        restaurants: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return formatVoucher(voucher);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create voucher: ${error.message}`);
    }
    throw new Error('Failed to create voucher');
  }
};

/**
 * Get voucher by ID
 */
export const getVoucherById = async (id: string): Promise<Voucher | null> => {
  try {
    const voucher = await prisma.vouchers.findUnique({
      where: { id },
      include: {
        restaurants: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return voucher ? formatVoucher(voucher) : null;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get voucher: ${error.message}`);
    }
    throw new Error('Failed to get voucher');
  }
};

/**
 * Get voucher by code
 */
export const getVoucherByCode = async (code: string): Promise<Voucher | null> => {
  try {
    const voucher = await prisma.vouchers.findUnique({
      where: { code },
      include: {
        restaurants: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return voucher ? formatVoucher(voucher) : null;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get voucher by code: ${error.message}`);
    }
    throw new Error('Failed to get voucher by code');
  }
};

/**
 * Get all vouchers with filtering and pagination
 */
export const getVouchers = async (query: VoucherQuery) => {
  try {
    const {
      restaurant_id,
      is_active,
      discount_type,
      code,
      page = 1,
      limit = 10,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = query;

    const where: any = {};

    if (restaurant_id) {
      where.restaurant_id = restaurant_id;
    }

    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    if (discount_type) {
      where.discount_type = discount_type;
    }

    if (code) {
      where.code = {
        contains: code,
        mode: 'insensitive'
      };
    }

    const total = await prisma.vouchers.count({ where });

    const vouchers = await prisma.vouchers.findMany({
      where,
      include: {
        restaurants: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        [sort_by]: sort_order
      },
      skip: (page - 1) * limit,
      take: limit
    });

    const totalPages = Math.ceil(total / limit);

    return {
      vouchers: vouchers.map(formatVoucher),
      total,
      page,
      limit,
      totalPages
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get vouchers: ${error.message}`);
    }
    throw new Error('Failed to get vouchers');
  }
};

/**
 * Update voucher
 */
export const updateVoucher = async (id: string, data: UpdateVoucher): Promise<Voucher> => {
  try {
    // Check if voucher exists
    const existingVoucher = await prisma.vouchers.findUnique({
      where: { id }
    });

    if (!existingVoucher) {
      throw new Error('Voucher not found');
    }

    // Check if new code already exists (if code is being updated)
    if (data.code && data.code !== existingVoucher.code) {
      const codeExists = await prisma.vouchers.findUnique({
        where: { code: data.code }
      });

      if (codeExists) {
        throw new Error('Voucher code already exists');
      }
    }

    // Validate restaurant exists if restaurant_id is provided
    if (data.restaurant_id) {
      const restaurant = await prisma.restaurants.findUnique({
        where: { id: data.restaurant_id }
      });

      if (!restaurant) {
        throw new Error('Restaurant not found');
      }
    }

    const voucher = await prisma.vouchers.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date()
      },
      include: {
        restaurants: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return formatVoucher(voucher);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update voucher: ${error.message}`);
    }
    throw new Error('Failed to update voucher');
  }
};

/**
 * Delete voucher (soft delete by setting is_active to false)
 */
export const deleteVoucher = async (id: string): Promise<void> => {
  try {
    const existingVoucher = await prisma.vouchers.findUnique({
      where: { id },
      include: {
        usages: true
      }
    });

    if (!existingVoucher) {
      throw new Error('Voucher not found');
    }

    // Check if voucher is currently being used
    if (existingVoucher.usages.length > 0) {
      // Soft delete only
      await prisma.vouchers.update({
        where: { id },
        data: { 
          is_active: false,
          updated_at: new Date()
        }
      });
    } else {
      // Can hard delete if no usages
      await prisma.vouchers.delete({
        where: { id }
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete voucher: ${error.message}`);
    }
    throw new Error('Failed to delete voucher');
  }
};

/**
 * Validate voucher for order
 */
export const validateVoucher = async (data: ApplyVoucher): Promise<VoucherValidationResult> => {
  try {
    const voucher = await prisma.vouchers.findUnique({
      where: { code: data.code }
    });

    if (!voucher) {
      return {
        is_valid: false,
        voucher: null,
        discount_amount: 0,
        final_amount: data.order_value,
        error_message: 'Voucher not found'
      };
    }

    if (!voucher.is_active) {
      return {
        is_valid: false,
        voucher: null,
        discount_amount: 0,
        final_amount: data.order_value,
        error_message: 'Voucher is not active'
      };
    }

    const now = new Date();
    if (now < voucher.start_date) {
      return {
        is_valid: false,
        voucher: null,
        discount_amount: 0,
        final_amount: data.order_value,
        error_message: 'Voucher is not yet valid'
      };
    }

    if (now > voucher.end_date) {
      return {
        is_valid: false,
        voucher: null,
        discount_amount: 0,
        final_amount: data.order_value,
        error_message: 'Voucher has expired'
      };
    }

    if (voucher.usage_limit && voucher.used_count >= voucher.usage_limit) {
      return {
        is_valid: false,
        voucher: null,
        discount_amount: 0,
        final_amount: data.order_value,
        error_message: 'Voucher usage limit reached'
      };
    }

    if (voucher.restaurant_id && voucher.restaurant_id !== data.restaurant_id) {
      return {
        is_valid: false,
        voucher: null,
        discount_amount: 0,
        final_amount: data.order_value,
        error_message: 'Voucher is not valid for this restaurant'
      };
    }

    const minOrderValue = Number(voucher.min_order_value || 0);
    if (data.order_value < minOrderValue) {
      return {
        is_valid: false,
        voucher: null,
        discount_amount: 0,
        final_amount: data.order_value,
        error_message: `Minimum order value is ${minOrderValue}`
      };
    }

    // Calculate discount
    let discountAmount = 0;
    const discountValue = Number(voucher.discount_value);

    if (voucher.discount_type === 'percentage') {
      discountAmount = (data.order_value * discountValue) / 100;
      
      // Apply max discount if specified
      const maxDiscount = Number(voucher.max_discount || 0);
      if (maxDiscount > 0 && discountAmount > maxDiscount) {
        discountAmount = maxDiscount;
      }
    } else {
      // Fixed amount discount
      discountAmount = Math.min(discountValue, data.order_value);
    }

    const finalAmount = data.order_value - discountAmount;

    return {
      is_valid: true,
      voucher: formatVoucher(voucher),
      discount_amount: discountAmount,
      final_amount: finalAmount,
      error_message: null
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to validate voucher: ${error.message}`);
    }
    throw new Error('Failed to validate voucher');
  }
};

/**
 * Apply voucher to order (increment usage count)
 */
export const applyVoucher = async (code: string, user_id: string): Promise<void> => {
  try {
    const voucher = await prisma.vouchers.findUnique({
      where: { code }
    });

    if (!voucher) {
      throw new Error('Voucher not found');
    }

    await prisma.$transaction(async (tx) => {
      // Increment usage count
      await tx.vouchers.update({
        where: { code },
        data: {
          used_count: {
            increment: 1
          },
          updated_at: new Date()
        }
      });

      // Create usage record
      await tx.voucher_usages.create({
        data: {
          voucher_id: voucher.id,
          user_id,
          used_at: new Date()
        }
      });
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to apply voucher: ${error.message}`);
    }
    throw new Error('Failed to apply voucher');
  }
};

/**
 * Get voucher usage statistics
 */
export const getVoucherStats = async (id: string) => {
  try {
    const voucher = await prisma.vouchers.findUnique({
      where: { id },
      include: {
        usages: true
      }
    });

    if (!voucher) {
      throw new Error('Voucher not found');
    }

    return {
      voucher: formatVoucher(voucher),
      total_uses: voucher.usages.length,
      usage_percentage: voucher.usage_limit 
        ? (voucher.used_count / voucher.usage_limit) * 100 
        : null
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get voucher stats: ${error.message}`);
    }
    throw new Error('Failed to get voucher stats');
  }
};
