import MagicMover from "../models/MagicMover";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/logger";

export const findMoverById = async (moverId: string) => {
  try {
    const moverFounded = await MagicMover.findById(moverId);
    if (!moverFounded) {
      logger.error("Mover not found");
      throw new AppError("Mover not found", 404);
    }
    return moverFounded;
  } catch (error) {
    logger.error("Failed to find Magic Mover: ", error);
    throw new AppError("Failed to find Magic Mover: ", 400);
  }
};
export const createMagicMover = async (name: string, weightLimit: number) => {
  try {
    const magicMover = await MagicMover.create({ name, weightLimit });
    return magicMover;
  } catch (error) {
    logger.error("Failed to create Magic Mover:", error);
    throw new AppError("Failed to create Magic Mover: ", 400);
  }
};
export const findAllMoversDescending = async () => {
  try {
    const moversFounded = await MagicMover.find().sort({
      missionsCompleted: -1,
    });
    if (!moversFounded) {
      logger.error("Movers Not Found");
      throw new AppError("Movers Not Found", 404);
    }
    return moversFounded;
  } catch (error) {
    logger.error("Failed to retrieve Magic Movers in descending order: ");
    throw new AppError(
      "Failed to retrieve Magic Movers in descending order: ",
      400
    );
  }
};
