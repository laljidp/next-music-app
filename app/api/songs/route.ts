import { connectDB } from "@/services/db/connect.db";
import { ERROR_MSG } from "@/services/db/db.utils";
import songsFunction from "@/services/db/functions/songs.functions";
import { ISongsDto } from "@/services/types/songs.types";
import {
  nextResponseError,
  nextResponseSuccess,
} from "@/utils/nextResponse.util";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    await connectDB();
    const params = request.nextUrl.searchParams;
    const searchText = params.get("search") || "";
    const minimal = params.get("minimal") || "";
    const batch = (params.get("batch") || 35) as number;
    const page = (params.get("page") || 0) as number;
    const fields = [];

    if (!!minimal && minimal === "true") {
      // configuring selection fields in return
      fields.push("_id", "title", "coverImage");
    }

    const { data, error } = await songsFunction.fetchSongs(
      { batch: Number(batch), page, searchText },
      fields,
    );
    const hasMore = data?.length === Number(batch);
    if (data) {
      return nextResponseSuccess({ songs: data, hasMore });
    }
    return nextResponseError(error || ERROR_MSG.UNDER_MAINTENANCE, 503);
  } catch (err) {
    console.log("Error processing GET /songs", err);
    return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    if (!body?.title?.trim() || !body?.source!) {
      return nextResponseError(ERROR_MSG.BAD_REQUEST, 400);
    }

    await connectDB();
    const { metadata = {} } = body;
    const payload: ISongsDto = {
      title: body?.title,
      artists: body?.artists,
      source: body?.source,
      genre: body?.genre,
      lyrics: body?.lyrics,
      duration: body?.duration,
      coverImage: body?.coverImage,
      metadata: {
        name: metadata?.name,
        kind: metadata?.kind,
        size: metadata?.size,
        trackNumber: metadata?.trackNumber,
        bitRate: metadata?.bitRate,
        comment: metadata?.comment,
      },
    };

    const { data, error } = await songsFunction.saveNewSong(payload);
    if (data) return nextResponseSuccess({ song: data });

    return nextResponseError(error || ERROR_MSG.UNDER_MAINTENANCE, 503);
  } catch (err) {
    console.log("Error processing /POST /songs", err);
  }
  return nextResponseSuccess({ message: "POST /songs API running." });
};

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      _id,
      title,
      source,
      artists,
      genre,
      duration,
      metadata,
      lyrics,
      coverImage,
    } = body || {};
    if (!_id) {
      return nextResponseError("Bad request, payload missing[id]!", 400);
    }
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
    const { data, error } = await songsFunction.updateSong(_id, payload);
    if (error) {
      return nextResponseError(error || ERROR_MSG.UNDER_MAINTENANCE, 500);
    }
    return nextResponseSuccess({ song: data });
  } catch (err) {
    console.log("Error processing PUT /songs", err);
    return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id as string[];
    if (!id?.length) {
      return nextResponseError(ERROR_MSG.BAD_REQUEST, 403);
    }
    const { data, error } = await songsFunction.deleteSongs(id);
    if (error) {
      return nextResponseError(ERROR_MSG.BAD_REQUEST, 503);
    }
    return nextResponseSuccess(data);
  } catch (err) {
    console.log("Error executing /songs DELETE::", err);
    return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);
  }
}
