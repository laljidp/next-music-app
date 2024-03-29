export const USER_TOKEN = "next-token";
import { apiUrls, PAGES } from "./apis.constant";

const JWT_SECRET_KEY: string | undefined =
  process.env.NEXT_PUBLIC_JWT_SECRET_KEY!;

export function getJwtSecretKey(): string {
  if (!JWT_SECRET_KEY || JWT_SECRET_KEY.length === 0) {
    throw new Error("The environment variable JWT_SECRET_KEY is not set.");
  }

  return JWT_SECRET_KEY;
}

const config = Object.freeze({
  jwtSecretKey: getJwtSecretKey(),
  gClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || null,
  gClientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || null,
  mongoUri: process.env.NEXT_PUBLIC_MONGO_URL || null,
});

const LEFT_MENUS = [
  {
    name: "stats",
    title: "Stats",
    url: PAGES.adminStats,
    icon: null,
  },
  {
    name: "songs",
    title: "Songs",
    url: PAGES.adminSongs,
    icon: null,
  },
  {
    name: "albums",
    title: "Albums",
    url: PAGES.adminAlbums,
    icon: null,
  },
  {
    name: "artists",
    title: "Artists",
    url: PAGES.adminArtists,
    icon: null,
  },
  {
    name: "playlists",
    title: "Playlists",
    url: PAGES.adminPlaylists,
    icon: null,
  },
];

const COLORS = Object.freeze({
  brand: "#8b5cf6",
  primary: "#818cf8",
  secondary: "#475569",
  primaryLight: "#a78bfa",
  primaryExtraLight: "#c4b5fd",
});

export { apiUrls, config, PAGES, LEFT_MENUS, COLORS };
