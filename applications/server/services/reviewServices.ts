import { PrismaClient } from '@prisma/client';
import type {
  CreateRestaurantReviewRequest,
  CreateMenuItemReviewRequest,
  CreateOrderReviewRequest,
  UpdateReviewRequest,
  ReviewResponseRequest,
  ReviewQueryRequest,
  ReviewStatsQueryRequest,
  BulkReviewActionRequest,
  ReviewModerationRequest,
  ReviewExportRequest
} from '@/schemas/reviewSchemas';

const prisma = new PrismaClient();

// ================================
// 🌟 REVIEW MANAGEMENT SERVICES
// ================================

// Create restaurant review
export const createRestaurantReview = async (
  customerId: string,
  data: CreateRestaurantReviewRequest
) => {
  try {
    // Validate customer exists
    const customer = await prisma.users.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      throw new Error('Khách hàng không tồn tại');
    }

    // Validate restaurant exists
    const restaurant = await prisma.restaurants.findUnique({
      where: { id: data.restaurant_id }
    });

    if (!restaurant) {
      throw new Error('Nhà hàng không tồn tại');
    }

    // Check if customer has ordered from this restaurant (optional validation)
    if (data.order_id) {
      const order = await prisma.orders.findFirst({
        where: {
          id: data.order_id,
          customer_id: customerId,
          restaurant_id: data.restaurant_id,
          status: 'completed'
        }
      });

      if (!order) {
        throw new Error('Đơn hàng không hợp lệ hoặc chưa hoàn thành');
      }

      // Check if review already exists for this order
      const existingReview = await prisma.reviews.findFirst({
        where: {
          customer_id: customerId,
          order_id: data.order_id,
          restaurant_id: data.restaurant_id
        }
      });

      if (existingReview) {
        throw new Error('Bạn đã đánh giá đơn hàng này rồi');
      }
    }

    const review = await prisma.reviews.create({
      data: {
        customer_id: customerId,
        restaurant_id: data.restaurant_id,
        order_id: data.order_id,
        rating: data.rating,
        title: data.title,
        content: data.content,
        photos: data.photos || []
      },
      include: {
        customers: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true
          }
        },
        restaurants: {
          select: {
            id: true,
            name: true
          }
        },
        orders: data.order_id ? {
          select: {
            id: true,
            order_code: true,
            created_at: true
          }
        } : false
      }
    });

    return review;
  } catch (error) {
    throw error;
  }
};

// Create menu item review
export const createMenuItemReview = async (
  customerId: string,
  data: CreateMenuItemReviewRequest
) => {
  try {
    // Validate menu item exists
    const menuItem = await prisma.menu_items.findUnique({
      where: { id: data.menu_item_id },
      include: {
        menus: {
          include: {
            restaurants: true
          }
        }
      }
    });

    if (!menuItem) {
      throw new Error('Món ăn không tồn tại');
    }

    // Validate order if provided
    if (data.order_id) {
      const order = await prisma.orders.findFirst({
        where: {
          id: data.order_id,
          customer_id: customerId,
          status: 'completed'
        },
        include: {
          order_items: {
            where: {
              menu_item_id: data.menu_item_id
            }
          }
        }
      });

      if (!order || order.order_items.length === 0) {
        throw new Error('Bạn chưa đặt món này hoặc đơn hàng chưa hoàn thành');
      }

      // Check existing review
      const existingReview = await prisma.reviews.findFirst({
        where: {
          customer_id: customerId,
          menu_item_id: data.menu_item_id,
          order_id: data.order_id
        }
      });

      if (existingReview) {
        throw new Error('Bạn đã đánh giá món này rồi');
      }
    }

    const review = await prisma.reviews.create({
      data: {
        customer_id: customerId,
        restaurant_id: menuItem.menus.restaurant_id,
        menu_item_id: data.menu_item_id,
        order_id: data.order_id,
        rating: data.rating,
        title: data.title,
        content: data.content,
        photos: data.photos || []
      },
      include: {
        customers: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true
          }
        },
        menu_items: {
          select: {
            id: true,
            name: true,
            image_url: true
          }
        },
        restaurants: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return review;
  } catch (error) {
    throw error;
  }
};

// Create order review
export const createOrderReview = async (
  customerId: string,
  data: CreateOrderReviewRequest
) => {
  try {
    // Validate order
    const order = await prisma.orders.findFirst({
      where: {
        id: data.order_id,
        customer_id: customerId,
        status: 'completed'
      },
      include: {
        restaurants: true
      }
    });

    if (!order) {
      throw new Error('Đơn hàng không hợp lệ hoặc chưa hoàn thành');
    }

    // Check existing review
    const existingReview = await prisma.reviews.findFirst({
      where: {
        customer_id: customerId,
        order_id: data.order_id
      }
    });

    if (existingReview) {
      throw new Error('Bạn đã đánh giá đơn hàng này rồi');
    }

    const review = await prisma.reviews.create({
      data: {
        customer_id: customerId,
        restaurant_id: order.restaurant_id,
        order_id: data.order_id,
        rating: data.rating,
        title: data.title,
        content: data.content,
        photos: data.photos || []
      },
      include: {
        customers: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true
          }
        },
        restaurants: {
          select: {
            id: true,
            name: true
          }
        },
        orders: {
          select: {
            id: true,
            order_code: true,
            order_type: true,
            created_at: true
          }
        }
      }
    });

    return review;
  } catch (error) {
    throw error;
  }
};

