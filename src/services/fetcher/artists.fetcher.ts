import { Fetcher } from "swr";
import { ArtistsDto } from "../types/artists.types";
import { apiUrls } from "@/constants";

export const fetchArtists: Fetcher<
  ArtistsDto[],
  { path: string; search: string }
> = async ({ search }) => {
  let requestUrl = apiUrls.artists.toString() + "?";
  if (search?.trim()?.length > 0) {
    const params = new URLSearchParams();
    params.set("search", search);
    requestUrl = requestUrl.concat(params.toString());
  }
  const resp = await fetch(requestUrl, {
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

export const saveArtistsRequest = async (payload: saveArtistsPayloadI) => {
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

export const updateArtistRequest = async (payload: ArtistsDto) => {
  const resp = await fetch(apiUrls.artists, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await resp.json();
  const artist = data?.artist as ArtistsDto;
  return artist;
};
