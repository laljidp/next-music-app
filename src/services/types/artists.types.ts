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
  followers: number;
  monthlyListeners: number;
};
