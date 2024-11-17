import { Request, Response } from "express";
import { addMagicItem } from "../../src/controllers/magicItemController";
import { createMagicItem } from "../../src/services/MagicItemServices";
import { AppError } from "../../src/utils/AppError";
import { logger } from "../../src/utils/logger";
import { sendResponse } from "../../src/utils/sendResponse";
import { handleError } from "../../src/utils/errorHandler";

jest.mock("../../src/services/MagicItemServices");
jest.mock("../../src/utils/sendResponse");
jest.mock("../../src/utils/errorHandler");
jest.mock("../../src/utils/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));
describe("addMagicItem Controller", () => {
  it("should create a magic item successfully", async () => {
    const req = {
      body: { name: "Magic Wand", weight: 2.5 },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    (createMagicItem as jest.Mock).mockResolvedValue({
      id: 1,
      name: "Magic Wand",
      weight: 2.5,
    });

    await addMagicItem(req, res);

    expect(createMagicItem).toHaveBeenCalledWith("Magic Wand", 2.5);
    expect(logger.info).toHaveBeenCalledWith(
      "Magic Item created successfully: Magic Wand with weight= 2.5"
    );
    expect(sendResponse).toHaveBeenCalledWith(res, 201, {
      id: 1,
      name: "Magic Wand",
      weight: 2.5,
    });
  });
});
it("should handle AppError properly", async () => {
  const req = {
    body: { name: "Magic Wand", weight: 2.5 },
  } as Request;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  // محاكاة خطأ منطق التطبيق
  const appError = new AppError("Invalid weight", 400);
  (createMagicItem as jest.Mock).mockRejectedValue(appError);

  await addMagicItem(req, res);

  expect(handleError).toHaveBeenCalledWith(appError, res);
  expect(logger.error).toHaveBeenCalledWith(appError);
});
it("should handle unknown errors properly", async () => {
  const req = {
    body: { name: "Magic Wand", weight: 2.5 },
  } as Request;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  const unknownError = new Error("Database connection failed");
  (createMagicItem as jest.Mock).mockRejectedValue(unknownError);

  await addMagicItem(req, res);

  expect(handleError).toHaveBeenCalledWith(
    new AppError("Database connection failed", 500),
    res
  );
  expect(logger.error).toHaveBeenCalledWith(unknownError);
});
