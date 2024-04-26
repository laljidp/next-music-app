import { connectDB } from "@/services/db/connect.db";
import { UI_CONFIG } from "@/services/db/constants/db.constants";
import { ERROR_MSG } from "@/services/db/db.utils";
import mediaFunctions from "@/services/db/functions/media.functions";
import {
  nextResponseError,
  nextResponseSuccess,
} from "@/utils/nextResponse.util";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const params = request.nextUrl.searchParams;
    const batch = params.get("batch") || UI_CONFIG.BATCH_SIZE;
    const search = params.get("search") || "";
    const page = params.get("page") || 0;

    const { data, error } = await mediaFunctions.getMedia({
      batch: Number(batch),
      searchTerm: search,
      page: Number(page),
    });
    if (error) return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);

    return nextResponseSuccess({ media: data });
  } catch (err) {
    return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    if (!body?.name?.trim() || !body.source?.trim()) {
      return nextResponseError(ERROR_MSG.BAD_REQUEST, 501);
    }
    const payload = {
      name: body.name,
      description: body.description,
      source: body.source,
    };
    const { data, error } = await mediaFunctions.addMedia(payload);
    if (error) return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);

    return nextResponseSuccess({
      message: "Media added successfully",
      data: { name: data?.name, source: data?.source },
    });
  } catch (err) {
    console.log("ERROR processing /media POST::", err);
    return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);
  }
}
