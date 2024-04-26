"use client";
import TWInput from "@/components/UI/Input";
import Spinner from "@/components/UI/Spinner";
import { apiUrls } from "@/constants";
import useDebounce from "@/hooks/useDebouce";
import mediaRequests from "@/services/request/media.request";
import { MediaDto } from "@/services/types/media.types";
import { SearchOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import useSWRInfinite from "swr/infinite";

const MediaLists = dynamic(() => import("@/components/Media/MediaLists"), {
  ssr: false,
});

const BATCH_SIZE = 30;

export default function MediaPage() {
  const [search, setSearch] = useState("");

  const debounceSearch = useDebounce(search, 1000);

  const getKey = (pageIndex: number, previousPageData: MediaDto[]) => {
    const params = new URLSearchParams();
    params.set("batch", BATCH_SIZE.toString());
    params.set("page", pageIndex.toString());
    if (debounceSearch) {
      params.set("search", debounceSearch);
    }

    const apiUrl = apiUrls.media + "?" + params.toString();

    return apiUrl;
  };

  const { isLoading, data, setSize, isValidating } = useSWRInfinite(
    getKey,
    mediaRequests.fetchMedia,
    {
      fallbackData: [],
    },
  );

  const { media, hasMore } = useMemo(() => {
    if (data?.length === 0) return { media: [], hasMore: false };
    let media = [] as MediaDto[];
    let hasMore = false;
    data?.forEach((m) => {
      media.push(...m);
      hasMore = m.length === BATCH_SIZE;
    });
    return { media, hasMore };
  }, [data]);

  return (
    <div>
      <TWInput
        placeholder="Search media"
        name="search"
        value={search}
        onChange={({ currentTarget }) => setSearch(currentTarget.value)}
        icon={<SearchOutlined className="text-slate-400" />}
      />
      <div className="mt-4">
        {isLoading && (
          <div className="mt-5">
            <Spinner color="violet" />
          </div>
        )}
        <MediaLists data={media} />
      </div>
      {hasMore && (
        <div
          role="button"
          onClick={() => setSize((size) => size + 1)}
          aria-disabled={isValidating}
          className="mx-auto mt-4 w-[50%] rounded-lg p-2 text-center ring-1 ring-violet-400
           hover:bg-violet-400 hover:text-white aria-[disabled=true]:pointer-events-none
           aria-[disabled=true]:bg-slate-200 aria-[disabled=true]:ring-slate-200"
        >
          <div className="flex items-center justify-center gap-2">
            <span>Load More..</span>
            {isValidating && <Spinner color="slate" />}
          </div>
        </div>
      )}
    </div>
  );
}
