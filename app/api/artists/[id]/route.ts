import { connectDB } from "@/services/db/connect.db";
import { ERROR_MSG } from "@/services/db/db.utils";
import artistFunction, {
  ArtistPayloadT,
} from "@/services/db/functions/artists.functions";
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

export const PUT = async (request: NextRequest, { params }: ParamsT) => {
  try {
    const { id } = params;
    if (!id?.trim()) return nextResponseError(ERROR_MSG.BAD_REQUEST, 400);

    const body = await request.json();
    const newPayload: ArtistPayloadT = {
      name: body?.name,
      bio: body?.bio,
      image: body?.image,
      genre: body?.genre || [],
    };

    await connectDB();
    const { data: artist, error } = await artistFunction.updateArtist(
      id,
      newPayload,
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
