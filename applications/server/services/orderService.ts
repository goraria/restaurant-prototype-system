import { orders, order_items, Prisma } from '@prisma/client';
import { BaseService, PaginationOptions, PaginatedResult } from './baseService';

export interface CreateOrderInput {
  restaurant_id: string;
  customer_id: string;
  address_id?: string;
  order_type: 'dine_in' | 'takeaway' | 'delivery';
  delivery_fee?: number;
  discount_amount?: number;
  tax_amount?: number;
  notes?: string;
  estimated_time?: number;
  items: CreateOrderItemInput[];
}

export interface CreateOrderItemInput {
  menu_item_id: string;
  quantity: number;
  special_instructions?: string;
}

export interface UpdateOrderInput {
  status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
  payment_status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  notes?: string;
  estimated_time?: number;
}

export interface OrderFilters {
  restaurant_id?: string;
  customer_id?: string;
  status?: string[];
  order_type?: string[];
  payment_status?: string[];
  created_from?: Date;
  created_to?: Date;
  amount_from?: number;
  amount_to?: number;
}

export class orderService extends BaseService<orders> {
  protected readonly modelName = 'orders';

  /**
   * Tạo order mới
   */
  async create(data: CreateOrderInput): Promise<orders> {
    try {
      // Kiểm tra restaurant tồn tại
      const restaurant = await this.prisma.restaurants.findUnique({
        where: { id: data.restaurant_id }
      });

      if (!restaurant) {
        throw new Error('Restaurant không tồn tại');
      }

      // Kiểm tra customer tồn tại
      const customer = await this.prisma.users.findUnique({
        where: { id: data.customer_id }
      });

      if (!customer) {
        throw new Error('Customer không tồn tại');
      }

      // Kiểm tra address nếu có
      if (data.address_id) {
        const address = await this.prisma.addresses.findUnique({
          where: { id: data.address_id }
        });

        if (!address || address.user_id !== data.customer_id) {
          throw new Error('Địa chỉ không hợp lệ');
        }
      }

      // Validate và tính toán items
      let totalAmount = 0;
      const validatedItems: any[] = [];

      for (const item of data.items) {
        const menuItem = await this.prisma.menu_items.findUnique({
          where: { id: item.menu_item_id },
          include: { menus: true }
        });

        if (!menuItem) {
          throw new Error(`Menu item ${item.menu_item_id} không tồn tại`);
        }

        if (!menuItem.is_available) {
          throw new Error(`Món ${menuItem.name} hiện không có sẵn`);
        }

        if (menuItem.menus.restaurant_id !== data.restaurant_id) {
          throw new Error(`Món ${menuItem.name} không thuộc restaurant này`);
        }

        const itemTotal = Number(menuItem.price) * item.quantity;
        totalAmount += itemTotal;

        validatedItems.push({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          unit_price: menuItem.price,
          total_price: itemTotal,
          special_instructions: item.special_instructions,
          created_at: new Date()
        });
      }

      // Tính toán final amount
      const deliveryFee = data.delivery_fee || 0;
      const discountAmount = data.discount_amount || 0;
      const taxAmount = data.tax_amount || 0;
      const finalAmount = totalAmount + deliveryFee - discountAmount + taxAmount;

      // Generate order code
      const orderCode = await this.generateOrderCode();

      // Tạo order và items trong transaction
      const result = await this.prisma.$transaction(async (tx) => {
        const order = await tx.orders.create({
          data: {
            restaurant_id: data.restaurant_id,
            customer_id: data.customer_id,
            address_id: data.address_id,
            order_code: orderCode,
            order_type: data.order_type,
            total_amount: totalAmount,
            delivery_fee: deliveryFee,
            discount_amount: discountAmount,
            tax_amount: taxAmount,
            final_amount: finalAmount,
            notes: data.notes,
            estimated_time: data.estimated_time,
            created_at: new Date(),
            updated_at: new Date()
          }
        });

        // Tạo order items
        const orderItems = await Promise.all(
          validatedItems.map(item =>
            tx.order_items.create({
              data: {
                order_id: order.id,
                ...item
              }
            })
          )
        );

        // Tạo order status history
        await tx.order_status_history.create({
          data: {
            order_id: order.id,
            status: 'pending',
            notes: 'Đơn hàng được tạo',
            created_at: new Date()
          }
        });

        return { order, orderItems };
      });

      // Return order với details
      return this.findById(result.order.id) as Promise<orders>;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Lấy order theo ID
   */
  async findById(id: string): Promise<orders | null> {
    if (!this.validateUUID(id)) {
      throw new Error('ID không hợp lệ');
    }

    try {
      const order = await this.prisma.orders.findUnique({
        where: { id },
        include: {
          restaurants: {
            select: { id: true, name: true, address: true, phone_number: true }
          },
          customers: {
            select: { id: true, first_name: true, last_name: true, email: true, phone_number: true }
          },
          addresses: true,
          order_items: {
            include: {
              menu_items: {
                select: { id: true, name: true, description: true, image_url: true }
              }
            },
            orderBy: { created_at: 'asc' }
          },
          order_history: {
            include: {
              users: {
                select: { id: true, first_name: true, last_name: true }
              }
            },
            orderBy: { created_at: 'desc' }
          },
          payments: {
            orderBy: { created_at: 'desc' }
          }
        }
      });

      return order;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Lấy order theo code
   */
  async findByCode(orderCode: string): Promise<orders | null> {
    try {
      const order = await this.prisma.orders.findUnique({
        where: { order_code: orderCode },
        include: {
          restaurants: {
            select: { id: true, name: true, address: true, phone_number: true }
          },
          customers: {
            select: { id: true, first_name: true, last_name: true, email: true, phone_number: true }
          },
          addresses: true,
          order_items: {
            include: {
              menu_items: {
                select: { id: true, name: true, description: true, image_url: true }
              }
            }
          }
        }
      });

      return order;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Cập nhật order
   */
  async update(id: string, data: UpdateOrderInput, userId?: string): Promise<orders> {
    if (!this.validateUUID(id)) {
      throw new Error('ID không hợp lệ');
    }

    if (!(await this.exists(id))) {
      throw new Error('Không tìm thấy order');
    }

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const order = await tx.orders.update({
          where: { id },
          data: {
            ...data,
            updated_at: new Date()
          }
        });

        // Tạo history record nếu có thay đổi status
        if (data.status) {
          await tx.order_status_history.create({
            data: {
              order_id: id,
              status: data.status,
              changed_by_user_id: userId,
              notes: `Trạng thái đổi thành ${data.status}`,
              created_at: new Date()
            }
          });
        }

        return order;
      });

      return this.findById(result.id) as Promise<orders>;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Hủy order
   */
  async cancel(id: string, reason: string, userId?: string): Promise<orders> {
    if (!this.validateUUID(id)) {
      throw new Error('ID không hợp lệ');
    }

    const order = await this.findById(id);
    if (!order) {
      throw new Error('Không tìm thấy order');
    }

    if (['completed', 'cancelled'].includes(order.status)) {
      throw new Error('Không thể hủy order này');
    }

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const updatedOrder = await tx.orders.update({
          where: { id },
          data: {
            status: 'cancelled',
            updated_at: new Date()
          }
        });

        await tx.order_status_history.create({
          data: {
            order_id: id,
            status: 'cancelled',
            changed_by_user_id: userId,
            notes: `Hủy đơn: ${reason}`,
            created_at: new Date()
          }
        });

        return updatedOrder;
      });

      return this.findById(result.id) as Promise<orders>;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Lấy danh sách orders có phân trang và filter
   */
  async findMany(
    filters: OrderFilters = {},
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<orders>> {
    const { page, limit, skip, sortBy, sortOrder } = this.parsePaginationOptions(options);
    const where = this.buildWhereClause(filters);

    // Handle amount range filters
    if (filters.amount_from || filters.amount_to) {
      where.final_amount = {};
      if (filters.amount_from) {
        where.final_amount.gte = filters.amount_from;
      }
      if (filters.amount_to) {
        where.final_amount.lte = filters.amount_to;
      }
      delete where.amount_from;
      delete where.amount_to;
    }

    try {
      const [orders, total] = await Promise.all([
        this.prisma.orders.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            restaurants: {
              select: { id: true, name: true }
            },
            customers: {
              select: { id: true, first_name: true, last_name: true, email: true }
            },
            _count: {
              select: { order_items: true }
            }
          }
        }),
        this.prisma.orders.count({ where })
      ]);

      return this.createPaginatedResult(orders, total, page, limit);
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Lấy orders theo restaurant
   */
  async findByRestaurant(
    restaurantId: string,
    filters: Omit<OrderFilters, 'restaurant_id'> = {},
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<orders>> {
    return this.findMany({ ...filters, restaurant_id: restaurantId }, options);
  }

  /**
   * Lấy orders theo customer
   */
  async findByCustomer(
    customerId: string,
    filters: Omit<OrderFilters, 'customer_id'> = {},
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<orders>> {
    return this.findMany({ ...filters, customer_id: customerId }, options);
  }

  /**
   * Cập nhật cooking status của order item
   */
  async updateItemCookingStatus(
    itemId: string,
    status: 'pending' | 'preparing' | 'ready' | 'served',
    userId?: string
  ): Promise<void> {
    if (!this.validateUUID(itemId)) {
      throw new Error('ID không hợp lệ');
    }

    try {
      const updateData: any = {
        cooking_status: status,
        updated_at: new Date()
      };

      if (status === 'ready') {
        updateData.prepared_at = new Date();
      } else if (status === 'served') {
        updateData.served_at = new Date();
      }

      await this.prisma.order_items.update({
        where: { id: itemId },
        data: updateData
      });
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Lấy thống kê orders
   */
  async getStats(restaurantId?: string): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
    todayOrders: number;
    todayRevenue: number;
    averageOrderValue: number;
  }> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const whereClause = restaurantId ? { restaurant_id: restaurantId } : {};

      const [total, byStatus, byType, todayOrders, todayRevenue, avgOrderValue] = await Promise.all([
        this.prisma.orders.count({ where: whereClause }),
        this.prisma.orders.groupBy({
          by: ['status'],
          _count: { status: true },
          where: whereClause
        }),
        this.prisma.orders.groupBy({
          by: ['order_type'],
          _count: { order_type: true },
          where: whereClause
        }),
        this.prisma.orders.count({
          where: { ...whereClause, created_at: { gte: today, lt: tomorrow } }
        }),
        this.prisma.orders.aggregate({
          _sum: { final_amount: true },
          where: { ...whereClause, created_at: { gte: today, lt: tomorrow } }
        }),
        this.prisma.orders.aggregate({
          _avg: { final_amount: true },
          where: whereClause
        })
      ]);

      return {
        total,
        byStatus: Object.fromEntries(byStatus.map(item => [item.status, item._count.status])),
        byType: Object.fromEntries(byType.map(item => [item.order_type, item._count.order_type])),
        todayOrders,
        todayRevenue: Number(todayRevenue._sum.final_amount || 0),
        averageOrderValue: Number(avgOrderValue._avg.final_amount || 0)
      };
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Generate unique order code
   */
  private async generateOrderCode(): Promise<string> {
    const prefix = 'ORD';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const code = `${prefix}${timestamp}${random}`;

    // Kiểm tra unique
    const existing = await this.prisma.orders.findUnique({
      where: { order_code: code }
    });

    if (existing) {
      return this.generateOrderCode(); // Recursive retry
    }

    return code;
  }
}
