"use client";
import { USER_TOKEN, apiUrls } from "@/constants";
import React, { createContext, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export type StatusT = "init" | "processing" | "done";
export type LoginAdminPayloadT = {
  email: string;
};

export type InitialStateT = {
  status: StatusT;
  loading: boolean;
  user: UserT | null;
  loginAdmin: (payload: LoginAdminPayloadT) => any;
  logout: () => void;
};

export type UserT = {
  id: string;
  name: string;
  email: string;
  picture: string;
  role: "user" | "admin";
};

const initialState: InitialStateT = {
  status: "init",
  loading: false,
  user: null,
  loginAdmin: () => {},
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

  return (
    <UserContext.Provider value={{ user, loginAdmin, status, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
}
