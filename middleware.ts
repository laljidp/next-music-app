import { NextRequest, NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  console.log({
    cookies: request.headers.get("Authorization"),
    source: "middleware ßß",
  });
  const response = NextResponse.next();
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
