import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import axios from 'axios';
import moment from 'moment';

const prisma = new PrismaClient();

// ================================
// 🎯 CORE PAYMENT SERVICES
// ================================

/**
 * Tạo payment record mới
 */
export async function createPayment(data: {
  order_id: string;
  amount: number;
  method: 'momo' | 'zalopay' | 'vnpay' | 'cash' | 'card';
  provider?: string;
  transaction_id?: string;
}) {
  try {
    const payment = await prisma.payments.create({
      data: {
        ...data,
        amount: data.amount,
        status: 'pending'
      },
      include: {
        orders: {
          include: {
            customers: true,
            restaurants: true
          }
        }
      }
    });

    return {
      success: true,
      data: payment
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi tạo payment'
    };
  }
}

/**
 * Danh sách payments (lọc + phân trang)
 */
export async function getPayments(query: {
  page?: number;
  limit?: number;
  order_id?: string;
  method?: string;
  status?: string;
  provider?: string;
  transaction_id?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: 'created_at' | 'amount' | 'status';
  sort_order?: 'asc' | 'desc';
}) {
  try {
    const {
      page = 1,
      limit = 20,
      order_id,
      method,
      status,
      provider,
      transaction_id,
      start_date,
      end_date,
      sort_by = 'created_at',
      sort_order = 'desc',
    } = query;

    const where: any = {};
    if (order_id) where.order_id = order_id;
    if (method) where.method = method;
    if (status) where.status = status;
    if (provider) where.provider = provider;
    if (transaction_id) where.transaction_id = transaction_id;
    if (start_date || end_date) {
      where.created_at = {};
      if (start_date) where.created_at.gte = new Date(start_date);
      if (end_date) where.created_at.lte = new Date(end_date);
    }

    const total = await prisma.payments.count({ where });
    const payments = await prisma.payments.findMany({
      where,
      include: {
        orders: {
          select: {
            id: true,
            order_code: true,
            final_amount: true,
          }
        }
      },
      orderBy: { [sort_by]: sort_order },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      success: true,
      data: payments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi lấy danh sách payments'
    };
  }
}

/**
 * Lấy chi tiết payment theo ID
 */
export async function getPaymentById(id: string) {
  try {
    const payment = await prisma.payments.findUnique({
      where: { id },
      include: {
        orders: {
          include: {
            customers: true,
            restaurants: true,
          }
        }
      }
    });

    if (!payment) {
      return { success: false, error: 'Payment không tồn tại' };
    }

    return { success: true, data: payment };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi lấy payment theo ID'
    };
  }
}

/**
 * Cập nhật payment (ngoài việc cập nhật status)
 */
export async function updatePaymentData(
  id: string,
  data: Partial<{
    amount: number;
    method: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
    provider: string | null;
    transaction_id: string | null;
    gateway_response: any;
  }>
) {
  try {
    const updated = await prisma.payments.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      } as any,
    });
    return { success: true, data: updated };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi cập nhật payment'
    };
  }
}

/**
 * Cập nhật trạng thái payment
 */
export async function updatePaymentStatus(
  paymentId: string,
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded',
  gatewayResponse?: any,
  transactionId?: string
) {
  try {
    const payment = await prisma.payments.update({
      where: { id: paymentId },
      data: {
        status,
        gateway_response: gatewayResponse,
        transaction_id: transactionId,
        processed_at: status === 'completed' ? new Date() : null,
        updated_at: new Date()
      },
      include: {
        orders: true
      }
    });

    // Cập nhật trạng thái order nếu payment thành công
    if (status === 'completed') {
      await prisma.orders.update({
        where: { id: payment.order_id },
        data: {
          payment_status: 'completed',
          status: 'confirmed' // Chuyển từ pending sang confirmed
        }
      });
    } else if (status === 'failed') {
      await prisma.orders.update({
        where: { id: payment.order_id },
        data: {
          payment_status: 'failed'
        }
      });
    }

    return {
      success: true,
      data: payment
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi cập nhật payment'
    };
  }
}

/**
 * Lấy payment theo order ID
 */
