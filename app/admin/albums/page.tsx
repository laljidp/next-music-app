"use client";
import useSWR from "swr";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import MainRightLayout from "@/components/Layouts/MainRightLayout";
import TWInput from "@/components/UI/Input";
import useDebounce from "@/utils/useDebouce";
import ListLayout from "@/components/Layouts/List.layout";
import PageSpinner from "@/components/UI/Spinner/PageSpinner";
import { SearchOutlined } from "@ant-design/icons";
import { albumRequest } from "@/services/request/albums.request";
import { apiUrls } from "@/constants";
import { IAlbumDto } from "@/services/types/albums.types";

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

  const {
    isLoading,
    data: albums,
    mutate: refreshAlbums,
  } = useSWR(
    {
      path: apiUrls.albums,
      search: debouncedSearch,
    },
    albumRequest.fetchAlbums,
    {
      revalidateOnFocus: false,
    }
  );

  const handleAddNewSelection = () => {
    setSelectedAlbum(null);
  };

  const handleSearchTextChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearchText(value);
  };

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
              albums={albums || []}
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
