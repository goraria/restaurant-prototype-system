import { PrismaClient, tables, reservations, table_orders } from '@prisma/client';
import { 
  CreateTable, 
  UpdateTable, 
  TableQuery,
  CreateReservation, 
  UpdateReservation, 
  ReservationQuery,
  CreateTableOrder, 
  UpdateTableOrder, 
  TableOrderQuery,
  TableAvailability,
  UpdateTableStatus,
  GenerateQRCode,
  ConfirmReservation,
  TableCheckIn,
  TableStatsQuery,
  ReservationStatsQuery
} from '@/schemas/tableSchemas';
import { validate } from 'uuid';

const prisma = new PrismaClient();

// ================================
// 🔧 HELPER FUNCTIONS
// ================================

// const validateUUID = (id: string): boolean => {
//   const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
//   return uuidRegex.test(id);
// };

const generateSessionCode = (): string => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

// ================================
// 🪑 TABLE SERVICES
// ================================

export async function getAllTable() {
  try {
    const tables = await prisma.tables.findMany({
      include: {
        restaurants: {
          select: {
            id: true,
            name: true,
            code: true,
          }
        },
        _count: {
          select: {
            reservations: true,
            table_orders: true,
          }
        }
      },
    })

    if (!tables) return

    return tables
  } catch (error) {
    throw new Error(`Lỗi khi lấy danh sách bàn: ${error}`);
  }
}

// Tạo bàn mới
export const createTable = async (data: CreateTable) => {
  try {
    // Kiểm tra nhà hàng tồn tại
    const restaurant = await prisma.restaurants.findUnique({
      where: { id: data.restaurant_id }
    });

    if (!restaurant) {
      throw new Error('Nhà hàng không tồn tại');
    }

    // Kiểm tra số bàn đã tồn tại trong nhà hàng
    const existingTable = await prisma.tables.findUnique({
      where: {
        restaurant_id_table_number: {
          restaurant_id: data.restaurant_id,
          table_number: data.table_number
        }
      }
    });

    if (existingTable) {
      throw new Error(`Số bàn ${data.table_number} đã tồn tại trong nhà hàng`);
    }

    const table = await prisma.tables.create({
      data: {
        ...data,
        status: data.status || 'available',
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        restaurants: {
          select: {
            id: true,
            name: true,
            code: true,
          }
        },
        _count: {
          select: {
            reservations: true,
            table_orders: true,
          }
        }
      }
    });

    return table;
  } catch (error) {
    throw new Error(`Lỗi khi tạo bàn: ${error}`);
  }
};

// Lấy bàn theo ID
export const getTableById = async (id: string) => {
  try {
    if (!validate(id)) {
      throw new Error('ID bàn không hợp lệ');
    }

    const table = await prisma.tables.findUnique({
      where: { id },
      include: {
        restaurants: {
          select: {
            id: true,
            name: true,
            code: true,
          }
        },
        reservations: {
          where: {
            status: { in: ['pending', 'confirmed', 'seated'] },
            reservation_date: {
              gte: new Date()
            }
          },
          orderBy: { reservation_date: 'asc' },
          take: 5,
          include: {
            customers: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                phone_number: true,
              }
            }
          }
        },
        table_orders: {
          where: { status: 'active' },
          include: {
            orders: {
              select: {
                id: true,
                order_code: true,
                total_amount: true,
                status: true,
              }
            },
            staff: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
              }
            }
          }
        }
      }
    });

    if (!table) {
      throw new Error('Không tìm thấy bàn');
    }

    return table;
  } catch (error) {
    throw new Error(`Lỗi khi lấy thông tin bàn: ${error}`);
  }
};

