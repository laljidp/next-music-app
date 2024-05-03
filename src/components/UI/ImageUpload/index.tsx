import { uploadFileToFireStorage } from "@/services/firebase/storage.firebase";
import { CloseOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import PageSpinner from "../Spinner/PageSpinner";
import ImagePreviewLayout from "@/components/Layouts/ImagePreviewLayout";
import MediaSelectUploadModal from "@/components/MediaSelectUploadModal";

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
  const [showMediaModel, setShowMediaModal] = useState(false);

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
    // fileRef?.current?.click();
    // TODO: Open media library components
    setShowMediaModal(true);
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
      className={`flex h-[150px] w-[150px] items-center
       justify-center rounded-lg ring-1 hover:ring-violet-400 ${
         !image && "ring-slate-300"
       } ${className}`}
    >
      {/* view is in preview mode & no image set yet. */}
      {previewMode && !image && (
        <img
          aria-hidden={!previewMode && image}
          className="object-cover p-2"
          src="/no-image.png"
          alt="no image"
          height={80}
          width={80}
        />
      )}
      <div aria-hidden={!imgUploading} className="aria-hide opacity-60">
        <PageSpinner />
      </div>
      <div aria-hidden={!image} className="aria-hide relative py-2">
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
            items-center justify-center rounded-full bg-slate-500 text-sm font-medium
             text-white ring-1 hover:scale-125 aria-[hidden=true]:hidden
            "
        >
          <CloseOutlined className="hover:fill-violet-500" />
        </span>
      </div>
      <MediaSelectUploadModal
        isOpen={showMediaModel}
        onClose={() => setShowMediaModal(false)}
        onMediaSelect={(url) => {
          setImage(url);
          onChange(url);
        }}
      />
      {!image && !imgUploading && !previewMode && (
        <div className="flex flex-col items-center gap-2">
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
