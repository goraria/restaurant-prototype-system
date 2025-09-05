import { PrismaClient } from '@prisma/client';
import * as stats from 'simple-statistics';

const prisma = new PrismaClient();

// ================================
// 📊 CUSTOMER ANALYTICS & AI INSIGHTS
// ================================

export interface CustomerInsight {
  customer_id: string;
  segment: 'high_value' | 'frequent' | 'at_risk' | 'new' | 'loyal';
  lifetime_value: number;
  predicted_churn_risk: number;
  preferences: {
    favorite_categories: string[];
    preferred_times: string[];
    average_order_value: number;
    order_frequency: 'daily' | 'weekly' | 'monthly' | 'occasional';
  };
  recommendations: {
    retention_strategy: string;
    upsell_opportunities: string[];
    optimal_contact_time: string;
  };
}

export interface CustomerSegmentation {
  segment_name: string;
  customer_count: number;
  total_revenue: number;
  average_order_value: number;
  retention_rate: number;
  characteristics: string[];
}

// Analyze customer behavior and segment them
export const analyzeCustomerBehavior = async (restaurantId: string): Promise<{
  segments: CustomerSegmentation[];
  insights: CustomerInsight[];
}> => {
  try {
    // Get all customers with their order data
    const customersData = await prisma.$queryRaw`
      SELECT 
        u.id as customer_id,
        u.full_name,
        u.created_at as registration_date,
        COUNT(DISTINCT o.id) as total_orders,
        SUM(o.final_amount) as total_spent,
        AVG(o.final_amount) as avg_order_value,
        MAX(o.created_at) as last_order_date,
        MIN(o.created_at) as first_order_date,
        COUNT(DISTINCT DATE(o.created_at)) as active_days,
        AVG(EXTRACT(HOUR FROM o.created_at)) as preferred_hour
      FROM users u
      LEFT JOIN orders o ON u.id = o.customer_id
      WHERE o.restaurant_id = ${restaurantId}
        OR o.restaurant_id IS NULL
      GROUP BY u.id, u.full_name, u.created_at
      HAVING COUNT(o.id) > 0
    ` as any[];

    const insights: CustomerInsight[] = [];
    const segmentCounts = {
      high_value: 0,
      frequent: 0,
      at_risk: 0,
      new: 0,
      loyal: 0
    };

    for (const customer of customersData) {
      const insight = await generateCustomerInsight(customer);
      insights.push(insight);
      segmentCounts[insight.segment]++;
    }

    // Generate segment analytics
    const segments = await generateSegmentAnalytics(customersData, segmentCounts);

    return { segments, insights };
  } catch (error) {
    console.error('Error in customer behavior analysis:', error);
    throw new Error('Failed to analyze customer behavior');
  }
};