// Lấy danh sách bàn với filter
export const getTables = async (filters: TableQuery) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort_by = 'table_number', 
      sort_order = 'asc', 
      ...whereFilters 
    } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (whereFilters.restaurant_id) {
      where.restaurant_id = whereFilters.restaurant_id;
    }

    if (whereFilters.status) {
      where.status = whereFilters.status;
    }

    if (whereFilters.location) {
      where.location = {
        contains: whereFilters.location,
        mode: 'insensitive'
      };
    }

    if (whereFilters.min_capacity || whereFilters.max_capacity) {
      where.capacity = {};
      if (whereFilters.min_capacity) where.capacity.gte = whereFilters.min_capacity;
      if (whereFilters.max_capacity) where.capacity.lte = whereFilters.max_capacity;
    }

    const [tables, total] = await Promise.all([
      prisma.tables.findMany({
        where,
        include: {
          restaurants: {
            select: {
              id: true,
              name: true,
              code: true,
            }
          },
          _count: {
            select: {
              reservations: true,
              table_orders: true,
            }
          }
        },
        orderBy: { [sort_by]: sort_order },
        skip,
        take: limit,
      }),
      prisma.tables.count({ where })
    ]);

    return {
      data: tables,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw new Error(`Lỗi khi lấy danh sách bàn: ${error}`);
  }
};

// Lấy bàn theo nhà hàng
export const getTablesByRestaurantId = async (restaurantId: string) => {
  try {
    if (!validate(restaurantId)) {
      throw new Error('ID nhà hàng không hợp lệ');
    }

    const tables = await prisma.tables.findMany({
      where: { restaurant_id: restaurantId },
      include: {
        _count: {
          select: {
            reservations: {
              where: {
                status: { in: ['pending', 'confirmed', 'seated'] },
                reservation_date: {
                  gte: new Date()
                }
              }
            },
            table_orders: {
              where: { status: 'active' }
            }
          }
        }
      },
      orderBy: { table_number: 'asc' },
    });

    return tables;
  } catch (error) {
    throw new Error(`Lỗi khi lấy bàn của nhà hàng: ${error}`);
  }
};

// Cập nhật bàn
export const updateTable = async (id: string, data: UpdateTable) => {
  try {
    if (!validate(id)) {
      throw new Error('ID bàn không hợp lệ');
    }

    const existingTable = await prisma.tables.findUnique({
      where: { id }
    });

    if (!existingTable) {
      throw new Error('Không tìm thấy bàn');
    }

    // Kiểm tra số bàn nếu có thay đổi
    if (data.table_number && data.table_number !== existingTable.table_number) {
      const duplicateTable = await prisma.tables.findUnique({
        where: {
          restaurant_id_table_number: {
            restaurant_id: existingTable.restaurant_id,
            table_number: data.table_number
          }
        }
      });

      if (duplicateTable) {
        throw new Error(`Số bàn ${data.table_number} đã tồn tại trong nhà hàng`);
      }
    }

    const updatedTable = await prisma.tables.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
      include: {
        restaurants: {
          select: {
            id: true,
            name: true,
            code: true,
          }
        }
      }
    });

    return updatedTable;
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật bàn: ${error}`);
  }
};

// Xóa bàn
export const deleteTable = async (id: string) => {
  try {
    if (!validate(id)) {
      throw new Error('ID bàn không hợp lệ');
    }

    const existingTable = await prisma.tables.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            reservations: true,
            table_orders: true,
          }
        }
      }
    });

    if (!existingTable) {
      throw new Error('Không tìm thấy bàn');
    }

    if (existingTable._count.reservations > 0 || existingTable._count.table_orders > 0) {
      throw new Error('Không thể xóa bàn có lịch đặt hoặc đơn hàng');
    }

    await prisma.tables.delete({
      where: { id }
    });

    return { message: 'Xóa bàn thành công' };
  } catch (error) {
    throw new Error(`Lỗi khi xóa bàn: ${error}`);
  }
};

// Kiểm tra bàn trống
export const checkTableAvailability = async (data: TableAvailability) => {
  try {
    const { restaurant_id, party_size, reservation_date, duration_hours = 2 } = data;

    if (!validate(restaurant_id)) {
      throw new Error('ID nhà hàng không hợp lệ');
    }

    const startTime = new Date(reservation_date);
    const endTime = new Date(startTime.getTime() + duration_hours * 60 * 60 * 1000);

    // Tìm bàn có sức chứa phù hợp
    const availableTables = await prisma.tables.findMany({
      where: {
        restaurant_id,
        capacity: { gte: party_size },
        status: { in: ['available'] },
        // Kiểm tra không có đặt bàn trùng thời gian
        reservations: {
          none: {
            status: { in: ['confirmed', 'seated'] },
            AND: [
              { reservation_date: { lt: endTime } },
              {
                reservation_date: {
                  gte: new Date(startTime.getTime() - 2 * 60 * 60 * 1000) // Buffer 2 hours
                }
              }
            ]
          }
        }
      },
      orderBy: [
        { capacity: 'asc' }, // Ưu tiên bàn vừa đủ
        { table_number: 'asc' }
      ]
    });

    return availableTables;
  } catch (error) {
    throw new Error(`Lỗi khi kiểm tra bàn trống: ${error}`);
  }
};

// Cập nhật trạng thái nhiều bàn
export const updateTableStatus = async (data: UpdateTableStatus) => {
  try {
    const { table_ids, status } = data;

    // Kiểm tra tất cả IDs hợp lệ
    for (const id of table_ids) {
      if (!validate(id)) {
        throw new Error(`ID bàn không hợp lệ: ${id}`);
      }
    }

    const updatedTables = await prisma.tables.updateMany({
      where: {
        id: { in: table_ids }
      },
      data: {
        status,
        updated_at: new Date(),
      }
    });

    return {
      message: `Đã cập nhật trạng thái ${updatedTables.count} bàn thành ${status}`,
      count: updatedTables.count
    };
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật trạng thái bàn: ${error}`);
  }
};

