import { Schema, model } from "mongoose";

const RoleSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Role name is required"],
      unique: [true, "Role name must be unique"],
      maxlength: [50, "Role name must not exceed 50 characters"],
    },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "permission",
      },
    ], 
    createdBy: {
      type: Schema.Types.ObjectId,
      ref:"admins"
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref:"admins"
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    isDeleted:{
      type:Boolean,
      default:false,
    },
  },
  { timestamps: true }
);

export default model("roles", RoleSchema);