// Get reviews with filters
export const getReviews = async (params: ReviewQueryRequest) => {
  try {
    const {
      restaurant_id,
      menu_item_id,
      customer_id,
      order_id,
      rating,
      status,
      has_photos,
      has_response,
      sort_by,
      sort_order,
      page,
      limit,
      date_from,
      date_to
    } = params;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      status: status || 'active'
    };

    if (restaurant_id) where.restaurant_id = restaurant_id;
    if (menu_item_id) where.menu_item_id = menu_item_id;
    if (customer_id) where.customer_id = customer_id;
    if (order_id) where.order_id = order_id;
    if (rating) where.rating = rating;
    if (has_photos !== undefined) {
      where.photos = has_photos ? { isEmpty: false } : { isEmpty: true };
    }
    if (has_response !== undefined) {
      where.response = has_response ? { not: null } : null;
    }

    if (date_from || date_to) {
      where.created_at = {};
      if (date_from) where.created_at.gte = new Date(date_from);
      if (date_to) where.created_at.lte = new Date(date_to);
    }

    // Get reviews with count
    const [reviews, total] = await Promise.all([
      prisma.reviews.findMany({
        where,
        include: {
          customers: {
            select: {
              id: true,
              full_name: true,
              avatar_url: true
            }
          },
          restaurants: {
            select: {
              id: true,
              name: true,
              logo_url: true
            }
          },
          menu_items: {
            select: {
              id: true,
              name: true,
              image_url: true,
              price: true
            }
          },
          orders: {
            select: {
              id: true,
              order_code: true,
              order_type: true,
              created_at: true
            }
          }
        },
        orderBy: {
          [sort_by]: sort_order
        },
        skip,
        take: limit
      }),
      prisma.reviews.count({ where })
    ]);

    return {
      reviews,
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

// Get review by ID
export const getReviewById = async (reviewId: string) => {
  try {
    const review = await prisma.reviews.findUnique({
      where: { id: reviewId },
      include: {
        customers: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true,
            total_orders: true
          }
        },
        restaurants: {
          select: {
            id: true,
            name: true,
            logo_url: true,
            address: true
          }
        },
        menu_items: {
          select: {
            id: true,
            name: true,
            image_url: true,
            price: true,
            description: true
          }
        },
        orders: {
          select: {
            id: true,
            order_code: true,
            order_type: true,
            created_at: true,
            final_amount: true
          }
        }
      }
    });

    if (!review) {
      throw new Error('Đánh giá không tồn tại');
    }

    return review;
  } catch (error) {
    throw error;
  }
};

// Update review
export const updateReview = async (
  reviewId: string,
  customerId: string,
  data: UpdateReviewRequest
) => {
  try {
    // Validate review exists and belongs to customer
    const existingReview = await prisma.reviews.findFirst({
      where: {
        id: reviewId,
        customer_id: customerId
      }
    });

    if (!existingReview) {
      throw new Error('Đánh giá không tồn tại hoặc bạn không có quyền chỉnh sửa');
    }

    const updatedReview = await prisma.reviews.update({
      where: { id: reviewId },
      data: {
        ...data,
        updated_at: new Date()
      },
      include: {
        customers: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true
          }
        },
        restaurants: {
          select: {
            id: true,
            name: true
          }
        },
        menu_items: {
          select: {
            id: true,
            name: true,
            image_url: true
          }
        }
      }
    });

    return updatedReview;
  } catch (error) {
    throw error;
  }
};

