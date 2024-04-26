"use client";

import { MediaDto } from "@/services/types/media.types";
import Image from "next/image";

interface MediaListsProps {
  data: MediaDto[];
}

export default function MediaLists({ data }: MediaListsProps) {
  return (
    <div className="py-2">
      <div className="grid grid-flow-row grid-cols-6 gap-4">
        {data.map((media) => (
          <div className="flex flex-col items-center gap-2 rounded-md p-2 ring-1 ring-violet-300">
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
