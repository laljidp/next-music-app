import { config } from "@/constants";
import * as jose from "jose";

const getEncodedSecret = () => {
  return new TextEncoder().encode(config.jwtSecretKey);
};

export const signJWT = async (payload: any) => {
  const alg = "HS256";

  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getEncodedSecret());

  return jwt;
};
