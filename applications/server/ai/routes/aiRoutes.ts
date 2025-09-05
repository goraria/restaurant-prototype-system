import express from 'express';
import * as aiControllers from '../controllers/aiControllers';

const router = express.Router();

// ================================
// 🤖 AI RECOMMENDATION ROUTES
// ================================

// Get personalized recommendations for a customer
router.get('/recommendations/personalized/:customerId', aiControllers.getPersonalizedRecommendations);

// Get trending items recommendations
router.get('/recommendations/trending/:restaurantId', aiControllers.getTrendingRecommendations);

// Get seasonal/time-based recommendations
router.get('/recommendations/seasonal/:restaurantId', aiControllers.getSeasonalRecommendations);

// ================================
// 📊 AI ANALYTICS ROUTES
// ================================

// Customer behavior analysis
router.get('/analytics/customers/:restaurantId', aiControllers.getCustomerBehaviorAnalysis);

// Churn prediction for specific customer
router.get('/analytics/churn/:customerId', aiControllers.getChurnPrediction);

// Customer lifetime value calculation
router.get('/analytics/clv/:customerId', aiControllers.getCustomerLifetimeValue);

// Demand forecasting
router.get('/analytics/forecast/:restaurantId', aiControllers.getDemandForecast);

// ================================
// 🎯 HYBRID AI ROUTES
// ================================

// Complete AI dashboard (combines multiple AI features)
router.get('/dashboard/:restaurantId', aiControllers.getAIDashboard);

// Smart menu optimization suggestions
router.get('/optimization/menu/:restaurantId', aiControllers.getSmartMenuOptimization);

// Real-time AI insights and alerts
router.get('/insights/realtime/:restaurantId', aiControllers.getRealtimeInsights);

// ================================
// 📋 API DOCUMENTATION ROUTE
// ================================

router.get('/docs', (req, res) => {
  const apiDocs = {
    title: "Restaurant AI API Documentation",
    version: "1.0.0",
    description: "AI-powered recommendation and analytics system for restaurant management",
    endpoints: {
      recommendations: {
        "GET /ai/recommendations/personalized/:customerId": {
          description: "Get personalized menu recommendations for a specific customer",
          parameters: {
            customerId: "UUID of the customer",
            restaurantId: "UUID of restaurant (query param)",
            limit: "Number of recommendations (query param, default: 10)"
          },
          response: "Array of MenuRecommendation objects with confidence scores"
        },
        "GET /ai/recommendations/trending/:restaurantId": {
          description: "Get currently trending menu items",
          parameters: {
            restaurantId: "UUID of the restaurant",
            limit: "Number of items (query param, default: 10)"
          }
        },
        "GET /ai/recommendations/seasonal/:restaurantId": {
          description: "Get seasonal and time-based recommendations",
          parameters: {
            restaurantId: "UUID of the restaurant",
            limit: "Number of items (query param, default: 10)"
          }
        }
      },
      analytics: {
        "GET /ai/analytics/customers/:restaurantId": {
          description: "Comprehensive customer behavior analysis and segmentation",
          parameters: {
            restaurantId: "UUID of the restaurant"
          },
          response: "Customer segments and individual insights"
        },
        "GET /ai/analytics/churn/:customerId": {
          description: "Predict customer churn risk with recommendations",
          parameters: {
            customerId: "UUID of the customer"
          },
          response: "Churn probability, risk level, and retention strategies"
        },
        "GET /ai/analytics/clv/:customerId": {
          description: "Calculate customer lifetime value and growth predictions",
          parameters: {
            customerId: "UUID of the customer"
          },
          response: "CLV analysis with segment classification and recommendations"
        },
        "GET /ai/analytics/forecast/:restaurantId": {
          description: "Demand forecasting for capacity planning",
          parameters: {
            restaurantId: "UUID of the restaurant",
            days_ahead: "Number of days to forecast (query param, default: 30)"
          },
          response: "Daily forecasts with confidence intervals and insights"
        }
      },
      hybrid: {
        "GET /ai/dashboard/:restaurantId": {
          description: "Complete AI dashboard combining multiple AI features",
          parameters: {
            restaurantId: "UUID of the restaurant",
            customerId: "Optional customer ID for personalized data (query param)"
          },
          response: "Comprehensive AI insights dashboard"
        },
        "GET /ai/optimization/menu/:restaurantId": {
          description: "AI-powered menu optimization suggestions",
          parameters: {
            restaurantId: "UUID of the restaurant",
            analysis_days: "Days of data to analyze (query param, default: 30)"
          },
          response: "Menu optimization recommendations and performance metrics"
        },
        "GET /ai/insights/realtime/:restaurantId": {
          description: "Real-time AI insights and alerts",
          parameters: {
            restaurantId: "UUID of the restaurant"
          },
          response: "Live metrics, AI alerts, and system status"
        }
      }
    },
    data_models: {
      MenuRecommendation: {
        menu_item_id: "string (UUID)",
        confidence_score: "number (0-1)",
        reason: "string",
        price: "number",
        category: "string",
        name: "string"
      },
      CustomerInsight: {
        customer_id: "string (UUID)",
        segment: "enum: high_value | frequent | at_risk | new | loyal",
        lifetime_value: "number",
        predicted_churn_risk: "number (0-1)",
        preferences: "object",
        recommendations: "object"
      }
    },
    authentication: "Same as main API - JWT tokens or Clerk authentication",
    rate_limits: "1000 requests per hour per API key",
    notes: [
      "All AI endpoints return confidence scores and explanations",
      "Results are cached for 5-15 minutes depending on endpoint",
      "Real-time endpoints update every 5 minutes",
      "ML models are retrained weekly with new data"
    ]
  };

  res.status(200).json(apiDocs);
});

export default router;
