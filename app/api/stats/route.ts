import { connectDB } from "@/services/db/connect.db";
import { ERROR_MSG } from "@/services/db/db.utils";
import Albums from "@/services/db/schemas/album.schema";
import Artists from "@/services/db/schemas/artists.schema";
import Media from "@/services/db/schemas/media.schema";
import Playlists from "@/services/db/schemas/playlist.schema";
import Songs from "@/services/db/schemas/songs.schema";
import Users from "@/services/db/schemas/user.schema";
import {
  nextResponseError,
  nextResponseSuccess,
} from "@/utils/nextResponse.util";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const media = await Media.countDocuments();
    const songs = await Songs.countDocuments();
    const albums = await Albums.countDocuments();
    const artists = await Artists.countDocuments();
    const playlists = await Playlists.countDocuments();
    const responsePayload = {
      media,
      songs,
      albums,
      artists,
      playlists,
    };
    return nextResponseSuccess({
      counts: responsePayload,
    });
  } catch (err) {
    console.log("Error processing /api/stats", err);
    return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);
  }
}
