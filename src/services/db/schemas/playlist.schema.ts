import mongoose from "mongoose";
import { COLLECTION } from "../constants/db.constants";

const PlaylistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: COLLECTION.PLAYLIST,
      },
    ],
    createdBy: {
      type: String,
      default: "system",
    },
  },
  {
    timestamps: true,
  }
);

const Playlists =
  mongoose.models?.[COLLECTION.PLAYLIST] ||
  mongoose.model(COLLECTION.PLAYLIST, PlaylistSchema);

export default Playlists;
