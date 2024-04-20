import Image from "next/image";
import { ISongsDto } from "@/services/types/songs.types";
import {
  DeleteFilled,
  DeleteOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { cn } from "@/utils/helper.util";
import { useState } from "react";

interface SongsListsProps {
  songs: ISongsDto[];
  selectedSong?: ISongsDto | null;
  loadMore?: React.ReactNode;
  onDeleteSong?: (songId: string) => void;
  onSelectSong?: (song: ISongsDto) => void;
  showDeleteIcon?: boolean;
}

export default function SongsLists(props: SongsListsProps) {
  const {
    songs,
    selectedSong,
    onSelectSong = () => {},
    onDeleteSong = () => {},
    loadMore,
  } = props;
  return (
    <div className="mt-3 h-full">
      <div
        aria-hidden={!!songs.length}
        className="aria-hide flex h-[50vh] items-center justify-center"
      >
        <span className="flex flex-col items-center rounded-lg px-3 py-2 font-medium text-violet-600">
          <SolutionOutlined className="w-8 text-5xl [&>svg]:h-8 [&>svg]:fill-violet-500" />
          No Songs found
        </span>
      </div>
      {songs.map((song) => (
        <SongItem
          song={song}
          key={song._id}
          onDeleteSong={onDeleteSong}
          onSelectSong={onSelectSong}
          selectedSong={selectedSong || null}
        />
      ))}
      {loadMore}
    </div>
  );
}

interface SongItemProps {
  song: ISongsDto;
  onDeleteSong: (songId: string) => void;
  onSelectSong: (song: ISongsDto) => void;
  selectedSong: ISongsDto | null;
}

export function SongItem(props: SongItemProps) {
  const { onDeleteSong, onSelectSong, selectedSong, song } = props;

  return (
    <li
      role="button"
      onClick={() => onSelectSong(song)}
      aria-selected={selectedSong?._id === song._id ? true : false}
      className={cn("card-layout group/item relative")}
    >
      <a
        href="void:"
        onClick={(e) => {
          e.stopPropagation();
          onDeleteSong(song._id || "--");
        }}
        role="button"
        className={cn(
          "invisible absolute right-5 top-3 hover:scale-125 group-hover/item:visible",
        )}
      >
        <DeleteFilled className="text-lg text-red-500" />
      </a>
      <Image
        height={40}
        width={40}
        className="mr-3 h-10 w-10 rounded-lg object-cover"
        src={song.coverImage || "/no-image.png"}
        alt="cover-song"
      />
      <div className="flex flex-col">
        <span>{song.title}</span>
        <span className="text-xs">
          Duration: {Number(song.duration / 60).toFixed(2)}m
        </span>
      </div>
    </li>
  );
}
