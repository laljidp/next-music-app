"use client";
import { Fetcher } from "swr";
import { PlayListsDto, PlaylistMinimumDto } from "../types/playlist.types";
import { getDefaultHeaders } from ".";
import { apiUrls } from "@/constants";

export type addPlaylistArgs = {
  name: string;
  description?: string;
};

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

  addPlaylist = async (payload: addPlaylistArgs) => {
    const resp = await fetch(apiUrls.playlists, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: getDefaultHeaders(),
    });
    const data = await resp.json();
    return data;
  };
}

const playlistRequest = new PlaylistsRequest();

export default playlistRequest;
