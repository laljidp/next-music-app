import mongoose from "mongoose";
import { COLLECTION } from "../constants/db.constants";

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    duration: { type: Number, required: true }, // Duration in seconds
    artists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: COLLECTION.ARTISTS,
        default: [],
      },
    ],
    source: { type: String, required: true },
    coverImage: { type: String },
    genre: [{ type: String, default: [] }],
    lyrics: { type: String },
    // Statistics
    plays: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    // Other song-related details
    metadata: {
      name: String,
      kind: String,
      size: Number,
      trackNumber: { type: String, default: 0 },
      bitRate: Number,
      comment: String,
    },
    type: {
      type: String,
      enum: ["auto", "user-defined"],
      default: "auto",
    },
  },
  {
    timestamps: true,
  }
);

const Songs =
  mongoose?.models?.[COLLECTION.SONGS] ||
  mongoose.model(COLLECTION.SONGS, songSchema);

// Songs.prototype.IncreaseLikes = function (context: any) {
//   console.log({ context });
// };

export default Songs;
