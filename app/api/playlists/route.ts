import { connectDB } from "@/services/db/connect.db";
import { ERROR_MSG } from "@/services/db/db.utils";
import playListsFunction from "@/services/db/functions/playlists.functions";
import { IPlaylistPayload } from "@/services/types/playlists.types";
import {
  nextResponseError,
  nextResponseSuccess,
} from "@/utils/nextResponse.util";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const search = params.get("search") || "";
    const batch = params.get("batch");
    const page = params.get("page");
    await connectDB();
    const playlists = await playListsFunction.getPlaylists({
      search,
      batch: Number(batch),
      page: Number(page),
    });
    return nextResponseSuccess({ playlists });
  } catch (err) {
    console.log("Error processing GET /api/playlists", err);
    return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as IPlaylistPayload;
    if (!payload?.name) {
      return nextResponseError(ERROR_MSG.BAD_REQUEST, 403);
    }
    const { data } = await playListsFunction.saveNewPlaylist(payload);
    if (data) {
      return nextResponseSuccess({ playlist: data });
    }
    return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);
  } catch (err) {
    console.log("Error processing POST /api/playlists", err);
    return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);
  }
}
