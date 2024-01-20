import { ISongsDto } from "./songs.types";

export interface IPlaylistPayload {
  _id?: string;
  name: string;
  description: string;
  songs: string[];
}
export interface IPlaylistsDto {
  _id?: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  songs: ISongsDto[];
  createdBy: string;
}
