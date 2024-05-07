import { connectDB } from "@/services/db/connect.db";
import { ERROR_MSG } from "@/services/db/db.utils";
import songsFunction from "@/services/db/functions/songs.functions";
import { ISongsDto } from "@/services/types/songs.types";
import {
  nextResponseError,
  nextResponseSuccess,
} from "@/utils/nextResponse.util";
import { NextRequest } from "next/server";

type ParamsT = {
  params: {
    id: string;
  };
};

export async function GET(req: NextRequest, { params }: ParamsT) {
  try {
    const { id } = params;

    if (!id?.trim()) {
      return nextResponseError(ERROR_MSG.BAD_REQUEST, 403);
    }

    await connectDB();
    const { data } = await songsFunction.fetchSongsByAlbum(id);
    if (data) {
      return nextResponseSuccess({ songs: data });
    }
    return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);
  } catch (err) {
    return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);
  }
}

export async function PUT(request: NextRequest, { params }: ParamsT) {
  try {
    const { id } = params;

    if (!id) return nextResponseError(ERROR_MSG.BAD_REQUEST, 403);

    const body = await request.json();
    const {
      title,
      source,
      artists,
      genre,
      duration,
      metadata,
      lyrics,
      coverImage,
    } = body || {};

    await connectDB();
    const payload: ISongsDto = {
      title,
      source,
      genre,
      duration,
      lyrics,
      metadata,
      coverImage,
      artists,
    };
    const { data, error } = await songsFunction.updateSong(id, payload);
    if (error) {
      return nextResponseError(error || ERROR_MSG.UNDER_MAINTENANCE, 500);
    }
    return nextResponseSuccess({ song: data });
  } catch (err) {
    console.log("Error processing PUT /songs", err);
    return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);
  }
}
