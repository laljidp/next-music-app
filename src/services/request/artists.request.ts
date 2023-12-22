"use client";
import { Fetcher } from "swr";
import { ArtistsDto } from "../types/artists.types";
import { apiUrls } from "@/constants";
import { configFetchInterceptor, getDefaultHeaders } from ".";

export interface saveArtistsPayloadI {
  name: string;
  bio: string;
  image: string | null;
  genre: string[];
}

class ArtistRequest {
  constructor() {
    configFetchInterceptor();
  }

  fetchArtists: Fetcher<
    ArtistsDto[],
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
    const data = (await resp.json()).data as ArtistsDto[];
    return data;
  };

  saveArtistsRequest = async (payload: saveArtistsPayloadI) => {
    try {
      const resp = await fetch(apiUrls.artists, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: getDefaultHeaders(),
      });
      const data = await resp.json();
      return data?.artist || null;
    } catch (err) {
      console.log("error saving artists::", err);
      return null;
    }
  };

  updateArtistRequest = async (payload: ArtistsDto) => {
    const resp = await fetch(apiUrls.artists, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: getDefaultHeaders(),
    });
    const data = await resp.json();
    const artist = data?.artist as ArtistsDto;
    return artist;
  };
}

const artistRequest = new ArtistRequest();

export default artistRequest;
