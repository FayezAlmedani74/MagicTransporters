import { Request, Response } from "express";
import {
  addMagicMover,
  loadMagicMover,
  startMission,
  endMission,
  getTopMovers,
} from "../../src/controllers/magicMoverController";
import {
  createMagicMover,
  findAllMoversDescending,
  findMoverById,
} from "../../src/services/MagicMoverServices";
import { findItemsByIds } from "../../src/services/MagicItemServices";
import {
  saveMissionEndInLog,
  saveMissionLoadingInLog,
  saveMissionOnInLog,
} from "../../src/services/MissionLogServices";
import { AppError } from "../../src/utils/AppError";
import { handleError } from "../../src/utils/errorHandler";
import { logger } from "../../src/utils/logger";
import { sendResponse } from "../../src/utils/sendResponse";

jest.mock("../../src/services/MagicMoverServices");
jest.mock("../../src/services/MagicItemServices");
jest.mock("../../src/services/MissionLogServices");
jest.mock("../../src/utils/sendResponse");
jest.mock("../../src/utils/errorHandler");
jest.mock("../../src/utils/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe("addMagicMover Controller", () => {
  it("should create a magic mover successfully", async () => {
    const req = { body: { name: "Mover1", weightLimit: 50 } } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    (createMagicMover as jest.Mock).mockResolvedValue({
      id: 1,
      name: "Mover1",
      weightLimit: 50,
    });

    await addMagicMover(req, res);

    expect(createMagicMover).toHaveBeenCalledWith("Mover1", 50);
    expect(logger.info).toHaveBeenCalledWith(
      "Magic Mover created successfully: Mover1 with weightLimit= 50"
    );
    expect(sendResponse).toHaveBeenCalledWith(res, 201, {
      id: 1,
      name: "Mover1",
      weightLimit: 50,
    });
  });

  it("should handle AppError properly", async () => {
    const req = { body: { name: "Mover1", weightLimit: 50 } } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const appError = new AppError("Invalid weight limit", 400);
    (createMagicMover as jest.Mock).mockRejectedValue(appError);

    await addMagicMover(req, res);

    expect(handleError).toHaveBeenCalledWith(appError, res);
    expect(logger.error).toHaveBeenCalledWith(appError);
  });

  it("should handle unknown errors properly", async () => {
    const req = { body: { name: "Mover1", weightLimit: 50 } } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const unknownError = new Error("Database error");
    (createMagicMover as jest.Mock).mockRejectedValue(unknownError);

    await addMagicMover(req, res);

    expect(handleError).toHaveBeenCalledWith(
      new AppError("Database error", 500),
      res
    );
    expect(logger.error).toHaveBeenCalledWith(unknownError);
  });
});

describe("loadMagicMover Controller", () => {
  it("should load items onto a magic mover successfully", async () => {
    const req = { body: { moverId: 1, itemIds: [1, 2] } } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockMover = {
      id: 1,
      state: "resting",
      currentWeight: 0,
      weightLimit: 100,
      save: jest.fn(),
    };
    const mockItems = [
      { id: 1, weight: 30 },
      { id: 2, weight: 40 },
    ];

    (findMoverById as jest.Mock).mockResolvedValue(mockMover);
    (findItemsByIds as jest.Mock).mockResolvedValue(mockItems);

    await loadMagicMover(req, res);

    expect(mockMover.state).toBe("loading");
    expect(mockMover.currentWeight).toBe(70);
    expect(mockMover.save).toHaveBeenCalled();
    expect(saveMissionLoadingInLog).toHaveBeenCalledWith(mockMover);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, mockMover);
  });

  it("should handle weight limit exceeded", async () => {
    const req = { body: { moverId: 1, itemIds: [1, 2] } } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockMover = {
      id: 1,
      state: "resting",
      currentWeight: 80,
      weightLimit: 100,
      save: jest.fn(),
    };
    const mockItems = [
      { id: 1, weight: 30 },
      { id: 2, weight: 40 },
    ];

    (findMoverById as jest.Mock).mockResolvedValue(mockMover);
    (findItemsByIds as jest.Mock).mockResolvedValue(mockItems);

    await loadMagicMover(req, res);

    expect(mockMover.currentWeight).toBe(80); // Should remain unchanged
    expect(mockMover.save).not.toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(res, 400, {
      message: "Weight limit exceeded",
    });
  });

  it("should handle invalid mover state", async () => {
    const req = { body: { moverId: 1, itemIds: [1, 2] } } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockMover = {
      id: 1,
      state: "on-mission",
      currentWeight: 50,
      weightLimit: 100,
      save: jest.fn(),
    };

    (findMoverById as jest.Mock).mockResolvedValue(mockMover);

    await loadMagicMover(req, res);

    expect(sendResponse).toHaveBeenCalledWith(res, 400, {
      message: "Mover is not in loading state or not found",
    });
  });
});

