import { Schema, model } from "mongoose";

const LikeSchema = new Schema({
    feedId: {
        type: Schema.Types.ObjectId,
        ref: 'Feed',
        // required: true
    },
    userId:
    {
        type: Schema.Types.ObjectId,
        ref: 'users',
        //  required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

// Prevent duplicate likes
LikeSchema.index({ feedId: 1, userId: 1 }, { unique: true });


export default model("Like", LikeSchema);
