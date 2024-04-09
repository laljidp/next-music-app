"use client";
import { Fetcher } from "swr";
import { PlayListsDto, PlaylistMinimumDto } from "../types/playlist.types";
import { getDefaultHeaders } from ".";

class PlaylistsRequest {
  constructor() {
    console.log("Loading PlaylistsRequests::");
  }

  fetchPlaylists: Fetcher<PlaylistMinimumDto[], string> = async (apiPath) => {
    let data = [] as PlaylistMinimumDto[];
    const resp = await fetch(apiPath, {
      method: "GET",
      headers: getDefaultHeaders(),
    });
    data = (await resp.json())?.playlists || ([] as PlayListsDto[]);
    return data;
  };
}

const playlistRequest = new PlaylistsRequest();

export default playlistRequest;
