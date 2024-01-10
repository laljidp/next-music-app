import { connectDB } from "@/services/db/connect.db";
import Albums from "@/services/db/schemas/album.schema";
import Artists from "@/services/db/schemas/artists.schema";
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
    const users = await Users.countDocuments();
    const songs = await Songs.countDocuments();
    const albums = await Albums.countDocuments();
    const artists = await Artists.countDocuments();
    const responsePayload = {
      users,
      songs,
      albums,
      artists,
    };
    return nextResponseSuccess({
      msg: "Stats running..",
      total: responsePayload,
    });
  } catch (err) {
    console.log("Error processing /api/stats", err);
    return nextResponseError(
      "Service under maintenance! Please try later.",
      503
    );
  }
}
