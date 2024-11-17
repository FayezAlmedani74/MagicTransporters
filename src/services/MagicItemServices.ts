import MagicItem from "../models/MagicItem";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/logger";

export const createMagicItem = async (name: string, weight: number) => {
  try {
    const magicItem = await MagicItem.create({ name, weight });
    return magicItem;
  } catch (error) {
    logger.error("Failed to create Magic Item: ", error);
    throw new AppError("Failed to create Magic Item: ", 400);
  }
};

export const findItemsByIds = async (itemIds: string[]) => {
  try {
    const items = await MagicItem.find({ _id: { $in: itemIds } });
    if (!items.length) {
      logger.error("No items found with provided IDs");
      throw new AppError("No items found with provided IDs", 404);
    }
    return items;
  } catch (error) {
    logger.error("Failed to retrieve Magic Items: ", error);
    throw new AppError("Failed to retrieve Magic Items: ", 400);
  }
};