// ================================
// 📅 RESERVATION SERVICES
// ================================

// Tạo đặt bàn mới
export const createReservation = async (data: CreateReservation) => {
  try {
    // Kiểm tra bàn tồn tại
    const table = await prisma.tables.findUnique({
      where: { id: data.table_id }
    });

    if (!table) {
      throw new Error('Bàn không tồn tại');
    }

    // Kiểm tra sức chứa
    if (data.party_size > table.capacity) {
      throw new Error(`Bàn ${table.table_number} chỉ có sức chứa ${table.capacity} người`);
    }

    // Kiểm tra khách hàng nếu có
    if (data.customer_id) {
      const customer = await prisma.users.findUnique({
        where: { id: data.customer_id }
      });

      if (!customer) {
        throw new Error('Khách hàng không tồn tại');
      }
    }

    // Kiểm tra thời gian trùng lặp
    const conflictingReservation = await prisma.reservations.findFirst({
      where: {
        table_id: data.table_id,
        status: { in: ['confirmed', 'seated'] },
        reservation_date: {
          gte: new Date(data.reservation_date.getTime() - 2 * 60 * 60 * 1000),
          lte: new Date(data.reservation_date.getTime() + 2 * 60 * 60 * 1000)
        }
      }
    });

    if (conflictingReservation) {
      throw new Error('Bàn đã được đặt trong khoảng thời gian này');
    }

    const reservation = await prisma.reservations.create({
      data: {
        ...data,
        duration_hours: data.duration_hours || 2,
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        tables: {
          select: {
            id: true,
            table_number: true,
            capacity: true,
            location: true,
            restaurants: {
              select: {
                id: true,
                name: true,
                address: true,
                phone_number: true,
              }
            }
          }
        },
        customers: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone_number: true,
          }
        }
      }
    });

    return reservation;
  } catch (error) {
    throw new Error(`Lỗi khi tạo đặt bàn: ${error}`);
  }
};

