import albumFunction from "@/services/db/functions/albums.functions";
import { NextRequest } from "next/server";
import {
  nextResponseError,
  nextResponseSuccess,
} from "@/utils/nextResponse.util";
import { connectDB } from "@/services/db/connect.db";
import { ERROR_MSG } from "@/services/db/db.utils";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  if (!id) {
    return nextResponseError(ERROR_MSG.BAD_REQUEST, 501);
  }

  try {
    const songIds = (await req.json()) as string[];

    if (!id) {
      return nextResponseError("Bad request !", 501);
    }
    await connectDB();
    // TODO: apply validation on payload & process further
    const { data: album, error } = await albumFunction.appendSongsToAlbums(
      id,
      songIds,
    );
    if (error) {
      return nextResponseError(error, 400);
    }
    return nextResponseSuccess({ album });
  } catch (err) {
    console.log("Error processing /PUT /api/albums", err);
  }
}
