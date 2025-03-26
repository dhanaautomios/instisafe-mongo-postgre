import { model, Schema } from "mongoose";

const adminSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Name is required"], 
    },
    email: {
      type: String,
      unique: [true, "This email is already in use"],
      required: [true, "Email is required"],
    },
    password_hash: {
      type: String,
      required: [true, "Password is required"],
    },
    is_first_login: {
      type: Boolean,
      default: true,  
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "roles",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "admins",
    },
    modifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "admins",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    emergencyNumber: {
      type: String,
      required: [true, "Emergency number is required"],
    },
    profilePhoto: {
      type: String, 
      default: "", 
    },
    dateOfBirth: {
      type: Date,
      // required: [true, "Date of birth is required"],
    },
    address: {
      type: String,
      // required: [true, "Address is required"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      // required: [true, "Gender is required"],
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      // required: [true, "Blood group is required"],
    },
    reportTo: {
      type:String
    },

    isDeleted: {
      type: Boolean,
      default: false, // Default value is false (user is active)
    },
    
  },
  { timestamps: true }
);


export default model("admins", adminSchema);




