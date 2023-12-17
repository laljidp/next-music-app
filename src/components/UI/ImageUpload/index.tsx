import {
  CloseCircleFilled,
  CloseCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface ImageUploadProps {
  file?: File;
  name: string;
  onChange: (file: File | null) => void;
  text?: string;
}

export default function ImageUpload({
  file,
  name,
  text = "Upload file",
  onChange,
}: ImageUploadProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const handleFileChange = (event: any) => {
    console.log(event, "event..");
    if (event?.target?.files?.length > 0) {
      const file = event.target.files?.[0];
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      onChange(file);
    }
  };

  const handleClick = () => {
    fileRef?.current?.click();
  };

  const handleClear = () => {
    setImage(null);
  };

  const isPreviewing = !!image;

  return (
    <div
      className={`flex items-center justify-center rounded-lg hover:ring-violet-400 ${
        isPreviewing
          ? "h-[100px] w-[100px]"
          : "h-20 w-[150px] ring-1 ring-slate-300"
      }`}
    >
      {isPreviewing && (
        <div className="relative">
          <img src={image} className="h-20 object-cover" alt="me-img" />
          <span
            onClick={handleClear}
            className="absolute right-[-10px] top-[-10px] flex h-5 w-5 cursor-pointer 
            items-center justify-center rounded-full text-sm text-white ring-1 bg-violet-400
            "
          >
            <CloseOutlined className="hover:fill-violet-500" />
          </span>
        </div>
      )}
      {!isPreviewing && (
        <div
          onClick={handleClick}
          role="button"
          className="flex items-center rounded-xl px-4 py-1 text-center text-xs ring-1
          ring-violet-400 hover:cursor-pointer hover:bg-violet-400 hover:text-white"
        >
          <span>{text}</span>
          <input
            ref={fileRef}
            type="file"
            name={name}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}
