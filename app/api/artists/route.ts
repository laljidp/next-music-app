import {
  ArtistPayloadT,
  getArtists,
  saveArtists,
} from "@/services/db/functions/artists.functions";
import {
  nextResponseError,
  nextResponseSuccess,
} from "@/utils/nextResponse.util";
import { NextRequest } from "next/server";

export const GET = async (request: Request, context: any) => {
  const { batch = 20, page = 0 } = {};
  console.log({ context });
  try {
    const data = await getArtists({ batch, page });
    return nextResponseSuccess({ data });
  } catch (err) {
    console.log("Error fetching /api/artists", err);
    return nextResponseError("Service under maintenance", 503);
  }
};

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  console.log({ body });
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
    const data = await saveArtists(payload);
    if (data) {
      return nextResponseSuccess({ data });
    }
    return nextResponseSuccess({
      msg: "POST: /api/artists ERROR",
      success: false,
    });
  } catch (err) {
    return nextResponseError(
      "Service is under Maintenance, Please try later",
      503
    );
  }
};
