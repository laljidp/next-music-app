"use client";
import useSWR from "swr";
import RootPageLoader from "@/loading";
import songsRequest from "@/services/request/songs.request";
import SongsLists from "./SongsLists";
import { apiUrls } from "@/constants";

interface SongsListsByAlbumProps {
  albumID: string;
}

export default function SongsListsByAlbum(props: SongsListsByAlbumProps) {
  const { albumID } = props;

  const { isLoading, data, error } = useSWR(
    { path: apiUrls.songs, id: albumID },
    songsRequest.fetchSongsByAlbum,
    {
      revalidateOnFocus: false,
      fallbackData: [],
    }
  );

  console.log({ data });

  console.log({ error });
  console.log({ isLoading });

  if (isLoading) return <RootPageLoader />;

  return (
    <div>
      <SongsLists songs={data || []} onSelectSong={() => {}} />
    </div>
  );
}
