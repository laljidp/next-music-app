"use client";
import RootPageLoader from "@/loading";
import songsRequest from "@/services/request/songs.request";
import useSWR from "swr";
import SongsLists from "./SongsLists";
import { apiUrls } from "@/constants";
import { ISongsDto } from "@/services/types/songs.types";

interface SongsListsByAlbumProps {
  albumID: string;
}

export default function SongsListsByAlbum(props: SongsListsByAlbumProps) {
  const { albumID } = props;
  console.log("albumID...", albumID);

  const { isLoading, data, error } = useSWR<
    ISongsDto[],
    { path: string; id: string }
  >({ path: apiUrls.songs, id: albumID }, songsRequest.fetchSongsByAlbum, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    fallbackData: [],
  });

  console.log({ error });
  console.log({ isLoading });

  if (isLoading) return <RootPageLoader />;

  return (
    <div>
      <SongsLists songs={data || []} onSelectSong={() => {}} />
    </div>
  );
}