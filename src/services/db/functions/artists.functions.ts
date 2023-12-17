import Artists from "@/services/db/schemas/artists.schema";
import { connectDB } from "../connect.db";

export type ArtistPayloadT = {
  name: string;
  bio?: string;
  genre?: string[];
  image?: string;
  albums?: string[];
  dob?: Date;
  socialMedia?: {
    website?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
};

export const saveArtists = async (payload: ArtistPayloadT) => {
  try {
    const data = await Artists.create(payload);
    if (data) {
      return data;
    }
    return null;
  } catch (err) {
    console.log("Error saving artists", err);
    return null;
  }
};

export type GetArtistsPayloadT = {
  page: number;
  batch: number;
};

export const getArtists = async (payload: GetArtistsPayloadT) => {
  const { batch, page } = payload;
  const db = await connectDB();
  console.log("processing..");

  const data = await Artists.find({}).skip(0).limit(batch);

  return data;
};