// Lấy đặt bàn theo ID
export const getReservationById = async (id: string) => {
  try {
    if (!validate(id)) {
      throw new Error('ID đặt bàn không hợp lệ');
    }

    const reservation = await prisma.reservations.findUnique({
      where: { id },
      include: {
        tables: {
          select: {
            id: true,
            table_number: true,
            capacity: true,
            location: true,
            restaurants: {
              select: {
                id: true,
                name: true,
                address: true,
                phone_number: true,
              }
            }
          }
        },
        customers: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone_number: true,
          }
        }
      }
    });

    if (!reservation) {
      throw new Error('Không tìm thấy đặt bàn');
    }

    return reservation;
  } catch (error) {
    throw new Error(`Lỗi khi lấy thông tin đặt bàn: ${error}`);
  }
};

// Lấy danh sách đặt bàn
export const getReservations = async (filters: ReservationQuery) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort_by = 'reservation_date', 
      sort_order = 'asc', 
      ...whereFilters 
    } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (whereFilters.table_id) {
      where.table_id = whereFilters.table_id;
    }

    if (whereFilters.customer_id) {
      where.customer_id = whereFilters.customer_id;
    }

    if (whereFilters.customer_phone) {
      where.customer_phone = {
        contains: whereFilters.customer_phone,
        mode: 'insensitive'
      };
    }

    if (whereFilters.status) {
      where.status = whereFilters.status;
    }

    if (whereFilters.date_from || whereFilters.date_to) {
      where.reservation_date = {};
      if (whereFilters.date_from) where.reservation_date.gte = whereFilters.date_from;
      if (whereFilters.date_to) where.reservation_date.lte = whereFilters.date_to;
    }

    if (whereFilters.party_size_min || whereFilters.party_size_max) {
      where.party_size = {};
      if (whereFilters.party_size_min) where.party_size.gte = whereFilters.party_size_min;
      if (whereFilters.party_size_max) where.party_size.lte = whereFilters.party_size_max;
    }

    const [reservations, total] = await Promise.all([
      prisma.reservations.findMany({
        where,
        include: {
          tables: {
            select: {
              id: true,
              table_number: true,
              capacity: true,
              location: true,
            }
          },
          customers: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
            }
          }
        },
        orderBy: { [sort_by]: sort_order },
        skip,
        take: limit,
      }),
      prisma.reservations.count({ where })
    ]);

    return {
      data: reservations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw new Error(`Lỗi khi lấy danh sách đặt bàn: ${error}`);
  }
};

