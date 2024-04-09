import { getServerSession } from "next-auth/next";
import { connectDB } from "@/services/db/connect.db";
import { ERROR_MSG } from "@/services/db/db.utils";
import usersFunction from "@/services/db/functions/users.functions";
import {
  nextResponseError,
  nextResponseSuccess,
} from "@/utils/nextResponse.util";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const params = req.nextUrl.searchParams;
  try {
    await connectDB();
    const batch = (params.get("batch") || 20) as number;
    const page = (params.get("page") || 0) as number;
    const searchText = params.get("searchText") as string;
    const { data } = await usersFunction.fetchUsers({
      batch,
      page,
      searchText,
    });
    if (data) {
      return nextResponseSuccess({ users: data });
    }
    return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);
  } catch (err) {
    console.log("Error processing GET /api/users::", err);
    return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);
  }
}
