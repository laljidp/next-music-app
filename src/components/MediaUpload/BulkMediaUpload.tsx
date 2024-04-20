"use client";

import { useState } from "react";
import UploadBulkControl from "../UI/BulkUploadControl";

export default function UploadBulkMedia() {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  return (
    <div>
      <UploadBulkControl
        onFileSelect={setImageFiles}
        onClearFiles={() => setImageFiles([])}
        title="Please drag & drop media images or select files."
      />
    </div>
  );
}
