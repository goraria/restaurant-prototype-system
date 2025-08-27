import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';
import moment from 'moment';
import type {
  CreateOrderInput,
  UpdateOrderInput,
  OrderQueryInput,
  OrderStatsInput,
  KitchenOrderQueryInput,
  UpdateCookingStatusInput,
  BulkOrderActionInput,
  OrderAnalyticsInput
} from '../schemas/orderSchemas';

const prisma = new PrismaClient();

// ================================
// 🔧 UTILITY FUNCTIONS
// ================================

const generateOrderCode = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = randomBytes(2).toString('hex').toUpperCase();
  return `ORD${timestamp}${random}`;
};

// ================================
// 🛒 ORDER CRUD OPERATIONS
// ================================

export const createOrder = async (data: CreateOrderInput) => {
  try {
    const orderCode = generateOrderCode();

    // Calculate total_amount from items
    let total_amount = 0;
    for (const item of data.items) {
      // Get menu item price
      const menuItem = await prisma.menu_items.findUnique({
        where: { id: item.menu_item_id }
      });
      if (!menuItem) {
        return {
          success: false,
          error: `Menu item ${item.menu_item_id} không tồn tại`
        };
      }
      total_amount += Number(menuItem.price) * item.quantity;
    }

    const order = await prisma.orders.create({
      data: {
        order_code: orderCode,
        customer_id: data.customer_id,
        restaurant_id: data.restaurant_id,
        address_id: data.address_id,
        order_type: data.order_type || 'dine_in',
        status: 'pending',
        total_amount: total_amount,
        delivery_fee: data.delivery_fee || 0,
        discount_amount: data.discount_amount || 0,
        tax_amount: data.tax_amount || 0,
        final_amount: data.final_amount,
        payment_status: 'pending',
        notes: data.notes,
        estimated_time: data.estimated_time,
        order_items: {
          create: data.items.map((item: any) => ({
            menu_item_id: item.menu_item_id,
            quantity: item.quantity,
            unit_price: 0, // Will be updated with actual price
            total_price: 0, // Will be calculated
            special_instructions: item.special_instructions || null
          }))
        }
      },
      include: {
        order_items: {
          include: {
            menu_items: true
          }
        },
        customers: true,
        restaurants: true,
        addresses: true
      }
    });

    // Update order items with actual prices
    for (const orderItem of order.order_items) {
      const menuItem = await prisma.menu_items.findUnique({
        where: { id: orderItem.menu_item_id }
      });
      if (menuItem) {
        await prisma.order_items.update({
          where: { id: orderItem.id },
          data: {
            unit_price: menuItem.price,
            total_price: Number(menuItem.price) * orderItem.quantity
          }
        });
      }
    }

    // Create initial status history
    await prisma.order_status_history.create({
      data: {
        order_id: order.id,
        status: 'pending',
        changed_by_user_id: data.customer_id
      }
    });

    return {
      success: true,
      data: order
    };
  } catch (error) {
    console.error('Create Order Error:', error);
    return {
      success: false,
      error: 'Không thể tạo đơn hàng'
    };
  }
};

export const getOrderById = async (id: string) => {
  try {
    const order = await prisma.orders.findUnique({
      where: { id },
      include: {
        order_items: {
          include: {
            menu_items: true
          }
        },
        customers: true,
        restaurants: true,
        addresses: true,
        order_history: {
          orderBy: { created_at: 'desc' }
        },
        payments: true,
        reviews: true
      }
    });

    if (!order) {
      return {
        success: false,
        error: 'Đơn hàng không tồn tại'
      };
    }

    return {
      success: true,
      data: order
    };
  } catch (error) {
    console.error('Get Order By ID Error:', error);
    return {
      success: false,
      error: 'Không thể lấy thông tin đơn hàng'
    };
  }
};

