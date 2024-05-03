import albumFunction from "@/services/db/functions/albums.functions";
import { NextRequest } from "next/server";
import {
  nextResponseError,
  nextResponseSuccess,
} from "@/utils/nextResponse.util";
import { IAlbumDto } from "@/services/types/albums.types";
import { connectDB } from "@/services/db/connect.db";
import { ERROR_MSG } from "@/services/db/db.utils";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  if (!id) {
    return nextResponseError(ERROR_MSG.BAD_REQUEST, 501);
  }

  try {
    const payload = await req.json();
    const {
      title,
      description,
      coverImage,
      gradientColors,
      releaseDate,
      artists,
      genre,
    } = payload;
    const albumPayload = {
      setting: { gradientColors },
      title,
      description,
      coverImage,
      releaseDate,
      artists,
      genre,
    } as IAlbumDto;
    if (!id) {
      return nextResponseError("Bad request !", 501);
    }
    await connectDB();
    // TODO: apply validation on payload & process further
    const { data: album, error } = await albumFunction.updateAlbum(
      id,
      albumPayload,
    );
    if (error) {
      return nextResponseError(error, 400);
    }
    return nextResponseSuccess({ album });
  } catch (err) {
    console.log("Error processing /PUT /api/albums", err);
  }
}
