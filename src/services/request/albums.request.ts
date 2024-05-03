"use client";

import { apiUrls } from "@/constants";
import { configFetchInterceptor, getDefaultHeaders } from ".";
import { IAlbumDto, IAlbumStatPayload } from "../types/albums.types";
import { Fetcher } from "swr";

export type AlbumResponse = {
  hasMore: boolean;
  data: IAlbumDto[];
  success: boolean;
};

class AlbumRequest {
  constructor() {
    configFetchInterceptor();
  }

  fetchAlbums: Fetcher<
    {
      data: IAlbumDto[];
      hasMore: boolean;
    },
    string
  > = async (queryStr) => {
    const resp = await fetch(queryStr, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const albumResp = (await resp.json()) as AlbumResponse;
    const { data, hasMore } = albumResp;
    return { data, hasMore };
  };

  fetchAlbumOptions: Fetcher<IAlbumDto[], string> = async (queryStr) => {
    const resp = await fetch(queryStr, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const albumResp = (await resp.json()) as AlbumResponse;
    const { data, hasMore } = albumResp;
    return data || [];
  };

  saveAlbum = async (body: IAlbumStatPayload) => {
    try {
      const resp = await fetch(apiUrls.albums, {
        method: "POST",
        body: JSON.stringify(body),
        headers: getDefaultHeaders(),
      });
      const data = await resp.json();
      return data?.album;
    } catch (err: any) {
      const { message } = (await err?.json()) || {
        message: "Album not saved ! Please try again later",
      };
      throw new Error(message);
    }
  };

  appendSongs = async (id: string, songIds: string[]) => {
    const resp = await fetch(`${apiUrls.albums}/${id}/songs`, {
      method: "PUT",
      body: JSON.stringify(songIds),
    });
    const data = await resp.json();
    return data;
  };

  updateAlbum = async (id: string, body: IAlbumStatPayload) => {
    try {
      const resp = await fetch(`${apiUrls.albums}/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: getDefaultHeaders(),
      });
      const data = await resp.json();
      return data?.album;
    } catch (err: any) {
      console.log("Error calling /PUT /api/albums", err);
      const { message } = (await err?.json()) || {
        message: "Album not saved ! Please try again later",
      };
      throw new Error(message);
    }
  };
}

const albumRequest = new AlbumRequest();

export { albumRequest };
