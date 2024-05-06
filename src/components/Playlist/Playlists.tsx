"use client";

import { MusicIcon } from "@/assets/svgs";
import { apiUrls } from "@/constants";
import RootPageLoader from "@/loading";
import playlistRequest from "@/services/request/playlist.request";
import { SearchOutlined } from "@ant-design/icons";
import Image from "next/image";
import { forwardRef, useImperativeHandle, useState } from "react";
import useSWR from "swr";
import TWInput from "../UI/Input";
import useDebounce from "@/hooks/useDebounce";

interface PlaylistProps {}

export default forwardRef(function Playlists(props: PlaylistProps, ref) {
  const [search, setSearch] = useState("");

  const debounceSearch = useDebounce(search, 1000);

  const {
    isLoading,
    data,
    mutate: refreshPlaylists,
  } = useSWR(
    `${apiUrls.playlists}?search=${debounceSearch}&batch=30`,
    playlistRequest.fetchPlaylists,
    {
      revalidateOnFocus: false,
      fallbackData: [],
    },
  );

  useImperativeHandle(ref, () => {
    return { refreshPlaylists };
  });

  return (
    <div>
      <div className="my-3">
        <TWInput
          value={search}
          onChange={({ currentTarget }) => {
            setSearch(currentTarget.value);
          }}
          placeholder="Search playlists"
          icon={<SearchOutlined className="text-gray-400" />}
        />
      </div>
      {isLoading && (
        <div className="mt-[4rem]">
          <RootPageLoader />
        </div>
      )}
      {!isLoading && !data?.length && <div>No Playlists found.</div>}
      <div className="grid max-h-[calc(100vh-180px)] grid-cols-3 gap-4 overflow-auto">
        {data.map((playlist) => (
          <div
            key={playlist.id}
            role="button"
            className="cursor-pointer rounded-md bg-violet-400 p-1 text-white
           shadow-lg shadow-violet-200 transition-all hover:bg-violet-500"
          >
            <div className="flex items-center justify-between rounded-md p-3 ring-violet-300">
              <span className="text-sm">{playlist.name}</span>
              <div className="flex items-center text-lg font-medium">
                <Image
                  src={MusicIcon}
                  alt="music-icon"
                  className="h-[25px] w-[50px]"
                />
                {playlist.totalSongs}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
