import { IPlaylistPayload } from "@/services/types/playlists.types";
import Playlists from "../schemas/playlist.schema";
import Artists from "../schemas/artists.schema";
import { connectDB } from "../connect.db";

export type PlaylistsParamsT = {
  batch: number;
  search?: string;
  page: number;
};

class PlayListsFunctions {
  constructor() {
    console.log("Loading PlayListsFunctions::");
  }

  getPlaylists = async ({ search, batch, page }: PlaylistsParamsT) => {
    try {
      await connectDB();
      let finder = {};
      if (!!search?.trim?.()) {
        const regex = new RegExp(search, "i");
        const conditions = {
          $or: [
            {
              name: regex,
              description: regex,
            },
          ],
        };
        finder = { $or: conditions };
      }
      const skip = Number(batch) * Number(page);
      const data = await Playlists.find(finder).skip(skip).limit(batch);
      return data || [];
    } catch (err) {
      console.log("Error executing getPlaylists function::", err);
      return { error: "Something went wrong" };
    }
  };

  saveNewPlaylist = async (payload: IPlaylistPayload) => {
    try {
      const data = await Playlists.create({
        name: payload.name,
        description: payload.description,
        songs: payload.songs,
      });
      return { data };
    } catch (err) {
      console.log("Error executing saveNewPlaylist::", err);
      return { error: "Service unavailable at the moment! Try later" };
    }
  };

  addSongToPlaylist = async (id: string, songs: string[]) => {
    try {
      const data = await Artists.findOneAndUpdate(
        { id },
        {
          $push: {
            songs,
          },
        }
      );
    } catch (err) {
      console.log("Error executing addSongToPlaylist::", err);
    }
  };
}

const PlaylistsFunction = new PlayListsFunctions();

export default PlaylistsFunction;
