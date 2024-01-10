"use client";
import PageSpinner from "@/components/UI/Spinner/PageSpinner";
import { getDefaultHeaders } from "@/services/request";
import useSWR, { Fetcher } from "swr";

const fetchStats: Fetcher<Record<string, number>, string> = async (
  path: string
) => {
  const resp = await fetch("/api/stats", {
    method: "GET",
    headers: getDefaultHeaders(),
  });
  const json = await resp.json();
  return json?.total || null;
};

export default function AdminStats() {
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

  console.log({ isLoading });

  if (isLoading) return <PageSpinner />;

  return (
    <div className="flex justify-center">
      <div className="flex gap-5 grow items-center">
        <div className="p-3 text-white ring-1 grow bg-violet-400 rounded-lg">
          <section className="text-4xl">{total?.albums || 0}</section>
          <span className="text-sm">Albums</span>
        </div>
        <div className="p-3 text-white ring-1 bg-violet-400 rounded-lg grow">
          <section className="text-4xl">{total?.songs || 0}</section>
          <span className="text-sm">Songs</span>
        </div>
        <div className="p-3 text-white ring-1 bg-violet-400 rounded-lg grow">
          <section className="text-4xl">{total?.artists || 0}</section>
          <span className="text-sm">Artists</span>
        </div>
        <div className="p-3 text-white ring-1 bg-violet-400 rounded-lg grow">
          <section className="text-4xl">{total?.users || 0}</section>
          <span className="text-sm">Users</span>
        </div>
        <div className="p-3 text-white ring-1 bg-violet-400 rounded-lg grow">
          <section className="text-4xl">{total?.playlists || 0}</section>
          <span className="text-sm">Playlists</span>
        </div>
      </div>
    </div>
  );
}
