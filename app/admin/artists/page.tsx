"use client";
import ArtistsList from "@/components/Artists/ArtistsList";
import EditViewArtist from "@/components/Artists/EditViewArtist";
import NoSelectionLayout from "@/components/Layouts/no-selection.layout";
import { TWButton } from "@/components/UI/Button";
import TWInput from "@/components/UI/Input";
import PageSpinner from "@/components/UI/Spinner/PageSpinner";
import { fetchArtists } from "@/services/fetcher/artists.fetcher";
import { ArtistsDto } from "@/services/types/artists.types";
import { RightCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import useSWR from "swr";

const ArtistsAdminPage = () => {
  const {
    isLoading,
    data,
    mutate: refetchArtists,
  } = useSWR("/admin/artists", fetchArtists, {
    fallback: [],
  });
  const [artist, setArtist] = useState<ArtistsDto | null>(null);

  const handleSelectArtist = (artist: ArtistsDto) => {
    setArtist(artist);
  };

  return (
    <div className="flex items-start justify-between gap-5">
      <div className="w-[40%] flex-col gap-2">
        <div className="rounded-md text-center gap-3">
          <TWInput
            placeholder="Search artists"
            name="search"
            className="min-w-[380px]"
            id="art-input"
            icon={
              <SearchOutlined className="[&>svg]:fill-slate-400 hover:[&>svg]:fill-violet-400" />
            }
          />
        </div>
        <div className="w-full max-h-[550px]">
          {isLoading ? (
            <PageSpinner />
          ) : (
            <ArtistsList
              onSelectArtist={handleSelectArtist}
              artists={data || []}
            />
          )}
        </div>
      </div>
      <div className="w-0.5 min-h-[550px] bg-violet-300 relative flex-grow rounded-full">
        <span className="absolute top-[50%] -left-2 bg-white flex items-center">
          <RightCircleOutlined className="[&>svg]:fill-violet-400 z-20" />
        </span>
      </div>
      <div className="w-[60%] min-h-[450px] flex items-center justify-center px-8">
        {!artist?.name ? (
          <NoSelectionLayout text="Choose an artist or click the 'Add' button to save a new artist." />
        ) : (
          <EditViewArtist artist={artist} />
        )}
      </div>
    </div>
  );
};

export default ArtistsAdminPage;
