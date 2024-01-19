"use client";

import { TWButton } from "@/components/UI/Button";
import TWInput from "@/components/UI/Input";
import PageSpinner from "@/components/UI/Spinner/PageSpinner";
import { SnackContext } from "@/context/snack.context";
import { FetchUsersParamsT } from "@/services/db/functions/users.functions";
import userRequests from "@/services/request/users.request";
import { IUserShortDto } from "@/services/types/users.types";
import useDebounce from "@/utils/useDebouce";
import { SearchOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useContext, useState } from "react";
import useSWR from "swr";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 1000);
  const [processing, setProcessing] = useState(false);
  const { showSnack } = useContext(SnackContext);
  const {
    isLoading,
    data,
    mutate: refreshUsers,
  } = useSWR<IUserShortDto[], FetchUsersParamsT>(
    { page: 0, batch: 20, searchText: debounceSearch },
    userRequests.getUsers,
    {
      revalidateOnFocus: false,
      fallbackData: [],
    }
  );

  const handleSwitchToAdmin = async (userId: string) => {
    setProcessing(true);
    try {
      const data = await userRequests.switchUserRole(userId);
      console.log("Data", data);
      if (data && data.status) {
        showSnack("Switched user role to Admin.", "success");
        refreshUsers();
      }
      // TODO: Call api to switch user to admin
    } catch (err) {
      console.log("ERROR handle switching admin::", err);
      showSnack("Failed to switch role. Please try again later.", "error");
    } finally {
      setProcessing(false);
    }
    console.log("Handle switch to login.");
  };

  return (
    <div className="p-2 flex flex-col justify-center items-center">
      <div className="w-[100%] md:w-[90%] xl:w-[70%]">
        <TWInput
          placeholder="Search Users"
          className=""
          onChange={({ currentTarget }) => setSearch(currentTarget.value)}
          value={search}
          name="search"
          icon={<SearchOutlined />}
        />
      </div>
      <div className="w-[100%] md:w-[90%] xl:w-[70%] h-[calc(100vh-165px)]">
        {!isLoading && !data?.length && <div>No users found.</div>}
        {isLoading ? (
          <div className="h-[350px] flex justify-center items-center">
            <PageSpinner />
          </div>
        ) : (
          <div
            className="py-5 px-2 gap-2 grid xl:grid-cols-2 lg:grid-cols-1 w-full  
            items-start overflow-auto scrollbar-thin group"
          >
            {data?.map((user) => (
              <div className="bg-violet-100 p-3 flex gap-2 rounded-xl ml-1 justify-between shadow-md relative">
                <div className="flex gap-3">
                  <div className="grow flex gap-2">
                    <Image
                      src={user.picture}
                      height={45}
                      width={45}
                      alt="user_profile"
                      className="rounded-full"
                    />
                    <div className="text-sm flex flex-col gap-0.5">
                      <span className="capitalize">{user.name}</span>
                      <span className="text-xs">{user.email}</span>
                    </div>
                  </div>
                </div>
                <div
                  aria-role={user?.role?.toLowerCase()}
                  className="capitalize text-xs font-medium
                      absolute bottom-2 right-4
                      aria-[role=admin]:text-violet-500
                      aria-[role=user]:text-pink-500"
                >
                  {user.role === "admin" ? (
                    "Admin"
                  ) : (
                    <TWButton
                      loading={processing}
                      className="group-hover:visible py-1 px-2 text-xs"
                      onClick={() => handleSwitchToAdmin(user._id)}
                    >
                      Switch to Admin
                    </TWButton>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
