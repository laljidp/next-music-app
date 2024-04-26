import mongoose from "mongoose";
import { COLLECTION } from "../constants/db.constants";

export const MediaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    source: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Media =
  mongoose?.models[COLLECTION.MEDIA] ||
  mongoose.model(COLLECTION.MEDIA, MediaSchema);

export default Media;
