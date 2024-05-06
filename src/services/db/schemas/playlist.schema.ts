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
      default: null,
    },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: COLLECTION.SONGS,
      },
    ],
    createdBy: {
      type: String,
      default: "system",
    },
  },
  {
    timestamps: true,
  },
);

PlaylistSchema.virtual("total_songs").get(function () {
  return this?.songs?.length || 0;
});

const Playlists =
  mongoose.models?.[COLLECTION.PLAYLIST] ||
  mongoose.model(COLLECTION.PLAYLIST, PlaylistSchema);

export default Playlists;
