import { connectDB } from "@/services/db/connect.db";
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
      return nextResponseError("Bad request!", 403);
    }

    await connectDB();
    const _songs = await songsFunction.fetchSongsByAlbum(id);
    return nextResponseSuccess({ songs: _songs });
  } catch (err) {
    return nextResponseError("Service looks down! Please try later.", 503);
  }

  return nextResponseSuccess({ xX: "Executing..." });
}
