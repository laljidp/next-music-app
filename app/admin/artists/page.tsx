"use client";
import ArtistsList from "@/components/Artists/ArtistsList";
import EditViewArtist from "@/components/Artists/EditViewArtist";
import NoSelectionLayout from "@/components/Layouts/noSelection.layout";
import TWInput from "@/components/UI/Input";
import PageSpinner from "@/components/UI/Spinner/PageSpinner";
import { fetchArtists } from "@/services/fetcher/artists.fetcher";
import { ArtistsDto } from "@/services/types/artists.types";
import useDebounce from "@/utils/useDebouce";
import { RightCircleOutlined, SearchOutlined } from "@ant-design/icons";
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
    <div className="flex items-start justify-between gap-5">
      <div className="w-[40%] flex flex-col gap-2 h-full">
        <div className="rounded-md text-center gap-3">
          <TWInput
            placeholder="Search artists"
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
            <ArtistsList
              artistSelectedID={artistSelectedID}
              onSelectArtist={handleSelectArtist}
              artists={data || []}
              className="pb-8"
            />
          )}
        </div>
      </div>
      <div className="w-0.5 bg-violet-300 relative rounded-full h-[calc(100vh-150px)]">
        <span className="absolute top-[50%] -left-2 bg-white flex items-center">
          <RightCircleOutlined className="[&>svg]:fill-violet-400 z-20" />
        </span>
      </div>
      <div className="w-[60%] flex items-center justify-center px-8">
        <EditViewArtist
          handleSelectArtist={handleSelectArtist}
          onAddNewSelection={() => {
            setArtistSelectedID(null);
          }}
          onArtistAdded={refetchArtists}
          artist={artist}
        />
      </div>
    </div>
  );
};

export default ArtistsAdminPage;
