import { Router } from "express";
import { getAISuggestions } from "../controllers/ai.controller";

const router = Router();

router.post("/suggestions", getAISuggestions);

export default router;