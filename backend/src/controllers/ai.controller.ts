import { Request, Response } from "express";
import { generateTaskSuggestions } from "../services/ai.service";

export const getAISuggestions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const query =
      typeof req.body?.query === "string"
        ? req.body.query.trim()
        : "";

    if (!query) {
      res.status(400).json({
        message: "Query is required",
      });
      return;
    }

    if (query.length > 200) {
      res.status(400).json({
        message: "Query is too long",
      });
      return;
    }

    const result = await generateTaskSuggestions(query);

    res.status(200).json(result);
  } catch (error) {
    console.error("AI suggestions error:", error);

    res.status(500).json({
      message: "Unable to generate AI suggestions",
    });
  }
};