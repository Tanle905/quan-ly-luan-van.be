import mongoose from "mongoose";
import { Tag } from "../interface/tag.interface";

export const tagDataSchema = new mongoose.Schema<Tag>({
  name: {
    type: String,
    required: true,
  },
  list: [{ type: { name: String, value: String }, default: [] }],
});

export const TagModel = mongoose.model("Tag", tagDataSchema);
