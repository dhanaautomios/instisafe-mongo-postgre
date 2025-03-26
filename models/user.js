import { Schema, model, Types } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      unique: [true, "This email is already in use"],
      required: [true, "Email is required"],
    },
    fcmToken: {
      type: String,
    },
    invitedBy: {
      type: Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

export default model("users", userSchema);
