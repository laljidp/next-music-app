import { ERROR_MSG } from "@/services/db/db.utils";
import usersFunctions from "@/services/db/functions/users.functions";
import {
  nextResponseError,
  nextResponseSuccess,
} from "@/utils/nextResponse.util";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest, { params }: any) {
  try {
    const id = params?.id as string;
    const role = params?.role as string;
    if (!id || !role) {
      return nextResponseError(ERROR_MSG.BAD_REQUEST, 400);
    }

    if (role !== "user" && role !== "admin") {
      return nextResponseError(ERROR_MSG.BAD_REQUEST, 400);
    }
    const { data } = await usersFunctions.switchUserToAdmin(id, role);
    if (data) {
      return nextResponseSuccess({ message: "User switched to Admin." });
    }
    return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);
  } catch (err) {
    console.log("ERROR processing PATCH /api/users");
    return nextResponseError(ERROR_MSG.UNDER_MAINTENANCE, 503);
  }
}
