import Artists from "@/services/db/schemas/artists.schema";
import { ArtistsDto } from "@/services/types/artists.types";
import { TFuncResponse, getMongoConstraintError } from "../db.utils";
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

export type GetArtistsPayloadT = {
  page: number;
  batch: number;
  searchTerm: string;
};

class ArtistFunction {
  constructor() {
    connectDB();
  }
  saveArtists = async (payload: ArtistPayloadT): TFuncResponse<ArtistsDto> => {
    try {
      const data = await Artists.create(payload);
      if (data) {
        return { data, error: null };
      }
      return { error: "Artists not saved.", data: null };
    } catch (err) {
      const error = getMongoConstraintError(err?.toString() || "");
      return { data: null, error };
    }
  };

  getArtists = async (
    payload: GetArtistsPayloadT,
    fields: string[] = []
  ): TFuncResponse<ArtistsDto> => {
    try {
      const { batch, page, searchTerm } = payload;
      const regex = new RegExp(searchTerm, "i");
      let finder = {};
      if (searchTerm.trim().length > 2) {
        let conditions = [
          { bio: regex }, // Matches titles containing 'JavaScript' (case insensitive)
          { name: regex }, // Matches authors with the name 'John Doe'
        ];
        finder = { $or: conditions };
      }
      let data: any;
      data = await Artists.find(finder)
        .sort({ createdAt: "desc" })
        .skip(Number(page) * Number(batch))
        .limit(batch)
        .select(fields);

      return { data, error: null };
    } catch (err) {
      console.log("Error fetching artists data", err);
      return { error: "Service looks down ! please try again later" };
    }
  };

  updateArtist = async (
    _id: string,
    payload: ArtistPayloadT
  ): TFuncResponse<ArtistsDto> => {
    try {
      const artist = await Artists.findOneAndUpdate({ _id }, payload);
      if (artist) {
        return { data: artist, error: null };
      }
      return { data: null, error: "Artists not saved ! please try later." };
    } catch (err) {
      console.log("Error saving artists", err);
      const error = getMongoConstraintError(err?.toString() || "");
      return { data: null, error };
    }
  };
}

const artistFunction = new ArtistFunction();

export default artistFunction;
