import { Request, Response } from 'express';
// import { Request } from '@/types/auth';
import {
  CreateReservationSchema,
  UpdateReservationSchema,
  UpdateReservationStatusSchema,
  ReservationQuerySchema,
  CheckAvailabilitySchema,
  BulkUpdateReservationSchema,
  ReservationAnalyticsSchema,
  CreateWalkInSchema,
  CreateWaitlistSchema
} from '@/schemas/reservationSchemas';
import {
  getAllReservations as getAllReservationsService,
  updateStatusReservation as updateStatusReservationService,
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  updateReservationStatus,
  deleteReservation,
  checkTableAvailability,
  bulkUpdateReservations,
  createWalkIn,
  getReservationAnalytics,
  createWaitlist,
  getWaitlist,
  updateWaitlistStatus,
  getReservationsByCustomer,
  searchReservationsByPhone,
  getDailyReservationStats
} from '@/services/reservationServices';

// ================================
// 🎯 RESERVATION CONTROLLERS
// ================================

export async function getAllReservations(
  req: Request,
  res: Response
) {
  try {
    const result = await getAllReservationsService();

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách đơn đặt bàn thành công',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách đặt bàn',
      error: error.issues || error
    });
  }
}

export async function updateStatusReservation(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Category ID is required'
      });
    }

    // Validate request body
    // const result = await UpdateReservationSchema.safeParseAsync(req.body);
    //
    // if (!result.success) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Validation failed',
    //     errors: result.error.issues
    //   });
    // }

    const reservation = await updateStatusReservationService(id, status);

    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái đơn đặt bàn thành công',
      data: reservation
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update category';
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
}
/**
 * Tạo đặt bàn mới
 * POST /api/reservations
 */
export async function createReservationController(req: Request, res: Response) {
  try {
    const validatedData = CreateReservationSchema.parse(req.body);
    
    const result = await createReservation(validatedData);

    if (result.success) {
      res.status(201).json({
        success: true,
        data: result.data,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        error: 'Dữ liệu không hợp lệ',
        details: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Lỗi server'
      });
    }
  }
}

/**
 * Lấy danh sách đặt bàn
 * GET /api/reservations
 */
export async function getReservationsController(req: Request, res: Response) {
  try {
    const queryParams = {
      ...req.query,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10
    };

    const validatedQuery = ReservationQuerySchema.parse(queryParams);
    
    // Nếu user không phải admin, chỉ xem được reservations của restaurant mình
    // if (req.user?.role !== 'admin' && req.user?.restaurant_context?.restaurant_id) {
    //   validatedQuery.restaurant_id = req.user.restaurant_context.restaurant_id;
    // }

    const result = await getReservations(validatedQuery);

    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        error: 'Tham số truy vấn không hợp lệ',
        details: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Lỗi server'
      });
    }
  }
}

/**
 * Lấy thông tin đặt bàn theo ID
 * GET /api/reservations/:id
 */
export async function getReservationByIdController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID đặt bàn là bắt buộc'
      });
    }

    const result = await getReservationById(id);

    if (result.success) {
      // Kiểm tra quyền truy cập
      // if (req.user?.role !== 'admin' && req.user?.restaurant_context?.restaurant_id !== result.data?.tables.restaurant_id) {
      //   return res.status(403).json({
      //     success: false,
      //     error: 'Không có quyền truy cập'
      //   });
      // }

      res.status(200).json({
        success: true,
        data: result.data
      });
    } else {
      res.status(404).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Lỗi server'
    });
  }
}

/**
 * Cập nhật thông tin đặt bàn
 * PUT /api/reservations/:id
 */
export async function updateReservationController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = UpdateReservationSchema.parse(req.body);

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID đặt bàn là bắt buộc'
      });
    }

    // Kiểm tra quyền truy cập trước khi update
    const existingReservation = await getReservationById(id);
    if (!existingReservation.success) {
      return res.status(404).json({
        success: false,
        error: existingReservation.error
      });
    }

    // if (req.user?.role !== 'admin' && req.user?.restaurant_context?.restaurant_id !== existingReservation.data?.tables.restaurant_id) {
    //   return res.status(403).json({
    //     success: false,
    //     error: 'Không có quyền cập nhật'
    //   });
    // }

    const result = await updateReservation(id, validatedData);

    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        error: 'Dữ liệu không hợp lệ',
        details: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Lỗi server'
      });
    }
  }
}

