import { connectDB } from "../connect.db";
import Users from "../schemas/user.schema";

export type UserPayloadT = {
  name: string;
  email: string;
  provider: string;
  providerId: string;
  type: string;
  role: string;
  picture: string;
};

export type UserProcessStat = "created" | "exists" | "error";

class UsersFunctions {
  constructor() {
    connectDB();
  }

  getUserByEmail = async (
    email: string,
    select: Record<string, boolean> = {
      name: true,
      email: true,
      picture: true,
      role: true,
    }
  ) => {
    const user = await Users.findOne({ email }).select(select);
    if (!user) {
      return null;
    }
    return user;
  };

  isAdminRole = async (id: string) => {
    const user = await Users.findById(id, { role: "admin" });
    if (!user) return false;

    return true;
  };

  fetchUserByEmail = async (email: string) => {
    try {
      const users = await Users.findOne({ email });
      return users;
    } catch (err) {
      console.log("Error fetching users (users.functions.ts:8)", err);
      return [];
    }
  };

  createUserIfNotExists = async (
    payload: UserPayloadT
  ): Promise<UserProcessStat> => {
    try {
      const user = await this.getUserByEmail(payload.email);
      console.log("findBYEmailUser", user);
      if (user) {
        console.log(`User already exits:: ${payload.email}`);
        return "exists";
      }

      const newUser = await Users.create({
        name: payload.name,
        email: payload.email,
        providerId: payload.providerId,
        provider: payload.provider,
        picture: payload.picture,
        type: payload.type,
        role: payload.role,
      });

      if (!newUser) {
        console.log("Failed to create a user::(new-error)");
        return "error";
      }
      return "created";
    } catch (err) {
      console.log("Failed to create a user", err);
      return "error";
    }
  };
}

const usersFunctions = new UsersFunctions();

export default usersFunctions;
