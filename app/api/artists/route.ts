import { connectDB } from "@/services/db/connect.db";
import { UI_CONFIG } from "@/services/db/constants/db.constants";
import { ERROR_MSG } from "@/services/db/db.utils";
import artistFunction, {
  ArtistPayloadT,
} from "@/services/db/functions/artists.functions";
import {
  nextResponseError,
  nextResponseSuccess,
} from "@/utils/nextResponse.util";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest, context: any) => {
  const params = request.nextUrl.searchParams;
  const searchTerm = params.get("search") || "";
  const minimal = params.get("minimal") || "";
  const batch = (params.get("batch") || UI_CONFIG.BATCH_SIZE) as number;
  const page = (params.get("page") || 0) as number;
  const fields = [];
  await connectDB();
  if (!!minimal && minimal === "true") {
    // configuring selection fields in return
    fields.push("_id", "name");
  }

  try {
    const { data, hasMore } = await artistFunction.getArtists(
      { batch, page, searchTerm },
      fields
    );
    return nextResponseSuccess({ data, hasMore });
  } catch (err) {
    console.log("Error fetching /api/artists", err);
    return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);
  }
};

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const payload: ArtistPayloadT = {
    name: body?.name,
    bio: body?.bio,
    dob: body?.dob,
    genre: body?.genre || [],
    image: body?.image || null,
    albums: body?.albums || [],
    socialMedia: body?.socialMedia || null,
  };
  try {
    await connectDB();
    const { data, error } = await artistFunction.saveArtists(payload);
    if (data) {
      return nextResponseSuccess({ artist: data });
    } else {
      return nextResponseError(error || "", 403);
    }
  } catch (err) {
    return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);
  }
};

export const PUT = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const _id = body._id;
    const newPayload: ArtistPayloadT = {
      name: body?.name,
      bio: body?.bio,
      image: body?.image,
      genre: body?.genre || [],
    };
    await connectDB();
    const { data: artist, error } = await artistFunction.updateArtist(
      _id,
      newPayload
    );
    if (artist) {
      return nextResponseSuccess({ artist });
    } else {
      return nextResponseError(error || "Artist not updated", 400);
    }
  } catch (err) {
    console.log("Error request PUT /artists", err);
    return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);
  }
};
