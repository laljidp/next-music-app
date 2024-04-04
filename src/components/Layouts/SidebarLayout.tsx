"use client";
import Image from "next/image";
import { useCallback } from "react";
import { PAGES } from "@/constants";
import { usePathname, useRouter } from "next/navigation";
import {
  ArtistsIcon,
  MusicAlbumsIcon,
  MusicIcon,
  PlaylistsIcon,
  StatsIcon,
} from "@/assets/svgs";
import { cn } from "@/utils/helper.util";
import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";
import UserDropdown from "../UserDropdown";

interface SidebarLayoutProps {
  expand: boolean;
  toggleExpand: () => void;
}

const SidebarAdminLayout: React.FC<SidebarLayoutProps> = ({
  expand,
  toggleExpand,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const isMenuActive = useCallback(
    (url: string) => {
      return pathname.includes(url) ? "active" : "non-active";
    },
    [pathname]
  );

  return (
    <div className="grid place-content-center align-middle">
      <div
        className={cn(
          `border-1 flex h-screen flex-col
        border-solid bg-white shadow-md ring-1 ring-violet-500`,
          expand ? " w-[210px]" : ""
        )}
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
        <button
          onClick={toggleExpand}
          className="w-[50px] my-[1rem] mx-auto rounded-full py-2 px-2 hover:bg-violet-100"
        >
          {expand ? (
            <DoubleLeftOutlined className="text-2xl" />
          ) : (
            <DoubleRightOutlined className="text-2xl" />
          )}
        </button>
        <div className="flex justify-between flex-col h-full">
          <div className="mt-5 w-full flex justify-center">
            <ul>
              {LEFT_MENUS.map(({ Icon, ...menu }) => (
                <li
                  aria-description={isMenuActive(menu.url)}
                  onClick={() => router.push(menu.url)}
                  className={cn(
                    `cursor-pointer flex items-center justify-center
                     rounded-full border-b-0 border-violet-500 py-3
                     hover:bg-violet-100 aria-[description=active]:bg-violet-300
                     mb-4`,
                    expand ? "px-5" : "px-3"
                  )}
                  key={menu.name}
                >
                  {!expand && Icon}
                  {expand && (
                    <div className="flex gap-5 items-center">
                      {Icon}
                      {expand && menu.title}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-3">
            <UserDropdown />
          </div>
        </div>
      </div>
    </div>
  );
};

const LEFT_MENUS = [
  {
    name: "stats",
    title: "Stats",
    url: PAGES.adminStats,
    Icon: <Image alt="songs" className="h-6 w-6" src={StatsIcon} priority />,
  },
  {
    name: "songs",
    title: "Songs",
    url: PAGES.adminSongs,
    Icon: <Image alt="songs" className="h-6 w-6" src={MusicIcon} priority />,
  },
  {
    name: "albums",
    title: "Albums",
    url: PAGES.adminAlbums,
    Icon: (
      <Image alt="songs" className="h-6 w-6" src={MusicAlbumsIcon} priority />
    ),
  },
  {
    name: "artists",
    title: "Artists",
    url: PAGES.adminArtists,
    Icon: <Image alt="songs" className="h-6 w-6" src={ArtistsIcon} priority />,
  },
  {
    name: "playlists",
    title: "Playlists",
    url: PAGES.adminPlaylists,
    Icon: (
      <Image alt="songs" className="h-6 w-6" src={PlaylistsIcon} priority />
    ),
  },
];

export default SidebarAdminLayout;
