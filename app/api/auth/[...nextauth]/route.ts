import { config } from "@/constants";
import {
  UserPayloadT,
  createUserIfNotExists,
} from "@/services/db/functions/users.functions";
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
export const authOptions: AuthOptions = {
  // Secret for Next-auth, without this JWT encryption/decryption won't work
  secret: config.jwtSecretKey,
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: config.gClientId || "",
      clientSecret: config.gClientSecret || "",
    }),
    // ...add more providers here
  ],
  callbacks: {
    signIn: async ({ user, account }) => {
      const payload: UserPayloadT = {
        email: user.email || "",
        name: user.name || "",
        picture: user.image || "",
        provider: account?.provider || "",
        providerId: account?.providerAccountId || "",
        role: "user",
        type: "oauth",
      };
      const result = await createUserIfNotExists(payload);
      if (result === "exists") {
        console.log("User already existed!");
      }
      if (result === "created") {
        console.log("New user created");
      }
      return true;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
