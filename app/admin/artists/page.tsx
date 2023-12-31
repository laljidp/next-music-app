"use client";
import ArtistsList from "@/components/Artists/ArtistsList";
import EditViewArtist from "@/components/Artists/EditViewArtist";
import ListLayout from "@/components/Layouts/List.layout";
import MainRightLayout from "@/components/Layouts/MainRightLayout";
import TWInput from "@/components/UI/Input";
import PageSpinner from "@/components/UI/Spinner/PageSpinner";
import artistRequest from "@/services/request/artists.request";
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
    { path: `/api/artists`, search: debouncedSearch },
    artistRequest.fetchArtists,
    {
      fallback: [],
      revalidateOnFocus: false,
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
        <ListLayout>
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
        </ListLayout>
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
