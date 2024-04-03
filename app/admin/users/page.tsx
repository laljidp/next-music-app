"use client";
import useSWR from "swr";
import useDebounce from "@/hooks/useDebouce";
import TWInput from "@/components/UI/Input";
import PageSpinner from "@/components/UI/Spinner/PageSpinner";
import userRequests from "@/services/request/users.request";
import { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { FetchUsersParamsT } from "@/services/db/functions/users.functions";
import { IUserShortDto } from "@/services/types/users.types";
import dynamic from "next/dynamic";

const UserListItem = dynamic(() => import("@/components/Users/UserListItem"), {
  ssr: false,
});

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 1000);
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
        {!isLoading && !data?.length && (
          <div className="p-5 flex items-center justify-center">
            No users found.
          </div>
        )}
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
              <UserListItem
                user={user}
                key={user._id}
                onRefreshUsers={refreshUsers}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
