import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error details:", error);
  res.status(500).json({
    message: "Internal server error",
    error: error.message,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
};
