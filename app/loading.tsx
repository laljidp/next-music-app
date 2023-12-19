import { pageLoaderSvg } from "@/utils/svgs.utils";
import React from "react";

export default function RootPageLoader() {
  return (
    <div className="flex justify-center items-center vh-full w-full">
      <div className="text-sky-400">{pageLoaderSvg}</div>
    </div>
  );
}
