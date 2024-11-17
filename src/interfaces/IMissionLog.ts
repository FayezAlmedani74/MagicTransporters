import mongoose from "mongoose";

export interface IMissionLog {
  moverId: mongoose.Types.ObjectId;
  action: "loading" | "on-mission" | "resting";
  timestamp: Date;
}
