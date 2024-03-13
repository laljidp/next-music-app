export const COLLECTION = {
  USERS: "Users",
  ALBUMS: "Albums",
  SONGS: "Songs",
  PLAYLIST: "Playlist",
  SETTINGS: "Settings",
  ARTISTS: "Artists",
};

export const MONGO_ERROR_CODES = Object.freeze({
  DUPLICATE: "E11000",
  CAST_ERROR: "Cast to ObjectId failed",
});

export const USER_ROLES = Object.freeze({
  admin: "admin",
  superAdmin: "superAdmin",
});

export const UI_CONFIG = Object.freeze({
  BATCH_SIZE: 15,
});
