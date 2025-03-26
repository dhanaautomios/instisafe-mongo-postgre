import { Schema, model } from "mongoose";
import Like from './like.js';
import Comment from './comment.js';

const FeedSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrls: [
    {
      type: String,
      required: true
    }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'admins'
  },
  modifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'admins'
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Like'
    }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  deleted: {
    type: Boolean,
    default: false
  }, // Soft delete
});

FeedSchema.pre('findOneAndDelete', async function (next) {
  try {
    const feed = await this.model.findOne(this.getQuery());
    if (feed) {
      await Comment.deleteMany({ feedId: feed._id });
      await Like.deleteMany({ feedId: feed._id });
    }
    next();
  } catch (error) {
    next(error);
  }
});

export default model("Feed", FeedSchema);