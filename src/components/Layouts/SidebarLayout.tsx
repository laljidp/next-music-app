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
    [pathname],
  );

  return (
    <div className="grid place-content-center align-middle">
      <div
        className={cn(
          `border-1 flex h-screen flex-col
        border-solid bg-white shadow-md ring-1 ring-violet-500`,
          expand ? " w-[210px]" : "",
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
          className="mx-auto my-[1rem] w-[45px] rounded-full px-2 py-2 hover:bg-violet-100"
        >
          {expand ? (
            <DoubleLeftOutlined className="text-xl" />
          ) : (
            <DoubleRightOutlined className="text-xl" />
          )}
        </button>
        <div className="flex h-full flex-col justify-between">
          <div className="mt-5 flex w-full justify-center">
            <ul>
              {LEFT_MENUS.map(({ Icon, ...menu }) => (
                <li
                  aria-description={isMenuActive(menu.url)}
                  onClick={() => router.push(menu.url)}
                  className={cn(
                    `mb-4 flex cursor-pointer items-center
                     justify-center rounded-full border-b-0 border-violet-500
                     py-3 hover:bg-violet-100
                     aria-[description=active]:bg-violet-300`,
                    expand ? "px-5" : "px-3",
                  )}
                  key={menu.name}
                >
                  <div className="flex items-center gap-5">
                    {Icon}
                    {expand && <span>{menu.title}</span>}
                  </div>
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
