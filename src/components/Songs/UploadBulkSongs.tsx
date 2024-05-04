import { IAlbumDto } from "@/services/types/albums.types";
import { useContext, useState } from "react";
import SongUploadProgress from "./SongUploadProgress";
import { SnackContext } from "@/context/snack.context";
import UploadBulkControl from "../UI/BulkUploadControl";
import { TWButton } from "../UI/Button";

interface UploadBulkSongsProps {
  album?: IAlbumDto;
}

export default function UploadBulkSongs(props: UploadBulkSongsProps) {
  const { showSnack } = useContext(SnackContext);
  const [files, setFiles] = useState<File[]>([]);

  const handleUploadComplete = (fileName: string) => {
    // TODO: show toast message..
    showSnack(`${fileName} audio has been uploaded.`, "success");
  };

  return (
    <div className="container">
      <UploadBulkControl
        onFileSelect={setFiles}
        onClearFiles={() => setFiles([])}
        title="Please upload audio files or drag & drop here.."
        acceptedFile="audio/*"
      />
      <div
        aria-hidden={files.length < 1}
        className="height-[calc(100vh-390px)] scrollbar-md aria-hide
          mt-2 flex flex-col gap-1 overflow-auto px-2 py-2 shadow-md"
      >
        {files.map((file, index) => (
          <SongUploadProgress
            key={file.name + index}
            file={file}
            onUploadCompleted={handleUploadComplete}
          />
        ))}
      </div>
    </div>
  );
}
