import { config } from "@/constants";
import * as jose from "jose";

const alg = "dir";

export const signJWT = async (payload: any) => {
  const secret = jose.base64url.decode(config.jwtSecretKey);
  const jwt = await new jose.EncryptJWT(payload)
    .setProtectedHeader({ alg, enc: "A128CBC-HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .encrypt(secret);

  return jwt;
};

export const decryptJWT = async (jwt: string) => {
  const secret = jose.base64url.decode(config.jwtSecretKey);
  const { payload } = await jose.jwtDecrypt(jwt, secret);
  return payload;
};
