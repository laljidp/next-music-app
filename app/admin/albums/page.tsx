"use client";
import dynamic from "next/dynamic";
import React, { useMemo, useState } from "react";
import MainRightLayout from "@/components/Layouts/MainRightLayout";
import TWInput from "@/components/UI/Input";
import useDebounce from "@/hooks/useDebouce";
import ListLayout from "@/components/Layouts/List.layout";
import PageSpinner from "@/components/UI/Spinner/PageSpinner";
import { SearchOutlined } from "@ant-design/icons";
import { albumRequest } from "@/services/request/albums.request";
import { apiUrls } from "@/constants";
import { IAlbumDto } from "@/services/types/albums.types";
import { TWButton } from "@/components/UI/Button";
import useSWRInfinite from "swr/infinite";
import { UI_CONFIG } from "@/services/db/constants/db.constants";

const AlbumLists = dynamic(() => import("@/components/Albums/AlbumLists"), {
  ssr: false,
});
const EditViewAlbumLayout = dynamic(
  () => import("@/components/Albums/EditViewAlbumLayout"),
  { ssr: false }
);

export default function AlbumPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState<IAlbumDto | null>(null);

  const debouncedSearch = useDebounce(searchText, 1000);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData?.data?.length) return null;

    let requestUrl = apiUrls?.albums?.toString() + "?";
    const params = new URLSearchParams();

    if (debouncedSearch?.trim()?.length > 0) {
      params.set("search", debouncedSearch);
    }
    params.set("page", pageIndex.toString());
    params.set("batch", UI_CONFIG.BATCH_SIZE.toString());
    // query string for api call
    requestUrl = requestUrl.concat(params.toString());
    return requestUrl;
  };

  const {
    size,
    setSize,
    isLoading,
    isValidating,
    data: albums,
    mutate: refreshAlbums,
  } = useSWRInfinite(getKey, albumRequest.fetchAlbums, {
    revalidateOnFocus: false,
    fallbackData: [
      {
        data: [],
        hasMore: false,
      },
    ],
  });

  const handleAddNewSelection = () => {
    setSelectedAlbum(null);
  };

  const handleSearchTextChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearchText(value);
  };

  const { filteredAlbums, hasMore } = useMemo(() => {
    let hasMore = true;
    const __data = [] as IAlbumDto[];
    if (albums && albums?.length > 0) {
      albums.filter((alb) => {
        __data.push(...(alb.data || []));
        hasMore = alb.hasMore;
      });
      return { filteredAlbums: __data, hasMore };
    }
    return { filteredAlbums: [], hasMore: false };
  }, [albums]);

  return (
    <MainRightLayout>
      <MainRightLayout.Left>
        <div className="rounded-md text-center gap-3">
          <TWInput
            placeholder="Search albums"
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
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <PageSpinner />
            </div>
          ) : (
            <AlbumLists
              albumSelectedID={selectedAlbum?._id}
              onSelectAlbum={setSelectedAlbum}
              albums={filteredAlbums || []}
              loadMore={
                hasMore && (
                  <div className="flex justify-center py-2">
                    <TWButton
                      loading={isValidating}
                      onClick={() => setSize(size + 1)}
                      className="text-center"
                    >
                      Load more
                    </TWButton>
                  </div>
                )
              }
            />
          )}
        </ListLayout>
      </MainRightLayout.Left>
      <MainRightLayout.Separator />
      <MainRightLayout.Right>
        <EditViewAlbumLayout
          onAlbumSaved={refreshAlbums}
          album={selectedAlbum}
          onAddNewSelection={handleAddNewSelection}
        />
      </MainRightLayout.Right>
    </MainRightLayout>
  );
}