// Cập nhật đặt bàn
export const updateReservation = async (id: string, data: UpdateReservation) => {
  try {
    if (!validate(id)) {
      throw new Error('ID đặt bàn không hợp lệ');
    }

    const existingReservation = await prisma.reservations.findUnique({
      where: { id },
      include: { tables: true }
    });

    if (!existingReservation) {
      throw new Error('Không tìm thấy đặt bàn');
    }

    // Kiểm tra sức chứa nếu thay đổi số người
    if (data.party_size && data.party_size > existingReservation.tables.capacity) {
      throw new Error(`Bàn ${existingReservation.tables.table_number} chỉ có sức chứa ${existingReservation.tables.capacity} người`);
    }

    const updatedReservation = await prisma.reservations.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
      include: {
        tables: {
          select: {
            id: true,
            table_number: true,
            capacity: true,
            location: true,
          }
        },
        customers: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          }
        }
      }
    });

    return updatedReservation;
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật đặt bàn: ${error}`);
  }
};

// Xác nhận đặt bàn
export const confirmReservation = async (data: ConfirmReservation) => {
  try {
    const { reservation_id, notes } = data;

    if (!validate(reservation_id)) {
      throw new Error('ID đặt bàn không hợp lệ');
    }

    const reservation = await prisma.reservations.findUnique({
      where: { id: reservation_id }
    });

    if (!reservation) {
      throw new Error('Không tìm thấy đặt bàn');
    }

    if (reservation.status !== 'pending') {
      throw new Error('Chỉ có thể xác nhận đặt bàn đang chờ');
    }

    const updatedReservation = await prisma.reservations.update({
      where: { id: reservation_id },
      data: {
        status: 'confirmed',
        notes: notes || reservation.notes,
        updated_at: new Date(),
      },
      include: {
        tables: {
          select: {
            id: true,
            table_number: true,
            capacity: true,
            location: true,
          }
        }
      }
    });

    return updatedReservation;
  } catch (error) {
    throw new Error(`Lỗi khi xác nhận đặt bàn: ${error}`);
  }
};

// Check-in khách hàng
export const checkInTable = async (data: TableCheckIn) => {
  try {
    const { reservation_id, table_id, party_size, staff_id } = data;

    // Validate inputs
    if (reservation_id && !validate(reservation_id)) {
      throw new Error('ID đặt bàn không hợp lệ');
    }
    if (!validate(table_id)) {
      throw new Error('ID bàn không hợp lệ');
    }
    if (!validate(staff_id)) {
      throw new Error('ID nhân viên không hợp lệ');
    }

    // Kiểm tra bàn
    const table = await prisma.tables.findUnique({
      where: { id: table_id }
    });

    if (!table) {
      throw new Error('Bàn không tồn tại');
    }

    if (table.status !== 'available') {
      throw new Error('Bàn không có sẵn');
    }

    if (party_size > table.capacity) {
      throw new Error(`Bàn ${table.table_number} chỉ có sức chứa ${table.capacity} người`);
    }

    // Cập nhật reservation nếu có
    if (reservation_id) {
      await prisma.reservations.update({
        where: { id: reservation_id },
        data: {
          status: 'seated',
          updated_at: new Date(),
        }
      });
    }

    // Cập nhật trạng thái bàn
    await prisma.tables.update({
      where: { id: table_id },
      data: {
        status: 'occupied',
        updated_at: new Date(),
      }
    });

    // Tạo table order session
    const tableOrder = await prisma.table_orders.create({
      data: {
        table_id,
        session_code: generateSessionCode(),
        status: 'active',
        staff_id,
        opened_at: new Date(),
      },
      include: {
        tables: {
          select: {
            id: true,
            table_number: true,
            capacity: true,
          }
        },
        staff: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          }
        }
      }
    });

    return tableOrder;
  } catch (error) {
    throw new Error(`Lỗi khi check-in: ${error}`);
  }
};

// ================================
// 🍽️ TABLE ORDER SERVICES
// ================================

// Tạo table order
export const createTableOrder = async (data: CreateTableOrder) => {
  try {
    // Kiểm tra bàn
    const table = await prisma.tables.findUnique({
      where: { id: data.table_id }
    });

    if (!table) {
      throw new Error('Bàn không tồn tại');
    }

    // Kiểm tra staff nếu có
    if (data.staff_id) {
      const staff = await prisma.users.findUnique({
        where: { id: data.staff_id }
      });

      if (!staff) {
        throw new Error('Nhân viên không tồn tại');
      }
    }

    const tableOrder = await prisma.table_orders.create({
      data: {
        table_id: data.table_id,
        session_code: data.session_code || generateSessionCode(),
        staff_id: data.staff_id,
        status: 'active',
        opened_at: new Date(),
      },
      include: {
        tables: {
          select: {
            id: true,
            table_number: true,
            capacity: true,
            location: true,
          }
        },
        staff: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          }
        }
      }
    });

    return tableOrder;
  } catch (error) {
    throw new Error(`Lỗi khi tạo phiên bàn: ${error}`);
  }
};

// Lấy table order theo ID
export const getTableOrderById = async (id: string) => {
  try {
    if (!validate(id)) {
      throw new Error('ID phiên bàn không hợp lệ');
    }

    const tableOrder = await prisma.table_orders.findUnique({
      where: { id },
      include: {
        tables: {
          select: {
            id: true,
            table_number: true,
            capacity: true,
            location: true,
            restaurants: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
        orders: {
          select: {
            id: true,
            order_code: true,
            total_amount: true,
            status: true,
            payment_status: true,
          }
        },
        staff: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          }
        }
      }
    });

    if (!tableOrder) {
      throw new Error('Không tìm thấy phiên bàn');
    }

    return tableOrder;
  } catch (error) {
    throw new Error(`Lỗi khi lấy thông tin phiên bàn: ${error}`);
  }
};

// Lấy danh sách table orders
export const getTableOrders = async (filters: TableOrderQuery) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort_by = 'opened_at', 
      sort_order = 'desc', 
      ...whereFilters 
    } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (whereFilters.table_id) {
      where.table_id = whereFilters.table_id;
    }

    if (whereFilters.order_id) {
      where.order_id = whereFilters.order_id;
    }

    if (whereFilters.status) {
      where.status = whereFilters.status;
    }

    if (whereFilters.staff_id) {
      where.staff_id = whereFilters.staff_id;
    }

    if (whereFilters.session_code) {
      where.session_code = {
        contains: whereFilters.session_code,
        mode: 'insensitive'
      };
    }

    if (whereFilters.date_from || whereFilters.date_to) {
      where.opened_at = {};
      if (whereFilters.date_from) where.opened_at.gte = whereFilters.date_from;
      if (whereFilters.date_to) where.opened_at.lte = whereFilters.date_to;
    }

    const [tableOrders, total] = await Promise.all([
      prisma.table_orders.findMany({
        where,
        include: {
          tables: {
            select: {
              id: true,
              table_number: true,
              capacity: true,
              location: true,
            }
          },
          orders: {
            select: {
              id: true,
              order_code: true,
              total_amount: true,
              status: true,
            }
          },
          staff: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
            }
          }
        },
        orderBy: { [sort_by]: sort_order },
        skip,
        take: limit,
      }),
      prisma.table_orders.count({ where })
    ]);

    return {
      data: tableOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw new Error(`Lỗi khi lấy danh sách phiên bàn: ${error}`);
  }
};

// Cập nhật table order
export const updateTableOrder = async (id: string, data: UpdateTableOrder) => {
  try {
    if (!validate(id)) {
      throw new Error('ID phiên bàn không hợp lệ');
    }

    const existingTableOrder = await prisma.table_orders.findUnique({
      where: { id }
    });

    if (!existingTableOrder) {
      throw new Error('Không tìm thấy phiên bàn');
    }

    const updateData: any = { ...data };

    // Tự động set thời gian đóng khi status = completed
    if (data.status === 'completed' && !existingTableOrder.closed_at) {
      updateData.closed_at = new Date();
    }

    const updatedTableOrder = await prisma.table_orders.update({
      where: { id },
      data: updateData,
      include: {
        tables: {
          select: {
            id: true,
            table_number: true,
            capacity: true,
            location: true,
          }
        },
        orders: {
          select: {
            id: true,
            order_code: true,
            total_amount: true,
            status: true,
          }
        }
      }
    });

    // Cập nhật trạng thái bàn khi đóng phiên
    if (data.status === 'completed') {
      await prisma.tables.update({
        where: { id: existingTableOrder.table_id },
        data: { status: 'available' }
      });
    }

    return updatedTableOrder;
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật phiên bàn: ${error}`);
  }
};

