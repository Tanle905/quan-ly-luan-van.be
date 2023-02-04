import mongoose from "mongoose";
import { Tag } from "../interface/tag.interface";

export const tagDataSchema = new mongoose.Schema<Tag>({
  majorTags: [{ type: String, default: [] }],
});

export const TagModel = mongoose.model("Tag", tagDataSchema);
