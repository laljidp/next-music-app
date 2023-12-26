import React, { useEffect, useRef, useState } from "react";
import { CloseCircleOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { uploadFileToFireStorage } from "@/services/firebase/storage.firebase";
import PageSpinner from "../UI/Spinner/PageSpinner";
import IconView from "../Layouts/IconView.layout";
import { ISongsMetadata } from "@/services/types/songs.types";

interface SongUploadControlProps {
  source?: string;
  onFileUpload?: (file_url: string, metadata: ISongsMetadata) => void;
  labelText?: string;
  error?: boolean;
  errorText?: string;
  height?: number;
  className?: string;
  onDurationChange?: (duration: number) => void;
}

export default function SongUploadControl(props: SongUploadControlProps) {
  const {
    labelText = "Upload Song",
    className = "",
    onFileUpload = () => {},
    source,
    error = false,
    onDurationChange = () => {},
    errorText,
    height = 60,
  } = props;
  const [songSource, setSongSource] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { files } = event.currentTarget;
    if (files && files.length) {
      const [file] = files;
      setIsUploading(true);
      const metadata: ISongsMetadata = {
        kind: file.type,
        size: file.size,
        name: file.name,
        bitRate: 256,
      };

      try {
        const source = await uploadFileToFireStorage(file, "/songs");
        onFileUpload(source, metadata);
        setSongSource(source);
      } catch (err) {
        console.log("Error uploading songs::", err);
      } finally {
        setIsUploading(false);
      }
      // TODO: Upload a file to fireStore /songs and callback with url
    }
  };

  const openFileExplorer = () => {
    fileRef?.current?.click();
  };

  const handleClear = () => {
    setSongSource(null);
  };

  useEffect(() => {
    if (source) {
      setSongSource(source);
    }
  }, [source]);

  return (
    <>
      <div
        role="button"
        aria-invalid={error}
        id="song-upload-container"
        className={`ring-1 ring-slate-300 px-3 py-2 rounded-lg
        h-[${height}px] flex items-center justify-center hover:ring-violet-68
        aria-[invalid=true]:ring-red-400 relative ${className}`}
      >
        <div aria-hidden={!isUploading} className="opacity-60 aria-hide">
          <PageSpinner />
        </div>
        <div
          aria-hidden={!!songSource || isUploading}
          className="flex flex-col gap-1 aria-hide"
        >
          <div
            onClick={openFileExplorer}
            className="ring-1 ring-violet-400 rounded-full flex items-center gap-1
            px-3 py-1 text-xs hover:bg-violet-400 hover:text-white"
          >
            <CloudUploadOutlined className="[&>svg]:fill-violet-500 [&>svg]:text-md" />
            <span>{labelText}</span>
          </div>
          <span className=" text-[10px] ml-2">mp3, aac, wav, ogg</span>
        </div>
        {songSource && (
          <div className="w-[75%] relative [audio::-webkit-media-controls-panel]:bg-violet-400">
            <audio
              onDurationChange={({ currentTarget }) =>
                onDurationChange(currentTarget.duration)
              }
              controls
              autoPlay={false}
              className=""
            >
              <source src={songSource} />
            </audio>
            <i
              className="absolute right-[-10px] top-[-20px] hover:scale-125"
              role="button"
              onClick={handleClear}
            >
              <IconView
                Icon={CloseCircleOutlined}
                size="md"
                fill="fill-slate-400"
              />
            </i>
          </div>
        )}
        <span
          aria-hidden={!errorText && !error}
          className="text-red-400 text-xs absolute left-1 bottom-[-20px]"
        >
          {errorText}
        </span>
      </div>
      {!songSource && (
        <input
          type="file"
          accept="audio/*"
          name="songs-"
          className="hidden"
          onChange={handleFileChange}
          ref={fileRef}
        />
      )}
    </>
  );
}
