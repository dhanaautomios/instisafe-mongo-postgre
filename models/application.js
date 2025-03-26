import { Schema, model } from "mongoose";

const applicationSchema=new Schema({
    applicationName:{
        type:String,
        require:true,
    },
    applicationUrl:{
        type:String,
        require:true
    },
    applicationLogoURL:{
        type:String,
        require:true,
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{timestamps:true})


export default model("Application", applicationSchema);