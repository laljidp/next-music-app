import {
  ArtistPayloadT,
  getArtists,
  saveArtists,
  updateArtist,
} from "@/services/db/functions/artists.functions";
import {
  nextResponseError,
  nextResponseSuccess,
} from "@/utils/nextResponse.util";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest, context: any) => {
  debugger;
  const params = request.nextUrl.searchParams;
  const searchTerm = params.get("search") || "";
  const batch = (params.get("batch") || 35) as number;
  const page = (params.get("page") || 0) as number;

  try {
    const data = await getArtists({ batch, page, searchTerm });
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
      return nextResponseSuccess({ artist: data });
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

    const updatedArtist = await updateArtist(_id, newPayload);
    return nextResponseSuccess({ artist: updatedArtist });
  } catch (err) {
    console.log("Error request PUT /artists", err);
    return nextResponseError("Services are under maintainance", 503);
  }
};