export async function getPaymentByOrderId(orderId: string) {
  try {
    const payments = await prisma.payments.findMany({
      where: { order_id: orderId },
      include: {
        orders: {
          include: {
            customers: true,
            restaurants: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return {
      success: true,
      data: payments
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi lấy payment'
    };
  }
}

/**
 * Lấy payment theo transaction ID
 */
export async function getPaymentByTransactionId(transactionId: string) {
  try {
    const payment = await prisma.payments.findFirst({
      where: { transaction_id: transactionId },
      include: {
        orders: {
          include: {
            customers: true,
            restaurants: true
          }
        }
      }
    });

    if (!payment) {
      throw new Error('Payment không tồn tại');
    }

    return {
      success: true,
      data: payment
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi lấy payment'
    };
  }
}

/**
 * Tạo refund
 */
export async function createRefund(paymentId: string, amount?: number, reason?: string) {
  try {
    const payment = await prisma.payments.findUnique({
      where: { id: paymentId },
      include: { orders: true }
    });

    if (!payment) {
      throw new Error('Payment không tồn tại');
    }

    if (payment.status !== 'completed') {
      throw new Error('Chỉ có thể refund payment đã hoàn thành');
    }

    const refundAmount = amount || payment.amount.toNumber();

    if (refundAmount > payment.amount.toNumber()) {
      throw new Error('Số tiền refund không thể lớn hơn số tiền gốc');
    }

    // Tạo payment record mới cho refund
    const refundPayment = await prisma.payments.create({
      data: {
        order_id: payment.order_id,
        amount: -refundAmount, // Số âm để đánh dấu refund
        method: payment.method,
        status: 'completed',
        provider: payment.provider,
        gateway_response: {
          type: 'refund',
          original_payment_id: paymentId,
          reason: reason || 'Refund by admin'
        },
        processed_at: new Date()
      }
    });

    // Cập nhật payment gốc
    await prisma.payments.update({
      where: { id: paymentId },
      data: {
        status: 'refunded',
        updated_at: new Date()
      }
    });

    return {
      success: true,
      data: refundPayment,
      message: `Refund ${refundAmount.toLocaleString('vi-VN')} VNĐ thành công`
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi tạo refund'
    };
  }
}

/**
 * Thống kê payments
 */
export async function getPaymentAnalytics(filters: {
  restaurant_id?: string;
  date_from?: string;
  date_to?: string;
  method?: string;
  status?: string;
}) {
  try {
    const { restaurant_id, date_from, date_to, method, status } = filters;

    // Build where clause
    const where: any = {};

    if (restaurant_id) {
      where.orders = {
        restaurant_id: restaurant_id
      };
    }

    if (date_from || date_to) {
      where.created_at = {};
      if (date_from) {
        where.created_at.gte = new Date(date_from);
      }
      if (date_to) {
        where.created_at.lte = new Date(date_to);
      }
    }

    if (method) {
      where.method = method;
    }

    if (status) {
      where.status = status;
    }

    // Thống kê tổng quan
    const overview = await prisma.payments.groupBy({
      by: ['status', 'method'],
      where,
      _count: {
        id: true
      },
      _sum: {
        amount: true
      }
    });

    // Tổng số tiền theo ngày
    const dailyStats = await prisma.payments.groupBy({
      by: ['status'],
      where: {
        ...where,
        created_at: {
          gte: date_from ? new Date(date_from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          lte: date_to ? new Date(date_to) : new Date()
        }
      },
      _count: {
        id: true
      },
      _sum: {
        amount: true
      }
    });

    return {
      success: true,
      data: {
        overview: overview.map(stat => ({
          status: stat.status,
          method: stat.method,
          count: stat._count.id,
          total_amount: stat._sum.amount?.toNumber() || 0
        })),
        daily_stats: dailyStats.map(stat => ({
          status: stat.status,
          count: stat._count.id,
          total_amount: stat._sum.amount?.toNumber() || 0
        }))
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi thống kê payments'
    };
  }
}

// ================================
// 🔧 HELPER FUNCTIONS
// ================================

/**
 * Generate unique order ID cho các ví điện tử
 */
export function generateOrderId(prefix: string = 'ORD'): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Validate signature cho callbacks
 */
export function validateSignature(
  data: string,
  signature: string,
  secretKey: string,
  algorithm: 'sha256' | 'md5' = 'sha256'
): boolean {
  const expectedSignature = crypto
    .createHmac(algorithm, secretKey)
    .update(data)
    .digest('hex');
  
  return signature === expectedSignature;
}

/**
 * Format amount cho các ví điện tử (số nguyên)
 */
export function formatAmount(amount: number): number {
  return Math.round(amount);
}

/**
 * Kiểm tra timeout cho payment
 */
export async function checkPaymentTimeout() {
  try {
    const timeoutMinutes = 15; // 15 phút timeout
    const timeoutDate = new Date(Date.now() - timeoutMinutes * 60 * 1000);

    const expiredPayments = await prisma.payments.findMany({
      where: {
        status: 'pending',
        created_at: {
          lt: timeoutDate
        }
      }
    });

    // Cập nhật payments hết hạn
    const updatedCount = await prisma.payments.updateMany({
      where: {
        id: {
          in: expiredPayments.map(p => p.id)
        }
      },
      data: {
        status: 'failed',
        gateway_response: {
          error: 'Payment timeout after 15 minutes'
        },
        updated_at: new Date()
      }
    });

    // Cập nhật orders tương ứng
    await prisma.orders.updateMany({
      where: {
        id: {
          in: expiredPayments.map(p => p.order_id)
        }
      },
      data: {
        payment_status: 'failed',
        status: 'cancelled'
      }
    });

    return {
      success: true,
      data: {
        expired_count: updatedCount.count
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi kiểm tra timeout'
    };
  }
}
