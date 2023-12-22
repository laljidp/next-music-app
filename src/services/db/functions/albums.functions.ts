import { IAlbumDto } from "@/services/types/albums.types";
import Albums from "../schemas/album.schema";

export type GetAlbumPayloadT = {
  page: number;
  batch: number;
  searchTerm: string;
};

export const getAlbums = async (
  payload: GetAlbumPayloadT,
  fields: string[] = []
) => {
  const { batch, page, searchTerm } = payload;
  const regex = new RegExp(searchTerm, "i");
  let conditions = [
    { description: regex }, // Matches titles containing 'JavaScript' (case insensitive)
    { title: regex }, // Matches authors with the name 'John Doe'
  ];
  let data: any;
  if (searchTerm.trim()?.length > 2) {
    data = await Albums.find({ $or: conditions })
      .sort({ createdAt: "desc" })
      .skip(Number(page) * Number(batch))
      .limit(batch)
      .select(fields);
  } else {
    data = await Albums.find({})
      .sort({ createdAt: "desc" })
      .skip(Number(page) * Number(batch))
      .limit(batch)
      .select(fields);
  }
  return data;
};

export const saveAlbum = async (payload: IAlbumDto) => {
  const album = await Albums.create(payload);
  if (!album) {
    throw new Error("Album not saved.");
  }
  return album;
};

export const updateAlbum = async (_id: string, payload: IAlbumDto) => {
  const album = await Albums.findOneAndUpdate({ _id }, payload);
  if (!album) {
    throw new Error("Album not saved");
  }
  return album;
};
