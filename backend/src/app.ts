import express from "express";
import cors from "cors";
import morgan from "morgan";

import quoteRoutes from "./routes/quote.routes";
import aiRoutes from "./routes/ai.routes";
import authRoutes from "./routes/auth.routes";
import todoRoutes from "./routes/todo.routes";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",

      // Vercel production URL
      "https://ai-todo-lac.vercel.app",

      // Vercel main branch URL
      "https://ai-todo-git-main-lov-kumar01s-projects.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/quote", quoteRoutes);

app.use(errorHandler);