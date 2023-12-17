"use client";
import ArtistsList from "@/components/Artists/ArtistsList";
import EditViewArtist from "@/components/Artists/EditViewArtist";
import TWInput from "@/components/UI/Input";
import Spinner from "@/components/UI/Spinner";
import PageSpinner from "@/components/UI/Spinner/PageSpinner";
import { fetchArtists } from "@/services/fetcher/artists.fetcher";
import { pageLoaderSvg } from "@/utils/svgs.utils";
import { SearchOutlined } from "@ant-design/icons";
import useSWR from "swr";

const ArtistsAdminPage = () => {
  const { isLoading, data } = useSWR("/admin/artists", fetchArtists, {
    fallback: [],
  });

  console.log({ isLoading });
  console.log({ data });

  return (
    <div>
      <div className="flex items-start justify-between gap-5">
        <div className="w-[35%] flex-col gap-2">
          <div className="flex w-full flex-col rounded-md text-center">
            <TWInput
              placeholder="Search artists"
              name="search"
              id="art-input"
              icon={
                <SearchOutlined className="[&>svg]:fill-slate-400 hover:[&>svg]:fill-violet-400" />
              }
            />
          </div>
          <div className="w-full min-h-[320px]">
            {isLoading ? <PageSpinner /> : <ArtistsList artists={data || []} />}
          </div>
        </div>
        <div className="w-[40%]">
          <EditViewArtist />
        </div>
      </div>
    </div>
  );
};

export default ArtistsAdminPage;
