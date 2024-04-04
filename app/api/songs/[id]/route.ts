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
