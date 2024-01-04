import usersFunctions from "@/services/db/functions/users.functions";
import {
  nextResponseError,
  nextResponseSuccess,
} from "@/utils/nextResponse.util";
import { NextRequest } from "next/server";
import { signJWT } from "@/utils/jwt.util";

export const POST = async (request: NextRequest) => {
  //:: checking if users has admin right or not.
  try {
    const { email } = await request.json();
    if (!email) {
      return nextResponseError("Bad request!", 403);
    }

    const user = (await usersFunctions.getUserByEmail(email)) || null;

    if (!user) {
      return nextResponseError("User does not exists", 401);
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

    return nextResponseError("Unauthorized Access", 401);
  } catch (err) {
    console.log("Error calling /POST /api/login", err);
    return nextResponseError("User does not exists", 401);
  }
};

export const GET = (request: NextRequest) => {
  return nextResponseError("Method not allowed", 405);
};
