import { fetchAllUsers } from "@/services/db/functions/users.functions";
import { NextRequest } from "next/server";
import {
  nextResponseError,
  nextResponseSuccess,
} from "@/utils/nextResponse.util";
import { IAlbumDto, IAlbumStatPayload } from "@/services/types/albums.types";
import { getAlbums, saveAlbum } from "@/services/db/functions/albums.functions";

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const searchTerm = params.get("search") || "";
    const minimal = params.get("minimal") || "";
    const batch = (params.get("batch") || 35) as number;
    const page = (params.get("page") || 0) as number;
    const data = await fetchAllUsers();
    console.log({ data });

    const fields = [];

    if (!!minimal && minimal === "true") {
      console.log("Its minimal");
      fields.push("_id", "title");
    }

    try {
      const data = await getAlbums({ batch, page, searchTerm }, fields);
      return nextResponseSuccess({ data });
    } catch (err) {
      console.log("Error fetching /api/artists", err);
      return nextResponseError("Service under maintenance", 503);
    }
  } catch (err) {
    console.log("err:", err);
    return nextResponseError("Service unavailable.", 503);
  }
}

export async function POST(req: NextRequest) {
  try {
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
    const album = await saveAlbum(payload);
    return nextResponseSuccess({ album });
  } catch (err) {
    console.log("Error processing /POST /api/albums", err);
    return nextResponseError("Service looks down ! try again later", 403);
  }
}
