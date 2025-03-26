import { Schema, model } from "mongoose";

const cameraSchema = new Schema({
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
      required: [true, "Location specification required(Point)"],
    },
    coordinates: {
      type: [Number],
      validate: {
        validator: (v) => {
          return v.length === 2;
        },
        message: "coordinate array should be of length 2",
      },
      required: [true, "location.coordinates required"],
    },
  },
  name: {
    type: String,
    required: [true, "Name of the camera is required"],
  },
  building: {
    type: String,
    required: [true, "building is required"],
  },
  locationId:{
    type:Schema.Types.ObjectId,
    required:false,
  },
  rtsp: {
    type: String,
    required: [true, "RTSP URL is required"],
  },
  isDeleted:{
    type:Boolean,
    default:false,
  },

},{timestamps:true});

cameraSchema.index({ location: "2dsphere" });

export default model("cameras", cameraSchema);
