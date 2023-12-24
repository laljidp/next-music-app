import { apiUrls } from "@/constants";
import { configFetchInterceptor, getDefaultHeaders } from ".";
import { ISongsDto } from "../types/songs.types";
import { Fetcher } from "swr";

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
}

const songsRequest = new SongsRequest();

export default songsRequest;
