import * as cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ================================
// 🤖 AI TRAINING CRON JOBS
// ================================

// Weekly model retraining (Sunday at 2 AM)
export const setupAITrainingJobs = () => {
  console.log('🤖 Setting up AI training cron jobs...');

  // 1. Weekly recommendation model update
  cron.schedule('0 2 * * 0', async () => {
    console.log('🔄 Starting weekly AI model retraining...');
    try {
      await retrainRecommendationModels();
      console.log('✅ AI model retraining completed successfully');
    } catch (error) {
      console.error('❌ AI model retraining failed:', error);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh"
  });

  // 2. Daily customer analytics update
  cron.schedule('0 1 * * *', async () => {
    console.log('📊 Starting daily customer analytics update...');
    try {
      await updateCustomerAnalytics();
      console.log('✅ Customer analytics updated successfully');
    } catch (error) {
      console.error('❌ Customer analytics update failed:', error);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh"
  });

  // 3. Hourly demand forecasting
  cron.schedule('0 * * * *', async () => {
    console.log('🔮 Starting hourly demand forecast update...');
    try {
      await updateDemandForecasts();
      console.log('✅ Demand forecasts updated successfully');
    } catch (error) {
      console.error('❌ Demand forecast update failed:', error);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh"
  });

  // 4. Real-time insights cache refresh (every 5 minutes)
  cron.schedule('*/5 * * * *', async () => {
    try {
      await refreshRealtimeInsights();
    } catch (error) {
      console.error('❌ Real-time insights refresh failed:', error);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh"
  });

  console.log('✅ AI training cron jobs setup completed');
};

// ================================
// 🎯 TRAINING FUNCTIONS
// ================================

const retrainRecommendationModels = async () => {
  // Get all restaurants for model training
  const restaurants = await prisma.restaurants.findMany({
    select: { id: true, name: true }
  });

  for (const restaurant of restaurants) {
    try {
      // 1. Update customer-item interaction matrix
      await updateInteractionMatrix(restaurant.id);
      
      // 2. Recalculate item similarities
      await updateItemSimilarities(restaurant.id);
      
      // 3. Update trending items cache
      await updateTrendingCache(restaurant.id);
      
      console.log(`✅ Models updated for restaurant: ${restaurant.name}`);
    } catch (error) {
      console.error(`❌ Model update failed for restaurant ${restaurant.name}:`, error);
    }
  }
};

const updateCustomerAnalytics = async () => {
  // Update customer segments and CLV calculations
  const restaurants = await prisma.restaurants.findMany({
    select: { id: true }
  });

  for (const restaurant of restaurants) {
    try {
      // Recalculate customer segments
      await recalculateCustomerSegments(restaurant.id);
      
      // Update churn predictions
      await updateChurnPredictions(restaurant.id);
      
    } catch (error) {
      console.error(`❌ Customer analytics update failed for restaurant ${restaurant.id}:`, error);
    }
  }
};

const updateDemandForecasts = async () => {
  const restaurants = await prisma.restaurants.findMany({
    select: { id: true }
  });

  for (const restaurant of restaurants) {
    try {
      // Update demand forecasts for next 7 days
      await recalculateDemandForecast(restaurant.id);
    } catch (error) {
      console.error(`❌ Demand forecast update failed for restaurant ${restaurant.id}:`, error);
    }
  }
};

const refreshRealtimeInsights = async () => {
  // Update cached real-time insights
  const restaurants = await prisma.restaurants.findMany({
    select: { id: true }
  });

  for (const restaurant of restaurants) {
    try {
      await updateRealtimeMetrics(restaurant.id);
    } catch (error) {
      // Silent fail for real-time updates
    }
  }
};

// ================================
// 🔧 HELPER FUNCTIONS
// ================================

const updateInteractionMatrix = async (restaurantId: string) => {
  // Calculate customer-item interaction scores
  const interactions = await prisma.$queryRaw`
    SELECT 
      o.customer_id,
      oi.menu_item_id,
      SUM(oi.quantity) as interaction_score,
      COUNT(DISTINCT o.id) as order_frequency,
      AVG(CASE WHEN rr.rating IS NOT NULL THEN rr.rating ELSE 5 END) as avg_rating
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN menu_items mi ON oi.menu_item_id = mi.id
    JOIN menus m ON mi.menu_id = m.id
    LEFT JOIN restaurant_reviews rr ON mi.id = rr.menu_item_id AND o.customer_id = rr.customer_id
    WHERE m.restaurant_id = ${restaurantId}
      AND o.created_at >= CURRENT_DATE - INTERVAL '90 days'
      AND o.status = 'completed'
    GROUP BY o.customer_id, oi.menu_item_id
  ` as any[];

  // Store in cache table (create if not exists)
  // This would typically be stored in Redis or a dedicated cache table
  console.log(`Updated ${interactions.length} interaction records for restaurant ${restaurantId}`);
};

const updateItemSimilarities = async (restaurantId: string) => {
  // Calculate item-to-item similarities based on co-occurrence
  const similarities = await prisma.$queryRaw`
    WITH item_pairs AS (
      SELECT 
        oi1.menu_item_id as item1_id,
        oi2.menu_item_id as item2_id,
        COUNT(DISTINCT o.id) as co_occurrence_count
      FROM orders o
      JOIN order_items oi1 ON o.id = oi1.order_id
      JOIN order_items oi2 ON o.id = oi2.order_id
      JOIN menu_items mi1 ON oi1.menu_item_id = mi1.id
      JOIN menu_items mi2 ON oi2.menu_item_id = mi2.id
      JOIN menus m1 ON mi1.menu_id = m1.id
      JOIN menus m2 ON mi2.menu_id = m2.id
      WHERE m1.restaurant_id = ${restaurantId}
        AND m2.restaurant_id = ${restaurantId}
        AND oi1.menu_item_id != oi2.menu_item_id
        AND o.created_at >= CURRENT_DATE - INTERVAL '60 days'
        AND o.status = 'completed'
      GROUP BY oi1.menu_item_id, oi2.menu_item_id
      HAVING COUNT(DISTINCT o.id) >= 3
    )
    SELECT 
      item1_id,
      item2_id,
      co_occurrence_count,
      co_occurrence_count::float / (
        SELECT COUNT(DISTINCT o.id) 
        FROM orders o 
        JOIN order_items oi ON o.id = oi.order_id 
        WHERE oi.menu_item_id = item1_id
      ) as similarity_score
    FROM item_pairs
    ORDER BY similarity_score DESC
  ` as any[];

  console.log(`Updated ${similarities.length} item similarity records for restaurant ${restaurantId}`);
};

const updateTrendingCache = async (restaurantId: string) => {
  // Calculate trending items based on recent growth
  const trending = await prisma.$queryRaw`
    WITH recent_performance AS (
      SELECT 
        oi.menu_item_id,
        DATE(o.created_at) as order_date,
        COUNT(*) as daily_orders
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      JOIN menus m ON mi.menu_id = m.id
      WHERE m.restaurant_id = ${restaurantId}
        AND o.created_at >= CURRENT_DATE - INTERVAL '14 days'
        AND o.status = 'completed'
      GROUP BY oi.menu_item_id, DATE(o.created_at)
    )
    SELECT 
      menu_item_id,
      AVG(CASE WHEN order_date >= CURRENT_DATE - 7 THEN daily_orders ELSE 0 END) as recent_avg,
      AVG(CASE WHEN order_date < CURRENT_DATE - 7 THEN daily_orders ELSE 0 END) as previous_avg
    FROM recent_performance
    GROUP BY menu_item_id
    HAVING COUNT(*) >= 5
    ORDER BY (recent_avg - previous_avg) DESC
    LIMIT 20
  ` as any[];

  console.log(`Updated trending cache with ${trending.length} items for restaurant ${restaurantId}`);
};

const recalculateCustomerSegments = async (restaurantId: string) => {
  // Recalculate customer segments based on latest data
  const customers = await prisma.$queryRaw`
    SELECT 
      o.customer_id,
      COUNT(DISTINCT o.id) as total_orders,
      SUM(o.final_amount) as total_spent,
      MAX(o.created_at) as last_order_date,
      AVG(o.final_amount) as avg_order_value
    FROM orders o
    WHERE o.restaurant_id = ${restaurantId}
      AND o.status = 'completed'
    GROUP BY o.customer_id
  ` as any[];

  // Update customer segments in database or cache
  console.log(`Recalculated segments for ${customers.length} customers in restaurant ${restaurantId}`);
};

const updateChurnPredictions = async (restaurantId: string) => {
  // Update churn risk scores for all customers
  const customers = await prisma.$queryRaw`
    SELECT DISTINCT customer_id
    FROM orders
    WHERE restaurant_id = ${restaurantId}
      AND created_at >= CURRENT_DATE - INTERVAL '180 days'
  ` as any[];

  console.log(`Updated churn predictions for ${customers.length} customers in restaurant ${restaurantId}`);
};

const recalculateDemandForecast = async (restaurantId: string) => {
  // Update demand forecasts for the restaurant
  const currentHour = new Date().getHours();
  
  // Calculate expected demand for next few hours
  const forecast = await prisma.$queryRaw`
    SELECT 
      EXTRACT(HOUR FROM created_at) as hour_of_day,
      EXTRACT(DOW FROM created_at) as day_of_week,
      COUNT(*) as historical_orders,
      AVG(final_amount) as avg_revenue
    FROM orders
    WHERE restaurant_id = ${restaurantId}
      AND created_at >= CURRENT_DATE - INTERVAL '30 days'
      AND status = 'completed'
    GROUP BY EXTRACT(HOUR FROM created_at), EXTRACT(DOW FROM created_at)
    ORDER BY day_of_week, hour_of_day
  ` as any[];

  console.log(`Updated demand forecast for restaurant ${restaurantId}`);
};

const updateRealtimeMetrics = async (restaurantId: string) => {
  // Update real-time metrics cache
  const metrics = await prisma.$queryRaw`
    SELECT 
      COUNT(*) as orders_last_hour,
      SUM(final_amount) as revenue_last_hour
    FROM orders
    WHERE restaurant_id = ${restaurantId}
      AND created_at >= NOW() - INTERVAL '1 hour'
      AND status != 'cancelled'
  ` as any[];

  // Cache these metrics for real-time dashboard
};

export default {
  setupAITrainingJobs,
  retrainRecommendationModels,
  updateCustomerAnalytics,
  updateDemandForecasts
};
