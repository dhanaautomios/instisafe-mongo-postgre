import mongoose, { Schema, model } from "mongoose";

const alertSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: [true, "user is required"],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: [true, "Location specification required(Point)"],
      },
      coordinates: {
        // longtitude comes first
        type: [Number],
        required: [true, "location.coordinates required"],
      },
    },
    status: {
      type: String,
      enum: ["PENDING", "ACKNOWLEDGED", "RESOLVED"],
      required: [true, "status is required"],
      default: "PENDING",
    },
    frontendTimestamp: {
      type: Date,
    },
    ackedAt: {
      type: Date,
      required: function () {
        return this.status === "ACKNOWLEDGED";
      },
    },
    resolvedAt: {
      type: Date,
      required: function () {
        return this.status === "RESOLVED";
      },
    },
    resolvedBy: {
      type: String,
      enum: ["USER", "ADMIN"],
      required: [
        function () {
          return this.status === "RESOLVED";
        },
        "Resolved state requires the resolvedBy field",
      ],
    },
    ackedBy: {
      type: String,
      enum: ["ADMIN"],
      required: [
        function () {
          return this.status === "ACKNOWLEDGED";
        },
        "Acknowledged state requires the ackedBy field",
      ],
    },
    assignee: { 
      type: mongoose.Types.ObjectId,
      ref: "admins",
      required: function () {
        return this.status !== "PENDING";
      },
    },
    path: [
      {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
          required: [true, "path.location.type specification required(Point)"],
        },
        coordinates: {
          // longtitude comes first
          type: [Number],
          required: [true, "path.location.coordinates required"],
        },
        timestamp: {
          type: Date,
          required: [true, "path.location.timestamp required"],
        },
      },
    ],
    origin: {
      type: String,
    },
  },
  { timestamps: true }
);

export default model("alerts", alertSchema);
