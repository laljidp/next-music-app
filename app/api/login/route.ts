import usersFunctions from "@/services/db/functions/users.functions";
import {
  nextResponseError,
  nextResponseSuccess,
} from "@/utils/nextResponse.util";
import { NextRequest } from "next/server";
import { signJWT } from "@/utils/jwt.util";
import { connectDB } from "@/services/db/connect.db";
import { ERROR_MSG } from "@/services/db/db.utils";

export const POST = async (request: NextRequest) => {
  //:: checking if users has admin right or not.
  try {
    const { email } = await request.json();
    if (!email) {
      return nextResponseError(ERROR_MSG.BAD_REQUEST, 403);
    }
    await connectDB();
    const user = (await usersFunctions.fetchUserByEmail(email)) || null;

    if (!user) {
      return nextResponseError(ERROR_MSG.USER_NOT_EXISTS, 401);
    }

    if (user.role === "admin") {
      const payload = {
        name: user?.name,
        email: user?.email,
        picture: user?.picture,
        role: user?.role,
        _id: user?._id.toString(),
      };
      console.log({
        payload,
      });
      // INFO:: generate token and send back to client.
      const token = await signJWT(payload);
      return nextResponseSuccess({ data: user, isAdmin: true, token });
    }

    return nextResponseError(ERROR_MSG.UNAUTHORIZED_ACCESS, 401);
  } catch (err) {
    console.log("Error calling /POST /api/login", err);
    return nextResponseError(ERROR_MSG.USER_NOT_EXISTS, 401);
  }
};

export const GET = () => {
  return nextResponseError("Method not allowed", 405);
};
