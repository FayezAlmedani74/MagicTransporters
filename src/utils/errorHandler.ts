import { Response } from "express";
import { logger } from "../utils/logger";
import { AppError } from "./AppError";

export const handleError = (error: Error, res: Response): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  } else {
    logger.error("Unhandled error", { error });

    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};