// ================================
// 📊 STATISTICS FUNCTIONS
// ================================

// Thống kê bàn
export const getTableStats = async (data: TableStatsQuery) => {
  try {
    const { restaurant_id, date_from, date_to } = data;

    if (!validate(restaurant_id)) {
      throw new Error('ID nhà hàng không hợp lệ');
    }

    const dateFilter = date_from && date_to ? {
      gte: date_from,
      lte: date_to
    } : undefined;

    const [
      totalTables,
      availableTables,
      occupiedTables,
      maintenanceTables,
      totalReservations,
      confirmedReservations,
      avgOccupancyRate
    ] = await Promise.all([
      prisma.tables.count({
        where: { restaurant_id }
      }),
      prisma.tables.count({
        where: { 
          restaurant_id,
          status: 'available' 
        }
      }),
      prisma.tables.count({
        where: { 
          restaurant_id,
          status: 'occupied' 
        }
      }),
      prisma.tables.count({
        where: { 
          restaurant_id,
          status: { in: ['maintenance', 'out_of_order'] }
        }
      }),
      prisma.reservations.count({
        where: { 
          tables: { restaurant_id },
          ...(dateFilter && { created_at: dateFilter })
        }
      }),
      prisma.reservations.count({
        where: { 
          tables: { restaurant_id },
          status: 'confirmed',
          ...(dateFilter && { created_at: dateFilter })
        }
      }),
      // Calculate average occupancy rate
      prisma.table_orders.aggregate({
        where: { 
          tables: { restaurant_id },
          status: 'completed',
          ...(dateFilter && { opened_at: dateFilter })
        },
        _avg: {
          total_amount: true
        }
      })
    ]);

    return {
      total_tables: totalTables,
      available_tables: availableTables,
      occupied_tables: occupiedTables,
      maintenance_tables: maintenanceTables,
      total_reservations: totalReservations,
      confirmed_reservations: confirmedReservations,
      reservation_rate: totalReservations > 0 ? (confirmedReservations / totalReservations * 100) : 0,
      avg_order_value: avgOccupancyRate._avg.total_amount || 0,
    };
  } catch (error) {
    throw new Error(`Lỗi khi lấy thống kê bàn: ${error}`);
  }
};