export const getOrderByCode = async (orderCode: string) => {
  try {
    const order = await prisma.orders.findUnique({
      where: { order_code: orderCode },
      include: {
        order_items: {
          include: {
            menu_items: true
          }
        },
        customers: true,
        restaurants: true,
        addresses: true,
        order_history: {
          orderBy: { created_at: 'desc' }
        },
        payments: true,
        reviews: true
      }
    });

    if (!order) {
      return {
        success: false,
        error: 'Đơn hàng không tồn tại'
      };
    }

    return {
      success: true,
      data: order
    };
  } catch (error) {
    console.error('Get Order By Code Error:', error);
    return {
      success: false,
      error: 'Không thể lấy thông tin đơn hàng'
    };
  }
};

export const getOrders = async (query: OrderQueryInput) => {
  try {
    const {
      page = 1,
      limit = 10,
      customer_id,
      restaurant_id,
      status,
      payment_status,
      from_date,
      to_date,
      search_query,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = query;

    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {};

    if (customer_id) where.customer_id = customer_id;
    if (restaurant_id) where.restaurant_id = restaurant_id;
    if (status) {
      if (Array.isArray(status)) {
        where.status = { in: status };
      } else {
        where.status = status;
      }
    }
    if (payment_status) where.payment_status = payment_status;
    
    if (from_date || to_date) {
      where.created_at = {};
      if (from_date) where.created_at.gte = new Date(from_date);
      if (to_date) where.created_at.lte = new Date(to_date);
    }

    if (search_query) {
      where.OR = [
        { order_code: { contains: search_query, mode: 'insensitive' } },
        { customers: { name: { contains: search_query, mode: 'insensitive' } } },
        { customers: { email: { contains: search_query, mode: 'insensitive' } } }
      ];
    }

    // Get orders with pagination
    const [orders, total] = await Promise.all([
      prisma.orders.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort_by]: sort_order },
        include: {
          order_items: {
            include: {
              menu_items: true
            }
          },
          customers: true,
          restaurants: true,
          addresses: true,
          order_history: {
            orderBy: { created_at: 'desc' },
            take: 1
          }
        }
      }),
      prisma.orders.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);
    
    return {
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    };
  } catch (error) {
    console.error('Get Orders Error:', error);
    return {
      success: false,
      error: 'Không thể lấy danh sách đơn hàng'
    };
  }
};

export const updateOrder = async (id: string, data: UpdateOrderInput) => {
  try {
    // Check if order exists
    const existingOrder = await prisma.orders.findUnique({
      where: { id }
    });

    if (!existingOrder) {
      return {
        success: false,
        error: 'Đơn hàng không tồn tại'
      };
    }

    // Update order
    const updatedOrder = await prisma.orders.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date()
      },
      include: {
        order_items: {
          include: {
            menu_items: true
          }
        },
        customers: true,
        restaurants: true,
        addresses: true
      }
    });

    // Create status history if status changed
    if (data.status && data.status !== existingOrder.status) {
      await prisma.order_status_history.create({
        data: {
          order_id: id,
          status: data.status,
          changed_by_user_id: (data as any).updated_by || existingOrder.customer_id
        }
      });
    }

    return {
      success: true,
      data: updatedOrder
    };
  } catch (error) {
    console.error('Update Order Error:', error);
    return {
      success: false,
      error: 'Không thể cập nhật đơn hàng'
    };
  }
};

