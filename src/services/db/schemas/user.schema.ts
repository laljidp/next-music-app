import mongoose from "mongoose";
import { COLLECTION } from "../constants/db.constants";

export enum USER_ROLES {
  USER = "user",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

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

const userSchema = new mongoose.Schema(
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
      enum: USER_ROLES,
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

const Users =
  mongoose.models?.[COLLECTION.USERS] ||
  mongoose.model(COLLECTION.USERS, userSchema);

export default Users;
