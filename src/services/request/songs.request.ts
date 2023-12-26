import { apiUrls } from "@/constants";
import { configFetchInterceptor, getDefaultHeaders } from ".";
import { ISongsDto } from "../types/songs.types";
import { Fetcher } from "swr";
import { MONGO_ERROR_CODES } from "../db/constants/db.constants";

class SongsRequest {
  constructor() {
    configFetchInterceptor();
  }

  fetchSongs: Fetcher<
    ISongsDto[],
    { path: string; search: string; minimal?: boolean }
  > = async (payload) => {
    try {
      const { search, minimal } = payload;
      const params = new URLSearchParams();

      if (search?.trim()?.length > 0) {
        params.set("search", search);
      }
      if (minimal) {
        params.set("minimal", "true");
      }
      const queryStr = params.toString();
      const resp = await fetch(`${apiUrls.songs}?${queryStr}`, {
        method: "GET",
        headers: getDefaultHeaders(),
      });
      const data = await resp.json();
      const songs = data.songs as ISongsDto[];
      if (songs) {
        return songs || [];
      }
      return [];
    } catch (err) {
      console.log("Error requesting GET /songs", err);
      return Promise.reject(err);
    }
  };

  async saveNewSong(payload: ISongsDto) {
    try {
      const resp = await fetch(apiUrls.songs, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: getDefaultHeaders(),
      });
      const data = await resp.json();
      if (resp.ok && resp.status === 200) {
        return data?.song || null;
      }
    } catch (err) {
      console.log("Failed to process saving song::", err);
    }
  }
  async updateSong(_id: string, payload: ISongsDto) {
    try {
      const resp = await fetch(apiUrls.songs, {
        method: "PUT",
        body: JSON.stringify({ _id, ...payload }),
      });
      const data = await resp.json();
      return data?.song || null;
    } catch (err) {
      console.log("Error requesting PUT /songs", err);
      return Promise.reject(err);
    }
  }
}

const songsRequest = new SongsRequest();

export default songsRequest;
