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
  const params = request.nextUrl.searchParams;
  const searchTerm = params.get("search") || "";
  const minimal = params.get("minimal") || "";
  const batch = (params.get("batch") || 35) as number;
  const page = (params.get("page") || 0) as number;
  const fields = [];

  if (!!minimal && minimal === "true") {
    console.log("Its minimal");
    // configuring selection fields in return
    fields.push("_id", "name");
  }

  try {
    const { data } = await getArtists({ batch, page, searchTerm }, fields);
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
    const { data, error } = await saveArtists(payload);
    if (data) {
      return nextResponseSuccess({ artist: data });
    } else {
      return nextResponseError(error || "", 403);
    }
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

    const { data: artist, error } = await updateArtist(_id, newPayload);
    if (artist) {
      return nextResponseSuccess({ artist });
    } else {
      return nextResponseError(error || "Artist not updated", 400);
    }
  } catch (err) {
    console.log("Error request PUT /artists", err);
    return nextResponseError("Services are under Maintenance", 503);
  }
};
