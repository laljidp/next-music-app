"use client";

import { apiUrls } from "@/constants";
import { configFetchInterceptor, getDefaultHeaders } from ".";
import { IAlbumDto, IAlbumStatPayload } from "../types/albums.types";
import { Fetcher } from "swr";

class AlbumRequest {
  constructor() {
    configFetchInterceptor();
  }

  fetchAlbums: Fetcher<
    IAlbumDto[],
    { path: string; search: string; minimal?: boolean }
  > = async ({ search = "", minimal = false, path }) => {
    let requestUrl = path.toString() + "?";
    const params = new URLSearchParams();

    if (search?.trim()?.length > 0) {
      params.set("search", search);
    }
    if (minimal) {
      params.set("minimal", "true");
    }

    requestUrl = requestUrl.concat(params.toString());
    const resp = await fetch(requestUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = (await resp.json()).data as IAlbumDto[];
    return data;
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
    } catch (err) {
      console.log("Error calling /POST", apiUrls.albums, err);
      return null;
    }
  };
}

const albumRequest = new AlbumRequest();

export { albumRequest };
