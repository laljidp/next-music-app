"use client";

import { apiUrls } from "@/constants";
import RootPageLoader from "@/loading";
import playlistRequest from "@/services/request/playlist.request";
import useSWR from "swr";

export default function Playlists() {
  const { isLoading, data } = useSWR(
    apiUrls.playlists,
    playlistRequest.fetchPlaylists,
    {
      revalidateOnFocus: false,
      fallbackData: [],
    },
  );

  console.log({ playlists: data });

  if (isLoading) return <RootPageLoader />;

  return (
    <div className="grid grid-flow-col grid-cols-3 gap-3">
      {data.map((playlist) => (
        <div
          key={playlist.id}
          role="button"
          className="cursor-pointer rounded-md bg-violet-400 text-white shadow-lg shadow-violet-200 transition-all hover:scale-105"
        >
          <div className="flex items-center justify-between rounded-md p-3 ring-violet-300">
            <small>{playlist.name}</small>
            <span className="text-md font-medium">{playlist.totalSongs}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
