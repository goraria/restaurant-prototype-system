import express from "express";
import { updateUser } from "@/controllers/clerkController";

const router = express.Router();

router.put("/:id", updateUser);

export default router;
