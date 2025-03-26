import { model, Schema } from "mongoose";

const cameraLocationSchema=new Schema({
    locationName:{
        type:String,
        require:true
    },
    buildingName:{
        type:String,
        require:true
    },
    floorNumber:{
        type:Number,
        require:false,
    },
    status:{
        type:String,
        default:'Active',
    },
},{timestamps:true});

export default model("cameraLocation",cameraLocationSchema);