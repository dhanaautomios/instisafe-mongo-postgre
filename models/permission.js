import { Schema, model } from "mongoose";

const PermissionSchema = new Schema({
    page_id: { 
      type: Schema.Types.ObjectId, 
      ref: 'page', 
      required: [true, "Page ID is required"],
    },
    actions: {
      view: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      edit: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    }
  }, { timestamps: true });

export default model("permission", PermissionSchema);
