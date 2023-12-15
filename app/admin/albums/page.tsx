"use client";
import React from "react";
import { useSession } from "next-auth/react";

export default function AlbumPage() {
  const { data, status } = useSession();
  return (
    <div className="text-black">
      <div>Album page layout</div>
    </div>
  );
}
