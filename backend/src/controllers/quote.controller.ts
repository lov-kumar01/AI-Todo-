import { Request, Response, NextFunction } from "express";
import { getRandomQuote } from "../services/quote.service";

export const getQuote = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const quote = await getRandomQuote();

    res.json(quote);
  } catch (error) {
    next(error);
  }
};