// Thống kê đặt bàn
export const getReservationStats = async (data: ReservationStatsQuery) => {
  try {
    const { restaurant_id, date_from, date_to } = data;

    if (!validate(restaurant_id)) {
      throw new Error('ID nhà hàng không hợp lệ');
    }

    const dateFilter = date_from && date_to ? {
      gte: date_from,
      lte: date_to
    } : undefined;

    const [
      totalReservations,
      pendingReservations,
      confirmedReservations,
      seatedReservations,
      completedReservations,
      cancelledReservations,
      noShowReservations
    ] = await Promise.all([
      prisma.reservations.count({
        where: { 
          tables: { restaurant_id },
          ...(dateFilter && { created_at: dateFilter })
        }
      }),
      prisma.reservations.count({
        where: { 
          tables: { restaurant_id },
          status: 'pending',
          ...(dateFilter && { created_at: dateFilter })
        }
      }),
      prisma.reservations.count({
        where: { 
          tables: { restaurant_id },
          status: 'confirmed',
          ...(dateFilter && { created_at: dateFilter })
        }
      }),
      prisma.reservations.count({
        where: { 
          tables: { restaurant_id },
          status: 'seated',
          ...(dateFilter && { created_at: dateFilter })
        }
      }),
      prisma.reservations.count({
        where: { 
          tables: { restaurant_id },
          status: 'completed',
          ...(dateFilter && { created_at: dateFilter })
        }
      }),
      prisma.reservations.count({
        where: { 
          tables: { restaurant_id },
          status: 'cancelled',
          ...(dateFilter && { created_at: dateFilter })
        }
      }),
      prisma.reservations.count({
        where: { 
          tables: { restaurant_id },
          status: 'no_show',
          ...(dateFilter && { created_at: dateFilter })
        }
      })
    ]);

    return {
      total_reservations: totalReservations,
      pending_reservations: pendingReservations,
      confirmed_reservations: confirmedReservations,
      seated_reservations: seatedReservations,
      completed_reservations: completedReservations,
      cancelled_reservations: cancelledReservations,
      no_show_reservations: noShowReservations,
      success_rate: totalReservations > 0 ? (completedReservations / totalReservations * 100) : 0,
      cancellation_rate: totalReservations > 0 ? (cancelledReservations / totalReservations * 100) : 0,
      no_show_rate: totalReservations > 0 ? (noShowReservations / totalReservations * 100) : 0,
    };
  } catch (error) {
    throw new Error(`Lỗi khi lấy thống kê đặt bàn: ${error}`);
  }
};