// Predict customer churn risk
export const predictChurnRisk = async (customerId: string): Promise<{
  churn_probability: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  key_factors: string[];
  retention_recommendations: string[];
}> => {
  try {
    // Get customer data for last 6 months
    const customerData = await prisma.$queryRaw`
      SELECT 
        COUNT(DISTINCT o.id) as total_orders,
        SUM(o.final_amount) as total_spent,
        AVG(o.final_amount) as avg_order_value,
        MAX(o.created_at) as last_order_date,
        COUNT(DISTINCT DATE(o.created_at)) as active_days,
        COUNT(CASE WHEN o.created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as recent_orders,
        COUNT(CASE WHEN o.created_at >= CURRENT_DATE - INTERVAL '90 days' THEN 1 END) as quarterly_orders,
        AVG(CASE WHEN rr.rating IS NOT NULL THEN rr.rating ELSE NULL END) as avg_rating
      FROM orders o
      LEFT JOIN restaurant_reviews rr ON o.id = rr.order_id
      WHERE o.customer_id = ${customerId}
        AND o.created_at >= CURRENT_DATE - INTERVAL '180 days'
    ` as any[];

    if (!customerData[0] || customerData[0].total_orders === 0) {
      return {
        churn_probability: 0.8,
        risk_level: 'high',
        key_factors: ['No recent orders'],
        retention_recommendations: ['Send welcome back offer', 'Personalized menu recommendations']
      };
    }

    const data = customerData[0];
    const daysSinceLastOrder = data.last_order_date ? 
      Math.floor((new Date().getTime() - new Date(data.last_order_date).getTime()) / (1000 * 60 * 60 * 24)) : 
      999;

    // Simple churn prediction model (can be enhanced with ML)
    let churnScore = 0;
    const factors: string[] = [];
    
    // Recency factor
    if (daysSinceLastOrder > 60) {
      churnScore += 0.4;
      factors.push('Không đặt hàng trong 60 ngày qua');
    } else if (daysSinceLastOrder > 30) {
      churnScore += 0.2;
      factors.push('Không đặt hàng trong 30 ngày qua');
    }
    
    // Frequency decline
    if (data.recent_orders < data.quarterly_orders * 0.3) {
      churnScore += 0.3;
      factors.push('Tần suất đặt hàng giảm mạnh');
    }
    
    // Low satisfaction (based on ratings)
    if (data.avg_rating && data.avg_rating < 3.5) {
      churnScore += 0.2;
      factors.push('Đánh giá thấp gần đây');
    }
    
    // Order value decline
    const expectedOrderValue = 150000; // Can be calculated from restaurant average
    if (data.avg_order_value < expectedOrderValue * 0.7) {
      churnScore += 0.1;
      factors.push('Giá trị đơn hàng thấp');
    }

    const churn_probability = Math.min(0.95, churnScore);
    let risk_level: 'low' | 'medium' | 'high' | 'critical';
    
    if (churn_probability < 0.3) risk_level = 'low';
    else if (churn_probability < 0.5) risk_level = 'medium';
    else if (churn_probability < 0.8) risk_level = 'high';
    else risk_level = 'critical';

    const retention_recommendations = generateRetentionRecommendations(risk_level, factors);

    return {
      churn_probability,
      risk_level,
      key_factors: factors,
      retention_recommendations
    };

  } catch (error) {
    console.error('Error in churn prediction:', error);
    throw new Error('Failed to predict churn risk');
  }
};

// Analyze customer lifetime value
export const calculateCustomerLifetimeValue = async (customerId: string): Promise<{
  current_value: number;
  predicted_value: number;
  value_segment: 'low' | 'medium' | 'high' | 'vip';
  growth_trend: 'increasing' | 'stable' | 'declining';
  recommendations: string[];
}> => {
  try {
    // Get historical order data
    const orderHistory = await prisma.orders.findMany({
      where: { customer_id: customerId },
      select: {
        final_amount: true,
        created_at: true
      },
      orderBy: { created_at: 'asc' }
    });

    if (orderHistory.length === 0) {
      return {
        current_value: 0,
        predicted_value: 0,
        value_segment: 'low',
        growth_trend: 'stable',
        recommendations: ['Encourage first order with welcome discount']
      };
    }

    const current_value = orderHistory.reduce((sum, order) => sum + Number(order.final_amount), 0);
    
    // Calculate monthly spending trend
    const monthlySpending = new Map<string, number>();
    orderHistory.forEach(order => {
      const monthKey = order.created_at.toISOString().substring(0, 7); // YYYY-MM
      monthlySpending.set(monthKey, (monthlySpending.get(monthKey) || 0) + Number(order.final_amount));
    });

    const monthlyValues = Array.from(monthlySpending.values());
    const trend = calculateTrend(monthlyValues);
    
    // Predict future value (simple linear regression)
    const predicted_value = current_value + (trend * 12); // Next 12 months
    
    // Determine value segment
    let value_segment: 'low' | 'medium' | 'high' | 'vip';
    if (current_value < 1000000) value_segment = 'low';
    else if (current_value < 5000000) value_segment = 'medium';
    else if (current_value < 10000000) value_segment = 'high';
    else value_segment = 'vip';

    const growth_trend: 'increasing' | 'stable' | 'declining' = 
      trend > 50000 ? 'increasing' : trend < -50000 ? 'declining' : 'stable';

    const recommendations = generateCLVRecommendations(value_segment, growth_trend);

    return {
      current_value,
      predicted_value: Math.max(0, predicted_value),
      value_segment,
      growth_trend,
      recommendations
    };

  } catch (error) {
    console.error('Error calculating CLV:', error);
    throw new Error('Failed to calculate customer lifetime value');
  }
};

