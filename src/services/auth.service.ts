import * as jose from "jose";
import { NextRequest, NextResponse } from "next/server";
import { USER_TOKEN, getJwtSecretKey } from "@/constants";

interface UserJwtPayload {
  jti: string;
  iat: number;
}

export class AuthError extends Error {}

export async function verifyUser(req: NextRequest, res: NextResponse) {
  const token = req.cookies.get(USER_TOKEN)?.value;

  if (!token) {
    throw new AuthError("Missing token required!");
  }

  try {
    const verified = await jose.jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecretKey())
    );
    return verified.payload as UserJwtPayload;
  } catch (err) {
    throw new AuthError("Your token has expired.");
  }
}

type LoginPayloadT = {
  username: string;
  password: string;
};

export async function loginUser(payload: LoginPayloadT) {
  // TODO: Fetch data from mongodb and match the password
}

export async function generateToken(data: any) {
  const token = await new jose.EncryptJWT(data)
    .setProtectedHeader({ alg: "HS256", enc: "A128CBC-HS256" })
    .setIssuedAt()
    .setExpirationTime("1w")
    .setJti(JSON.stringify({ user: "new user"! }))
    .encrypt(new TextEncoder().encode(getJwtSecretKey()));

  return token;
}

export function expireUserCookie(res: NextResponse) {
  res.cookies.set(USER_TOKEN, "", { httpOnly: true, maxAge: 0 });
  return res;
}
