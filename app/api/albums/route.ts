import albumFunction from "@/services/db/functions/albums.functions";
import { NextRequest } from "next/server";
import {
  nextResponseError,
  nextResponseSuccess,
} from "@/utils/nextResponse.util";
import { IAlbumDto } from "@/services/types/albums.types";
import { connectDB } from "@/services/db/connect.db";
import { ERROR_MSG } from "@/services/db/db.utils";

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const searchTerm = params.get("search") || "";
    const minimal = params.get("minimal") || "";
    const batch = (params.get("batch") || 35) as number;
    const page = (params.get("page") || 0) as number;
    const fields = [];
    await connectDB();

    if (!!minimal && minimal === "true") {
      fields.push("_id", "title");
    }

    try {
      const { data, error } = await albumFunction.getAlbums(
        { batch, page, searchTerm },
        fields
      );
      if (error) {
        return nextResponseError(error, 400);
      }
      return nextResponseSuccess({ data });
    } catch (err) {
      console.log("Error fetching /api/artists", err);
      return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);
    }
  } catch (err) {
    console.log("err:", err);
    return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    // TODO: APPLY VALIDATION ON REQUEST BODY
    const payload: IAlbumDto = {
      title: body.title,
      description: body?.description,
      coverImage: body?.coverImage,
      releaseDate: body?.releaseDate,
      artists: body?.artists,
      genre: body?.genre,
      setting: {
        gradientColors: body?.gradientColors,
      },
    };
    const { data: album, error } = await albumFunction.saveAlbum(payload);
    if (error) {
      return nextResponseError(error, 400);
    }
    return nextResponseSuccess({ album });
  } catch (err) {
    console.log("Error processing /POST /api/albums", err);
    return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 403);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const payload = await req.json();
    const {
      _id,
      title,
      description,
      coverImage,
      gradientColors,
      releaseDate,
      artists,
      genre,
    } = payload;
    const albumPayload = {
      setting: { gradientColors },
      title,
      description,
      coverImage,
      releaseDate,
      artists,
      genre,
    } as IAlbumDto;
    if (!_id) {
      return nextResponseError("Bad request !", 501);
    }
    await connectDB();
    // TODO: apply validation on payload & process further
    const { data: album, error } = await albumFunction.updateAlbum(
      _id,
      albumPayload
    );
    if (error) {
      return nextResponseError(error, 400);
    }
    return nextResponseSuccess({ album });
  } catch (err) {
    console.log("Error processing /PUT /api/albums", err);
  }
}
