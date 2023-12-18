import { connectDB } from "@/services/db/connect.db";
import { fetchAllUsers } from "@/services/db/functions/users.functions";
import { NextRequest } from "next/server";
import {
  nextResponseError,
  nextResponseSuccess,
} from "@/utils/nextResponse.util";

export default async function GET(req: NextRequest) {
  const cookies = req.cookies;
  try {
    const db = await connectDB();
    const data = await fetchAllUsers();
    console.log({ data });

    console.log({ cookies, source: "from album/add :POST method" });
    nextResponseSuccess("Request is processing.");
  } catch (err) {
    console.log("err:", err);
    nextResponseError("Service unavailable.", 503);
  }
}
