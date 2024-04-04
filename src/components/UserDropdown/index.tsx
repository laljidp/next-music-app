"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { TWButton } from "../UI/Button";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import { cn } from "@/utils/helper.util";
import { UserSwitchOutlined } from "@ant-design/icons";

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
      <div className="flex justify-center items-center">
        <div className="relative">
          <Image
            role="button"
            onClick={() => setShowMenu(true)}
            src={data?.user?.image || "/no-profile-image.png"}
            alt="user-pic"
            loading="lazy"
            height={40}
            className="my-auto h-12 w-12 rounded-full ring-1 hover:scale-105"
            width={40}
          />
          <div
            ref={sectionRef}
            className={cn(
              `absolute left-[60px] bottom-4 bg-white h-[200px] animation-scale-up-tl w-[280px]
               ring-2 ring-violet-400 rounded-lg shadow-lg slide-right-animation`,
              showMenu ? "visibility" : "hidden"
            )}
          >
            <div className="arrow-left flex-col flex justify-between p-3 h-full">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold">{data?.user?.name}</h3>
                <small>{data?.user?.email}</small>
                <hr />
                <div
                  onClick={() => {
                    router.push("/admin/users");
                    setShowMenu(false);
                  }}
                  role="button"
                  className="flex items-center gap-2 cursor-pointer bg-violet-50
                 hover:bg-violet-100 py-1 px-2 rounded-md"
                >
                  <UserSwitchOutlined />
                  <span> Users</span>
                </div>
              </div>
              <TWButton
                className="h-7 mt-2 mx-auto w-fit px-3 hover:scale-105"
                variant="outline"
                onClick={logout}
              >
                Logout
              </TWButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
