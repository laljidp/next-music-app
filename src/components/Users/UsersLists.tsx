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
import UserListItem from "./UserListItem";

export default function UsersLists() {
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
    },
  );
  return (
    <div className="flex flex-col items-center justify-center p-2">
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
      <div className="h-[calc(100vh-165px)] w-[100%] md:w-[90%] xl:w-[70%]">
        {!isLoading && !data?.length && (
          <div className="flex items-center justify-center p-5">
            No users found.
          </div>
        )}
        {isLoading ? (
          <div className="flex h-[350px] items-center justify-center">
            <PageSpinner />
          </div>
        ) : (
          <div
            className="scrollbar-thin group grid w-full items-start gap-2 overflow-auto  
            px-2 py-5 lg:grid-cols-1 xl:grid-cols-2"
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
