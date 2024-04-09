import { ISongsDto } from "./songs.types";

export type PlaylistMinimumDto = {
  id: string;
  name: string;
  totalSongs: number;
};

export type PlayListsDto = {
  id: string;
  name: string;
  description: string;
  songs: ISongsDto[];
  createdAt: string;
  updatedAt: string;
};
