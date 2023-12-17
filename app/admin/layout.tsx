"use client";
import SidebarAdminLayout from "@/components/Layouts/sidebar.layout";

interface SharedAdminLayoutI {
  children: React.ReactNode;
}

const SharedAdminLayout: React.FC<SharedAdminLayoutI> = ({ children }) => {
  return (
    <>
      <div className="flex text-black" id="left-sidebar">
        <SidebarAdminLayout />
      </div>
      <div
        id="main"
        className="m-8 w-[calc(100%-250px)] rounded-xl bg-white
         p-6 shadow-md ring-1 ring-violet-400"
      >
        {children}
      </div>
    </>
  );
};

export default SharedAdminLayout;
