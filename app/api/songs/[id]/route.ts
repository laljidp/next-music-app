import { connectDB } from "@/services/db/connect.db";
import { ERROR_MSG } from "@/services/db/db.utils";
import songsFunction from "@/services/db/functions/songs.functions";
import {
  nextResponseError,
  nextResponseSuccess,
} from "@/utils/nextResponse.util";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: any) {
  try {
    console.log({ params });
    const { id } = params;

    if (!id?.trim()) {
      return nextResponseError(ERROR_MSG.BAD_REQUEST, 403);
    }

    await connectDB();
    const _songs = await songsFunction.fetchSongsByAlbum(id);
    return nextResponseSuccess({ songs: _songs });
  } catch (err) {
    return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);
  }
}
