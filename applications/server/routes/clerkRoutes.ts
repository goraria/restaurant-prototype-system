import express from "express";
import { 
  webhookHandler, 
  updateUser, 
  getCurrentUser, 
  syncUserWithClerk 
} from "@/controllers/clerkControllers";
import { requireAuthentication } from "@/middlewares/authMiddleware";

const router = express.Router();

// Webhook endpoint (no auth required) - must use raw body parser
router.post("/webhooks", express.raw({ type: 'application/json' }), webhookHandler);

// Protected routes
router.get("/me", requireAuthentication, getCurrentUser);
router.put("/users/:id", requireAuthentication, updateUser);
router.post("/sync/:clerk_id", requireAuthentication, syncUserWithClerk);

export default router;
