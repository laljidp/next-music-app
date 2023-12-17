"use client";
import React from "react";
import { useSession } from "next-auth/react";

export default function AlbumPage() {
  const { data, status } = useSession();
  return (
    <div className="rounded-lg bg-white text-black">
      <div className="p-3">Album page layout</div>
    </div>
  );
}
