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
  searchTerm: string;
};

export const getArtists = async (payload: GetArtistsPayloadT) => {
  const { batch, page, searchTerm } = payload;
  const db = await connectDB();
  console.log("processing..");
  const regex = new RegExp(searchTerm, "i");
  let conditions = [
    { bio: regex }, // Matches titles containing 'JavaScript' (case insensitive)
    { name: regex }, // Matches authors with the name 'John Doe'
  ];
  let data: any;
  if (searchTerm.trim()?.length > 2) {
    data = await Artists.find({ $or: conditions })
      .skip(Number(page) * Number(batch))
      .limit(batch);
  } else {
    data = await Artists.find({ $or: conditions })
      .skip(Number(page) * Number(batch))
      .limit(batch);
  }

  return data;
};

export const updateArtist = async (_id: string, payload: ArtistPayloadT) => {
  const doc = await Artists.findOneAndUpdate({ _id }, payload);
  return doc;
};
