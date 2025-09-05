import { Request, Response } from 'express';
import * as recommendationService from '../services/recommendationService';
import * as analyticsService from '../services/analyticsService';

// ================================
// 🤖 AI RECOMMENDATION ENDPOINTS
// ================================

export const getPersonalizedRecommendations = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    const { restaurantId, limit = 10 } = req.query;

    const recommendations = await recommendationService.getAIRecommendations(
      customerId,
      restaurantId as string,
      {
        limit: parseInt(limit as string)
      }
    );

    res.status(200).json({
      success: true,
      message: 'Lấy gợi ý món ăn thành công',
      data: {
        recommendations,
        total: recommendations.length,
        generated_at: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('AI Recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống AI gợi ý',
      error: error.message
    });
  }
};

export const getTrendingRecommendations = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const { limit = 10 } = req.query;

    const recommendations = await recommendationService.getTrendingRecommendations(
      restaurantId,
      parseInt(limit as string)
    );

    res.status(200).json({
      success: true,
      message: 'Lấy món ăn hot trend thành công',
      data: {
        recommendations,
        total: recommendations.length
      }
    });
  } catch (error: any) {
    console.error('Trending recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy món ăn trending',
      error: error.message
    });
  }
};

export const getSeasonalRecommendations = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const { limit = 10 } = req.query;

    const recommendations = await recommendationService.getSeasonalRecommendations(
      restaurantId,
      parseInt(limit as string)
    );

    res.status(200).json({
      success: true,
      message: 'Lấy gợi ý theo mùa thành công',
      data: {
        recommendations,
        total: recommendations.length,
        season_info: {
          current_time: new Date().toISOString(),
          local_hour: new Date().getHours()
        }
      }
    });
  } catch (error: any) {
    console.error('Seasonal recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy gợi ý theo mùa',
      error: error.message
    });
  }
};

// ================================
// 📊 AI ANALYTICS ENDPOINTS
// ================================

export const getCustomerBehaviorAnalysis = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;

    const analysis = await analyticsService.analyzeCustomerBehavior(restaurantId);

    res.status(200).json({
      success: true,
      message: 'Phân tích hành vi khách hàng thành công',
      data: {
        ...analysis,
        analysis_date: new Date().toISOString(),
        total_customers_analyzed: analysis.insights.length
      }
    });
  } catch (error: any) {
    console.error('Customer behavior analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi phân tích hành vi khách hàng',
      error: error.message
    });
  }
};

export const getChurnPrediction = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;

    const prediction = await analyticsService.predictChurnRisk(customerId);

    res.status(200).json({
      success: true,
      message: 'Dự đoán churn risk thành công',
      data: {
        customer_id: customerId,
        ...prediction,
        analyzed_at: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Churn prediction error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi dự đoán churn risk',
      error: error.message
    });
  }
};

export const getCustomerLifetimeValue = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;

    const clv = await analyticsService.calculateCustomerLifetimeValue(customerId);

    res.status(200).json({
      success: true,
      message: 'Tính CLV thành công',
      data: {
        customer_id: customerId,
        ...clv,
        calculated_at: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('CLV calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi tính Customer Lifetime Value',
      error: error.message
    });
  }
};

export const getDemandForecast = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const { days_ahead = 30 } = req.query;

    const forecast = await analyticsService.forecastDemand(
      restaurantId,
      parseInt(days_ahead as string)
    );

    res.status(200).json({
      success: true,
      message: 'Dự báo nhu cầu thành công',
      data: {
        restaurant_id: restaurantId,
        forecast_period: `${days_ahead} days`,
        ...forecast,
        generated_at: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Demand forecast error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi dự báo nhu cầu',
      error: error.message
    });
  }
};

// ================================
// 🎯 HYBRID AI ENDPOINTS (Multi-purpose)
// ================================

