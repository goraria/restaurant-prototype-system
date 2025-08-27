import express from "express";
import { updateUser, webhookHandler } from "@controllers/clerkControllers";

const router = express.Router();

router.put("/:id", updateUser);
router.post("/webhooks", webhookHandler);

export default router;
