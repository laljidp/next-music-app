import mongoose from "mongoose";
import { COLLECTION } from "../constants/db.constants";

const albumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    releaseDate: { type: Date },
    genre: [{ type: String }],
    artist: { type: mongoose.Schema.Types.ObjectId, ref: COLLECTION.ARTISTS },
    coverImage: { type: String },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: COLLECTION.SONGS }],
    // Statistics
    totalDuration: { type: Number, default: 0 }, // Duration in seconds
    totalLikes: { type: Number, default: 0 },
    setting: {
      colors: [{ type: String }],
    },
  },
  {
    timestamps: true,
  },
);

const Albums =
  mongoose.models?.[COLLECTION.ALBUMS] ||
  mongoose.model(COLLECTION.ALBUMS, albumSchema);

export default Albums;