/**
 * Cập nhật trạng thái đặt bàn
 * PATCH /api/reservations/:id/status
 */
export async function updateReservationStatusController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = UpdateReservationStatusSchema.parse(req.body);

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID đặt bàn là bắt buộc'
      });
    }

    // Kiểm tra quyền truy cập
    const existingReservation = await getReservationById(id);
    if (!existingReservation.success) {
      return res.status(404).json({
        success: false,
        error: existingReservation.error
      });
    }

    // if (req.user?.role !== 'admin' && req.user?.restaurant_context?.restaurant_id !== existingReservation.data?.tables.restaurant_id) {
    //   return res.status(403).json({
    //     success: false,
    //     error: 'Không có quyền cập nhật'
    //   });
    // }

    const result = await updateReservationStatus(id, validatedData);

    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        error: 'Dữ liệu không hợp lệ',
        details: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Lỗi server'
      });
    }
  }
}

/**
 * Xóa đặt bàn
 * DELETE /api/reservations/:id
 */
export async function deleteReservationController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID đặt bàn là bắt buộc'
      });
    }

    // Kiểm tra quyền truy cập
    const existingReservation = await getReservationById(id);
    if (!existingReservation.success) {
      return res.status(404).json({
        success: false,
        error: existingReservation.error
      });
    }

    // if (req.user?.role !== 'admin' && req.user?.restaurant_context?.restaurant_id !== existingReservation.data?.tables.restaurant_id) {
    //   return res.status(403).json({
    //     success: false,
    //     error: 'Không có quyền xóa'
    //   });
    // }

    const result = await deleteReservation(id);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Lỗi server'
    });
  }
}

/**
 * Kiểm tra tình trạng bàn trống
 * POST /api/reservations/check-availability
 */
export async function checkAvailabilityController(req: Request, res: Response) {
  try {
    const validatedData = CheckAvailabilitySchema.parse(req.body);

    const result = await checkTableAvailability(validatedData);

    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        error: 'Dữ liệu không hợp lệ',
        details: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Lỗi server'
      });
    }
  }
}

/**
 * Cập nhật hàng loạt đặt bàn
 * PATCH /api/reservations/bulk-update
 */
export async function bulkUpdateReservationsController(req: Request, res: Response) {
  try {
    const validatedData = BulkUpdateReservationSchema.parse(req.body);

    // Chỉ admin hoặc manager mới có quyền bulk update
    // if (!['admin', 'manager'].includes(req.user?.role || '')) {
    //   return res.status(403).json({
    //     success: false,
    //     error: 'Không có quyền thực hiện thao tác này'
    //   });
    // }

    const result = await bulkUpdateReservations(validatedData);

    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        error: 'Dữ liệu không hợp lệ',
        details: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Lỗi server'
      });
    }
  }
}

/**
 * Tạo khách vãng lai (walk-in)
 * POST /api/reservations/walk-in
 */
export async function createWalkInController(req: Request, res: Response) {
  try {
    const validatedData = CreateWalkInSchema.parse(req.body);

    const result = await createWalkIn(validatedData);

    if (result.success) {
      res.status(201).json({
        success: true,
        data: result.data,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        error: 'Dữ liệu không hợp lệ',
        details: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Lỗi server'
      });
    }
  }
}

/**
 * Phân tích thống kê đặt bàn
 * POST /api/reservations/analytics
 */
export async function getReservationAnalyticsController(req: Request, res: Response) {
  try {
    const validatedData = ReservationAnalyticsSchema.parse(req.body);

    // Nếu không phải admin, chỉ xem analytics của restaurant mình
    // if (req.user?.role !== 'admin' && req.user?.restaurant_context?.restaurant_id) {
    //   validatedData.restaurant_id = req.user.restaurant_context?.restaurant_id;
    // }

    const result = await getReservationAnalytics(validatedData);

    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        error: 'Dữ liệu không hợp lệ',
        details: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Lỗi server'
      });
    }
  }
}

