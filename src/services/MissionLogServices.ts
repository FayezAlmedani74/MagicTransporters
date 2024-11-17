import { IMagicMover } from "../interfaces/IMagicMover";
import MissionLog from "../models/MissionLog";
import { logger } from "../utils/logger";

export const saveMissionLoadingInLog = async (mover: IMagicMover) => {
  try {
    await MissionLog.create({
      moverId: mover._id,
      action: "loading",
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error("Failed to log mission loading action: ");
    throw new Error("Failed to log mission loading action: " + error);
  }
};
export const saveMissionOnInLog = async (mover: IMagicMover) => {
  try {
    await MissionLog.create({
      moverId: mover._id,
      action: "on-mission",
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error("Failed to log mission start action: ");
    throw new Error("Failed to log mission start action: " + error);
  }
};
export const saveMissionEndInLog = async (mover: IMagicMover) => {
  try {
    await MissionLog.create({
      moverId: mover._id,
      action: "resting",
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error("Failed to log mission end action: ");
    throw new Error("Failed to log mission end action: " + error);
  }
};