// Demand forecasting for restaurant planning
export const forecastDemand = async (restaurantId: string, days_ahead: number = 30): Promise<{
  daily_forecasts: Array<{
    date: string;
    predicted_orders: number;
    predicted_revenue: number;
    confidence_interval: { lower: number; upper: number };
    peak_hours: number[];
  }>;
  insights: {
    busiest_days: string[];
    seasonal_patterns: string[];
    growth_trend: number;
    capacity_recommendations: string[];
  };
}> => {
  try {
    // Get historical data for the last 90 days
    const historicalData = await prisma.$queryRaw`
      SELECT 
        DATE(created_at) as order_date,
        COUNT(*) as daily_orders,
        SUM(final_amount) as daily_revenue,
        EXTRACT(DOW FROM created_at) as day_of_week,
        ARRAY_AGG(EXTRACT(HOUR FROM created_at)) as hours
      FROM orders
      WHERE restaurant_id = ${restaurantId}
        AND created_at >= CURRENT_DATE - INTERVAL '90 days'
        AND status = 'completed'
      GROUP BY DATE(created_at), EXTRACT(DOW FROM created_at)
      ORDER BY order_date
    ` as any[];

    if (historicalData.length < 7) {
      throw new Error('Insufficient historical data for forecasting');
    }

    const daily_forecasts = [];
    const baseDate = new Date();
    
    // Calculate averages by day of week
    const dayOfWeekStats = new Map<number, { orders: number[], revenue: number[] }>();
    historicalData.forEach(day => {
      const dow = day.day_of_week;
      if (!dayOfWeekStats.has(dow)) {
        dayOfWeekStats.set(dow, { orders: [], revenue: [] });
      }
      dayOfWeekStats.get(dow)!.orders.push(day.daily_orders);
      dayOfWeekStats.get(dow)!.revenue.push(day.daily_revenue);
    });

    // Generate forecasts
    for (let i = 1; i <= days_ahead; i++) {
      const forecastDate = new Date(baseDate);
      forecastDate.setDate(baseDate.getDate() + i);
      const dayOfWeek = forecastDate.getDay();
      
      const stats = dayOfWeekStats.get(dayOfWeek);
      if (!stats) continue;

      const avgOrders = stats.orders.reduce((a, b) => a + b, 0) / stats.orders.length;
      const avgRevenue = stats.revenue.reduce((a, b) => a + b, 0) / stats.revenue.length;
      
      // Add some seasonality and trend (simplified)
      const seasonalMultiplier = getSeasonalMultiplier(forecastDate);
      const trendMultiplier = 1 + (i * 0.001); // Small growth trend
      
      const predicted_orders = Math.round(avgOrders * seasonalMultiplier * trendMultiplier);
      const predicted_revenue = Math.round(avgRevenue * seasonalMultiplier * trendMultiplier);
      
      // Calculate confidence interval (±20%)
      const confidence_interval = {
        lower: Math.round(predicted_revenue * 0.8),
        upper: Math.round(predicted_revenue * 1.2)
      };

      // Predict peak hours (simplified - based on historical patterns)
      const peak_hours = [11, 12, 18, 19]; // Typical meal times

      daily_forecasts.push({
        date: forecastDate.toISOString().split('T')[0],
        predicted_orders,
        predicted_revenue,
        confidence_interval,
        peak_hours
      });
    }

    // Generate insights
    const insights = generateForecastInsights(historicalData, daily_forecasts);

    return { daily_forecasts, insights };

  } catch (error) {
    console.error('Error in demand forecasting:', error);
    throw new Error('Failed to forecast demand');
  }
};

