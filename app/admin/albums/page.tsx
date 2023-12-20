"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import MainRightLayout from "@/components/Layouts/MainRightLayout";
import TWInput from "@/components/UI/Input";
import useDebounce from "@/utils/useDebouce";
import PageSpinner from "@/components/UI/Spinner/PageSpinner";
import AlbumLists from "@/components/AlbumLists";
import { SearchOutlined } from "@ant-design/icons";

export default function AlbumPage() {
  const { data, status } = useSession();

  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 1000);

  const handleSearchTextChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearchText(value);
  };

  return (
    <MainRightLayout>
      <MainRightLayout.Left>
        <div className="rounded-md text-center gap-3">
          <TWInput
            placeholder="Search albums"
            name="search"
            className=""
            onChange={handleSearchTextChange}
            value={searchText}
            id="art-input"
            icon={
              <SearchOutlined className="[&>svg]:fill-slate-400 hover:[&>svg]:fill-violet-400" />
            }
          />
        </div>
        <div
          className="overflow-auto scrollbar-hide h-[calc(100vh-200px)]
         shadow-lg rounded-xl animation-scale-up-tl"
        >
          {searchText ? (
            <div className="flex items-center justify-center h-full">
              <PageSpinner />
            </div>
          ) : (
            <AlbumLists />
          )}
        </div>
      </MainRightLayout.Left>
      <MainRightLayout.Separator />
      <MainRightLayout.Right>
        <div>Right layout</div>
      </MainRightLayout.Right>
    </MainRightLayout>
  );
}
