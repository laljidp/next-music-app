"use client";
import Image from "next/image";
import Spinner from "../UI/Spinner";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
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

    const payload = {
      email: data?.user?.email || "--",
    };

    const resp = await loginAdmin(payload);

    if (resp?.token) {
      localStorage.setItem(USER_TOKEN, resp?.token);
      setIsUserAdmin(true);
      router.push(PAGES.adminAlbums);
    } else {
      // TODO: handle unauthorized user
      setIsUserAdmin(false);
      setProcessLoading(false);
      console.log("Unauthorized user");
    }
  };

  const handleSignOut = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    logout();
  };

  const isLoading = status === "loading";

  const userNotAdmin = !isUserAdmin && loginStatus === "done";

  return (
    <div className="flex w-full items-center justify-center">
      <div
        className="z-10 flex w-full max-w-lg
        items-center justify-center rounded-xl border-solid border-emerald-500
        p-5 text-sm ring-1"
      >
        <div className="flex flex-col justify-center gap-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <Image
              alt="logo"
              src={"/next-streaming-512x512.png"}
              height={80}
              priority={true}
              width={80}
            />
            <p className="text-lg font-bold text-slate-600">Next Music</p>
          </div>
          {userNotAdmin && (
            <div className="flex justify-center">
              <span
                className="rounded-lg bg-violet-400 p-2 px-3 
            font-medium text-white shadow-md ring-2 ring-violet-400"
              >
                You are not Authorized to Access, Contact Administrator!
              </span>
            </div>
          )}
          {status === "authenticated" && (
            <div
              role="button"
              aria-disabled={processLoading}
              onClick={handleContinueLogin}
              className="relative z-10 flex items-center justify-between gap-4 rounded-md
           bg-violet-400 px-4 py-3 text-white ring-sky-400
           hover:ring-2 aria-disabled:select-none aria-disabled:opacity-10"
            >
              {processLoading && (
                <div className="z-50 h-full w-full">
                  <Spinner height={25} width={25} />
                  <span>Processing...</span>
                </div>
              )}
              {!processLoading && (
                <>
                  <div className="flex items-center gap-4">
                    <Image
                      alt="logo"
                      className="rounded-full ring-2 ring-white"
                      src={data?.user?.image || "/no-profile-image.png"}
                      height={50}
                      loading="lazy"
                      width={50}
                    />
                    <section className="flex flex-col">
                      <span className="font-bold">{data?.user?.name}</span>
                      <span>{data?.user?.email}</span>
                      <span className="text-xs after:ml-1 after:content-['>'] hover:underline">
                        Continue as user
                      </span>
                    </section>
                  </div>
                  <TWButton
                    onClick={handleSignOut}
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
    </div>
  );
}
