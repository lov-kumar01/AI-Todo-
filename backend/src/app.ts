import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes";
import todoRoutes from "./routes/todo.routes";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

// Middlewares
app.use(cors());               // allow frontend
app.use(express.json());       // parse JSON
app.use(morgan("dev"));        // HTTP logging

// Health check route
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// Global error handler
app.use(errorHandler);