describe("startMission Controller", () => {
  it("should start mission successfully", async () => {
    const req = { body: { moverId: 1 } } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockMover = {
      id: 1,
      state: "loading",
      missionsCompleted: 0,
      save: jest.fn(),
    };

    (findMoverById as jest.Mock).mockResolvedValue(mockMover);

    await startMission(req, res);

    expect(mockMover.state).toBe("on-mission");
    expect(mockMover.save).toHaveBeenCalled();
    expect(saveMissionOnInLog).toHaveBeenCalledWith(mockMover);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, mockMover);
  });

  it("should handle invalid mover state", async () => {
    const req = { body: { moverId: 1 } } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockMover = {
      id: 1,
      state: "resting",
      missionsCompleted: 0,
      save: jest.fn(),
    };

    (findMoverById as jest.Mock).mockResolvedValue(mockMover);

    await startMission(req, res);

    expect(sendResponse).toHaveBeenCalledWith(res, 400, {
      message: "Mover must be in loading state or not found",
    });
  });
});

describe("endMission Controller", () => {
  it("should end mission successfully", async () => {
    const req = { body: { moverId: 1 } } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockMover = {
      id: 1,
      state: "on-mission",
      currentWeight: 50,
      missionsCompleted: 0,
      save: jest.fn(),
    };

    (findMoverById as jest.Mock).mockResolvedValue(mockMover);

    await endMission(req, res);

    expect(mockMover.state).toBe("resting");
    expect(mockMover.currentWeight).toBe(0);
    expect(mockMover.missionsCompleted).toBe(1);
    expect(mockMover.save).toHaveBeenCalled();
    expect(saveMissionEndInLog).toHaveBeenCalledWith(mockMover);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, mockMover);
  });

  it("should handle invalid mover state", async () => {
    const req = { body: { moverId: 1 } } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockMover = {
      id: 1,
      state: "loading",
      missionsCompleted: 0,
      save: jest.fn(),
    };

    (findMoverById as jest.Mock).mockResolvedValue(mockMover);

    await endMission(req, res);

    expect(sendResponse).toHaveBeenCalledWith(res, 400, {
      message: "Mover must be on a mission",
    });
  });
});

describe("getTopMovers Controller", () => {
  it("should return top movers", async () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockMovers = [
      { id: 1, name: "Mover1", missionsCompleted: 10 },
      { id: 2, name: "Mover2", missionsCompleted: 8 },
    ];

    (findAllMoversDescending as jest.Mock).mockResolvedValue(mockMovers);

    await getTopMovers({} as Request, res);

    expect(findAllMoversDescending).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith("Magic Mover numbers =  2 ");
    expect(sendResponse).toHaveBeenCalledWith(res, 200, mockMovers);
  });

  it("should handle errors during fetching top movers", async () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockError = new Error("Database error");
    (findAllMoversDescending as jest.Mock).mockRejectedValue(mockError);

    await getTopMovers({} as Request, res);

    expect(handleError).toHaveBeenCalledWith(
      new AppError("Database error", 500),
      res
    );
    expect(logger.error).toHaveBeenCalledWith(mockError);
  });
});
