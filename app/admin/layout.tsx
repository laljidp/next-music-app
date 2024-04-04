"use client";
import SidebarAdminLayout from "@/components/Layouts/SidebarLayout";
import { cn } from "@/utils/helper.util";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SharedAdminLayoutI {
  children: React.ReactNode;
}

const SharedAdminLayout: React.FC<SharedAdminLayoutI> = ({ children }) => {
  const { status } = useSession();
  const [expand, setExpand] = useState(false);
  const router = useRouter();

  const handleAuthFlow = () => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  };

  const toggleExpand = () => setExpand(!expand);

  useEffect(() => {
    handleAuthFlow();
  }, [status]);

  const leftBarClasses = expand ? "w-[210px]" : "w-[75px]";
  const rightMainClasses = expand ? "ml-[210px]" : "ml-[70px]";

  return (
    <>
      <div
        className={cn("fixed top-0 left-0 h-full", leftBarClasses)}
        id="left-sidebar"
      >
        <SidebarAdminLayout expand={expand} toggleExpand={toggleExpand} />
      </div>
      <div
        id="main"
        className={cn(
          "bg-white p-6 shadow-md h-screen w-screen -z-10",
          rightMainClasses
        )}
      >
        {children}
      </div>
    </>
  );
};

export default SharedAdminLayout;
