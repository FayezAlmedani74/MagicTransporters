import express from "express";
import { addMagicItem } from "../controllers/magicItemController";
import { addMagicItemSchema } from "../validations/MagicValidations";
import { validateRequest } from "../middlewares/validateRequest";

const router = express.Router();
/**
 * @swagger
 * /api/v1/items/add:
 *   post:
 *     summary: Add a new magic item
 *     description: Adds a new magic item with a name and weight
 *     tags:
 *       - Magic Items
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               weight:
 *                 type: number
 *     responses:
 *       201:
 *         description: Item created successfully
 *       400:
 *         description: Bad request
 */
router.post("/add", validateRequest(addMagicItemSchema), addMagicItem);

export default router;