export const cancelOrder = async (id: string, reason: string, userId?: string) => {
  try {
    // Check if order exists and can be cancelled
    const existingOrder = await prisma.orders.findUnique({
      where: { id }
    });

    if (!existingOrder) {
      return {
        success: false,
        error: 'Đơn hàng không tồn tại'
      };
    }

    if (['completed', 'cancelled'].includes(existingOrder.status)) {
      return {
        success: false,
        error: 'Không thể hủy đơn hàng này'
      };
    }

    // Update order status to cancelled
    const cancelledOrder = await prisma.orders.update({
      where: { id },
      data: {
        status: 'cancelled',
        notes: existingOrder.notes 
          ? `${existingOrder.notes}\n\nLý do hủy: ${reason}`
          : `Lý do hủy: ${reason}`,
        updated_at: new Date()
      },
      include: {
        order_items: {
          include: {
            menu_items: true
          }
        },
        customers: true,
        restaurants: true,
        addresses: true
      }
    });

    // Create status history
    await prisma.order_status_history.create({
      data: {
        order_id: id,
        status: 'cancelled',
        changed_by_user_id: userId || existingOrder.customer_id,
        notes: reason
      }
    });

    return {
      success: true,
      data: cancelledOrder
    };
  } catch (error) {
    console.error('Cancel Order Error:', error);
    return {
      success: false,
      error: 'Không thể hủy đơn hàng'
    };
  }
};

// ================================
// 📊 ORDER STATISTICS & ANALYTICS
// ================================

export const getOrderStatistics = async (query: OrderStatsInput) => {
  try {
    const {
      restaurant_id,
      period = 'today',
      from_date,
      to_date
    } = query;

    // Build date range based on period
    let startDate: Date;
    let endDate: Date = new Date();

    switch (period) {
      case 'today':
        startDate = moment().startOf('day').toDate();
        break;
      case 'yesterday':
        startDate = moment().subtract(1, 'day').startOf('day').toDate();
        endDate = moment().subtract(1, 'day').endOf('day').toDate();
        break;
      case 'this_week':
        startDate = moment().startOf('week').toDate();
        break;
      case 'last_week':
        startDate = moment().subtract(1, 'week').startOf('week').toDate();
        endDate = moment().subtract(1, 'week').endOf('week').toDate();
        break;
      case 'this_month':
        startDate = moment().startOf('month').toDate();
        break;
      case 'last_month':
        startDate = moment().subtract(1, 'month').startOf('month').toDate();
        endDate = moment().subtract(1, 'month').endOf('month').toDate();
        break;
      case 'custom':
        if (!from_date || !to_date) {
          return {
            success: false,
            error: 'Vui lòng cung cấp from_date và to_date cho period custom'
          };
        }
        startDate = new Date(from_date);
        endDate = new Date(to_date);
        break;
      default:
        startDate = moment().startOf('day').toDate();
    }

    // Build where clause
    const where: any = {
      created_at: {
        gte: startDate,
        lte: endDate
      }
    };

    if (restaurant_id) where.restaurant_id = restaurant_id;

    // Get order statistics
    const [
      totalOrders,
      completedOrders,
      cancelledOrders,
      pendingOrders,
      totalRevenue,
      averageOrderValue
    ] = await Promise.all([
      prisma.orders.count({ where }),
      prisma.orders.count({ where: { ...where, status: 'completed' } }),
      prisma.orders.count({ where: { ...where, status: 'cancelled' } }),
      prisma.orders.count({ where: { ...where, status: 'pending' } }),
      prisma.orders.aggregate({
        where: { ...where, status: 'completed' },
        _sum: { final_amount: true }
      }),
      prisma.orders.aggregate({
        where: { ...where, status: 'completed' },
        _avg: { final_amount: true }
      })
    ]);

    return {
      success: true,
      data: {
        period,
        date_range: {
          from: startDate,
          to: endDate
        },
        total_orders: totalOrders,
        completed_orders: completedOrders,
        cancelled_orders: cancelledOrders,
        pending_orders: pendingOrders,
        total_revenue: totalRevenue._sum.final_amount || 0,
        average_order_value: averageOrderValue._avg.final_amount || 0,
        completion_rate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
        cancellation_rate: totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0
      }
    };
  } catch (error) {
    console.error('Get Order Stats Error:', error);
    return {
      success: false,
      error: 'Không thể lấy thống kê đơn hàng'
    };
  }
};

// ================================
// 🍳 KITCHEN MANAGEMENT
// ================================

