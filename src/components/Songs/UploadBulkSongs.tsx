import { useDropzone } from "react-dropzone";
import { IAlbumDto } from "@/services/types/albums.types";
import { useCallback, useMemo, useState } from "react";
import SongUploadProgress from "./SongUploadProgress";

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
    const _files = files.slice().filter((file) => file.name !== fileName);
    setFiles(_files);
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
      <div className="mt-3">
        {files.map((file, index) => (
          <div className="my-3">
            <SongUploadProgress
              key={file.name + index}
              file={file}
              onUploadCompleted={handleUploadComplete}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
