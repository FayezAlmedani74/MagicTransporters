import mongoose, { Schema } from "mongoose";
import { IMagicItem } from "../interfaces/IMagicItem";

const MagicItemSchema: Schema = new Schema({
  name: { type: String, required: true },
  weight: { type: Number, required: true },
});

const MagicItem = mongoose.model<IMagicItem>("MagicItem", MagicItemSchema);
export default MagicItem;
