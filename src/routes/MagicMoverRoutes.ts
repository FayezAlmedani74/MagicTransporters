import express from "express";
import {
  addMagicMover,
  startMission,
  endMission,
  loadMagicMover,
  getTopMovers,
} from "../controllers/magicMoverController";
import {
  addMagicMoverSchema,
  loadMagicMoverItemsSchema,
  missionSchema,
} from "../validations/MagicValidations";
import { validateRequest } from "../middlewares/validateRequest";

const router = express.Router();

/**
 * @swagger
 * /api/v1/movers/add:
 *   post:
 *     summary: Add a new magic mover
 *     description: Creates a new magic mover with a name and weight limit
 *     tags:
 *       - Magic Movers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               weightLimit:
 *                 type: number
 *     responses:
 *       201:
 *         description: Magic Mover created successfully
 *       400:
 *         description: Bad request
 */
router.post("/add", validateRequest(addMagicMoverSchema), addMagicMover);

/**
 * @swagger
 * /api/v1/movers/load:
 *   post:
 *     summary: Load items onto a magic mover
 *     description: Loads items to a specific magic mover, updating its weight and state
 *     tags:
 *       - Magic Movers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               moverId:
 *                 type: string
 *               itemIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Items loaded successfully
 *       400:
 *         description: Bad request or weight limit exceeded
 */
router.post(
  "/load",
  validateRequest(loadMagicMoverItemsSchema),
  loadMagicMover
);

/**
 * @swagger
 * /api/v1/movers/start-mission:
 *   post:
 *     summary: Start a mission for a magic mover
 *     description: Starts a mission for the specified magic mover if it is in loading state
 *     tags:
 *       - Magic Movers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               moverId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mission started successfully
 *       400:
 *         description: Bad request or invalid mover state
 */
router.post("/start-mission", validateRequest(missionSchema), startMission);

/**
 * @swagger
 * /api/v1/movers/end-mission:
 *   post:
 *     summary: end a mission for a magic mover
 *     description: Ends the current mission for the specified magic mover
 *     tags:
 *       - Magic Movers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               moverId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mission ended successfully
 *       400:
 *         description: Mover must be on a mission
 */

router.post("/end-mission", endMission);

/**
 * @swagger
 * /api/v1/movers/top-movers:
 *   get:
 *     summary: Get the top movers
 *     description: Retrieves a list of top movers sorted by missions completed
 *     tags:
 *       - Magic Movers
 *     responses:
 *       200:
 *         description: A list of top movers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   missionsCompleted:
 *                     type: number
 */
router.get("/top-movers", getTopMovers);

export default router;