/**
 * Lấy đặt bàn hôm nay
 * GET /api/reservations/today
 */
export async function getTodayReservationsController(req: Request, res: Response) {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const queryParams = {
      // restaurant_id: req.user?.restaurant_context?.restaurant_id,
      date_from: startOfDay.toISOString(),
      date_to: endOfDay.toISOString(),
      page: 1,
      limit: 100,
      sort_by: 'reservation_date' as const,
      sort_order: 'asc' as const
    };

    const result = await getReservations(queryParams);

    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Lỗi server'
    });
  }
}

/**
 * Lấy đặt bàn sắp tới (trong 2 tiếng)
 * GET /api/reservations/upcoming
 */
export async function getUpcomingReservationsController(req: Request, res: Response) {
  try {
    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    const queryParams = {
      // restaurant_id: req.user?.restaurant_context?.restaurant_id,
      date_from: now.toISOString(),
      date_to: twoHoursLater.toISOString(),
      status: 'confirmed' as const,
      page: 1,
      limit: 50,
      sort_by: 'reservation_date' as const,
      sort_order: 'asc' as const
    };

    const result = await getReservations(queryParams);

    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Lỗi server'
    });
  }
}

/**
 * Tạo waitlist
 * POST /api/reservations/waitlist
 */
// export async function createWaitlistController(req: Request, res: Response) {
export async function createWaitlistController(req: Request, res: Response) {
  try {
    const validatedData = CreateWaitlistSchema.parse(req.body);

    const result = await createWaitlist(validatedData);

    if (result.success) {
      res.status(201).json({
        success: true,
        // data: result.data,
        // message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        error: 'Dữ liệu không hợp lệ',
        details: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Lỗi server'
      });
    }
  }
}

/**
 * Lấy danh sách waitlist
 * GET /api/reservations/waitlist
 */
export async function getWaitlistController(req: Request, res: Response) {
  try {
    const { restaurant_id, status } = req.query;

    if (!restaurant_id) {
      return res.status(400).json({
        success: false,
        error: 'ID nhà hàng là bắt buộc'
      });
    }

    const result = await getWaitlist(restaurant_id as string, status as string);

    if (result.success) {
      res.status(200).json({
        success: true,
        // data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Lỗi server'
    });
  }
}

/**
 * Cập nhật trạng thái waitlist
 * PATCH /api/reservations/waitlist/:id/status
 */
export async function updateWaitlistStatusController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID waitlist là bắt buộc'
      });
    }

    const result = await updateWaitlistStatus(id, status, notes);

    if (result.success) {
      res.status(200).json({
        success: true,
        // data: result.data,
        // message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Lỗi server'
    });
  }
}

/**
 * Lấy đặt bàn theo khách hàng
 * GET /api/reservations/customer/:customer_id
 */
export async function getReservationsByCustomerController(req: Request, res: Response) {
  try {
    const { customer_id } = req.params;
    const { status } = req.query;

    if (!customer_id) {
      return res.status(400).json({
        success: false,
        error: 'ID khách hàng là bắt buộc'
      });
    }

    const result = await getReservationsByCustomer(customer_id, status as string);

    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Lỗi server'
    });
  }
}

/**
 * Tìm kiếm đặt bàn theo số điện thoại
 * GET /api/reservations/search/phone
 */
export async function searchReservationsByPhoneController(req: Request, res: Response) {
  try {
    const { phone, restaurant_id } = req.query;

    if (!phone) {
      return res.status(400).json({
        success: false,
        error: 'Số điện thoại là bắt buộc'
      });
    }

    const result = await searchReservationsByPhone(phone as string, restaurant_id as string);

    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Lỗi server'
    });
  }
}

/**
 * Lấy thống kê đặt bàn theo ngày
 * GET /api/reservations/stats/daily
 */
export async function getDailyReservationStatsController(req: Request, res: Response) {
  try {
    const { restaurant_id, date } = req.query;

    if (!restaurant_id || !date) {
      return res.status(400).json({
        success: false,
        error: 'ID nhà hàng và ngày là bắt buộc'
      });
    }

    const result = await getDailyReservationStats(restaurant_id as string, date as string);

    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Lỗi server'
    });
  }
}
