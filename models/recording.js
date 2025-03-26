import mongoose, { Schema, model } from "mongoose";

const recordingSchema = new Schema(
  {
    startedAt: {
      type: Date,
      required: [true, "start time is required"],
    },
    stoppedAt: Date,
    cameraId: {
      type: mongoose.Types.ObjectId,
      ref: "cameras",
      required: [true, "camera id is required"],
    },
    alertId: {
      type: mongoose.Types.ObjectId,
      ref: "alert-logs",
      required: [true, "alertId is required"],
    },
  },
  { timestamps: true }
);

export default model("recordings", recordingSchema);
