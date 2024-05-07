import { ERROR_MSG } from "@/services/db/db.utils";
import playListsFunction, {
  UpdatePlayListPayload,
} from "@/services/db/functions/playlists.functions";
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

export async function PUT(req: NextRequest, { params }: ParamsT) {
  try {
    const { id } = params;

    if (!id?.trim()) {
      return nextResponseError(ERROR_MSG.BAD_REQUEST, 403);
    }

    const bodyParams = (await req.json()) as UpdatePlayListPayload;
    const { songs, name, description } = bodyParams;
    const { data, error } = await playListsFunction.updatePlaylist(id, {
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

export async function PATCH(req: NextRequest, { params }: ParamsT) {
  try {
    const { id } = params;

    if (!id?.trim?.()) return nextResponseError(ERROR_MSG.BAD_REQUEST, 403);

    const { songs = [] } = await req.json();
    if (!songs?.length) {
      return nextResponseError(ERROR_MSG.BAD_REQUEST, 403);
    }
    const { data } = await playListsFunction.removeSongFromPlaylist(id, songs);

    if (data) {
      return nextResponseSuccess({ message: "Songs removed from playlist." });
    }

    return nextResponseError("No update has made! service looks down!", 503);
  } catch (err) {
    console.log("Error processing PATCH /api/playlist::", err);
    return nextResponseError(ERROR_MSG.BAD_REQUEST, 403);
  }
}

export async function DELETE(req: NextRequest, { params }: ParamsT) {
  try {
    const { id } = params;

    if (!id) return nextResponseError(ERROR_MSG.BAD_REQUEST, 403);
    const { error } = await playListsFunction.deletePlaylist(id);

    if (error) {
      return nextResponseError(ERROR_MSG.SERVICE_UNAVAILABLE, 403);
    }
    return nextResponseSuccess({ message: "Playlist deleted." });
  } catch (err) {
    console.log("Error processing DELETE /api/playlist", err);
    return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);
  }
}
