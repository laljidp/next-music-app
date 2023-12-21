"use client";
import React, { useState } from "react";
import MainRightLayout from "@/components/Layouts/MainRightLayout";
import TWInput from "@/components/UI/Input";
import useDebounce from "@/utils/useDebouce";
import PageSpinner from "@/components/UI/Spinner/PageSpinner";
import AlbumLists from "@/components/Albums/AlbumLists";
import { SearchOutlined } from "@ant-design/icons";
import EditViewAlbumLayout from "@/components/Albums/EditViewAlbumLayout";
import useSWR from "swr";
import { albumRequest } from "@/services/request/albums.request";
import { apiUrls } from "@/constants";
import { IAlbumDto } from "@/services/types/albums.types";

export default function AlbumPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState<IAlbumDto | null>(null);

  const debouncedSearch = useDebounce(searchText, 1000);

  const { isLoading, data: albums } = useSWR(
    {
      path: apiUrls.albums,
      search: debouncedSearch,
    },
    albumRequest.fetchAlbums,
    {
      revalidateOnFocus: false,
    }
  );

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
            className=""
            onChange={handleSearchTextChange}
            value={searchText}
            id="art-input"
            icon={
              <SearchOutlined className="[&>svg]:fill-slate-400 hover:[&>svg]:fill-violet-400" />
            }
          />
        </div>
        <div
          className="overflow-auto scrollbar-hide h-[calc(100vh-200px)]
            shadow-lg rounded-xl animation-scale-up-tl"
        >
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
        </div>
      </MainRightLayout.Left>
      <MainRightLayout.Separator />
      <MainRightLayout.Right>
        <EditViewAlbumLayout album={selectedAlbum} />
      </MainRightLayout.Right>
    </MainRightLayout>
  );
}