// Helper functions
const generateCustomerInsight = async (customerData: any): Promise<CustomerInsight> => {
  const daysSinceLastOrder = customerData.last_order_date ? 
    Math.floor((new Date().getTime() - new Date(customerData.last_order_date).getTime()) / (1000 * 60 * 60 * 24)) : 
    999;
  
  const totalSpent = Number(customerData.total_spent || 0);
  const totalOrders = Number(customerData.total_orders || 0);
  const avgOrderValue = Number(customerData.avg_order_value || 0);

  // Determine segment
  let segment: CustomerInsight['segment'];
  if (totalSpent > 5000000 && totalOrders > 20) segment = 'high_value';
  else if (totalOrders > 15 && daysSinceLastOrder < 30) segment = 'frequent';
  else if (daysSinceLastOrder > 60) segment = 'at_risk';
  else if (totalOrders < 3) segment = 'new';
  else segment = 'loyal';

  // Calculate churn risk (simplified)
  let churn_risk = 0;
  if (daysSinceLastOrder > 90) churn_risk = 0.8;
  else if (daysSinceLastOrder > 60) churn_risk = 0.6;
  else if (daysSinceLastOrder > 30) churn_risk = 0.3;
  else churn_risk = 0.1;

  // Get customer preferences
  const preferences = await getCustomerPreferences(customerData.customer_id);

  const recommendations = generateRecommendations(segment, churn_risk);

  return {
    customer_id: customerData.customer_id,
    segment,
    lifetime_value: totalSpent,
    predicted_churn_risk: churn_risk,
    preferences: {
      favorite_categories: preferences.categories,
      preferred_times: preferences.times,
      average_order_value: avgOrderValue,
      order_frequency: getOrderFrequency(totalOrders, customerData.active_days)
    },
    recommendations
  };
};

const getCustomerPreferences = async (customerId: string) => {
  // Get customer's order patterns
  const preferences = await prisma.$queryRaw`
    SELECT 
      c.name as category,
      COUNT(*) as frequency,
      EXTRACT(HOUR FROM o.created_at) as hour
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN menu_items mi ON oi.menu_item_id = mi.id
    LEFT JOIN categories c ON mi.category_id = c.id
    WHERE o.customer_id = ${customerId}
    GROUP BY c.name, EXTRACT(HOUR FROM o.created_at)
  ` as any[];

  const categories = [...new Set(preferences.map(p => p.category))].slice(0, 3);
  const times = [...new Set(preferences.map(p => {
    const hour = p.hour;
    if (hour < 11) return 'morning';
    if (hour < 14) return 'lunch';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }))].slice(0, 2);

  return { categories, times };
};

const getOrderFrequency = (totalOrders: number, activeDays: number): 'daily' | 'weekly' | 'monthly' | 'occasional' => {
  const ordersPerDay = totalOrders / Math.max(activeDays, 1);
  if (ordersPerDay > 0.5) return 'daily';
  if (ordersPerDay > 0.1) return 'weekly';
  if (ordersPerDay > 0.03) return 'monthly';
  return 'occasional';
};

const generateRecommendations = (segment: CustomerInsight['segment'], churnRisk: number) => {
  const baseRecommendations = {
    retention_strategy: getRetentionStrategy(segment, churnRisk),
    upsell_opportunities: getUpsellOpportunities(segment),
    optimal_contact_time: getOptimalContactTime(segment)
  };

  return baseRecommendations;
};

const getRetentionStrategy = (segment: CustomerInsight['segment'], churnRisk: number): string => {
  if (churnRisk > 0.7) return 'Urgent: Send personalized win-back campaign with special offer';
  if (segment === 'high_value') return 'VIP treatment with exclusive menu items and priority service';
  if (segment === 'new') return 'Welcome series with onboarding offers and menu recommendations';
  return 'Regular engagement with loyalty rewards and seasonal promotions';
};

