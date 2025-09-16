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
import { clerkWebhookMiddleware } from "@/middlewares/clerkMiddlewares";
import { handleClerkWebhook } from "@/utils/clerkSync";

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

// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

// ================================
// 📨 CLERK WEBHOOKS ENDPOINT
// ================================

router.post('/webhooks/clerk', clerkWebhookMiddleware, async (req, res) => {
  try {
    const { type, data } = req.body;

    console.log('📨 Received Clerk webhook:', type);

    const result = await handleClerkWebhook(type, data);

    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
      data: result
    });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);

    res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
      error: error.message
    });
  }
});

// ================================
// 🔄 MANUAL SYNC ENDPOINTS
// ================================

router.post('/sync/clerk-user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // TODO: Fetch user from Clerk API
    // const clerkUser = await fetchClerkUserById(userId);
    // const result = await syncClerkUserToDatabase(clerkUser);

    res.status(200).json({
      success: true,
      message: 'User synced successfully',
      // data: result
    });

  } catch (error) {
    console.error('❌ Manual sync error:', error);

    res.status(500).json({
      success: false,
      message: 'Sync failed',
      error: error.message
    });
  }
});

router.post('/sync/all-clerk-users', async (req, res) => {
  try {
    // TODO: Fetch all users from Clerk API
    // const clerkUsers = await fetchAllClerkUsers();
    // const result = await syncAllClerkUsers(clerkUsers);

    res.status(200).json({
      success: true,
      message: 'All users sync initiated',
      // data: result
    });

  } catch (error) {
    console.error('❌ Bulk sync error:', error);

    res.status(500).json({
      success: false,
      message: 'Bulk sync failed',
      error: error.message
    });
  }
});


export default router;
