import { Document } from "mongoose";

export interface IMagicMover extends Document {
  name: string;
  weightLimit: number;
  currentWeight: number;
  state: "resting" | "loading" | "on-mission";
  missionsCompleted: number;
}
