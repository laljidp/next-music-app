"use client";
import React from "react";
import { useSession } from "next-auth/react";

export default function AlbumPage() {
  const { data, status } = useSession();
  return (
    <div className="text-black h-full bg-white rounded-lg">
      <div className="bg-transparent p-3">Album page layout</div>
    </div>
  );
}
