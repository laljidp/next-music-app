import { pageLoaderSvg } from "@/utils/svgs.utils";

export default function PageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[320px]">
      {pageLoaderSvg}
    </div>
  );
}
