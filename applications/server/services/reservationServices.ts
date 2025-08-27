import { PrismaClient } from '@prisma/client';
import { 
  CreateReservationType, 
  UpdateReservationType, 
  UpdateReservationStatusType,
  ReservationQueryType,
  CheckAvailabilityType,
  BulkUpdateReservationType,
  ReservationAnalyticsType,
  CreateWalkInType,
  CreateWaitlistType
} from '../schemas/reservationSchemas';

const prisma = new PrismaClient();

// ================================
// 🎯 RESERVATION SERVICES
// ================================

/**
 * Tạo đặt bàn mới
 */
export async function createReservation(data: CreateReservationType) {
  try {
    // Kiểm tra bàn có tồn tại và thuộc nhà hàng
    const table = await prisma.tables.findUnique({
      where: { id: data.table_id },
      include: { restaurants: true }
    });

    if (!table) {
      throw new Error('Bàn không tồn tại');
    }

    // Kiểm tra sức chứa bàn
    if (data.party_size > table.capacity) {
      throw new Error(`Bàn chỉ có sức chứa ${table.capacity} người`);
    }

    // Kiểm tra bàn có available không
    if (table.status !== 'available') {
      throw new Error('Bàn hiện tại không khả dụng');
    }

    // Kiểm tra xung đột thời gian
    const conflictingReservations = await checkTableConflicts(
      data.table_id,
      new Date(data.reservation_date),
      data.duration_hours
    );

    if (conflictingReservations.length > 0) {
      throw new Error('Bàn đã được đặt trong khung thời gian này');
    }

    // Tạo đặt bàn
    const reservation = await prisma.reservations.create({
      data: {
        ...data,
        reservation_date: new Date(data.reservation_date)
      },
      include: {
        tables: {
          include: {
            restaurants: true
          }
        },
        customers: true
      }
    });

    return {
      success: true,
      data: reservation,
      message: 'Đặt bàn thành công'
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi tạo đặt bàn'
    };
  }
}

/**
 * Lấy danh sách đặt bàn với filter và pagination
 */
export async function getReservations(query: ReservationQueryType) {
  try {
    const {
      restaurant_id,
      table_id,
      customer_id,
      status,
      date_from,
      date_to,
      customer_phone,
      customer_name,
      page,
      limit,
      sort_by,
      sort_order
    } = query;

    // Build where clause
    const where: any = {};

    if (restaurant_id) {
      where.tables = {
        restaurant_id: restaurant_id
      };
    }

    if (table_id) {
      where.table_id = table_id;
    }

    if (customer_id) {
      where.customer_id = customer_id;
    }

    if (status) {
      where.status = status;
    }

    if (date_from || date_to) {
      where.reservation_date = {};
      if (date_from) {
        where.reservation_date.gte = new Date(date_from);
      }
      if (date_to) {
        where.reservation_date.lte = new Date(date_to);
      }
    }

    if (customer_phone) {
      where.customer_phone = {
        contains: customer_phone,
        mode: 'insensitive'
      };
    }

    if (customer_name) {
      where.customer_name = {
        contains: customer_name,
        mode: 'insensitive'
      };
    }

    // Count total records
    const total = await prisma.reservations.count({ where });

    // Get reservations with pagination
    const reservations = await prisma.reservations.findMany({
      where,
      include: {
        tables: {
          include: {
            restaurants: true
          }
        },
        customers: true
      },
      orderBy: {
        [sort_by]: sort_order
      },
      skip: (page - 1) * limit,
      take: limit
    });

    return {
      success: true,
      data: {
        reservations,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      }
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi lấy danh sách đặt bàn'
    };
  }
}

/**
 * Lấy thông tin đặt bàn theo ID
 */
export async function getReservationById(id: string) {
  try {
    const reservation = await prisma.reservations.findUnique({
      where: { id },
      include: {
        tables: {
          include: {
            restaurants: true
          }
        },
        customers: true
      }
    });

    if (!reservation) {
      throw new Error('Không tìm thấy đặt bàn');
    }

    return {
      success: true,
      data: reservation
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi lấy thông tin đặt bàn'
    };
  }
}

/**
 * Cập nhật thông tin đặt bàn
 */
export async function updateReservation(id: string, data: UpdateReservationType) {
  try {
    const existingReservation = await prisma.reservations.findUnique({
      where: { id },
      include: { tables: true }
    });

    if (!existingReservation) {
      throw new Error('Không tìm thấy đặt bàn');
    }

    // Không cho phép cập nhật đặt bàn đã completed/cancelled
    if (['completed', 'cancelled', 'no_show'].includes(existingReservation.status)) {
      throw new Error('Không thể cập nhật đặt bàn đã hoàn thành/hủy');
    }

    // Kiểm tra sức chứa nếu có update party_size
    if (data.party_size && data.party_size > existingReservation.tables.capacity) {
      throw new Error(`Bàn chỉ có sức chứa ${existingReservation.tables.capacity} người`);
    }

    // Kiểm tra xung đột thời gian nếu có update thời gian
    if (data.reservation_date) {
      const conflictingReservations = await checkTableConflicts(
        existingReservation.table_id,
        new Date(data.reservation_date),
        data.duration_hours || existingReservation.duration_hours.toNumber(),
        id // exclude current reservation
      );

      if (conflictingReservations.length > 0) {
        throw new Error('Bàn đã được đặt trong khung thời gian này');
      }
    }

    const updatedReservation = await prisma.reservations.update({
      where: { id },
      data: {
        ...data,
        reservation_date: data.reservation_date ? new Date(data.reservation_date) : undefined,
        updated_at: new Date()
      },
      include: {
        tables: {
          include: {
            restaurants: true
          }
        },
        customers: true
      }
    });

    return {
      success: true,
      data: updatedReservation,
      message: 'Cập nhật đặt bàn thành công'
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi cập nhật đặt bàn'
    };
  }
}

