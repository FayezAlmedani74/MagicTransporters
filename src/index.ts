import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db";
import mongoose from "mongoose";
import MagicMoverRoutes from "./routes/MagicMoverRoutes";
import MagicItemRoutes from "./routes/MagicItemRoutes";
import { Request, Response, NextFunction } from "express";
import swaggerUiExpress from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import { handleError } from "./utils/errorHandler";
import { limiter } from "./middlewares/rateLimiter";
import helmet from "helmet";
import { corsMiddleware } from "./middlewares/corsConfig";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

connectDB();
app.use(limiter);
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(corsMiddleware);
app.use("/api/v1/movers", MagicMoverRoutes);
app.use("/api/v1/items", MagicItemRoutes);

app.use(
  "/api-docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(swaggerSpec)
);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  handleError(err, res);
});
app.listen(PORT, () => {
  console.log(
    `Server is running at: http://localhost:${PORT}/ click for test in swagger => http://localhost:3030/api-docs`
  );
});
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to application termination.");
  process.exit(0);
});
