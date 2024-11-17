import { Request, Response } from "express";
import { IMagicItemRequestBody } from "../interfaces/IMagicItemRequestBody";
import { sendResponse } from "../utils/sendResponse";
import { createMagicItem } from "../services/MagicItemServices";
import { handleError } from "../utils/errorHandler";
import { logger } from "../utils/logger";
import { AppError } from "../utils/AppError";

export const addMagicItem = async (
  req: Request<{}, {}, IMagicItemRequestBody>,
  res: Response
) => {
  try {
    const { name, weight } = req.body;
    const item = await createMagicItem(name, weight);
    logger.info(
      `Magic Item created successfully: ${name} with weight= ${weight}`
    );
    sendResponse(res, 201, item);
  } catch (error) {
    logger.error(error);
    if (error instanceof AppError) {
      handleError(error, res);
    } else if (error instanceof Error) {
      handleError(new AppError(error.message, 500), res);
    } else {
      handleError(new AppError("Unknown error occurred", 500), res);
    }
  }
};
