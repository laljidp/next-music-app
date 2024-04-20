"use client";

import dynamic from "next/dynamic";
import useSWRInfinite from "swr/infinite";
import RootPageLoader from "../../loading";
import ListLayout from "@/components/Layouts/ListLayout";
import TWInput from "@/components/UI/Input";
import MainRightLayout from "@/components/Layouts/MainRightLayout";
import songsRequest from "@/services/request/songs.request";
import useDebounce from "@/hooks/useDebouce";
import { ISongsDto } from "@/services/types/songs.types";
import { useContext, useMemo, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { apiUrls } from "@/constants";
import { UI_CONFIG } from "@/services/db/constants/db.constants";
import { TWButton } from "@/components/UI/Button";
import TWModal from "@/components/UI/Modal";
import { SnackContext } from "@/context/snack.context";

const SongsLists = dynamic(() => import("@/components/Songs/SongsLists"), {
  ssr: false,
});

const EditViewSongSection = dynamic(
  () => import("@/components/Songs/EditViewSong"),
  { ssr: false },
);

export default function SongsPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedSong, setSelectedSong] = useState<ISongsDto | null>(null);
  const [deleteId, setDeleteId] = useState("");
  const [processDelete, setProcessDelete] = useState(false);
  const { showSnack } = useContext(SnackContext);
  const debounceSearch = useDebounce(searchText, 1000);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData?.length) return null;

    let requestUrl = apiUrls?.songs?.toString() + "?";
    const params = new URLSearchParams();

    if (debounceSearch?.trim()?.length > 0) {
      params.set("search", debounceSearch);
    }
    params.set("page", pageIndex.toString());
    params.set("batch", UI_CONFIG.BATCH_SIZE.toString());
    // query string for api call
    requestUrl = requestUrl.concat(params.toString());
    return requestUrl;
  };

  const {
    isLoading,
    data,
    setSize,
    size,
    isValidating,
    mutate: refetchSongs,
  } = useSWRInfinite<ISongsDto[]>(getKey, songsRequest.fetchSongs, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    fallback: [],
  });

  const handleSearchTextChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearchText(value);
  };

  const handleDeleteSong = async (id: string) => {
    // TODO: Call api to delete song
    try {
      setProcessDelete(true);
      const data = await songsRequest.deleteSong(id);
      if (data?.success) {
        showSnack("Song deleted.", "success");
        setDeleteId("");
        refetchSongs();
      }
      setProcessDelete(false);
    } catch (err) {
      console.log("Error calling handleDeleteSong::", err);
      setProcessDelete(false);
    }
  };

  const { songs, hasMore } = useMemo(() => {
    let songs = [] as ISongsDto[];
    let hasMore = false;
    if (data && data?.length > 0) {
      data.forEach((songsArr) => {
        hasMore = songsArr.length === UI_CONFIG.BATCH_SIZE;
        songs.push(...songsArr);
      });
      return { songs, hasMore };
    } else {
      return { songs: [], hasMore: false };
    }
  }, [data]);

  return (
    <MainRightLayout>
      <MainRightLayout.Left>
        <div className="gap-3 rounded-md text-center">
          <TWInput
            placeholder="Search songs"
            name="search"
            onChange={handleSearchTextChange}
            value={searchText}
            id="art-input"
            icon={
              <SearchOutlined className="[&>svg]:fill-slate-400 hover:[&>svg]:fill-violet-400" />
            }
          />
        </div>
        <ListLayout>
          <div
            aria-hidden={!isLoading}
            className="aria-hide flex h-full items-center justify-center"
          >
            <RootPageLoader />
          </div>
          <div aria-hidden={isLoading} className="anim-scale-out-top">
            <SongsLists
              onSelectSong={setSelectedSong}
              songs={songs || []}
              onDeleteSong={setDeleteId}
              selectedSong={selectedSong}
              loadMore={
                hasMore && (
                  <div className="flex justify-center py-2">
                    <TWButton
                      loading={isValidating}
                      onClick={() => setSize(size + 1)}
                    >
                      Load more
                    </TWButton>
                  </div>
                )
              }
            />
          </div>
          <TWModal isOpen={!!deleteId} onClose={() => setDeleteId("")}>
            <div className="">Are you sure, you want to delete this song?</div>
            <div className="mt-4 flex justify-end gap-2">
              <TWButton
                onClick={() => setDeleteId("")}
                variant="outline"
                className="py-1"
              >
                Cancel
              </TWButton>
              <TWButton
                loading={processDelete}
                onClick={() => handleDeleteSong(deleteId)}
                variant="error-outline"
                className="py-1"
              >
                Delete
              </TWButton>
            </div>
          </TWModal>
        </ListLayout>
      </MainRightLayout.Left>
      <MainRightLayout.Separator />
      <MainRightLayout.Right>
        <EditViewSongSection song={selectedSong} onSongAdded={refetchSongs} />
      </MainRightLayout.Right>
    </MainRightLayout>
  );
}
