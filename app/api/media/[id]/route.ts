import { connectDB } from "@/services/db/connect.db";
import { ERROR_MSG } from "@/services/db/db.utils";
import mediaFunctions from "@/services/db/functions/media.functions";
import {
  nextResponseError,
  nextResponseSuccess,
} from "@/utils/nextResponse.util";
import { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  if (!id) {
    return nextResponseError(ERROR_MSG.BAD_REQUEST, 501);
  }

  try {
    // TODO: call delete media function
    await connectDB();
    const { data, error } = await mediaFunctions.deleteMedia(id);
    if (!data?.deletedCount) {
      return nextResponseError(error || ERROR_MSG.UNDER_MAINTENANCE, 501);
    }
    return nextResponseSuccess({
      message: "Media has been deleted.",
      deletedCount: data?.deletedCount || 0,
    });
  } catch (err) {
    console.log("ERROR executing /api/media/{id} DELETE::", err);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params || {};
    const { name } = await request.json();
    if (!id || !name.trim())
      return nextResponseError(ERROR_MSG.BAD_REQUEST, 501);

    const { data, error } = await mediaFunctions.updateMediaName(id, name);
    if (error)
      return nextResponseError(error || ERROR_MSG.SERVICE_UNAVAILABLE, 501);

    return nextResponseSuccess(data);
    // TODO: Call function to edit the media name
  } catch (err) {
    console.log("ERROR PUT /api/media/${id} ::", err);
  }
}
