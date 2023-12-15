"use client";
import SidebarAdminLayout from "@/components/Layouts/sidebar.layout";
import { useContext } from "react";
import { UserContext } from "@/context/user.context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SharedAdminLayoutI {
  children: React.ReactNode;
}

const SharedAdminLayout: React.FC<SharedAdminLayoutI> = ({ children }) => {
  const { data } = useSession();
  const { logout } = useContext(UserContext);
  const router = useRouter();

  return (
    <>
      <div className="flex text-black" id="left-sidebar">
        <SidebarAdminLayout />
      </div>
      <div id="main" className="w-[calc(100%-250px)] p-6 rounded-md m-8">
        {children}
      </div>
    </>
  );
};

export default SharedAdminLayout;
