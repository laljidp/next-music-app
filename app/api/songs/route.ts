import {
  fetchSongs,
  saveNewSong,
  updateSong,
} from "@/services/db/functions/songs.functions";
import { ISongsDto } from "@/services/types/songs.types";
import {
  nextResponseError,
  nextResponseSuccess,
} from "@/utils/nextResponse.util";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const params = request.nextUrl.searchParams;
    const searchText = params.get("search") || "";
    const minimal = params.get("minimal") || "";
    const batch = (params.get("batch") || 35) as number;
    const page = (params.get("page") || 0) as number;
    const fields = [];

    if (!!minimal && minimal === "true") {
      // configuring selection fields in return
      fields.push("_id", "name");
    }

    const { data, error } = await fetchSongs(
      { batch, page, searchText },
      fields
    );
    if (data) {
      return nextResponseSuccess({ songs: data });
    }
    return nextResponseError(error || "Service under maintenance", 503);
  } catch (err) {
    console.log("Error processing GET /songs", err);
    return nextResponseError(
      "Service looks down | Please try again later",
      503
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    if (!body?.title?.trim() || !body?.source!) {
      return nextResponseError("Bad request ! request data invalid.", 400);
    }
    const { metadata = {} } = body;
    const payload: ISongsDto = {
      title: body?.title,
      artists: body?.artists,
      source: body?.source,
      albums: body?.albums,
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

    const { data, error } = await saveNewSong(payload);
    if (data) return nextResponseSuccess({ song: data });

    return nextResponseError(
      error || "Service unavailable ! please try later",
      503
    );
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
      albums,
      genre,
      duration,
      metadata,
      lyrics,
      coverImage,
    } = body || {};
    if (!_id) {
      return nextResponseError("Bad request, payload missing[id]!", 400);
    }
    const payload: ISongsDto = {
      title,
      source,
      albums,
      genre,
      duration,
      lyrics,
      metadata,
      coverImage,
      artists,
    };
    const { data, error } = await updateSong(_id, payload);
    if (error) {
      return nextResponseError(
        error || "Service unavailable at the moment! try again later",
        500
      );
    }
    return nextResponseSuccess({ song: data });
  } catch (err) {
    console.log("Error processing PUT /songs", err);
    return nextResponseError(
      "Service looks down | Please try agin later.",
      503
    );
  }
}
