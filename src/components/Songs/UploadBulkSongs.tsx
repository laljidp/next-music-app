import { useDropzone } from "react-dropzone";
import { IAlbumDto } from "@/services/types/albums.types";
import { useCallback, useContext, useMemo, useState } from "react";
import SongUploadProgress from "./SongUploadProgress";
import { TWButton } from "../UI/Button";
import { SnackContext } from "@/context/snack.context";

interface UploadBulkSongsProps {
  album?: IAlbumDto;
}

const baseStyle = {
  padding: "20px",
  minHeight: "125px",
  borderWidth: 2,
  borderRadius: 5,
  cursor: "pointer",
  borderColor: "rgb(167 139 250)",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "rgb(167 139 250)",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

export default function UploadBulkSongs(props: UploadBulkSongsProps) {
  const { showSnack } = useContext(SnackContext);
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    console.log("Files", acceptedFiles);
    setFiles((_files) => [..._files, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({ accept: { "audio/*": [] }, onDrop });

  const style: any = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject],
  );

  const handleUploadComplete = (fileName: string) => {
    // TODO: show toast message..
    showSnack(`${fileName} audio has been uploaded.`, "success");
  };

  return (
    <div className="container py-4">
      <div
        {...getRootProps({ style })}
        className="flex items-center justify-center"
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop audio files here, or click to select files</p>
      </div>
      {files.length > 0 && (
        <TWButton
          onClick={() => setFiles([])}
          variant="outline"
          className="my-3 py-1"
        >
          Clear all
        </TWButton>
      )}
      <div className="mt-3 grid grid-cols-2 gap-3">
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
