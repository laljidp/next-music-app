import { Fetcher } from "swr";
import { ArtistsDto } from "../types/artists.types";
import { apiUrls } from "@/constants";
import Artists from "../db/schemas/artists.schema";

export const fetchArtists: Fetcher<ArtistsDto[], string> = async (
  path: string
) => {
  const resp = await fetch(apiUrls.artists, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = (await resp.json()).data as ArtistsDto[];
  return data;
};

export interface saveArtistsPayloadI {
  name: string;
  bio: string;
  image: string | null;
  genre: string[];
}

export const saveArtists = async (payload: saveArtistsPayloadI) => {
  try {
    const resp = await fetch(apiUrls.artists, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await resp.json();
    console.log("saved artist data", data);
    if (data) {
      return data?.artist;
    }
    return null;

    return data;
  } catch (err) {
    console.log("error saving artists::", err);
  }
};
