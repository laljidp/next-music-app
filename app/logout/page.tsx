"use client";
import RootPageLoader from "../loading";
import { useContext, useEffect } from "react";
import { SnackContext } from "@/context/snack.context";
import { UserContext } from "@/context/user.context";

export default function Logout() {
  const { showSnack } = useContext(SnackContext);
  const { logout } = useContext(UserContext);

  const handleLogout = async () => {
    showSnack("Logging out..", "info");
    setTimeout(async () => {
      await logout();
      window.location.replace("/");
    }, 1500);
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return (
    <section className="h-[80vh] items-center flex justify-center w-full">
      <div className="flex flex-col gap-4 font-sm">
        <RootPageLoader />
        <span>Signing out..</span>
      </div>
    </section>
  );
}
