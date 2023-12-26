import { ISongsDto } from "@/services/types/songs.types";
import ImagePreviewLayout from "../Layouts/ImagePreview.layout";
import Image from "next/image";
import { SolutionOutlined } from "@ant-design/icons";

interface SongsListsProps {
  songs: ISongsDto[];
}

export default function SongsLists(props: SongsListsProps) {
  const { songs } = props;
  return (
    <div className="mt-3 h-full">
      <div
        aria-hidden={!!songs.length}
        className="flex justify-center items-center h-[85%] aria-hide"
      >
        <span className="font-medium px-3 py-2 rounded-lg flex flex-col items-center text-violet-600">
          <SolutionOutlined
            className="[&>svg]:h-8 w-8 text-5xl [&>svg]:fill-violet-500"
            // style={{ fontSize: 35 }}
          />
          No Songs found
        </span>
      </div>
      {songs.map((song) => (
        <div className="card-layout" key={song._id}>
          <Image
            height={40}
            width={40}
            className="rounded-lg mr-3 h-12 w-12 object-cover"
            src={song.coverImage || "/no-image.png"}
            alt="cover-song"
          />
          <div className="flex flex-col">
            <span>{song.title}</span>
            <span className="text-xs">
              Duration: {Number(song.duration / 60).toFixed(2)}m
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
