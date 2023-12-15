"use client";
import Image from "next/image";
import Spinner from "../UI/Spinner";
import { useRouter } from "next/navigation";
import { signIn, useSession, signOut } from "next-auth/react";
import { useContext, useState } from "react";
import { TWButton } from "../UI/Button";
import { UserContext } from "@/context/user.context";
import { PAGES, USER_TOKEN } from "@/constants";
import { googleIcon } from "@/utils/svgs.utils";

export default function LoginPage() {
  const router = useRouter();

  const { data, status } = useSession();
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [processLoading, setProcessLoading] = useState(false);
  const { loginAdmin, status: loginStatus, logout } = useContext(UserContext);

  const handleContinueLogin = async () => {
    setProcessLoading(true);
    console.log("Handle Login");

    const payload = {
      email: data?.user?.email || "--",
    };

    const resp = await loginAdmin(payload);

    if (resp.isAdmin && resp?.token) {
      localStorage.setItem(USER_TOKEN, resp?.token);
      setProcessLoading(false);
      setIsUserAdmin(true);
      router.push(PAGES.adminAlbums);
    } else {
      // TODO: handle unauthorized user
      setIsUserAdmin(false);
      console.log("Unauthorized user");
    }
    setProcessLoading(false);
  };

  const handleSignout = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    logout();
  };

  const isLoading = status === "loading";

  const userNotAdmin = !isUserAdmin && loginStatus === "done";

  return (
    <div
      className="z-10 w-full items-center justify-center
        text-sm lg:flex border-solid border-emerald-500 ring-1
        p-5 rounded-xl md:max-w-md lg:max-w-lg"
    >
      <div className="flex flex-col justify-center gap-4">
        <div className="flex items-center justify-center flex-col gap-2">
          <Image
            alt="logo"
            src={"/next-streaming-512x512.png"}
            height={80}
            priority={true}
            width={80}
          />
          <p className="text-lg text-slate-600 font-bold">Next Music</p>
        </div>
        {userNotAdmin && (
          <div className="flex justify-center">
            <span className="font-medium text-white p-2 bg-violet-400 rounded-lg px-3 ring-2 ring-violet-400 shadow-md">
              You are not Authorized to Access, Contact Administrator!
            </span>
          </div>
        )}
        {status === "authenticated" && (
          <div
            role="button"
            aria-disabled={processLoading}
            onClick={handleContinueLogin}
            className="px-4 py-3 bg-violet-400 rounded-md flex items-center z-10
           justify-between text-white ring-sky-400 gap-4 relative
           aria-disabled:select-none aria-disabled:opacity-10 hover:ring-2"
          >
            {processLoading && (
              <div className="h-full w-full z-50">
                <Spinner height={25} width={25} />
                <span>Processing...</span>
              </div>
            )}
            {!processLoading && (
              <>
                <div className="flex items-center gap-4">
                  <img
                    alt="logo"
                    className="rounded-full ring-2 ring-white"
                    src={data?.user?.image || ""}
                    height={50}
                    width={50}
                  />
                  <section className="flex flex-col">
                    <span className="font-bold">{data?.user?.name}</span>
                    <span>{data?.user?.email}</span>
                    <span className="text-xs after:content-['>'] after:ml-1 hover:underline">
                      Continue as Admin
                    </span>
                  </section>
                </div>
                <TWButton
                  onClick={handleSignout}
                  variant="secondary"
                  className="h-7"
                >
                  Sign out
                </TWButton>
              </>
            )}
          </div>
        )}
        {status !== "authenticated" && (
          <div>
            <TWButton
              loading={isLoading}
              onClick={() => signIn()}
              className="btn btn-primary"
            >
              <i className="h-5 w-5">{googleIcon}</i>
              Sign in with Google
            </TWButton>
          </div>
        )}
      </div>
    </div>
  );
}
