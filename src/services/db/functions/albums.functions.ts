import { IAlbumDto } from "@/services/types/albums.types";
import Albums from "../schemas/album.schema";
import { TFuncResponse, getMongoConstraintError } from "../db.utils";

export type GetAlbumPayloadT = {
  page: number;
  batch: number;
  searchTerm: string;
};

class AlbumFunctions {
  constructor() {
    console.log("Loading AlbumFunctions::()");
  }

  getAlbums = async (
    payload: GetAlbumPayloadT,
    fields: string[] = []
  ): TFuncResponse<IAlbumDto> => {
    const { batch, page, searchTerm } = payload;
    try {
      const regex = new RegExp(searchTerm, "i");
      let conditions = [
        { description: regex }, // Matches titles containing 'JavaScript' (case insensitive)
        { title: regex }, // Matches authors with the name 'John Doe'
      ];
      let data: any = [];
      if (searchTerm.trim()?.length > 2) {
        data = await Albums.find({ $or: conditions })
          .sort({ createdAt: "desc" })
          .skip(Number(page) * Number(batch))
          .limit(batch)
          .select(fields);
      } else {
        data = await Albums.find({})
          .sort({ createdAt: "desc" })
          .skip(Number(page) * Number(batch))
          .limit(batch)
          .select(fields);
      }
      const hasMore = data.length === Number(batch);
      return { data, hasMore };
    } catch (err) {
      console.log("Error fetching albums from db::", err);
      return { error: "Service looks down ! Please try again later." };
    }
  };

  saveAlbum = async (payload: IAlbumDto): TFuncResponse<IAlbumDto> => {
    try {
      const createdAlbum = await Albums.create(payload);
      if (!createdAlbum) {
        throw new Error("Album not saved.");
      }
      return { data: createdAlbum };
    } catch (err: any) {
      const error = getMongoConstraintError(err?.toString());
      return { error };
    }
  };

  updateAlbum = async (_id: string, payload: IAlbumDto) => {
    try {
      const { artists, ...restPayload } = payload;
      const _album = await Albums.findOneAndUpdate(
        { _id },
        {
          ...restPayload,
          $set: { artists: artists || [] },
        },
        {
          returnDocument: "after",
        }
      );
      if (!_album) {
        throw new Error("Album not saved");
      }
      return { data: _album };
    } catch (err: any) {
      console.log("err", err);
      const error = getMongoConstraintError(err?.toString());
      return { error };
    }
  };
}

const albumFunction = new AlbumFunctions();

export default albumFunction;
