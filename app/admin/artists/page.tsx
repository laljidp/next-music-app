"use client";
import ArtistsList from "@/components/Artists/ArtistsList";
import EditViewArtist from "@/components/Artists/EditViewArtist";
import MainRightLayout from "@/components/Layouts/MainRightLayout";
import TWInput from "@/components/UI/Input";
import PageSpinner from "@/components/UI/Spinner/PageSpinner";
import { fetchArtists } from "@/services/fetcher/artists.fetcher";
import { ArtistsDto } from "@/services/types/artists.types";
import useDebounce from "@/utils/useDebouce";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import useSWR from "swr";

const ArtistsAdminPage = () => {
  const [artist, setArtist] = useState<ArtistsDto | null>(null);
  const [artistSelectedID, setArtistSelectedID] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 1000);

  const {
    isLoading,
    data,
    mutate: refetchArtists,
  } = useSWR<ArtistsDto[], { search: string; path: string }>(
    { path: `/admin/artists`, search: debouncedSearch },
    fetchArtists,
    {
      fallback: [],
    }
  );

  const handleSearchTextChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearchText(value);
  };

  const handleSelectArtist = (artist: ArtistsDto) => {
    setArtist(artist);
    setArtistSelectedID(artist._id);
  };

  return (
    <MainRightLayout>
      <MainRightLayout.Left>
        <div className="rounded-md text-center gap-3">
          <TWInput
            placeholder="Search artists"
            name="search"
            onChange={handleSearchTextChange}
            value={searchText}
            id="art-input"
            icon={
              <SearchOutlined className="[&>svg]:fill-slate-400 hover:[&>svg]:fill-violet-400" />
            }
          />
        </div>
        <div
          className="overflow-auto scrollbar-hide
           shadow-lg rounded-xl animation-scale-up-tl h-[calc(100vh-200px)]"
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <PageSpinner />
            </div>
          ) : (
            <ArtistsList
              artistSelectedID={artistSelectedID}
              onSelectArtist={handleSelectArtist}
              artists={data || []}
            />
          )}
        </div>
      </MainRightLayout.Left>
      <MainRightLayout.Separator />
      <MainRightLayout.Right>
        <EditViewArtist
          handleSelectArtist={handleSelectArtist}
          onAddNewSelection={() => {
            setArtistSelectedID(null);
          }}
          onArtistAdded={refetchArtists}
          artist={artist}
        />
      </MainRightLayout.Right>
    </MainRightLayout>
  );
};

export default ArtistsAdminPage;
