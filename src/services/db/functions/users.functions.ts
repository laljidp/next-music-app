import { UserPayloadT } from "@/services/types/users.types";
import Users, { USER_ROLES } from "../schemas/user.schema";

export type FetchUsersParamsT = {
  batch: number;
  page: number;
  searchText?: string;
};

export type UserProcessStat = "created" | "exists" | "error";

class UsersFunctions {
  constructor() {
    console.log("UsersFunction Loading::");
  }
  fetchUsers = async (params: FetchUsersParamsT) => {
    const { batch = 20, page = 0, searchText } = params;
    let finder = {};
    try {
      if (searchText?.trim()?.length) {
        const searchRegex = new RegExp(searchText, "i");
        const conditions = [{ name: searchRegex }, { email: searchRegex }];
        finder = { $or: conditions };
      }
      const skip = Number(batch) * Number(page);
      const users = await Users.find(finder)
        .skip(skip)
        .limit(batch)
        .select(["name", "email", "picture", "role"]);
      return { data: users };
    } catch (err) {
      console.log("ERROR executing fetchUsers::", err);
      return { error: "Unable to fetch users" };
    }
  };

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
    const user = await Users.findById(id, { role: USER_ROLES.ADMIN });
    if (!user) return false;

    return true;
  };

  isUserSuperAdmin = async (email: string) => {
    const user = await Users.findOne({ email, role: USER_ROLES.SUPER_ADMIN });
    console.log("user", user);
    if (user) return true;

    return false;
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

  switchUserToAdmin = async (userId: string, role: string) => {
    try {
      const user = await Users.updateOne(
        { _id: userId },
        {
          role: role,
        },
        { returnDocument: "after" }
      );
      return { data: user };
    } catch (err) {
      console.log("ERROR executing switchUserToAdmin", err);
      return { error: "Failed to switch role to Admin." };
    }
  };
}

const usersFunctions = new UsersFunctions();

export default usersFunctions;
