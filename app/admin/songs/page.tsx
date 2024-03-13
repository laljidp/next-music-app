"use client";

import useSWR from "swr";
import RootPageLoader from "../../loading";
import ListLayout from "@/components/Layouts/List.layout";
import TWInput from "@/components/UI/Input";
import MainRightLayout from "@/components/Layouts/MainRightLayout";

import songsRequest from "@/services/request/songs.request";
import useDebounce from "@/utils/useDebouce";
import { ISongsDto } from "@/services/types/songs.types";
import { useMemo, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import useSWRInfinite from "swr/infinite";
import { apiUrls } from "@/constants";
import { DB_CONFIG } from "@/services/db/constants/db.constants";
import { TWButton } from "@/components/UI/Button";

const SongsLists = dynamic(() => import("@/components/Songs/SongsLists"), {
  ssr: false,
});

const EditViewSongSection = dynamic(
  () => import("@/components/Songs/EditViewSong"),
  { ssr: false }
);

export default function SongsPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedSong, setSelectedSong] = useState<ISongsDto | null>(null);
  const debounceSearch = useDebounce(searchText, 1000);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData?.length) return null;

    let requestUrl = apiUrls?.songs?.toString() + "?";
    const params = new URLSearchParams();

    if (debounceSearch?.trim()?.length > 0) {
      params.set("search", debounceSearch);
    }
    params.set("page", pageIndex.toString());
    params.set("batch", DB_CONFIG.BATCH_SIZE.toString());
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

  const { songs, hasMore } = useMemo(() => {
    let songs = [] as ISongsDto[];
    let hasMore = false;
    if (data && data?.length > 0) {
      data.forEach((songsArr) => {
        hasMore = songsArr.length === DB_CONFIG.BATCH_SIZE;
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
        <div className="rounded-md text-center gap-3">
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
            className="aria-hide flex items-center justify-center h-full"
          >
            <RootPageLoader />
          </div>
          <div aria-hidden={isLoading} className="anim-scale-out-top">
            <SongsLists
              onSelectSong={setSelectedSong}
              songs={songs || []}
              selectedSong={selectedSong}
              loadMore={
                hasMore && (
                  <div className="py-2 flex justify-center">
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
        </ListLayout>
      </MainRightLayout.Left>
      <MainRightLayout.Separator />
      <MainRightLayout.Right>
        <EditViewSongSection song={selectedSong} onSongAdded={refetchSongs} />
      </MainRightLayout.Right>
    </MainRightLayout>
  );
}
