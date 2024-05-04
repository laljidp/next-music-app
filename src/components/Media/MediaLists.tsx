"use client";

import { MediaDto } from "@/services/types/media.types";
import { DeleteFilled, DeleteOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useState } from "react";
import DeleteMediaModal from "./DeleteMediaModal";

interface MediaListsProps {
  data: MediaDto[];
  allowSelect?: boolean;
  allowDelete?: boolean;
  onSelectMedia?: (url: string) => void;
  onMediaDeleted?: () => void;
}

export default function MediaLists({
  data,
  allowSelect = false,
  allowDelete = false,
  onSelectMedia = () => {},
  onMediaDeleted = () => {},
}: MediaListsProps) {
  const [selectedMediaID, setSelectedMediaID] = useState("");
  const [deleteMediaId, setDeleteMediaId] = useState<string | null>(null);

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
            key={media._id}
            className="group/item relative flex flex-col items-center gap-2 rounded-md
             p-2 ring-1 ring-violet-300 aria-[selected=true]:bg-violet-200"
            aria-selected={selectedMediaID === media._id}
            onClick={() => {
              allowSelect
                ? handleSelectMedia(media._id, media.source)
                : () => {};
            }}
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
            {allowDelete && (
              <div
                role="button"
                onClick={() => setDeleteMediaId(media._id)}
                className="invisible absolute right-3 top-3 hover:scale-110 group-hover/item:visible"
              >
                <DeleteFilled className="text-red-500" />
              </div>
            )}
          </div>
        ))}
      </div>
      <DeleteMediaModal
        isOpen={!!deleteMediaId}
        onClose={() => setDeleteMediaId(null)}
        id={deleteMediaId}
        onMediaDeleted={onMediaDeleted}
      />
    </div>
  );
}
