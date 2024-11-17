import { Document } from "mongoose";

export interface IMagicItem extends Document {
  name: string;
  weight: number;
}
