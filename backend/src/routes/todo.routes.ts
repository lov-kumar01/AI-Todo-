import { Router } from "express";
import {
  createTodo,
  getTodos,
  toggleTodo,
  deleteTodo,
  logEvent,
  getSuggestions
} from "../controllers/todo.controller";
import { authMiddleware } from "../middleware/auth";


const router = Router();

router.post("/", authMiddleware, createTodo);
router.get("/", authMiddleware, getTodos);
router.patch("/:id/toggle", authMiddleware, toggleTodo);
router.delete("/:id", authMiddleware, deleteTodo);

// Extra new features
router.post("/log", authMiddleware, logEvent);
router.get("/suggestions", authMiddleware, getSuggestions);

export default router;
