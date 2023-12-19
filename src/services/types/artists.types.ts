export type SocialMediaPlatform =
  | "website"
  | "facebook"
  | "twitter"
  | "instagram";

export type ArtistsDto = {
  _id: string;
  name: string;
  bio?: string;
  genre?: string[];
  image?: string;
  albums?: string[];
  dob?: Date;
  socialMedia?: Record<SocialMediaPlatform, string>;
  followers?: number;
  monthlyListeners?: number;
};

export type GenreT = typeof GENRES;

export const GENRES = [
  "Rock",
  "Pop",
  "Hip Hop / Rap",
  "Electronic",
  "R&B / Soul",
  "Jazz",
  "Country",
  "Classical",
  "Blues",
  "Reggae",
  "Folk",
  "World",
  "Experimental / Avant-Garde",
  "Gospel",
  "Metal",
  "Punk",
  "New Age",
  "Soundtracks",
];
