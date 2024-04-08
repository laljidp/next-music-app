"use client";
import { USER_TOKEN, apiUrls } from "@/constants";
import React, { createContext, useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { USER_ROLES } from "@/services/db/schemas/user.schema";
import userRequests from "@/services/request/users.request";

export type StatusT = "init" | "processing" | "done";
export type LoginAdminPayloadT = {
  email: string;
};

export type InitialStateT = {
  status: StatusT;
  loading: boolean;
  user: UserT | null;
  loginAdmin: (payload: LoginAdminPayloadT) => any;
  updateRoleInformation: (email: string) => void;
  logout: () => void;
};

export type UserT = {
  id: string;
  name: string;
  email: string;
  picture: string;
  role: USER_ROLES;
};

const initialState: InitialStateT = {
  status: "init",
  loading: false,
  user: null,
  loginAdmin: () => {},
  updateRoleInformation: () => {},
  logout: () => {},
};

export const UserContext = createContext(initialState);

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [user, setUser] = useState<UserT | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<StatusT>("init");

  const loginAdmin = async (payload: LoginAdminPayloadT) => {
    try {
      setLoading(true);
      //:Call login API
      const resp = await fetch(apiUrls.login, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const respData = (await resp.json()) as UserT;
      setUser(respData);
      return respData;
    } catch (err) {
      console.error("Error calling Login API::", err);
    } finally {
      setLoading(false);
      setStatus("done");
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem(USER_TOKEN);
    await signOut();
  };

  const updateRoleInformation = async (email: string) => {
    try {
      const data = await userRequests.checkIfUserSuperAdmin(email);
      if (data && user) {
        setUser({
          ...user,
          role: USER_ROLES.SUPER_ADMIN,
        });
      }
    } catch (err) {
      console.log("ERROR updateRoleInformation::", err);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loginAdmin,
        status,
        loading,
        logout,
        updateRoleInformation,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
