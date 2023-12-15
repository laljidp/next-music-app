import mongoose from "mongoose";
import { COLLECTION } from "../constants/db.constants";

export type UserPreferencesT = {
  createPlaylist: boolean;
  uploadSongs: boolean;
  createAlbum: boolean;
  playSongs: boolean;
  searchSongs: boolean;
  profileUpdate: boolean;
};

export const USER_PREFERENCES: UserPreferencesT = {
  createPlaylist: true,
  uploadSongs: false,
  createAlbum: false,
  playSongs: true,
  searchSongs: true,
  profileUpdate: true,
};

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    givenName: { type: String, default: null },
    familyName: { type: String, default: null },
    picture: { type: String, default: null },
    role: {
      type: String,
      required: true,
      default: "user",
      enum: ["user", "admin"],
    },
    preferences: {
      type: Map,
      default: USER_PREFERENCES,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    provider: {
      type: String,
      enum: ["google", "facebook"],
    },
    providerId: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models?.[COLLECTION.USERS] ||
  mongoose.model(COLLECTION.USERS, UserSchema);
