import mongoose, { Schema } from "mongoose";

const roleDataSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
  },
});

export const RoleModel = mongoose.model("Role", roleDataSchema);
