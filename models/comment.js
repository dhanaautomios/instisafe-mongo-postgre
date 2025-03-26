import { Schema, model } from "mongoose";

const CommentSchema = new Schema({
    feedId: {
        type: Schema.Types.ObjectId,
        ref: 'Feed',
        // required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        // required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});


export default model("Comment", CommentSchema);
