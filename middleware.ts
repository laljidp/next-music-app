import { decryptJWT } from "@/utils/jwt.util";
import { nextResponseError } from "@/utils/nextResponse.util";
import { NextRequest, NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest, response: NextResponse) {
  try {
    console.log("Middleware running.");
    const token = request.headers.get("Authorization");
    if (token) {
      // console.log("token::", token);
      const [, jwtToken] = token.split(" ");
      const payload = await decryptJWT(jwtToken);
      if (payload?.name && payload?._id) {
        return NextResponse.next();
      } else {
        return nextResponseError("Unauthorized user", 401);
      }
    } else {
      // needs to redirect to root page
      return NextResponse.redirect("/");
    }
  } catch (err) {
    console.log("Error executing middleware:", err);
    return nextResponseError("Unauthorized user", 401);
  }
}

export const config = {
  matcher: [
    "/api/artists/:path*",
    "/api/songs/:path*",
    "/api/albums/:path*",
    "/api/playlists/:path*",
    "/api/users/:path*",
  ],
};
