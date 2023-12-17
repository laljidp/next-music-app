import mongoose from "mongoose";
import { COLLECTION } from "../constants/db.constants";

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    duration: { type: Number, required: true }, // Duration in seconds
    artist: { type: mongoose.Schema.Types.ObjectId, ref: COLLECTION.ARTISTS },
    source: { type: String, required: true },
    album: { type: mongoose.Schema.Types.ObjectId, ref: COLLECTION.ALBUMS },
    genre: [{ type: String }],
    lyrics: { type: String },
    // Statistics
    plays: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    // Other song-related details
    metadata: { type: Map<String, Number | String | Boolean>, default: {} },
    type: {
      type: String,
      enum: ["auto", "user-defined"],
      default: "auto",
    },
  },
  {
    timestamps: true,
  },
);

const Songs =
  mongoose?.models?.[COLLECTION.SONGS] ||
  mongoose.model(COLLECTION.SONGS, songSchema);

export default Songs;
