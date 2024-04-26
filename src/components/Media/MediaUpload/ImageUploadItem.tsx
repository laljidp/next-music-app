import { MEDIA_UPLOAD_PATH } from "@/services/db/constants/db.constants";
import { uploadFileToFireStorage } from "@/services/firebase/storage.firebase";
import mediaRequests from "@/services/request/media.request";
import { useCallback, useEffect, useState } from "react";
import Spinner from "../../UI/Spinner";
import { cn } from "@/utils/helper.util";
import { CheckCircleFilled } from "@ant-design/icons";

interface ImageUploadItemProps {
  image: File;
  onUploadComplete: (name: string) => void;
  onUploadError: (err: string, name?: string) => void;
}

export default function ImageUploadItem(props: ImageUploadItemProps) {
  const { image, onUploadComplete, onUploadError } = props;
  const [isLoading, setLoading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleUploadImage = useCallback(async (imgFile: File) => {
    try {
      setLoading(true);
      const source = await uploadFileToFireStorage(imgFile, MEDIA_UPLOAD_PATH);
      // TODO: call API to store data to media collection.
      const resp = await mediaRequests.addMedia({
        description: "",
        name: imgFile.name,
        source,
      });
      console.log({ resp });
      onUploadComplete(imgFile.name);
      setLoading(false);
      setIsUploaded(true);
    } catch (err) {
      setLoading(false);
      console.log("Failed to upload image::", err);
      onUploadError("Failed to upload Media", imgFile.name);
    }
  }, []);

  useEffect(() => {
    // Call function to upload image
    handleUploadImage(image);
  }, []);

  return (
    <div
      className={cn(
        "rounded-lg px-4 py-2 ring-1 ring-violet-400",
        !isLoading ? "bg-slate-200" : "",
        !isLoading ? "ring-slate-400" : "ring-violet-400",
      )}
    >
      <div className="flex justify-between">
        <div>
          {image.name}{" "}
          <small>
            {" "}
            ( Size: {Math.round(image.size / 1000).toPrecision(2)}kb )
          </small>
        </div>
        <div className="flex items-center">
          {isLoading && (
            <div className="flex items-center gap-1">
              <small className="text-slate-400">Uploading..</small>
              <Spinner color="slate" />
            </div>
          )}
          {!isLoading && isUploaded && (
            <CheckCircleFilled className="text-violet-500" />
          )}
        </div>
      </div>
    </div>
  );
}
