import { Fetcher } from "swr";
import { ArtistsDto } from "../types/artists.types";
import { apiUrls } from "@/constants";

export const fetchArtists: Fetcher<ArtistsDto[], string> = async (
  path: string,
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
