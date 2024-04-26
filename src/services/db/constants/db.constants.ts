export const COLLECTION = {
  USERS: "Users",
  ALBUMS: "Albums",
  SONGS: "Songs",
  PLAYLIST: "Playlist",
  SETTINGS: "Settings",
  ARTISTS: "Artists",
  MEDIA: "Media",
};

export const MONGO_ERROR_CODES = Object.freeze({
  DUPLICATE: "E11000",
  CAST_ERROR: "Cast to ObjectId failed",
});

export const SONGS_UPLOAD_PATH = "/songs";
export const MEDIA_UPLOAD_PATH = "/media";

export const USER_ROLES = Object.freeze({
  admin: "admin",
  superAdmin: "superAdmin",
});

export const UI_CONFIG = Object.freeze({
  BATCH_SIZE: 15,
});