export const getKitchenOrderList = async (query: KitchenOrderQueryInput) => {
  try {
    const {
      page = 1,
      limit = 20,
      restaurant_id,
      status = ['confirmed', 'preparing'],
      priority = 'oldest_first'
    } = query;

    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {
      status: { in: Array.isArray(status) ? status : [status] }
    };

    if (restaurant_id) where.restaurant_id = restaurant_id;

    // Determine sort order based on priority
    let orderBy: any;
    switch (priority) {
      case 'newest_first':
        orderBy = { created_at: 'desc' };
        break;
      case 'oldest_first':
      default:
        orderBy = { created_at: 'asc' };
        break;
    }

    // Get kitchen orders
    const [kitchen_orders, total] = await Promise.all([
      prisma.orders.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          order_items: {
            include: {
              menu_items: {
                select: {
                  id: true,
                  name: true,
                  preparation_time: true
                }
              }
            }
          },
          customers: {
            select: {
              id: true,
              email: true
            }
          }
        }
      }),
      prisma.orders.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);
    
    return {
      success: true,
      data: {
        kitchen_orders,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    };
  } catch (error) {
    console.error('Get Kitchen Orders Error:', error);
    return {
      success: false,
      error: 'Không thể lấy danh sách đơn hàng cho bếp'
    };
  }
};

export const updateCookingOrderStatus = async (data: UpdateCookingStatusInput) => {
  try {
    const { order_id, status, chef_id, estimated_completion_time, notes } = data;

    // Validate status transition
    const validStatusTransitions = {
      'confirmed': ['preparing'],
      'preparing': ['ready', 'confirmed'],
      'ready': ['completed', 'preparing']
    };

    const currentOrder = await prisma.orders.findUnique({
      where: { id: order_id }
    });

    if (!currentOrder) {
      return {
        success: false,
        error: 'Đơn hàng không tồn tại'
      };
    }

    const allowedStatuses = validStatusTransitions[currentOrder.status as keyof typeof validStatusTransitions];
    if (!allowedStatuses?.includes(status)) {
      return {
        success: false,
        error: `Không thể chuyển từ trạng thái ${currentOrder.status} sang ${status}`
      };
    }

    // Update order status
    const updatedOrder = await prisma.orders.update({
      where: { id: order_id },
      data: {
        status,
        estimated_time: estimated_completion_time ? parseInt(estimated_completion_time) : undefined,
        updated_at: new Date()
      },
      include: {
        order_items: {
          include: {
            menu_items: true
          }
        },
        customers: true
      }
    });

    // Create status history
    await prisma.order_status_history.create({
      data: {
        order_id,
        status,
        changed_by_user_id: chef_id || 'system',
        notes
      }
    });

    return {
      success: true,
      data: updatedOrder
    };
  } catch (error) {
    console.error('Update Cooking Status Error:', error);
    return {
      success: false,
      error: 'Không thể cập nhật trạng thái nấu ăn'
    };
  }
};

// ================================
// 🔄 BULK OPERATIONS
// ================================

export const bulkUpdateOrders = async (data: BulkOrderActionInput) => {
  try {
    const { order_ids, action, action_data } = data;

    let result;

    switch (action) {
      case 'update_status':
        if (!action_data?.status) {
          return {
            success: false,
            error: 'Thiếu thông tin status để cập nhật'
          };
        }

        result = await prisma.orders.updateMany({
          where: { id: { in: order_ids } },
          data: {
            status: action_data.status,
            updated_at: new Date()
          }
        });

        // Create status history for each order
        await Promise.all(order_ids.map(order_id =>
          prisma.order_status_history.create({
            data: {
              order_id,
              status: action_data.status!,
              changed_by_user_id: action_data.updated_by || 'system',
              notes: 'Bulk status update'
            }
          })
        ));
        break;

      case 'assign_chef':
        if (!action_data?.chef_id) {
          return {
            success: false,
            error: 'Thiếu thông tin chef_id để gán'
          };
        }

        result = await prisma.orders.updateMany({
          where: { id: { in: order_ids } },
          data: {
            updated_at: new Date()
          }
        });
        break;

      case 'set_priority':
        result = await prisma.orders.updateMany({
          where: { id: { in: order_ids } },
          data: {
            updated_at: new Date()
          }
        });
        break;

      default:
        return {
          success: false,
          error: 'Hành động không được hỗ trợ'
        };
    }

    return {
      success: true,
      data: {
        affected_orders: result.count,
        action,
        action_data
      }
    };
  } catch (error) {
    console.error('Bulk Order Actions Error:', error);
    return {
      success: false,
      error: 'Không thể thực hiện hành động hàng loạt'
    };
  }
};

