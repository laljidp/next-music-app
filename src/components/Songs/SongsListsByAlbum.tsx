"use client";
import useSWR from "swr";
import RootPageLoader from "@/loading";
import songsRequest from "@/services/request/songs.request";
import SongsLists from "./SongsLists";
import { apiUrls } from "@/constants";
import IconView from "../Layouts/IconViewLayout";
import { PlusCircleOutlined } from "@ant-design/icons";
import SongSelectionModal from "./SongSelectionModal";
import { useState } from "react";
import { albumRequest } from "@/services/request/albums.request";
import Spinner from "../UI/Spinner";

interface SongsListsByAlbumProps {
  albumID: string;
}

export default function SongsListsByAlbum(props: SongsListsByAlbumProps) {
  const { albumID } = props;
  const [showImportSongs, setShowImportSongs] = useState(false);
  const [processImporting, setProcessImporting] = useState(false);

  const { isLoading, data, mutate } = useSWR(
    { path: apiUrls.songs, id: albumID },
    songsRequest.fetchSongsByAlbum,
    {
      revalidateOnFocus: false,
      fallbackData: [],
    },
  );

  const handleImportSongs = async (songsIds: string[]) => {
    // TODO: call API to append songsIds to albums
    try {
      setShowImportSongs(false);
      setProcessImporting(true);
      const resp = await albumRequest.appendSongs(albumID, songsIds);
      if (resp.success) {
        // TODO: toast messages.
        mutate();
      }
    } catch (err) {
      console.log("ERROR importing songs to album::", err);
    } finally {
      setProcessImporting(false);
    }
  };

  if (isLoading) return <RootPageLoader />;

  return (
    <div className="">
      <div className="py-2">
        <div
          onClick={() => setShowImportSongs(true)}
          className="flex cursor-pointer select-none items-center justify-center gap-1 font-medium text-violet-500 hover:scale-105"
        >
          <IconView Icon={PlusCircleOutlined} />
          <span>Import songs</span>
        </div>
      </div>

      {processImporting && (
        <div className="my-2">
          {" "}
          <Spinner color="violet" size="xl" />
        </div>
      )}
      <div>
        <SongsLists songs={data || []} />
      </div>
      <SongSelectionModal
        isOpen={showImportSongs}
        onClose={() => setShowImportSongs(false)}
        onSongSelected={handleImportSongs}
      />
    </div>
  );
}
