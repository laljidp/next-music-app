import { connectDB } from "@/services/db/connect.db";
import { ERROR_MSG } from "@/services/db/db.utils";
import playListsFunction, {
  UpdatePlayListPayload,
} from "@/services/db/functions/playlists.functions";
import { IPlaylistPayload } from "@/services/types/playlists.types";
import {
  nextResponseError,
  nextResponseSuccess,
} from "@/utils/nextResponse.util";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: any) {
  try {
    console.log({ params });
    await connectDB();
    const {
      search = "" as string,
      batch = 20 as number,
      page = 0 as Number,
    } = params || {};
    const playlists = await playListsFunction.getPlaylists({
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

export async function PUT(req: NextRequest) {
  try {
    const bodyParams = (await req.json()) as UpdatePlayListPayload;
    const { _id, songs, name, description } = bodyParams;
    const { data, error } = await playListsFunction.updatePlaylist({
      _id,
      songs,
      name,
      description,
    });
    if (data) return nextResponseSuccess({ playlist: data });

    return nextResponseError(error, 403);
  } catch (err) {
    console.log("Error executing PUT /api/playlist::", err);
    return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 501);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { _id, songs = [] } = await req.json();
    console.log("Sings", songs);
    if (!songs?.length) {
      return nextResponseError(ERROR_MSG.BAD_REQUEST, 403);
    }
    const { data } = await playListsFunction.removeSongFromPlaylist(_id, songs);
    console.log({ data });
    if (data) {
      return nextResponseSuccess({ message: "Songs removed from playlist." });
    }
    return nextResponseError("No update has made! service looks down!", 503);
  } catch (err) {
    console.log("Error processing PATCH /api/playlist::", err);
    return nextResponseError(ERROR_MSG.BAD_REQUEST, 403);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const payload = await req.json();
    const { _id } = payload;
    if (!_id?.trim()) {
      return nextResponseError(ERROR_MSG.BAD_REQUEST, 403);
    }

    const { data } = await playListsFunction.deletePlaylist(_id);
    if (data) {
      return nextResponseSuccess({ message: "Playlist deleted." });
    }
  } catch (err) {
    console.log("Error processing DELETE /api/playlist", err);
    return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);
  }
}