/**
 * Cập nhật trạng thái đặt bàn
 */
export async function updateReservationStatus(id: string, data: UpdateReservationStatusType) {
  try {
    const existingReservation = await prisma.reservations.findUnique({
      where: { id },
      include: { tables: true }
    });

    if (!existingReservation) {
      throw new Error('Không tìm thấy đặt bàn');
    }

    // Kiểm tra luồng trạng thái hợp lệ
    const validTransitions: Record<string, string[]> = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['seated', 'cancelled', 'no_show'],
      'seated': ['completed'],
      'completed': [],
      'cancelled': [],
      'no_show': []
    };

    const allowedStatuses = validTransitions[existingReservation.status];
    if (!allowedStatuses.includes(data.status)) {
      throw new Error(`Không thể chuyển từ trạng thái ${existingReservation.status} sang ${data.status}`);
    }

    // Cập nhật trạng thái bàn khi seated/completed
    let tableUpdate: any = {};
    if (data.status === 'seated') {
      tableUpdate = { status: 'occupied' };
    } else if (['completed', 'cancelled', 'no_show'].includes(data.status)) {
      tableUpdate = { status: 'available' };
    }

    // Transaction để cập nhật cả reservation và table
    const result = await prisma.$transaction(async (tx) => {
      // Cập nhật reservation
      const updatedReservation = await tx.reservations.update({
        where: { id },
        data: {
          status: data.status,
          notes: data.notes,
          updated_at: new Date()
        },
        include: {
          tables: {
            include: {
              restaurants: true
            }
          },
          customers: true
        }
      });

      // Cập nhật table status nếu cần
      if (Object.keys(tableUpdate).length > 0) {
        await tx.tables.update({
          where: { id: existingReservation.table_id },
          data: tableUpdate
        });
      }

      return updatedReservation;
    });

    return {
      success: true,
      data: result,
      message: `Đã chuyển trạng thái thành ${data.status}`
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi cập nhật trạng thái đặt bàn'
    };
  }
}

/**
 * Xóa đặt bàn
 */
export async function deleteReservation(id: string) {
  try {
    const reservation = await prisma.reservations.findUnique({
      where: { id }
    });

    if (!reservation) {
      throw new Error('Không tìm thấy đặt bàn');
    }

    // Chỉ cho phép xóa đặt bàn pending hoặc confirmed
    if (!['pending', 'confirmed'].includes(reservation.status)) {
      throw new Error('Chỉ có thể xóa đặt bàn đang chờ hoặc đã xác nhận');
    }

    await prisma.reservations.delete({
      where: { id }
    });

    return {
      success: true,
      message: 'Xóa đặt bàn thành công'
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi xóa đặt bàn'
    };
  }
}

/**
 * Kiểm tra tình trạng bàn trống
 */
export async function checkTableAvailability(data: CheckAvailabilityType) {
  try {
    const { restaurant_id, reservation_date, duration_hours, party_size, table_id } = data;

    // Build where clause cho tables
    const tableWhere: any = {
      restaurant_id,
      status: 'available',
      capacity: {
        gte: party_size
      }
    };

    if (table_id) {
      tableWhere.id = table_id;
    }

    // Lấy danh sách bàn phù hợp
    const availableTables = await prisma.tables.findMany({
      where: tableWhere,
      include: {
        reservations: {
          where: {
            status: {
              in: ['confirmed', 'seated']
            },
            // Kiểm tra overlap thời gian
            OR: [
              {
                // Reservation bắt đầu trong khoảng thời gian đặt bàn
                reservation_date: {
                  lt: new Date(new Date(reservation_date).getTime() + duration_hours * 60 * 60 * 1000),
                  gte: new Date(reservation_date)
                }
              },
              {
                // Reservation kết thúc trong khoảng thời gian đặt bàn
                AND: [
                  {
                    reservation_date: {
                      lte: new Date(reservation_date)
                    }
                  },
                  {
                    // Sử dụng SQL raw để tính end time
                    reservation_date: {
                      gte: new Date(new Date(reservation_date).getTime() - 8 * 60 * 60 * 1000) // max 8 hours back
                    }
                  }
                ]
              }
            ]
          }
        }
      }
    });

    // Filter out tables with conflicting reservations
    const trulyAvailableTables = availableTables.filter(table => {
      return table.reservations.every(reservation => {
        const reservationStart = reservation.reservation_date;
        const reservationEnd = new Date(reservationStart.getTime() + reservation.duration_hours.toNumber() * 60 * 60 * 1000);
        const requestStart = new Date(reservation_date);
        const requestEnd = new Date(requestStart.getTime() + duration_hours * 60 * 60 * 1000);

        // Không có overlap
        return requestEnd <= reservationStart || requestStart >= reservationEnd;
      });
    });

    return {
      success: true,
      data: {
        available: trulyAvailableTables.length > 0,
        tables: trulyAvailableTables.map(table => ({
          id: table.id,
          table_number: table.table_number,
          capacity: table.capacity,
          location: table.location
        })),
        total_available: trulyAvailableTables.length
      }
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi kiểm tra tình trạng bàn'
    };
  }
}

