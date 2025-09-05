import { PrismaClient } from '@prisma/client';
import * as tf from '@tensorflow/tfjs-node';
import { Matrix } from 'ml-matrix';

const prisma = new PrismaClient();

// ================================
// 🤖 AI RECOMMENDATION ENGINE  
// ================================

export interface MenuRecommendation {
  menu_item_id: string;
  confidence_score: number;
  reason: string;
  price: number;
  category: string;
  name: string;
}

export interface CustomerProfile {
  customer_id: string;
  preferred_categories: string[];
  average_order_value: number;
  order_frequency: number;
  favorite_times: string[];
  dietary_preferences: string[];
}

// Collaborative Filtering Recommendation
export const getPersonalizedRecommendations = async (
  customerId: string,
  limit: number = 10
): Promise<MenuRecommendation[]> => {
  try {
    // 1. Get customer order history
    const customerOrders = await prisma.orders.findMany({
      where: { customer_id: customerId },
      include: {
        order_items: {
          include: {
            menu_items: {
              include: {
                categories: true,
                menus: {
                  include: {
                    restaurants: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' },
      take: 50 // Last 50 orders
    });

    if (customerOrders.length === 0) {
      // New customer - return popular items
      return await getPopularRecommendations(limit);
    }

    // 2. Build customer profile
    const profile = await buildCustomerProfile(customerId, customerOrders);
    
    // 3. Find similar customers
    const similarCustomers = await findSimilarCustomers(profile);
    
    // 4. Generate recommendations based on similar customers' preferences
    const recommendations = await generateCollaborativeRecommendations(
      profile,
      similarCustomers,
      limit
    );

    return recommendations;
  } catch (error) {
    console.error('Error in personalized recommendations:', error);
    return await getPopularRecommendations(limit);
  }
};

// Content-Based Filtering
export const getContentBasedRecommendations = async (
  customerId: string,
  limit: number = 10
): Promise<MenuRecommendation[]> => {
  try {
    // Get customer's order history
    const recentOrders = await prisma.orders.findMany({
      where: { 
        customer_id: customerId,
        status: 'completed'
      },
      include: {
        order_items: {
          include: {
            menu_items: {
              include: {
                categories: true
              }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' },
      take: 20
    });

    if (recentOrders.length === 0) {
      return await getPopularRecommendations(limit);
    }

    // Extract customer preferences
    const likedCategories = new Map<string, number>();
    const likedPriceRange = { min: Infinity, max: 0 };
    
    recentOrders.forEach(order => {
      order.order_items.forEach(item => {
        const category = item.menu_items.categories?.name || 'other';
        likedCategories.set(category, (likedCategories.get(category) || 0) + item.quantity);
        
        const price = Number(item.menu_items.price);
        likedPriceRange.min = Math.min(likedPriceRange.min, price);
        likedPriceRange.max = Math.max(likedPriceRange.max, price);
      });
    });

    // Find similar items
    const candidateItems = await prisma.menu_items.findMany({
      where: {
        is_available: true,
        price: {
          gte: likedPriceRange.min * 0.7,
          lte: likedPriceRange.max * 1.3
        }
      },
      include: {
        categories: true,
        menus: {
          include: {
            restaurants: true
          }
        }
      },
      take: 100
    });

    // Score items based on similarity to customer preferences
    const recommendations: MenuRecommendation[] = candidateItems
      .map(item => {
        const categoryScore = likedCategories.get(item.categories?.name || 'other') || 0;
        const priceScore = calculatePriceScore(Number(item.price), likedPriceRange);
        
        const confidence_score = (categoryScore * 0.6 + priceScore * 0.4) / 100;
        
        return {
          menu_item_id: item.id,
          confidence_score,
          reason: `Dựa trên sở thích ${item.categories?.name || 'món ăn'} của bạn`,
          price: Number(item.price),
          category: item.categories?.name || 'Khác',
          name: item.name
        };
      })
      .filter(item => item.confidence_score > 0.1)
      .sort((a, b) => b.confidence_score - a.confidence_score)
      .slice(0, limit);

    return recommendations;
  } catch (error) {
    console.error('Error in content-based recommendations:', error);
    return await getPopularRecommendations(limit);
  }
};

// Seasonal/Time-based Recommendations
export const getSeasonalRecommendations = async (
  restaurantId: string,
  limit: number = 10
): Promise<MenuRecommendation[]> => {
  try {
    const currentHour = new Date().getHours();
    const currentMonth = new Date().getMonth() + 1;
    
    let timeCategory = 'dinner';
    if (currentHour < 11) timeCategory = 'breakfast';
    else if (currentHour < 14) timeCategory = 'lunch';
    else if (currentHour < 17) timeCategory = 'afternoon';

    // Get popular items for this time period
    const popularItems = await prisma.$queryRaw`
      SELECT 
        mi.id as menu_item_id,
        mi.name,
        mi.price,
        c.name as category,
        COUNT(oi.id) as order_count,
        AVG(CASE WHEN r.rating IS NOT NULL THEN r.rating ELSE 0 END) as avg_rating
      FROM menu_items mi
      LEFT JOIN categories c ON mi.category_id = c.id
      LEFT JOIN order_items oi ON mi.id = oi.menu_item_id
      LEFT JOIN orders o ON oi.order_id = o.id
      LEFT JOIN restaurant_reviews r ON mi.id = r.menu_item_id
      WHERE mi.is_available = true
        AND mi.menu_id IN (
          SELECT id FROM menus WHERE restaurant_id = ${restaurantId}
        )
        AND (
          EXTRACT(HOUR FROM o.created_at) BETWEEN ${currentHour - 2} AND ${currentHour + 2}
          OR o.created_at IS NULL
        )
      GROUP BY mi.id, mi.name, mi.price, c.name
      ORDER BY order_count DESC, avg_rating DESC
      LIMIT ${limit}
    ` as any[];

    return popularItems.map(item => ({
      menu_item_id: item.menu_item_id,
      confidence_score: Math.min(0.9, (item.order_count * 0.1 + item.avg_rating * 0.15)),
      reason: `Phổ biến vào ${timeCategory === 'breakfast' ? 'buổi sáng' : 
                         timeCategory === 'lunch' ? 'buổi trưa' : 
                         timeCategory === 'afternoon' ? 'buổi chiều' : 'buổi tối'}`,
      price: Number(item.price || 0),
      category: item.category || 'Khác',
      name: item.name || 'Món ăn'
    }));

  } catch (error) {
    console.error('Error in seasonal recommendations:', error);
    return [];
  }
};

// Trending Items Recommendation
export const getTrendingRecommendations = async (
  restaurantId: string,
  limit: number = 10
): Promise<MenuRecommendation[]> => {
  try {
    // Get items with increasing order frequency in last 7 days
    const trendingItems = await prisma.$queryRaw`
      WITH recent_orders AS (
        SELECT 
          oi.menu_item_id,
          DATE(o.created_at) as order_date,
          COUNT(*) as daily_orders
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        JOIN menu_items mi ON oi.menu_item_id = mi.id
        JOIN menus m ON mi.menu_id = m.id
        WHERE o.created_at >= NOW() - INTERVAL '7 days'
          AND m.restaurant_id = ${restaurantId}
          AND o.status = 'completed'
        GROUP BY oi.menu_item_id, DATE(o.created_at)
      ),
      trending_calc AS (
        SELECT 
          menu_item_id,
          AVG(CASE WHEN order_date >= CURRENT_DATE - 3 THEN daily_orders ELSE 0 END) as recent_avg,
          AVG(CASE WHEN order_date < CURRENT_DATE - 3 THEN daily_orders ELSE 0 END) as previous_avg
        FROM recent_orders
        GROUP BY menu_item_id
        HAVING COUNT(*) >= 3
      )
      SELECT 
        mi.id as menu_item_id,
        mi.name,
        mi.price,
        c.name as category,
        tc.recent_avg,
        tc.previous_avg,
        CASE 
          WHEN tc.previous_avg > 0 THEN (tc.recent_avg - tc.previous_avg) / tc.previous_avg
          ELSE tc.recent_avg
        END as growth_rate
      FROM trending_calc tc
      JOIN menu_items mi ON tc.menu_item_id = mi.id
      LEFT JOIN categories c ON mi.category_id = c.id
      WHERE mi.is_available = true
      ORDER BY growth_rate DESC
      LIMIT ${limit}
    ` as any[];

    return trendingItems.map(item => ({
      menu_item_id: item.menu_item_id,
      confidence_score: Math.min(0.95, Math.max(0.1, item.growth_rate * 0.5 + 0.3)),
      reason: `Đang hot! Tăng ${Math.round(item.growth_rate * 100)}% so với tuần trước`,
      price: Number(item.price || 0),
      category: item.category || 'Khác',
      name: item.name || 'Món ăn'
    }));

  } catch (error) {
    console.error('Error in trending recommendations:', error);
    return [];
  }
};

// Helper Functions
const buildCustomerProfile = async (customerId: string, orders: any[]): Promise<CustomerProfile> => {
  const categories = new Map<string, number>();
  let totalValue = 0;
  const orderTimes: number[] = [];

  orders.forEach(order => {
    totalValue += Number(order.final_amount || 0);
    orderTimes.push(new Date(order.created_at).getHours());
    
    order.order_items.forEach((item: any) => {
      const category = item.menu_items.categories?.name || 'other';
      categories.set(category, (categories.get(category) || 0) + item.quantity);
    });
  });

  const averageOrderValue = totalValue / orders.length;
  const preferredCategories = Array.from(categories.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category]) => category);

  return {
    customer_id: customerId,
    preferred_categories: preferredCategories,
    average_order_value: averageOrderValue,
    order_frequency: orders.length,
    favorite_times: getMostFrequentTimes(orderTimes),
    dietary_preferences: [] // TODO: Implement dietary preference detection
  };
};

const findSimilarCustomers = async (profile: CustomerProfile): Promise<string[]> => {
  // Simplified similarity calculation - can be enhanced with ML
  const similarCustomers = await prisma.$queryRaw`
    SELECT DISTINCT o.customer_id
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN menu_items mi ON oi.menu_item_id = mi.id
    JOIN categories c ON mi.category_id = c.id
    WHERE c.name = ANY(${profile.preferred_categories})
      AND o.customer_id != ${profile.customer_id}
      AND o.final_amount BETWEEN ${profile.average_order_value * 0.7} AND ${profile.average_order_value * 1.3}
    GROUP BY o.customer_id
    HAVING COUNT(DISTINCT oi.id) >= 3
    LIMIT 20
  ` as { customer_id: string }[];

  return similarCustomers.map(c => c.customer_id);
};

const generateCollaborativeRecommendations = async (
  profile: CustomerProfile,
  similarCustomers: string[],
  limit: number
): Promise<MenuRecommendation[]> => {
  if (similarCustomers.length === 0) {
    return await getPopularRecommendations(limit);
  }

  const recommendations = await prisma.$queryRaw`
    SELECT 
      mi.id as menu_item_id,
      mi.name,
      mi.price,
      c.name as category,
      COUNT(oi.id) as popularity_score,
      AVG(CASE WHEN rr.rating IS NOT NULL THEN rr.rating ELSE 0 END) as avg_rating
    FROM menu_items mi
    LEFT JOIN categories c ON mi.category_id = c.id
    LEFT JOIN order_items oi ON mi.id = oi.menu_item_id
    LEFT JOIN orders o ON oi.order_id = o.id
    LEFT JOIN restaurant_reviews rr ON mi.id = rr.menu_item_id
    WHERE o.customer_id = ANY(${similarCustomers})
      AND mi.is_available = true
      AND mi.id NOT IN (
        SELECT DISTINCT oi2.menu_item_id 
        FROM order_items oi2 
        JOIN orders o2 ON oi2.order_id = o2.id 
        WHERE o2.customer_id = ${profile.customer_id}
      )
    GROUP BY mi.id, mi.name, mi.price, c.name
    ORDER BY popularity_score DESC, avg_rating DESC
    LIMIT ${limit}
  ` as any[];

  return recommendations.map(item => ({
    menu_item_id: item.menu_item_id,
    confidence_score: Math.min(0.9, (item.popularity_score * 0.1 + item.avg_rating * 0.15)),
    reason: 'Khách hàng có sở thích tương tự đã thích món này',
    price: Number(item.price || 0),
    category: item.category || 'Khác',
    name: item.name || 'Món ăn'
  }));
};

const getPopularRecommendations = async (limit: number): Promise<MenuRecommendation[]> => {
  try {
    const popularItems = await prisma.$queryRaw`
      SELECT 
        mi.id as menu_item_id,
        mi.name,
        mi.price,
        c.name as category,
        COUNT(oi.id) as order_count,
        AVG(CASE WHEN rr.rating IS NOT NULL THEN rr.rating ELSE 4.0 END) as avg_rating
      FROM menu_items mi
      LEFT JOIN categories c ON mi.category_id = c.id
      LEFT JOIN order_items oi ON mi.id = oi.menu_item_id
      LEFT JOIN restaurant_reviews rr ON mi.id = rr.menu_item_id
      WHERE mi.is_available = true
        AND mi.is_featured = true
      GROUP BY mi.id, mi.name, mi.price, c.name
      ORDER BY order_count DESC, avg_rating DESC
      LIMIT ${limit}
    ` as any[];

    return popularItems.map(item => ({
      menu_item_id: item.menu_item_id,
      confidence_score: Math.min(0.8, (item.order_count * 0.05 + item.avg_rating * 0.15)),
      reason: 'Món phổ biến được nhiều khách hàng yêu thích',
      price: Number(item.price || 0),
      category: item.category || 'Khác',
      name: item.name || 'Món ăn'
    }));
  } catch (error) {
    console.error('Error in popular recommendations:', error);
    return [];
  }
};

const calculatePriceScore = (itemPrice: number, priceRange: { min: number; max: number }): number => {
  const midPoint = (priceRange.min + priceRange.max) / 2;
  const distance = Math.abs(itemPrice - midPoint);
  const maxDistance = Math.max(midPoint - priceRange.min, priceRange.max - midPoint);
  return Math.max(0, 100 - (distance / maxDistance) * 100);
};

const getMostFrequentTimes = (times: number[]): string[] => {
  const timeRanges = ['morning', 'lunch', 'afternoon', 'dinner', 'late'];
  const counts = [0, 0, 0, 0, 0];
  
  times.forEach(hour => {
    if (hour < 11) counts[0]++;
    else if (hour < 14) counts[1]++;
    else if (hour < 17) counts[2]++;
    else if (hour < 21) counts[3]++;
    else counts[4]++;
  });

  return timeRanges
    .map((range, index) => ({ range, count: counts[index] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 2)
    .map(item => item.range);
};

// Main recommendation aggregator
export const getAIRecommendations = async (
  customerId: string,
  restaurantId?: string,
  options: {
    includePersonalized?: boolean;
    includeContentBased?: boolean;
    includeSeasonal?: boolean;
    includeTrending?: boolean;
    limit?: number;
  } = {}
): Promise<MenuRecommendation[]> => {
  const {
    includePersonalized = true,
    includeContentBased = true,
    includeSeasonal = true,
    includeTrending = true,
    limit = 20
  } = options;

  const allRecommendations: MenuRecommendation[] = [];

  try {
    // Get different types of recommendations
    if (includePersonalized) {
      const personalized = await getPersonalizedRecommendations(customerId, Math.ceil(limit * 0.4));
      allRecommendations.push(...personalized);
    }

    if (includeContentBased) {
      const contentBased = await getContentBasedRecommendations(customerId, Math.ceil(limit * 0.3));
      allRecommendations.push(...contentBased);
    }

    if (includeSeasonal && restaurantId) {
      const seasonal = await getSeasonalRecommendations(restaurantId, Math.ceil(limit * 0.2));
      allRecommendations.push(...seasonal);
    }

    if (includeTrending && restaurantId) {
      const trending = await getTrendingRecommendations(restaurantId, Math.ceil(limit * 0.1));
      allRecommendations.push(...trending);
    }

    // Remove duplicates and sort by confidence score
    const uniqueRecommendations = new Map<string, MenuRecommendation>();
    allRecommendations.forEach(rec => {
      const existing = uniqueRecommendations.get(rec.menu_item_id);
      if (!existing || rec.confidence_score > existing.confidence_score) {
        uniqueRecommendations.set(rec.menu_item_id, rec);
      }
    });

    return Array.from(uniqueRecommendations.values())
      .sort((a, b) => b.confidence_score - a.confidence_score)
      .slice(0, limit);

  } catch (error) {
    console.error('Error in AI recommendations:', error);
    return await getPopularRecommendations(limit);
  }
};
