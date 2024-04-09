import usersFunctions from "@/services/db/functions/users.functions";
import { nextResponseSuccess } from "@/utils/nextResponse.util";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    console.log({ params });
    const isSuperAdmin = await usersFunctions.isUserSuperAdmin(params.email);
    return nextResponseSuccess({ isSuperAdmin: isSuperAdmin });
    // TODO: check if user is super admin
  } catch (err) {
    console.log("Error GET /isSuperAdmin", err);
    return nextResponseSuccess({ isSuperAdmin: false });
  }
}
