import { ArtistsDto } from "./artists.types";

export interface IAlbumStatPayload {
  title: string;
  description: string;
  genre: string[];
  releaseDate: string;
  gradientColors: string[];
  coverImage: string;
}

export interface IAlbumDto {
  _id: string;
  title: string;
  description: string;
  releaseDate: string;
  genre: string[];
  artist: ArtistsDto[];
  coverImage: string;
  songs: any[];
  // Statistics
  totalDuration: number;
  totalLikes: number;
  setting: {
    gradientColors: string[];
  };
}
