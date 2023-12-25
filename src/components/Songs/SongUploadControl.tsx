import { useEffect, useRef, useState } from "react";
import { TWButton } from "../UI/Button";
import { CloudUploadOutlined, UploadOutlined } from "@ant-design/icons";
import { uploadFileToFireStorage } from "@/services/firebase/storage.firebase";
import PageSpinner from "../UI/Spinner/PageSpinner";

interface SongUploadControlProps {
  source?: string;
  onFileUpload?: (
    file_url: string,
    metadata?: Record<string, string | number>
  ) => void;
  labelText?: string;
  error?: boolean;
  errorText?: string;
  height?: number;
}

export default function SongUploadControl(props: SongUploadControlProps) {
  const {
    labelText = "Upload Song",
    onFileUpload = () => {},
    source,
    error = false,
    errorText,
    height = 65,
  } = props;
  const [songSource, setSongSource] = useState(source);
  const [isUploading, setIsUploading] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { files } = event.currentTarget;
    if (files && files.length) {
      console.log("file==>", files);
      const [file] = files;
      setIsUploading(true);
      // TODO: Upload a file to firestore /songs and callback with url
      const source = await uploadFileToFireStorage(file, "/songs");
      onFileUpload(source);
      setSongSource(source);
      setSongSource(source);
      setIsUploading(false);
    }
  };

  const openFileExplorer = () => {
    fileRef?.current?.click();
  };

  useEffect(() => {
    if (source) {
      setSongSource(source);
    }
  }, [source]);

  console.log({ source });

  return (
    <>
      <div
        role="button"
        aria-invalid={error}
        id="song-upload-container"
        className={`ring-1 ring-slate-300 px-3 py-2 rounded-lg min-h-[55px]
        h-[${height}px] flex items-center justify-center hover:ring-violet-400 aria-[invalid=true]:ring-red-400`}
      >
        <div aria-hidden={!isUploading} className="opacity-60 aria-hide">
          <PageSpinner />
        </div>
        <div
          aria-hidden={!!songSource || isUploading}
          className="flex flex-col gap-2 aria-hide"
        >
          <div
            onClick={openFileExplorer}
            className="ring-1 ring-violet-400 rounded-full flex items-center gap-2
            px-3 py-1 text-xs hover:bg-violet-400 hover:text-white
          peer-hover:[&>svg]:fill-white"
          >
            <CloudUploadOutlined className="[&>svg]:fill-violet-500 [&>svg]:text-md" />
            <span>{labelText}</span>
          </div>
          <p className="align-sub text-[10px] ml-2">mp3, aac, wav, ogg</p>
        </div>
        <div aria-hidden={!songSource} className="aria-hide">
          <span>Music controls</span>
        </div>
      </div>
      <input
        type="file"
        accept="audio/*"
        name="songs-"
        className="hidden"
        onChange={handleFileChange}
        ref={fileRef}
      />
    </>
  );
}
