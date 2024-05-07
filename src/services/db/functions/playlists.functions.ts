import { IPlaylistPayload } from "@/services/types/playlists.types";
import Playlists from "../schemas/playlist.schema";
import { ERROR_MSG, getMongoConstraintError } from "../db.utils";

export type PlaylistsParamsT = {
  batch: number;
  search?: string;
  page: number;
};

export type UpdatePlayListPayload = {
  songs: string[];
  name?: string;
  description?: string;
};

class PlayListsFunctions {
  constructor() {
    console.log("Loading PlayListsFunctions::");
  }

  getPlaylists = async ({ search, batch, page }: PlaylistsParamsT) => {
    try {
      let finder = {};
      if (search?.trim()?.length) {
        const regex = new RegExp(search, "i");
        const conditions = [{ name: regex }, { description: regex }];
        finder = { $or: conditions };
      }
      const skip = Number(batch) * Number(page);
      let data = await Playlists.find(finder, {
        name: true,
        songs: true,
      })
        .skip(skip)
        .limit(batch)
        .sort({ createdAt: "desc" });
      data = data.map((doc) => ({
        id: doc._id,
        name: doc.name,
        totalSongs: doc.total_songs,
      }));
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

  updatePlaylist = async (
    _id: string,
    { name, description, songs }: UpdatePlayListPayload,
  ) => {
    try {
      let updateObj = {
        name,
        description,
      };
      if (!!songs?.length) {
        updateObj = Object.assign(updateObj, {
          $addToSet: {
            songs: {
              $each: songs || [],
            },
          },
        });
      }

      const playlist = await Playlists.updateOne({ _id }, updateObj, {
        upsert: true,
        returnDocument: "after",
      });
      return { data: playlist };
    } catch (err: any) {
      console.log("Error executing addSongToPlaylist::", err);
      const error = getMongoConstraintError(err?.toString());

      return { error: error || ERROR_MSG.UNDER_MAINTENANCE };
    }
  };

  removeSongFromPlaylist = async (_id: string, songsIds: string[]) => {
    try {
      const playlist = await Playlists.updateOne(
        { _id },
        {
          $pull: {
            songs: {
              $in: songsIds,
            },
          },
        },
        {
          returnDocument: "after",
          lean: true,
        },
      );
      return { data: playlist };
    } catch (err) {
      console.log("Error executing removeSongFromPlaylist::", err);
      return { error: "Service unavailable !" };
    }
  };

  fetchPlaylistSongs = async (_id: string) => {
    try {
      const songs = await Playlists.findOne({ _id }).populate("songs").limit(1);
      return { data: songs };
    } catch (err) {
      console.log("ERROR executing fetchPlaylistSongs::", _id);
      return { error: ERROR_MSG.UNDER_MAINTENANCE };
    }
  };

  deletePlaylist = async (_id: string) => {
    try {
      const data = await Playlists.deleteOne({ _id });
      return { data };
    } catch (err) {
      console.log("ERROR executing deletePlaylist::", err);
      return { error: "Failed to delete playlist" };
    }
  };
}

const playlistsFunction = new PlayListsFunctions();

export default playlistsFunction;
