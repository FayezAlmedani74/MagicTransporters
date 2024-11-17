import mongoose, { Schema, Document } from "mongoose";
import { IMissionLog } from "../interfaces/IMissionLog";

const MissionLogSchema = new Schema({
  moverId: { type: Schema.Types.ObjectId, ref: "MagicMover", required: true },
  action: {
    type: String,
    enum: ["loading", "on-mission", "resting"],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

const MissionLog = mongoose.model<IMissionLog>("MissionLog", MissionLogSchema);
export default MissionLog;