// Add restaurant response to review
export const addReviewResponse = async (
  reviewId: string,
  staffId: string,
  data: ReviewResponseRequest
) => {
  try {
    // Validate review exists
    const review = await prisma.reviews.findUnique({
      where: { id: reviewId },
      include: {
        restaurants: true
      }
    });

    if (!review) {
      throw new Error('Đánh giá không tồn tại');
    }

    // Validate staff has permission to respond
    const staff = await prisma.restaurant_staffs.findFirst({
      where: {
        user_id: staffId,
        restaurant_id: review.restaurant_id || '',
        status: 'active',
        role: {
          in: ['manager', 'staff', 'supervisor']
        }
      }
    });

    if (!staff || !review.restaurant_id) {
      throw new Error('Bạn không có quyền phản hồi đánh giá này');
    }

    const updatedReview = await prisma.reviews.update({
      where: { id: reviewId },
      data: {
        response: data.response,
        responded_at: new Date()
      },
      include: {
        customers: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true
          }
        },
        restaurants: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return updatedReview;
  } catch (error) {
    throw error;
  }
};

// Delete review
export const deleteReview = async (reviewId: string, customerId: string) => {
  try {
    const review = await prisma.reviews.findFirst({
      where: {
        id: reviewId,
        customer_id: customerId
      }
    });

    if (!review) {
      throw new Error('Đánh giá không tồn tại hoặc bạn không có quyền xóa');
    }

    await prisma.reviews.delete({
      where: { id: reviewId }
    });

    return { message: 'Xóa đánh giá thành công' };
  } catch (error) {
    throw error;
  }
};

// Get review statistics
export const getReviewStats = async (params: ReviewStatsQueryRequest) => {
  try {
    const { restaurant_id, menu_item_id, period, date_from, date_to } = params;

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
      status: 'active',
      created_at: {
        gte: startDate,
        lte: endDate
      }
    };

    if (restaurant_id) where.restaurant_id = restaurant_id;
    if (menu_item_id) where.menu_item_id = menu_item_id;

    // Get basic stats
    const [
      totalReviews,
      averageRating,
      ratingDistribution
    ] = await Promise.all([
      prisma.reviews.count({ where }),
      prisma.reviews.aggregate({
        where,
        _avg: { rating: true }
      }),
      prisma.reviews.groupBy({
        by: ['rating'],
        where,
        _count: true,
        orderBy: { rating: 'asc' }
      })
    ]);

    // Get recent reviews
    const recentReviews = await prisma.reviews.findMany({
      where,
      include: {
        customers: {
          select: {
            full_name: true,
            avatar_url: true
          }
        },
        menu_items: {
          select: {
            name: true
          }
        }
      },
      orderBy: { created_at: 'desc' },
      take: 5
    });

    // Get reviews with photos count
    const reviewsWithPhotos = await prisma.reviews.count({
      where: {
        ...where,
        photos: {
          isEmpty: false
        }
      }
    });

    // Get reviews with responses count
    const reviewsWithResponses = await prisma.reviews.count({
      where: {
        ...where,
        response: {
          not: null
        }
      }
    });

    return {
      summary: {
        total_reviews: totalReviews,
        average_rating: averageRating._avg.rating ? Number(averageRating._avg.rating.toFixed(1)) : 0,
        reviews_with_photos: reviewsWithPhotos,
        reviews_with_responses: reviewsWithResponses,
        response_rate: totalReviews > 0 ? Number(((reviewsWithResponses / totalReviews) * 100).toFixed(1)) : 0
      },
      rating_distribution: ratingDistribution.map(item => ({
        rating: item.rating,
        count: item._count,
        percentage: totalReviews > 0 ? Number(((item._count / totalReviews) * 100).toFixed(1)) : 0
      })),
      recent_reviews: recentReviews,
      period: {
        start_date: startDate,
        end_date: endDate,
        period_type: period || 'custom'
      }
    };
  } catch (error) {
    throw error;
  }
};

// Bulk review actions (admin/staff)
export const bulkReviewAction = async (
  staffId: string,
  data: BulkReviewActionRequest
) => {
  try {
    const { review_ids, action, reason } = data;

    // Validate staff permissions
    const staff = await prisma.restaurant_staffs.findFirst({
      where: {
        user_id: staffId,
        status: 'active',
        role: {
          in: ['manager', 'supervisor']
        }
      }
    });

    if (!staff) {
      throw new Error('Bạn không có quyền thực hiện thao tác này');
    }

    let updateData: any = { updated_at: new Date() };

    switch (action) {
      case 'hide':
        updateData.status = 'hidden';
        break;
      case 'show':
        updateData.status = 'active';
        break;
      case 'flag':
        updateData.status = 'flagged';
        break;
      case 'unflag':
        updateData.status = 'active';
        break;
      case 'delete':
        updateData.status = 'deleted';
        break;
    }

    const result = await prisma.reviews.updateMany({
      where: {
        id: { in: review_ids },
        restaurant_id: staff.restaurant_id
      },
      data: updateData
    });

    return {
      updated_count: result.count,
      action,
      reason,
      timestamp: new Date()
    };
  } catch (error) {
    throw error;
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
  bulkReviewAction
};
