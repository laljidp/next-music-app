export interface ISongsMetadata {
  name: string;
  kind: string;
  size: number;
  trackNumber?: string;
  bitRate?: number;
  comment?: string;
}

export interface ISongsDto {
  _id?: string;
  title: string;
  duration: number; // ins seconds
  artists: string[];
  source: string; // song file dest url
  genre: string[];
  lyrics?: string;
  coverImage?: string;
  // Statistics
  plays?: number;
  likes?: number;
  // Other song-related details
  metadata?: ISongsMetadata;
  type?: "auto" | "user-defined";
  createdAt?: string;
  updatedAt?: string;
}
