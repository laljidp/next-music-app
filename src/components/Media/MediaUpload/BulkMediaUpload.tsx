"use client";

import { useEffect, useState } from "react";
import UploadBulkControl from "../../UI/BulkUploadControl";
import ImageUploadItem from "./ImageUploadItem";
import { BC_MEDIA_CHANNEL, NEW_MEDIA_DETECTED } from "@/constants";

let bc: BroadcastChannel;

export default function UploadBulkMedia() {
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    bc = new BroadcastChannel(BC_MEDIA_CHANNEL);
    return () => {
      bc?.close();
    };
  }, []);

  const broadcastMessage = (name: string) => {
    bc?.postMessage(NEW_MEDIA_DETECTED);
  };

  return (
    <div>
      <UploadBulkControl
        onFileSelect={setImageFiles}
        onClearFiles={() => setImageFiles([])}
        title="Please drag & drop media images or select files."
      />
      <div
        aria-hidden={imageFiles.length < 1}
        className="height-[calc(100vh-390px)] scrollbar-md aria-hide
      mt-2 flex flex-col gap-1 overflow-auto px-2 py-2 shadow-md"
      >
        {imageFiles.map((img, index) => (
          <div className="mb-2" key={img.name + index}>
            <ImageUploadItem
              image={img}
              onUploadComplete={broadcastMessage}
              onUploadError={console.log}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
