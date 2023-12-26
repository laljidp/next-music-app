"use client";
import MainRightLayout from "@/components/Layouts/MainRightLayout";
import EditViewSongSection from "@/components/Songs/EditViewSong";
import SongsLists from "@/components/Songs/SongsLists";
import songsRequest from "@/services/request/songs.request";
import { ISongsDto } from "@/services/types/songs.types";
import PageLoader from "next/dist/client/page-loader";
import useSWR from "swr";
import RootPageLoader from "../../loading";
import ListLayout from "@/components/Layouts/List.layout";
import TWInput from "@/components/UI/Input";
import { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import useDebounce from "@/utils/useDebouce";

export default function SongsPage() {
  const [searchText, setSearchText] = useState("");

  const debounceSearch = useDebounce(searchText, 1000);

  const {
    isLoading,
    data,
    mutate: refetchSongs,
  } = useSWR<ISongsDto[], { search: string; path: string }>(
    { path: "/api/songs", search: debounceSearch },
    songsRequest.fetchSongs,
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
            <SongsLists songs={data || []} />
          </div>
        </ListLayout>
      </MainRightLayout.Left>
      <MainRightLayout.Separator />
      <MainRightLayout.Right>
        <EditViewSongSection onSongAdded={refetchSongs} />
      </MainRightLayout.Right>
    </MainRightLayout>
  );
}
