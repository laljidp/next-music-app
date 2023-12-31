import GoogleProvider from "next-auth/providers/google";
import {
  UserPayloadT,
  createUserIfNotExists,
} from "@/services/db/functions/users.functions";
import { AuthOptions } from "next-auth";
import { config } from "@/constants";
import { connectDB } from "@/services/db/connect.db";

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
      try {
        await connectDB();
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
      } catch (err) {
        console.log("Error while executing signIn func::", err);
        return false;
      }
    },
  },
};
