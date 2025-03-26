import { model, Schema, Types } from "mongoose";

const inviteeSchema = new Schema({
  invitedBy: {
    type: Types.ObjectId,
    ref: "users",
    required: [true, "An invitee is required"],
  },
  email: {
    type: String,
    unique: [true, "This email has already been invited"],
    required: [true, "Email is required"],
  },
  isRegistered: {
    type: Boolean,
    default: false,
  },
});

export default model("invitees", inviteeSchema);
