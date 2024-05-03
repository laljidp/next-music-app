"use client";

import { MediaDto } from "@/services/types/media.types";
import Image from "next/image";
import { useState } from "react";

interface MediaListsProps {
  data: MediaDto[];
  allowSelect?: boolean;
  onSelectMedia?: (url: string) => void;
}

export default function MediaLists({
  data,
  allowSelect = false,
  onSelectMedia = () => {},
}: MediaListsProps) {
  const [selectedMediaID, setSelectedMediaID] = useState("");

  const handleSelectMedia = (id: string, url: string) => {
    setSelectedMediaID(id);
    onSelectMedia(url);
  };

  return (
    <div className="py-2">
      <div
        className="grid grid-flow-row gap-4 md:grid-cols-4 xl:grid-cols-5"
        role="button"
      >
        {data.map((media) => (
          <div
            className="flex flex-col items-center gap-2 rounded-md p-2 ring-1
             ring-violet-300 aria-[selected=true]:bg-violet-200"
            aria-selected={selectedMediaID === media._id}
            onClick={() => handleSelectMedia(media._id, media.source)}
          >
            <Image
              src={media.source}
              alt="img"
              className="h-[100px] w-[100px] object-contain"
              height={50}
              width={50}
              loading="lazy"
            />
            <div className="text-xs">{media.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
