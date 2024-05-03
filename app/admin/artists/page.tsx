"use client";

import useSWRInfinite from "swr/infinite";
import ListLayout from "@/components/Layouts/ListLayout";
import MainRightLayout from "@/components/Layouts/MainRightLayout";
import TWInput from "@/components/UI/Input";
import PageSpinner from "@/components/UI/Spinner/PageSpinner";
import { apiUrls } from "@/constants";
import { UI_CONFIG } from "@/services/db/constants/db.constants";
import artistRequest from "@/services/request/artists.request";
import { ArtistsDto } from "@/services/types/artists.types";
import useDebounce from "@/hooks/useDebounce";
import { SearchOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { TWButton } from "@/components/UI/Button";

const ArtistsList = dynamic(() => import("@/components/Artists/ArtistsList"), {
  ssr: false,
});
const EditViewArtist = dynamic(
  () => import("@/components/Artists/EditViewArtist"),
  {
    ssr: false,
  },
);

const ArtistsAdminPage = () => {
  const [artist, setArtist] = useState<ArtistsDto | null>(null);
  const [artistSelectedID, setArtistSelectedID] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 1000);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData?.length) return null;

    let requestUrl = apiUrls?.artists?.toString() + "?";
    const params = new URLSearchParams();

    if (debouncedSearch?.trim()?.length > 0) {
      params.set("search", debouncedSearch);
    }
    params.set("page", pageIndex.toString());
    params.set("batch", UI_CONFIG.BATCH_SIZE.toString());
    requestUrl = requestUrl.concat(params.toString());
    return requestUrl;
  };

  const {
    isLoading,
    data,
    size,
    setSize,
    isValidating,
    mutate: refetchArtists,
  } = useSWRInfinite<ArtistsDto[]>(getKey, artistRequest.fetchArtists, {
    fallback: [],
    revalidateOnFocus: false,
  });

  const { artists, hasMore } = useMemo(() => {
    if (data && data?.length > 0) {
      let artists = [] as ArtistsDto[];
      let hasMore = false;
      data.forEach((artistsArr) => {
        hasMore = artistsArr.length === UI_CONFIG.BATCH_SIZE;
        artists.push(...artistsArr);
      });

      return { artists, hasMore };
    } else {
      return { artists: [], hasMore: false };
    }
  }, [data]);

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
        <div className="gap-3 rounded-md text-center">
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
            <div className="flex h-full items-center justify-center">
              <PageSpinner />
            </div>
          ) : (
            <ArtistsList
              artistSelectedID={artistSelectedID}
              onSelectArtist={handleSelectArtist}
              artists={artists || []}
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
