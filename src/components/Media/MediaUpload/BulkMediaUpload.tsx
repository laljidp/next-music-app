"use client";

import { useState } from "react";
import UploadBulkControl from "../../UI/BulkUploadControl";
import ImageUploadItem from "./ImageUploadItem";

export default function UploadBulkMedia() {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  return (
    <div>
      <UploadBulkControl
        onFileSelect={setImageFiles}
        onClearFiles={() => setImageFiles([])}
        title="Please drag & drop media images or select files."
      />
      <div className="mt-4">
        {imageFiles.map((img) => (
          <ImageUploadItem
            image={img}
            onUploadComplete={console.log}
            onUploadError={console.log}
          />
        ))}
      </div>
    </div>
  );
}
