import { Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import { IAddMagicMoverRequestBody } from "../interfaces/IAddMagicMoverRequestBody";
import {
  createMagicMover,
  findAllMoversDescending,
  findMoverById,
} from "../services/MagicMoverServices";
import { ILoadMagicMoverRequestBody } from "../interfaces/ILoadMagicMoverRequestBody";
import { findItemsByIds } from "../services/MagicItemServices";
import {
  saveMissionEndInLog,
  saveMissionLoadingInLog,
  saveMissionOnInLog,
} from "../services/MissionLogServices";
import { IMissionRequestBody } from "../interfaces/IMissionRequestBody";
import { logger } from "../utils/logger";
import { AppError } from "../utils/AppError";
import { handleError } from "../utils/errorHandler";

export const addMagicMover = async (
  req: Request<{}, {}, IAddMagicMoverRequestBody>,
  res: Response
) => {
  try {
    const { name, weightLimit } = req.body;
    const mover = await createMagicMover(name, weightLimit);
    logger.info(
      `Magic Mover created successfully: ${name} with weightLimit= ${weightLimit}`
    );
    sendResponse(res, 201, mover);
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
export const loadMagicMover = async (
  req: Request<{}, {}, ILoadMagicMoverRequestBody>,
  res: Response
) => {
  try {
    const { moverId, itemIds } = req.body;
    const mover = await findMoverById(moverId);
    if (!mover || mover.state === "on-mission") {
      sendResponse(res, 400, {
        message: "Mover is not in loading state or not found",
      });
      return;
    }
    if (mover.state === "resting") {
      mover.state = "loading";
    }
    let totalWeight = 0;
    const items = await findItemsByIds(itemIds);
    items.forEach((item) => (totalWeight += item.weight));
    if (mover.currentWeight + totalWeight > mover.weightLimit) {
      sendResponse(res, 400, { message: "Weight limit exceeded" });
      return;
    }
    mover.currentWeight += totalWeight;
    await mover.save();
    saveMissionLoadingInLog(mover);
    logger.info(
      `Magic Mover loading successfully his name : ${mover.name} and currentWeight= ${mover.currentWeight}`
    );

    sendResponse(res, 200, mover);
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
export const startMission = async (
  req: Request<{}, {}, IMissionRequestBody>,
  res: Response
) => {
  try {
    const { moverId } = req.body;
    const mover = await findMoverById(moverId);
    if (!mover || mover.state === "resting" || mover.state !== "loading") {
      sendResponse(res, 400, {
        message: "Mover must be in loading state or not found",
      });
      return;
    }
    mover.state = "on-mission";
    await mover.save();
    saveMissionOnInLog(mover);
    logger.info(
      `Magic Mover start mission successfully his name: ${mover.name} and missionsCompleted = ${mover.missionsCompleted}`
    );
    sendResponse(res, 200, mover);
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
export const endMission = async (
  req: Request<{}, {}, IMissionRequestBody>,
  res: Response
) => {
  try {
    const { moverId } = req.body;
    const mover = await findMoverById(moverId);
    if (!mover || mover.state !== "on-mission") {
      sendResponse(res, 400, { message: "Mover must be on a mission" });
      return;
    }
    mover.state = "resting";
    mover.currentWeight = 0;
    mover.missionsCompleted += 1;
    await mover.save();
    saveMissionEndInLog(mover);
    logger.info(
      `Magic Mover end mission successfully his name: ${mover.name} and missionsCompleted = ${mover.missionsCompleted}`
    );
    sendResponse(res, 200, mover);
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
export const getTopMovers = async (_req: Request, res: Response) => {
  try {
    const movers = await findAllMoversDescending();
    logger.info(`Magic Mover numbers =  ${movers.length} `);
    sendResponse(res, 200, movers);
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
