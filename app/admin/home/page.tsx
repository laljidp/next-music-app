"use client";
import UploadBulkMedia from "@/components/Media/MediaUpload/BulkMediaUpload";
import UploadBulkSongs from "@/components/Songs/UploadBulkSongs";
import PageSpinner from "@/components/UI/Spinner/PageSpinner";
import { PAGES } from "@/constants";
import { UserContext } from "@/context/user.context";
import { getDefaultHeaders } from "@/services/request";
import { CloudServerOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import useSWR, { Fetcher } from "swr";

const fetchStats: Fetcher<Record<string, number>, string> = async (
  path: string,
) => {
  const resp = await fetch("/api/stats", {
    method: "GET",
    headers: getDefaultHeaders(),
  });
  const json = await resp.json();
  return json?.counts || null;
};

export default function AdminStats() {
  const { user } = useContext(UserContext);

  const { isLoading, data: total } = useSWR("/api/stats", fetchStats, {
    revalidateOnFocus: false,
    fallback: {
      albums: 0,
      artists: 0,
      songs: 0,
      users: 0,
      playlist: 0,
    },
  });

  const navigate = useRouter();

  if (isLoading) return <PageSpinner />;

  return (
    <div className="flex flex-col justify-center gap-5">
      <div className="mt-5 flex grow items-center gap-5">
        {STAT_CARDS.map((card) => (
          <div
            key={card.keyIndex}
            role="button"
            aria-disabled={!card?.path}
            onClick={() => (card?.path ? navigate.push(card.path) : {})}
            className="grow cursor-pointer rounded-lg bg-violet-400 p-3
            text-white ring-1 transition-all hover:scale-105  hover:bg-violet-500
            aria-[disabled=true]:select-none aria-[disabled=true]:opacity-70"
          >
            <section className="text-4xl">
              {total?.[card.keyIndex] || 0}
            </section>
            <span className="text-sm font-medium">{card.name}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-1 gap-4">
        <div className="mt-2 w-full">
          <div className="mb-2 flex items-center gap-2">
            <CloudServerOutlined className="text-lg text-violet-400" />
            <span className="text-violet-500">Bulk upload songs</span>
          </div>
          <UploadBulkSongs />
        </div>
        <div className="mt-2 w-full">
          <div className="mb-2 flex items-center gap-2">
            <CloudServerOutlined className="text-lg text-violet-400" />
            <span className="text-violet-500">Upload bulk media Images</span>
          </div>
          <UploadBulkMedia />
        </div>
      </div>
    </div>
  );
}

const STAT_CARDS = [
  {
    name: "Users",
    keyIndex: "users",
    path: PAGES.adminUsers,
  },
  {
    name: "Songs",
    keyIndex: "songs",
    path: PAGES.adminSongs,
  },
  {
    name: "Albums",
    keyIndex: "albums",
    path: PAGES.adminAlbums,
  },
  {
    name: "Artists",
    keyIndex: "artists",
    path: PAGES.adminArtists,
  },
  {
    name: "Playlists",
    keyIndex: "playlists",
    path: PAGES.adminPlaylists,
  },
];
