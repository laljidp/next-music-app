import { useContext } from "react";
import { TWButton } from "../UI/Button";
import { UserContext } from "@/context/user.context";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { LEFT_MENUS } from "@/constants";

export default function LeftMenus() {
  const { data } = useSession();
  return (
    <div className="h-full w-full place-content-center grid">
      <div
        className="border-1 border-solid h-[500px] w-[250px] 
        rounded-xl bg-white
        flex flex-col ring-1 ring-violet-500"
        id="left-sidebar"
      >
        <div className="flex align-center my-3 mx-2 justify-center">
          <Image
            src={"/next-streaming-512x512.png"}
            alt="logo"
            className="ring-1 rounded-lg text-center"
            width={60}
            height={60}
          />
        </div>
        <hr className="my-4 border-violet-500" />
        <div className="flex justify-center">
          <Image
            src={data?.user?.image || "/"}
            alt="user-pic"
            loading="lazy"
            height={40}
            className="ring-1 h-12 w-12 rounded-full mr-3"
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
                role="button"
                className="hover:bg-violet-100 border-b-0 mx-7 border-violet-500 py-3 cursor-pointer rounded-full"
                key={menu.name}
              >
                {menu.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex justify-center">
        <TWButton className="h-7 mt-2 w-fit px-3" variant="outline">
          Logout
        </TWButton>
      </div>
    </div>
  );
}
