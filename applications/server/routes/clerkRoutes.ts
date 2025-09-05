import Router from "express";
import { 
  webhookHandler, 
  updateUser, 
  getCurrentUser, 
  syncUserWithClerk 
} from "@/controllers/clerkControllers";
import {
  webhookHandler as advancedWebhookHandler,
  testWebhookHandler,
} from "@/controllers/webhookControllers";
import { requireAuthentication } from "@/middlewares/authMiddlewares";

const router = Router();

router.get("/", (req, res) => {
  res.json("pro");
});

// ================================
// 🔗 WEBHOOK ROUTES
// ================================

// Health check route (tối giản)  
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Clerk routes are working",
    timestamp: new Date().toISOString()
  });
});

// Simple webhook status endpoint (GET trước POST)
router.get("/webhooks", (req, res) => {
  res.json({
    success: true,
    message: "Webhook endpoints đang hoạt động",
    availableEndpoints: [
      "POST /clerk/webhooks",
      "POST /clerk/webhooks/advanced", 
      "POST /clerk/webhooks/test",
      "GET /clerk/webhooks"
    ],
    timestamp: new Date().toISOString()
  });
});

// Basic webhook (legacy support) - raw body parser handled globally
router.post("/webhooks", webhookHandler);

// Advanced webhook with comprehensive event handling - raw body parser handled globally
router.post("/webhooks/advanced", advancedWebhookHandler);
router.post("/webhooks/test", testWebhookHandler);

// ================================
// 🔐 PROTECTED ROUTES
// ================================

router.get("/me", requireAuthentication, getCurrentUser);
router.put("/users/:id", requireAuthentication, updateUser);
router.post("/sync/:clerk_id", requireAuthentication, syncUserWithClerk);

export default router;
