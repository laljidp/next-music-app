"use client";
import TWInput from "@/components/UI/Input";
import Spinner from "@/components/UI/Spinner";
import { BC_MEDIA_CHANNEL, apiUrls } from "@/constants";
import useDebounce from "@/hooks/useDebouce";
import mediaRequests from "@/services/request/media.request";
import { MediaDto } from "@/services/types/media.types";
import { cn } from "@/utils/helper.util";
import { SearchOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import useSWRInfinite from "swr/infinite";

let bc: BroadcastChannel;

const MediaLists = dynamic(() => import("@/components/Media/MediaLists"), {
  ssr: false,
});
const BATCH_SIZE = 30;

interface MediaPlaceholderProps {
  allowSelect?: boolean;
  onSelectMedia?: (url: string) => void;
}

export default function MediaPlaceholder({
  allowSelect = false,
  onSelectMedia,
}: MediaPlaceholderProps) {
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

  const { isLoading, data, setSize, isValidating, mutate } = useSWRInfinite(
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

  useEffect(() => {
    bc = new BroadcastChannel(BC_MEDIA_CHANNEL);
    bc.onmessage = (event) => {
      console.log("Event", event);
      mutate();
    };

    return () => {
      bc?.close();
    };
  });

  return (
    <div>
      <TWInput
        placeholder="Search media"
        name="search"
        value={search}
        onChange={({ currentTarget }) => setSearch(currentTarget.value)}
        icon={<SearchOutlined className="text-slate-400" />}
      />
      <div
        className={cn(
          `scrollbar-md mt-4 overflow-auto px-3`,
          allowSelect ? "h-[calc(100vh-400px)]" : "h-[calc(100vh-220px)]",
        )}
      >
        {isLoading && (
          <div className="mt-5">
            <Spinner color="violet" />
          </div>
        )}
        <MediaLists
          allowSelect={allowSelect}
          onSelectMedia={onSelectMedia}
          data={media}
        />
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
