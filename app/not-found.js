"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Error404() {
  const router = useRouter();

  const backToMain = () => {
    router.push("/");
  };

  return (
    <div className="h-[80vh] items-center justify-center flex w-full flex-col gap-4">
      <Image
        alt="logoImage"
        className="rounded-xl"
        src={"/next-streaming-512x512.png"}
        width={50}
        priority
        height={50}
      />
      <div className="[line-height:4]">
        <span className="text-xl">404</span> |
        <span className="text-slate-500"> Not found</span>
        <button onClick={backToMain} className="btn btn-primary mt-2">
          Back to Main
        </button>
      </div>
    </div>
  );
}
