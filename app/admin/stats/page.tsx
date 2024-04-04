"use client";
import PageSpinner from "@/components/UI/Spinner/PageSpinner";
import { PAGES } from "@/constants";
import { UserContext } from "@/context/user.context";
import { getDefaultHeaders } from "@/services/request";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import useSWR, { Fetcher } from "swr";

const fetchStats: Fetcher<Record<string, number>, string> = async (
  path: string
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

  console.log({ user });

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

  console.log({ isLoading });

  if (isLoading) return <PageSpinner />;

  return (
    <div className="flex justify-center">
      <div className="flex gap-5 grow items-center">
        {STAT_CARDS.map((card) => (
          <div
            key={card.keyIndex}
            role="button"
            aria-disabled={!card?.path}
            onClick={() => (card?.path ? navigate.push(card.path) : {})}
            className="p-3 text-white ring-1 grow bg-violet-400
            aria-[disabled=true]:opacity-70 aria-[disabled=true]:select-none
             rounded-lg cursor-pointer hover:scale-105"
          >
            <section className="text-4xl">
              {total?.[card.keyIndex] || 0}
            </section>
            <span className="text-sm font-medium">{card.name}</span>
          </div>
        ))}
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
