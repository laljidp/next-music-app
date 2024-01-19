"use client";
import useSWR from "swr";
import RootPageLoader from "@/loading";
import songsRequest from "@/services/request/songs.request";
import SongsLists from "./SongsLists";
import { apiUrls } from "@/constants";
import { ISongsDto } from "@/services/types/songs.types";

interface SongsListsByAlbumProps {
  albumID: string;
}

export default function SongsListsByAlbum(props: SongsListsByAlbumProps) {
  const { albumID } = props;

  const { isLoading, data, error } = useSWR<ISongsDto[]>(
    { path: apiUrls.songs, id: albumID },
    songsRequest.fetchSongsByAlbum,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      fallbackData: [],
    }
  );

  console.log({ error });
  console.log({ isLoading });

  if (isLoading) return <RootPageLoader />;

  return (
    <div>
      <SongsLists songs={data || []} onSelectSong={() => {}} />
    </div>
  );
}
