"use client";
import SidebarAdminLayout from "@/components/Layouts/sidebar.layout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface SharedAdminLayoutI {
  children: React.ReactNode;
}

const SharedAdminLayout: React.FC<SharedAdminLayoutI> = ({ children }) => {
  const { status } = useSession();
  const router = useRouter();

  const handleAuthFlow = () => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  };

  useEffect(() => {
    handleAuthFlow();
  }, [status]);

  return (
    <>
      <div
        className="flex text-black fixed top-[45%] bottom-[50%] translate-y-[-50%] w-[320px]"
        id="left-sidebar"
      >
        <SidebarAdminLayout />
      </div>
      <div
        id="main"
        className="m-8 ml-[300px] rounded-xl bg-white w-full
         p-6 shadow-md ring-1 ring-violet-400"
      >
        {children}
      </div>
    </>
  );
};

export default SharedAdminLayout;
