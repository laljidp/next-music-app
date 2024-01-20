export type UserPayloadT = {
  name: string;
  email: string;
  provider: string;
  providerId: string;
  type: string;
  role: string;
  picture: string;
};

export interface IUserShortDto {
  _id: string;
  name: string;
  picture: string;
  role: "user" | "admin" | "superAdmin";
  email: string;
}

export interface IUserDto extends IUserShortDto {
  givenName: string;
  familyName: string;
  preferences: {
    createPlaylist: boolean;
    uploadSongs: boolean;
    createAlbum: boolean;
    playSongs: boolean;
    searchSongs: boolean;
    profileUpdate: boolean;
  };
  provider: string;
  providerId: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