/**
 * Cập nhật hàng loạt đặt bàn
 */
export async function bulkUpdateReservations(data: BulkUpdateReservationType) {
  try {
    const { reservation_ids, status, notes } = data;

    // Kiểm tra tất cả reservations tồn tại
    const existingReservations = await prisma.reservations.findMany({
      where: {
        id: {
          in: reservation_ids
        }
      }
    });

    if (existingReservations.length !== reservation_ids.length) {
      throw new Error('Một số đặt bàn không tồn tại');
    }

    // Cập nhật hàng loạt
    const result = await prisma.reservations.updateMany({
      where: {
        id: {
          in: reservation_ids
        }
      },
      data: {
        status,
        notes,
        updated_at: new Date()
      }
    });

    return {
      success: true,
      data: {
        updated_count: result.count
      },
      message: `Đã cập nhật ${result.count} đặt bàn`
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi cập nhật hàng loạt'
    };
  }
}

/**
 * Tạo walk-in customer (khách vãng lai)
 */
export async function createWalkIn(data: CreateWalkInType) {
  try {
    // Tạo reservation ngay với status seated
    const walkInReservation = await createReservation({
      table_id: data.table_id,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone || 'N/A', // Đảm bảo luôn có giá trị
      party_size: data.party_size,
      customer_email: undefined,
      reservation_date: new Date().toISOString(),
      duration_hours: 2,
      special_requests: undefined,
      notes: `Walk-in customer. ${data.notes || ''}`
    });

    if (!walkInReservation.success) {
      throw new Error(walkInReservation.error);
    }

    // Cập nhật status thành seated ngay lập tức
    const seatedResult = await updateReservationStatus(
      walkInReservation.data!.id,
      {
        status: 'seated',
        notes: 'Walk-in customer seated immediately'
      }
    );

    return seatedResult;

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi tạo khách vãng lai'
    };
  }
}

/**
 * Phân tích thống kê đặt bàn
 */
export async function getReservationAnalytics(data: ReservationAnalyticsType) {
  try {
    const { restaurant_id, date_from, date_to, group_by } = data;

    // Base query
    const whereClause = {
      tables: {
        restaurant_id
      },
      reservation_date: {
        gte: new Date(date_from),
        lte: new Date(date_to)
      }
    };

    // Tổng quan
    const overview = await prisma.reservations.groupBy({
      by: ['status'],
      where: whereClause,
      _count: {
        id: true
      },
      _avg: {
        party_size: true
      }
    });

    // Thống kê theo thời gian (simplified)
    const timeStats = await prisma.reservations.findMany({
      where: whereClause,
      select: {
        reservation_date: true,
        party_size: true,
        status: true
      },
      orderBy: {
        reservation_date: 'asc'
      }
    });

    return {
      success: true,
      data: {
        overview: overview.map(stat => ({
          status: stat.status,
          count: stat._count.id,
          avg_party_size: stat._avg.party_size
        })),
        time_series: timeStats,
        total_reservations: timeStats.length,
        total_guests: timeStats.reduce((sum, res) => sum + res.party_size, 0)
      }
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi phân tích thống kê'
    };
  }
}

// ================================
// 🔧 HELPER FUNCTIONS
// ================================

/**
 * Kiểm tra xung đột thời gian đặt bàn
 */
async function checkTableConflicts(
  tableId: string,
  reservationDate: Date,
  durationHours: number,
  excludeReservationId?: string
) {
  const endTime = new Date(reservationDate.getTime() + durationHours * 60 * 60 * 1000);

  const whereClause: any = {
    table_id: tableId,
    status: {
      in: ['confirmed', 'seated']
    },
    OR: [
      {
        // Overlap case 1: existing reservation starts during new reservation
        reservation_date: {
          gte: reservationDate,
          lt: endTime
        }
      },
      {
        // Overlap case 2: existing reservation ends during new reservation
        AND: [
          {
            reservation_date: {
              lt: reservationDate
            }
          }
          // Note: Would need raw SQL for proper end time calculation
        ]
      }
    ]
  };

  if (excludeReservationId) {
    whereClause.id = {
      not: excludeReservationId
    };
  }

  return await prisma.reservations.findMany({
    where: whereClause
  });
}
