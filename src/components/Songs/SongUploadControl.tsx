import React, { useEffect, useRef, useState } from "react";
import {
  CloseCircleOutlined,
  CloudUploadOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { uploadFileToFireStorage } from "@/services/firebase/storage.firebase";
import PageSpinner from "../UI/Spinner/PageSpinner";
import IconView from "../Layouts/IconViewLayout";
import { ISongsMetadata } from "@/services/types/songs.types";
import { SONGS_UPLOAD_PATH } from "@/services/db/constants/db.constants";

interface SongUploadControlProps {
  source?: string;
  onFileUpload?: (file_url: string, metadata: ISongsMetadata) => void;
  labelText?: string;
  error?: boolean;
  errorText?: string;
  height?: number;
  readOnly?: boolean;
  className?: string;
  onDurationChange?: (duration: number) => void;
}

export default function SongUploadControl(props: SongUploadControlProps) {
  const {
    labelText = "Upload Song",
    className = "",
    readOnly = false,
    onFileUpload = () => {},
    source,
    error = false,
    onDurationChange = () => {},
    errorText,
    height = 60,
  } = props;
  const [songSource, setSongSource] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loadSong, setLoadSong] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
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
        const source = await uploadFileToFireStorage(file, SONGS_UPLOAD_PATH);
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
      setLoadSong(false);
    } else {
      setSongSource(null);
    }
  }, [source]);

  return (
    <>
      <div
        role="button"
        aria-invalid={error}
        id="song-upload-container"
        className={`rounded-lg px-3 py-2 ring-1 ring-slate-300
        h-[${height}px] hover:ring-violet-68 relative flex items-center
        justify-center aria-[invalid=true]:ring-red-400 ${className}`}
      >
        <div aria-hidden={!isUploading} className="aria-hide opacity-60">
          <PageSpinner />
        </div>
        <div
          aria-hidden={!!songSource || isUploading}
          className="aria-hide flex flex-col gap-1"
        >
          <div
            onClick={openFileExplorer}
            className="flex items-center gap-1 rounded-full px-3 py-1
            text-xs ring-1 ring-violet-400 hover:bg-violet-400 hover:text-white"
          >
            <CloudUploadOutlined className="[&>svg]:text-md [&>svg]:fill-violet-600" />
            <span>{labelText}</span>
          </div>
          <span className=" ml-2 text-[10px]">mp3, aac, wav, ogg</span>
        </div>
        <div
          className="aria-hide"
          aria-hidden={loadSong || !source}
          onClick={() => setLoadSong(true)}
          role="button"
        >
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 hover:bg-violet-200">
            <IconView Icon={PlayCircleOutlined} fill="fill-violet-400" />{" "}
            <span className="text-sm">Load song</span>
          </div>
        </div>
        {songSource && loadSong && (
          <div className="[audio::-webkit-media-controls-panel]:bg-violet-400 relative w-[100%]">
            <audio
              onDurationChange={({ currentTarget }) =>
                onDurationChange(currentTarget.duration)
              }
              controls
              className="w-full"
              autoPlay={false}
            >
              <source src={songSource} />
            </audio>
            {/* <SongPlayer src={songSource} /> */}
            <i
              aria-hidden={readOnly}
              className="aria-hide absolute right-[-10px] top-[-20px] hover:scale-125"
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
          className="absolute bottom-[-20px] left-1 text-xs text-red-400"
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
