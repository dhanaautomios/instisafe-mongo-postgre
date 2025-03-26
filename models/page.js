// models/Page.js
import { Schema, model } from "mongoose";

const PageSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  pageIcon: {
    type: String
  }
}, { timestamps: true });

export default model("Page", PageSchema); // default export
