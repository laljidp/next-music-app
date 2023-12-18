import { uploadFileToFireStorage } from "@/services/firebase/storage.firebase";
import { CloseOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useRef, useState } from "react";
import PageSpinner from "../Spinner/PageSpinner";

interface ImageUploadProps {
  file?: File;
  name: string;
  onChange: (url: string | null) => void;
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
  const [imgUploading, setImgUploading] = useState(false);

  const handleFileChange = async (event: any) => {
    if (event?.target?.files?.length > 0) {
      // TODO upload file to firebase storage
      setImgUploading(true);
      const file = event.target.files?.[0];
      const imageUrl = URL.createObjectURL(file);
      const uploadedUrl = await uploadFileToFireStorage(file, "/artists");
      console.log("uploadedUrl", uploadedUrl);
      setImage(uploadedUrl);
      onChange(uploadedUrl);
      setImgUploading(false);
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
      {imgUploading && (
        <div className="opacity-60">
          <PageSpinner />
        </div>
      )}
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
      {!isPreviewing && !imgUploading && (
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
