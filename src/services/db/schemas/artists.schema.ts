import mongoose from "mongoose";
import { COLLECTION } from "../constants/db.constants";

const artistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    bio: String,
    genre: [{ type: String }],
    image: String,
    albums: [{ type: mongoose.Schema.Types.ObjectId, ref: COLLECTION.ALBUMS }],
    socialMedia: {
      website: String,
      facebook: String,
      twitter: String,
      instagram: String,
      // Other social media links
    },
    // Statistics
    followers: { type: Number, default: 0 },
    monthlyListeners: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Artists =
  mongoose.models?.[COLLECTION.ARTISTS] ||
  mongoose.model(COLLECTION.ARTISTS, artistSchema);

export default Artists;
