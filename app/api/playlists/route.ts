import { ERROR_MSG } from "@/services/db/db.utils";
import PlayListsFunction from "@/services/db/functions/playlists.functions";
import { IPlaylistPayload } from "@/services/types/playlists.types";
import {
  nextResponseError,
  nextResponseSuccess,
} from "@/utils/nextResponse.util";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: any) {
  try {
    console.log({ params });
    const {
      search = "" as string,
      batch = 20 as number,
      page = 0 as Number,
    } = params || {};
    const playlists = await PlayListsFunction.getPlaylists({
      search,
      batch,
      page,
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
    if (!payload?.name || !payload?.description) {
      return nextResponseError(ERROR_MSG.BAD_REQUEST, 403);
    }
    const { data } = await PlayListsFunction.saveNewPlaylist(payload);
    if (data) {
      return nextResponseSuccess({ playlist: data });
    }
    return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);
  } catch (err) {
    console.log("Error processing POST /api/playlists", err);
    return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);
  }
}

export async function PUT(req: NextRequest) {
  try {
  } catch (err) {
    console.log("Error executing PUT /api/playlist::", err);
    return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);
  }
}
