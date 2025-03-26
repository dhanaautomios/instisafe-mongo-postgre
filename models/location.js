import { Schema, model } from "mongoose";

const locationSchema = new Schema({
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
});

export default model("locations", locationSchema);
