import { Router } from "express";
import { createGraphQLMiddleware } from "@/config/graphql";

const router = Router();

router.post("/", createGraphQLMiddleware);

export default router;