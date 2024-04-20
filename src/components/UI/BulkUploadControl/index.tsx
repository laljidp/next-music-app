import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { TWButton } from "../Button";

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

interface UploadBulkControlProps {
  onFileSelect: (files: File[]) => void;
  acceptedFile?: string;
  title?: string;
  onClearFiles?: () => void;
}

export default function UploadBulkControl(props: UploadBulkControlProps) {
  const {
    acceptedFile = "image/*",
    onFileSelect,
    title,
    onClearFiles = () => {},
  } = props;
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files

    if (!acceptedFiles.length) return;

    console.log("Files", acceptedFiles);
    setFiles((_files) => [..._files, ...acceptedFiles]);
    onFileSelect(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({ accept: { [acceptedFile]: [] }, onDrop });

  const style: any = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject],
  );

  return (
    <div>
      <div
        {...getRootProps({ style })}
        className="flex items-center justify-center"
      >
        <input {...getInputProps()} />
        <p>{title || "Drag 'n' drop files here, or click to select files"}</p>
      </div>
      {files.length > 0 && (
        <TWButton
          onClick={() => {
            setFiles([]);
            onClearFiles();
          }}
          variant="outline"
          className="my-3 py-1"
        >
          Clear all
        </TWButton>
      )}
    </div>
  );
}
