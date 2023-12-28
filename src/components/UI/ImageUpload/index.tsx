import { uploadFileToFireStorage } from "@/services/firebase/storage.firebase";
import { CloseOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import PageSpinner from "../Spinner/PageSpinner";
import ImagePreviewLayout from "@/components/Layouts/ImagePreviewLayout";

interface ImageUploadProps {
  name: string;
  onChange: (url: string) => void;
  text?: string;
  src?: string;
  className?: string;
  previewMode?: boolean;
}

export default function ImageUpload({
  src,
  name,
  text = "Upload file",
  className = "",
  previewMode = false,
  onChange,
}: ImageUploadProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<string | null>(src || "");
  const [imgUploading, setImgUploading] = useState(false);

  const handleFileChange = async (event: any) => {
    if (event?.target?.files?.length > 0) {
      // TODO upload file to firebase storage
      setImgUploading(true);
      const file = event.target.files?.[0];
      const uploadedUrl = await uploadFileToFireStorage(file, "/artists");
      onChange(uploadedUrl);
      setImage(uploadedUrl);
      setImgUploading(false);
    }
  };

  const handleClick = () => {
    fileRef?.current?.click();
  };

  const handleClear = () => {
    setImage(null);
    onChange("");
  };

  useEffect(() => {
    if (src) {
      setImage(src);
    } else {
      setImage(null);
    }
  }, [src]);

  return (
    <div
      className={`flex items-center justify-center rounded-lg
       hover:ring-violet-400 h-[150px] w-[150px] ring-1 ${
         !image && "ring-slate-300"
       } ${className}`}
    >
      {/* view is in preview mode & no image set yet. */}
      {previewMode && !image && (
        <img
          aria-hidden={!previewMode && image}
          className="p-2 object-cover"
          src="/no-image.png"
          alt="no image"
          height={80}
          width={80}
        />
      )}
      <div aria-hidden={!imgUploading} className="opacity-60 aria-hide">
        <PageSpinner />
      </div>
      <div aria-hidden={!image} className="relative py-2 aria-hide">
        <ImagePreviewLayout
          height={100}
          width={100}
          src={image || ""}
          alt="image-upload"
        />
        <span
          onClick={handleClear}
          aria-hidden={previewMode}
          className="absolute right-[-10px] top-[-5px] flex h-5 w-5 cursor-pointer 
            items-center justify-center rounded-full text-sm text-white ring-1
             bg-slate-500 aria-[hidden=true]:hidden hover:scale-125 font-medium
            "
        >
          <CloseOutlined className="hover:fill-violet-500" />
        </span>
      </div>
      {!image && !imgUploading && !previewMode && (
        <div className="flex flex-col gap-2 items-center">
          <i>
            <CloudUploadOutlined className="[&>svg]:fill-violet-400 [&>svg]:text-4xl" />
          </i>
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
              accept="image/*"
              name={name}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
