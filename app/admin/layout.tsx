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
        className={cn(
          "slide-right-animation fixed left-0 top-0 h-full shadow-lg transition-all",
          leftBarClasses,
        )}
        id="left-sidebar"
      >
        <SidebarAdminLayout expand={expand} toggleExpand={toggleExpand} />
      </div>
      <div
        id="main"
        className={cn(
          "-z-10 h-screen w-screen bg-white p-6 shadow-md transition-all",
          rightMainClasses,
        )}
      >
        {children}
      </div>
    </>
  );
};

export default SharedAdminLayout;
