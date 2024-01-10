"use client";
import Image from "next/image";
import { useCallback } from "react";
import { TWButton } from "@/components/UI/Button";
import { useSession } from "next-auth/react";
import { LEFT_MENUS } from "@/constants";
import { usePathname, useRouter } from "next/navigation";

const SidebarAdminLayout: React.FC = () => {
  const { data } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    router.push("/logout");
  };

  const isMenuActive = useCallback(
    (url: string) => {
      return pathname.includes(url) ? "active" : "non-active";
    },
    [pathname]
  );

  return (
    <div className="grid place-content-center">
      <div
        className="border-1 flex h-[510px] w-[250px] flex-col rounded-xl 
        border-solid bg-white shadow-md ring-1 ring-violet-500"
        id="left-sidebar"
      >
        <div className="align-center mx-2 my-3 flex justify-center">
          <Image
            src={"/next-streaming-512x512.png"}
            alt="logo"
            className="rounded-lg text-center ring-1"
            width={60}
            height={60}
            priority
          />
        </div>
        <hr className="mb-4 border-violet-500" />
        <div className="flex justify-center">
          <Image
            src={data?.user?.image || "/no-profile-image.png"}
            alt="user-pic"
            loading="lazy"
            height={40}
            className="mr-3 h-12 w-12 rounded-full ring-1"
            width={40}
          />
          <div className="flex flex-col place-content-center">
            <h3 className="text-sm">Hello, {data?.user?.name}</h3>
            <small>{data?.user?.email?.split("@")[0]}</small>
          </div>
          <hr />
        </div>
        <div className="mt-5 w-full text-center">
          <ul className="">
            {LEFT_MENUS.map((menu) => (
              <li
                aria-description={isMenuActive(menu.url)}
                onClick={() => router.push(menu.url)}
                className="mx-7 mb-2 cursor-pointer
                     rounded-full border-b-0 border-violet-500 py-3
                      hover:bg-violet-100 aria-[description=active]:bg-violet-400
                       aria-[description=active]:text-white"
                key={menu.name}
              >
                {menu.title}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center">
          <TWButton
            className="h-7 mt-2 w-fit px-3 hover:scale-105"
            variant="outline"
            onClick={logout}
          >
            Logout
          </TWButton>
        </div>
      </div>
    </div>
  );
};

export default SidebarAdminLayout;
