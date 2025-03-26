import { Schema, model } from "mongoose";

const userApplicationSchema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"admins",
        require:true,
    },
    applicationId:{
        type:Schema.Types.ObjectId,
        ref:'Application',
        require:true,
    }
},{timestamps:true});

export default model("UserApplication", userApplicationSchema);