import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes";
import todoRoutes from "./routes/todo.routes";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://ai-todo-lac.vercel.app",
    ],
    credentials: true,
  })
);

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

// Health check route
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// Global error handler
app.use(errorHandler);