import { connectDB } from "@/services/db/connect.db";
import { fetchAllUsers } from "@/services/db/functions/users.functions";
import { NextRequest } from "next/server";
import {
  nextResponseError,
  nextResponseSuccess,
} from "@/utils/nextResponse.util";

export async function GET(req: NextRequest) {
  try {
    const db = await connectDB();
    const data = await fetchAllUsers();
    console.log({ data });

    console.log({ source: "from album/add :POST method" });
    return nextResponseSuccess("Request is processing.");
  } catch (err) {
    console.log("err:", err);
    return nextResponseError("Service unavailable.", 503);
  }
}
