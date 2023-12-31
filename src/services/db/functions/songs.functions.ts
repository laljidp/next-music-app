import { ISongsDto } from "@/services/types/songs.types";
import { TFuncResponse } from "../db.utils";
import Songs from "../schemas/songs.schema";
import { MONGO_ERROR_CODES } from "../constants/db.constants";
import Albums from "../schemas/album.schema";

export interface IFetchSongsPayload {
  searchText: string;
  batch: number;
  page: number;
}

class SongsFunctions {
  constructor() {
    console.log("Loading SongsFunctions::()");
  }

  fetchSongsByAlbum = async (albumId: string) => {
    try {
      const _songs = Albums.findById(albumId).populate("songs");
      return { data: _songs };
    } catch (err) {
      return { error: "Failed to fetch songs of albums" };
      console.log("Error fetching songs by album::", err);
    }
  };

  fetchSongs = async (params: IFetchSongsPayload, fields: string[] = []) => {
    const { searchText, batch, page } = params;
    try {
      let finder = {};
      if (searchText?.trim()?.length > 2) {
        const searchRegex = new RegExp(searchText, "i");
        const conditions = [{ title: searchRegex }, { lyrics: searchRegex }];
        finder = { $or: conditions };
      }
      const _songs = (await Songs.find(finder)
        .select(fields)
        .limit(batch)
        .skip(page * batch)) as ISongsDto[];
      if (_songs) {
        return { data: _songs };
      }
      return { data: [] };
    } catch (err) {
      console.log("Error fetching songs", err);
      return { error: err?.toString() };
    }
  };

  saveNewSong = async (payload: ISongsDto): TFuncResponse<ISongsDto> => {
    try {
      const song = (await Songs.create(payload)) as ISongsDto;
      return { data: song };
    } catch (err) {
      if (err?.toString().includes(MONGO_ERROR_CODES.DUPLICATE)) {
        return { error: "Song already exists with same title." };
      }
      return { error: err?.toString() };
    }
  };

  updateSong = async (
    _id: string,
    payload: ISongsDto
  ): TFuncResponse<ISongsDto> => {
    try {
      const song = (await Songs.findByIdAndUpdate({ _id }, payload, {
        returnDocument: "after",
      })) as ISongsDto;
      return { data: song };
    } catch (err) {
      if (err?.toString()?.includes(MONGO_ERROR_CODES.DUPLICATE)) {
        return {
          error: "Song already exists with this name, you cannot update !",
        };
      }
      return { error: err?.toString() };
    }
  };
}

const songsFunction = new SongsFunctions();

export default songsFunction;
