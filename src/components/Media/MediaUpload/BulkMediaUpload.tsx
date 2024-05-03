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
    bc.postMessage(NEW_MEDIA_DETECTED);
  };

  return (
    <div>
      <UploadBulkControl
        onFileSelect={setImageFiles}
        onClearFiles={() => setImageFiles([])}
        title="Please drag & drop media images or select files."
      />
      <div className="mt-4">
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
