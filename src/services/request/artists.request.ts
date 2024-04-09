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

  fetchArtists: Fetcher<ArtistsDto[], string> = async (apiPath) => {
    const resp = await fetch(apiPath, {
      method: "GET",
      headers: getDefaultHeaders(),
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
    } catch (err: any) {
      console.log("error saving artists::", err);
      const { message } = (await err?.json()) || {
        message: "Artist not saved",
      };
      throw new Error(message);
    }
  };

  updateArtistRequest = async (payload: ArtistsDto) => {
    try {
      const resp = await fetch(apiUrls.artists, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: getDefaultHeaders(),
      });
      const data = await resp.json();
      const artist = data?.artist as ArtistsDto;
      return artist;
    } catch (err: any) {
      console.log("err updating artists", err);
      const { message } = (await err?.json()) || {
        message: "Artists not saved",
      };
      throw new Error(message);
    }
  };
}

const artistRequest = new ArtistRequest();

export default artistRequest;
