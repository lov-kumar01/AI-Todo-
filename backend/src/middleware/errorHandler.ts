import { Request, Response, NextFunction } from "express";
import { ErrorLog } from "../models/ErrorLog";
import { AuthRequest } from "./auth";

export const errorHandler = async (
  err: any,
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) => {
  console.error("❌ Error:", err);

  try {
    await ErrorLog.create({
      message: err.message || "Unknown error",
      stack: err.stack,
      path: req.path,
      method: req.method,
      userId: req.user?.userId || null
    });
  } catch (logError) {
    console.error("❌ Failed to save error log:", logError);
  }

  const status = err.statusCode || 500;

  res.status(status).json({
    message: err.message || "Internal server error"
  });
};
