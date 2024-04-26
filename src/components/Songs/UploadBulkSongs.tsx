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
      <div className="grid-col-1 mt-3 grid gap-3">
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
