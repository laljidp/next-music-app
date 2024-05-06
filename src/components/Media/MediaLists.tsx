"use client";
import DeleteMediaModal from "./DeleteMediaModal";
import TWModal from "../UI/Modal";
import TWInput from "../UI/Input";
import mediaRequests from "@/services/request/media.request";
import Image from "next/image";
import { MediaDto } from "@/services/types/media.types";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { useContext, useState } from "react";
import { TWButton } from "../UI/Button";
import { SnackContext } from "@/context/snack.context";

interface MediaListsProps {
  data: MediaDto[];
  allowSelect?: boolean;
  allowActions?: boolean;
  onSelectMedia?: (url: string) => void;
  onMediaModified?: () => void;
}

export default function MediaLists({
  data,
  allowSelect = false,
  allowActions = false,
  onSelectMedia = () => {},
  onMediaModified = () => {},
}: MediaListsProps) {
  const [selectedMediaID, setSelectedMediaID] = useState("");
  const [loading, setLoading] = useState(false);

  const [deleteMediaId, setDeleteMediaId] = useState<string | null>(null);
  const [editMedia, setEditMedia] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const { showSnack } = useContext(SnackContext);

  const handleSelectMedia = (id: string, url: string) => {
    setSelectedMediaID(id);
    onSelectMedia(url);
  };

  const handleRename = async () => {
    try {
      setLoading(true);
      if (!editMedia?.id || !editMedia?.name) return;
      // TODO: call API to rename the media name
      const data = await mediaRequests.renameMedia(
        editMedia?.id,
        editMedia?.name,
      );
      showSnack(`${data?.name} has been updated.`, "success");
      onMediaModified(); // To update
    } catch (err) {
      console.log("ERROR handleRename::", err);
      showSnack("Failed to rename the media", "error");
    } finally {
      setLoading(false);
      setEditMedia(null);
    }
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
            {allowActions && (
              <>
                <div
                  role="button"
                  onClick={() => setDeleteMediaId(media._id)}
                  className="invisible absolute right-2 top-1 hover:scale-110 group-hover/item:visible"
                >
                  <DeleteFilled className="text-red-500" />
                </div>
                <div
                  role="button"
                  onClick={() =>
                    setEditMedia({
                      id: media._id || "",
                      name: media.name,
                    })
                  }
                  className="invisible absolute bottom-2 right-2 hover:scale-110 group-hover/item:visible"
                >
                  <EditFilled className="text-violet-500" />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <DeleteMediaModal
        isOpen={!!deleteMediaId}
        onClose={() => setDeleteMediaId(null)}
        id={deleteMediaId}
        onMediaDeleted={onMediaModified}
      />
      <TWModal
        isOpen={!!editMedia}
        onClose={() => setEditMedia(null)}
        className="w-[450px]"
      >
        <div className="flex flex-col gap-4">
          <div className="text-lg font-medium text-violet-500">
            Edit media name
          </div>
          <TWInput
            placeholder="Enter photo name"
            value={editMedia?.name || ""}
            name={"name"}
            onChange={({ currentTarget }) =>
              setEditMedia({
                id: editMedia?.id || "",
                name: currentTarget.value,
              })
            }
          />
          <div className="flex justify-end gap-2">
            <TWButton
              onClick={() => setEditMedia(null)}
              variant="secondary"
              small
            >
              Close
            </TWButton>
            <TWButton
              loading={loading}
              onClick={handleRename}
              variant="outline"
              small
            >
              Submit
            </TWButton>
          </div>
        </div>
      </TWModal>
    </div>
  );
}
