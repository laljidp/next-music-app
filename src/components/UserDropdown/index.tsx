"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import { cn } from "@/utils/helper.util";
import { LogoutOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { PAGES } from "@/constants";

export default function UserDropdown() {
  const { data } = useSession();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const sectionRef = useRef(null);

  useClickOutside(sectionRef, () => {
    setShowMenu(false);
  });

  const logout = () => {
    router.push("/logout");
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="relative">
          <Image
            role="button"
            onClick={() => setShowMenu(true)}
            src={data?.user?.image || "/no-profile-image.png"}
            alt="user-pic"
            loading="lazy"
            height={40}
            className="my-auto h-10 w-10 rounded-full ring-1 ring-violet-500 transition-all hover:scale-105"
            width={40}
          />
          <div
            ref={sectionRef}
            className={cn(
              `animation-scale-up-tl slide-right-animation absolute bottom-4 left-[55px] h-[200px] w-[280px]
               rounded-lg bg-white shadow-xl ring-1 ring-violet-400`,
              showMenu ? "visibility" : "hidden",
            )}
          >
            <div className="arrow-left flex h-full flex-col justify-between p-3">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold">{data?.user?.name}</h3>
                <small>{data?.user?.email}</small>
                <hr />
                <div
                  onClick={() => {
                    router.push(PAGES.adminUsers);
                    setShowMenu(false);
                  }}
                  role="button"
                  className="flex cursor-pointer items-center gap-2 rounded-md
                 bg-violet-50 px-2 py-1 text-sm font-medium hover:bg-violet-100"
                >
                  <UserSwitchOutlined />
                  <span> Users</span>
                </div>
              </div>
              <div
                onClick={logout}
                role="button"
                className="flex cursor-pointer items-center gap-2 rounded-md
                 bg-violet-100 px-3 py-2 text-sm font-medium hover:bg-violet-500 hover:text-white"
              >
                <LogoutOutlined />
                Logout
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
