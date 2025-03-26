import { model, Schema, Types } from "mongoose";

const notificationSchema = new Schema({
  title: {
    type: String,
    required: [true, "Notification title is required"],
    trim: true,
  },
  message: { 
    type: String,
    required: [true, "Notification message is required"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
  createdBy: {
    type: Types.ObjectId,
    ref: "admins", 
  },
  isNotified: {
    type: Boolean,
    default: false,
  },
});

export default model("notifications", notificationSchema);