const getUpsellOpportunities = (segment: CustomerInsight['segment']): string[] => {
  const opportunities: string[] = [];
  
  if (segment === 'high_value') {
    opportunities.push('Premium tasting menu', 'Wine pairing', 'Private dining experience');
  } else if (segment === 'frequent') {
    opportunities.push('Combo meals', 'Dessert add-ons', 'Beverage upgrades');
  } else {
    opportunities.push('Side dishes', 'Seasonal specials', 'Loyalty program signup');
  }
  
  return opportunities;
};

const getOptimalContactTime = (segment: CustomerInsight['segment']): string => {
  // Based on segment behavior patterns
  if (segment === 'high_value') return '6-7 PM on weekdays';
  if (segment === 'frequent') return '11 AM - 12 PM for lunch promotions';
  return '5-6 PM for dinner suggestions';
};

const generateSegmentAnalytics = async (customersData: any[], segmentCounts: any): Promise<CustomerSegmentation[]> => {
  const segments: CustomerSegmentation[] = [];
  
  for (const [segmentName, count] of Object.entries(segmentCounts)) {
    const segmentCustomers = customersData.filter(c => {
      // Re-determine segment for each customer (simplified)
      const totalSpent = Number(c.total_spent || 0);
      const totalOrders = Number(c.total_orders || 0);
      const daysSinceLastOrder = c.last_order_date ? 
        Math.floor((new Date().getTime() - new Date(c.last_order_date).getTime()) / (1000 * 60 * 60 * 24)) : 
        999;

      if (segmentName === 'high_value') return totalSpent > 5000000 && totalOrders > 20;
      if (segmentName === 'frequent') return totalOrders > 15 && daysSinceLastOrder < 30;
      if (segmentName === 'at_risk') return daysSinceLastOrder > 60;
      if (segmentName === 'new') return totalOrders < 3;
      return true; // loyal
    });

    const totalRevenue = segmentCustomers.reduce((sum, c) => sum + Number(c.total_spent || 0), 0);
    const avgOrderValue = segmentCustomers.reduce((sum, c) => sum + Number(c.avg_order_value || 0), 0) / Math.max(segmentCustomers.length, 1);
    
    segments.push({
      segment_name: segmentName,
      customer_count: count as number,
      total_revenue: totalRevenue,
      average_order_value: avgOrderValue,
      retention_rate: calculateRetentionRate(segmentCustomers),
      characteristics: getSegmentCharacteristics(segmentName)
    });
  }

  return segments;
};

const calculateRetentionRate = (customers: any[]): number => {
  if (customers.length === 0) return 0;
  
  const recentlyActive = customers.filter(c => {
    const daysSinceLastOrder = c.last_order_date ? 
      Math.floor((new Date().getTime() - new Date(c.last_order_date).getTime()) / (1000 * 60 * 60 * 24)) : 
      999;
    return daysSinceLastOrder < 30;
  });

  return (recentlyActive.length / customers.length) * 100;
};

const getSegmentCharacteristics = (segmentName: string): string[] => {
  const characteristics: { [key: string]: string[] } = {
    high_value: ['High spending', 'Frequent orders', 'Long-term customers', 'Premium preferences'],
    frequent: ['Regular ordering', 'Medium spending', 'Consistent behavior', 'Time-sensitive'],
    at_risk: ['Declining activity', 'Potential churn', 'Need re-engagement', 'Price-sensitive'],
    new: ['Recent signup', 'Exploring menu', 'Building habits', 'Promotion-responsive'],
    loyal: ['Steady customers', 'Predictable orders', 'Word-of-mouth advocates', 'Relationship-focused']
  };

  return characteristics[segmentName] || ['Standard customers'];
};