// ================================
// 📈 ADVANCED ANALYTICS
// ================================

export const getOrderAnalyticsData = async (query: OrderAnalyticsInput) => {
  try {
    const {
      restaurant_id,
      from_date,
      to_date,
      group_by = 'day',
      metrics = ['revenue', 'orders']
    } = query;

    // Build date range
    const startDate = new Date(from_date);
    const endDate = new Date(to_date);

    // Build where clause
    const where: any = {
      created_at: {
        gte: startDate,
        lte: endDate
      },
      status: 'completed' // Only completed orders for analytics
    };

    if (restaurant_id) where.restaurant_id = restaurant_id;

    // Get analytics data based on grouping
    let groupByQuery: string;
    let dateFormat: string;

    switch (group_by) {
      case 'hour':
        groupByQuery = "DATE_TRUNC('hour', created_at)";
        dateFormat = 'YYYY-MM-DD HH:00';
        break;
      case 'day':
        groupByQuery = "DATE_TRUNC('day', created_at)";
        dateFormat = 'YYYY-MM-DD';
        break;
      case 'week':
        groupByQuery = "DATE_TRUNC('week', created_at)";
        dateFormat = 'YYYY-[W]WW';
        break;
      case 'month':
        groupByQuery = "DATE_TRUNC('month', created_at)";
        dateFormat = 'YYYY-MM';
        break;
      default:
        groupByQuery = "DATE_TRUNC('day', created_at)";
        dateFormat = 'YYYY-MM-DD';
    }

    // Get raw analytics data
    const analyticsData = await prisma.$queryRaw`
      SELECT 
        ${groupByQuery} as period,
        COUNT(*)::int as order_count,
        SUM(final_amount)::float as total_revenue,
        AVG(final_amount)::float as avg_order_value,
        COUNT(DISTINCT customer_id)::int as unique_customers
      FROM orders 
      WHERE created_at >= ${startDate} 
        AND created_at <= ${endDate}
        AND status = 'completed'
        ${restaurant_id ? `AND restaurant_id = '${restaurant_id}'` : ''}
      GROUP BY ${groupByQuery}
      ORDER BY period ASC
    `;

    // Format the data
    const formattedData = (analyticsData as any[]).map(row => ({
      period: moment(row.period).format(dateFormat),
      period_date: row.period,
      order_count: row.order_count,
      total_revenue: parseFloat(row.total_revenue) || 0,
      avg_order_value: parseFloat(row.avg_order_value) || 0,
      unique_customers: row.unique_customers
    }));

    // Get summary statistics
    const summary = {
      total_orders: formattedData.reduce((sum, item) => sum + item.order_count, 0),
      total_revenue: formattedData.reduce((sum, item) => sum + item.total_revenue, 0),
      avg_order_value: formattedData.length > 0 
        ? formattedData.reduce((sum, item) => sum + item.avg_order_value, 0) / formattedData.length 
        : 0,
      total_unique_customers: Math.max(...formattedData.map(item => item.unique_customers), 0)
    };

    return {
      success: true,
      data: {
        date_range: {
          from: startDate,
          to: endDate
        },
        group_by,
        metrics,
        analytics: formattedData,
        summary
      }
    };
  } catch (error) {
    console.error('Get Order Analytics Error:', error);
    return {
      success: false,
      error: 'Không thể lấy analytics đơn hàng'
    };
  }
};
