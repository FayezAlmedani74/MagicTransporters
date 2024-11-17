import mongoose, { Schema } from "mongoose";
import { IMagicMover } from "../interfaces/IMagicMover";

const MagicMoverSchema: Schema = new Schema({
  name: { type: String, required: true },
  weightLimit: { type: Number, required: true },
  currentWeight: { type: Number, default: 0 },
  state: {
    type: String,
    enum: ["resting", "loading", "on-mission"],
    default: "resting",
  },
  missionsCompleted: { type: Number, default: 0 },
});

const MagicMover = mongoose.model<IMagicMover>("MagicMover", MagicMoverSchema);
export default MagicMover;