const generateRetentionRecommendations = (riskLevel: string, factors: string[]): string[] => {
  const recommendations: string[] = [];
  
  if (riskLevel === 'critical') {
    recommendations.push('Immediate personal outreach with special offer');
    recommendations.push('Survey to understand dissatisfaction');
    recommendations.push('Free meal voucher for feedback');
  } else if (riskLevel === 'high') {
    recommendations.push('Targeted email with personalized discount');
    recommendations.push('Recommendation of new menu items');
    recommendations.push('Loyalty program enrollment');
  } else if (riskLevel === 'medium') {
    recommendations.push('Regular engagement through newsletter');
    recommendations.push('Seasonal promotion notifications');
  } else {
    recommendations.push('Continue current engagement strategy');
    recommendations.push('Upsell premium options');
  }

  return recommendations;
};

const generateCLVRecommendations = (valueSegment: string, growthTrend: string): string[] => {
  const recommendations: string[] = [];
  
  if (valueSegment === 'vip') {
    recommendations.push('Exclusive VIP menu access');
    recommendations.push('Personal chef consultation');
    recommendations.push('Private event hosting');
  } else if (valueSegment === 'high') {
    recommendations.push('Premium loyalty tier upgrade');
    recommendations.push('Wine pairing suggestions');
    recommendations.push('Priority reservation system');
  } else if (valueSegment === 'medium') {
    if (growthTrend === 'increasing') {
      recommendations.push('Introduce premium options');
      recommendations.push('Combo meal promotions');
    } else {
      recommendations.push('Value meal promotions');
      recommendations.push('Frequency incentives');
    }
  } else {
    recommendations.push('Welcome discount series');
    recommendations.push('Menu exploration incentives');
    recommendations.push('Referral program enrollment');
  }

  return recommendations;
};

const calculateTrend = (values: number[]): number => {
  if (values.length < 2) return 0;
  
  // Simple linear regression slope
  const n = values.length;
  const sumX = n * (n - 1) / 2;
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = values.reduce((sum, y, x) => sum + x * y, 0);
  const sumXX = n * (n - 1) * (2 * n - 1) / 6;
  
  return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
};

const getSeasonalMultiplier = (date: Date): number => {
  const month = date.getMonth() + 1;
  const dayOfWeek = date.getDay();
  
  // Seasonal adjustments (simplified)
  let multiplier = 1.0;
  
  // Weekend boost
  if (dayOfWeek === 0 || dayOfWeek === 6) multiplier *= 1.2;
  
  // Holiday seasons
  if (month === 12 || month === 1) multiplier *= 1.3; // New Year/Christmas
  if (month === 2) multiplier *= 1.2; // Tet holiday
  if (month === 4 || month === 5) multiplier *= 1.1; // Spring season
  
  return multiplier;
};

const generateForecastInsights = (historicalData: any[], forecasts: any[]) => {
  // Analyze busiest days
  const dayOfWeekCounts = new Map<number, number>();
  historicalData.forEach(day => {
    const dow = day.day_of_week;
    dayOfWeekCounts.set(dow, (dayOfWeekCounts.get(dow) || 0) + day.daily_orders);
  });

  const busiestDays = Array.from(dayOfWeekCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([dow]) => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[dow];
    });

  // Calculate growth trend
  const recentRevenue = forecasts.slice(-7).reduce((sum, f) => sum + f.predicted_revenue, 0);
  const currentRevenue = historicalData.slice(-7).reduce((sum, d) => sum + d.daily_revenue, 0);
  const growthTrend = ((recentRevenue - currentRevenue) / currentRevenue) * 100;

  return {
    busiest_days: busiestDays,
    seasonal_patterns: ['Weekend peak', 'Lunch rush 11-13h', 'Dinner peak 18-20h'],
    growth_trend: Math.round(growthTrend * 100) / 100,
    capacity_recommendations: [
      'Increase staff during weekend peaks',
      'Optimize kitchen workflow for lunch rush',
      'Consider delivery partnerships for high-demand periods'
    ]
  };
};