export const getAIDashboard = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const { customerId } = req.query;

    // Parallel execution for better performance
    const [
      customerAnalysis,
      demandForecast,
      trendingItems
    ] = await Promise.allSettled([
      analyticsService.analyzeCustomerBehavior(restaurantId),
      analyticsService.forecastDemand(restaurantId, 7), // Next 7 days
      recommendationService.getTrendingRecommendations(restaurantId, 5)
    ]);

    // Get personalized recommendations if customer ID provided
    let personalizedRecommendations = null;
    if (customerId) {
      try {
        personalizedRecommendations = await recommendationService.getAIRecommendations(
          customerId as string,
          restaurantId,
          { limit: 5 }
        );
      } catch (error) {
        console.log('Could not get personalized recommendations:', error);
      }
    }

    const dashboardData = {
      customer_analytics: customerAnalysis.status === 'fulfilled' ? customerAnalysis.value : null,
      demand_forecast: demandForecast.status === 'fulfilled' ? demandForecast.value : null,
      trending_items: trendingItems.status === 'fulfilled' ? trendingItems.value : [],
      personalized_recommendations: personalizedRecommendations,
      ai_insights: {
        data_freshness: new Date().toISOString(),
        recommendations_count: personalizedRecommendations?.length || 0,
        trending_count: trendingItems.status === 'fulfilled' ? trendingItems.value.length : 0,
        forecast_days: 7
      }
    };

    res.status(200).json({
      success: true,
      message: 'AI Dashboard data loaded successfully',
      data: dashboardData
    });

  } catch (error: any) {
    console.error('AI Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi tải AI Dashboard',
      error: error.message
    });
  }
};

export const getSmartMenuOptimization = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const { analysis_days = 30 } = req.query;

    // This would analyze menu performance and suggest optimizations
    // For now, we'll return a structured response that can be enhanced
    
    const menuOptimization = {
      analysis_period: `${analysis_days} days`,
      recommendations: {
        items_to_promote: [
          { name: "Phở Đặc Biệt", reason: "High margin, growing demand", action: "Feature prominently" },
          { name: "Trà Sữa Matcha", reason: "Trending, high satisfaction", action: "Add to combo deals" }
        ],
        items_to_review: [
          { name: "Cơm Chiên Dương Châu", reason: "Declining orders, low rating", action: "Recipe review needed" }
        ],
        pricing_suggestions: [
          { name: "Bánh Mì Thịt", current_price: 25000, suggested_price: 28000, reason: "High demand, can support price increase" }
        ],
        new_item_opportunities: [
          { category: "Healthy Options", reason: "Growing customer interest in diet-conscious choices" },
          { category: "Desserts", reason: "Low coverage in current menu, high margin potential" }
        ]
      },
      performance_metrics: {
        menu_utilization: "78%", // Percentage of menu items ordered regularly
        top_performer_margin: "65%",
        optimization_potential: "12% revenue increase possible"
      }
    };

    res.status(200).json({
      success: true,
      message: 'Menu optimization analysis completed',
      data: {
        restaurant_id: restaurantId,
        ...menuOptimization,
        generated_at: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Menu optimization error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi phân tích tối ưu menu',
      error: error.message
    });
  }
};

// ================================
// 🔄 REAL-TIME AI FEATURES
// ================================

export const getRealtimeInsights = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    
    // Real-time insights that update frequently
    const insights = {
      current_timestamp: new Date().toISOString(),
      live_metrics: {
        orders_last_hour: Math.floor(Math.random() * 20) + 5, // Mock data - replace with real queries
        revenue_today: Math.floor(Math.random() * 5000000) + 1000000,
        peak_items_now: [
          { name: "Phở Bò", orders_last_hour: 8 },
          { name: "Cà Phê Sữa", orders_last_hour: 12 }
        ]
      },
      ai_alerts: [
        {
          type: "demand_spike",
          message: "Phở Bò orders increased 40% in last hour",
          action: "Consider kitchen prep adjustment",
          urgency: "medium"
        },
        {
          type: "inventory_warning", 
          message: "Predicted to run low on beef by 6 PM",
          action: "Contact supplier or adjust menu",
          urgency: "high"
        }
      ],
      next_update: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes
    };

    res.status(200).json({
      success: true,
      message: 'Real-time AI insights retrieved',
      data: insights
    });

  } catch (error: any) {
    console.error('Real-time insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy thông tin real-time',
      error: error.message
    });
  }
};
