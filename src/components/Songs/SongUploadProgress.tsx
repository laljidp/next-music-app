import { MusicIcon } from "@/assets/svgs";
import { uploadFileToFireStorage } from "@/services/firebase/storage.firebase";
import songsRequest from "@/services/request/songs.request";
import { ISongsDto } from "@/services/types/songs.types";
import { cleanAudioFileName, cn } from "@/utils/helper.util";
import Image from "next/image";
import { useEffect, useState } from "react";
import Spinner from "../UI/Spinner";
import { CheckCircleFilled } from "@ant-design/icons";
import { SONGS_UPLOAD_PATH } from "@/services/db/constants/db.constants";

interface SongUploadProgressProps {
  file: File;
  onUploadCompleted?: (fileName: string) => void;
  onUploadRejected?: () => void;
}

export default function SongUploadProgress(props: SongUploadProgressProps) {
  const { file, onUploadCompleted = () => {} } = props;
  const [isLoading, setLoading] = useState(true);
  const [isUploadFinished, setUploadFinished] = useState(false);

  const getDurationAndUpload = () => {
    const reader = new FileReader();
    setLoading(true);
    try {
      reader.onload = async (event: any) => {
        // Create an instance of AudioContext
        const audioContext = new window.AudioContext();
        console.timeLog();

        // Asynchronously decode audio file data contained in an ArrayBuffer.
        audioContext.decodeAudioData(event.target.result, async (buffer) => {
          // Obtain the duration in seconds of the audio file (with milliseconds as well, a float value)
          const duration = buffer.duration;
          // Upload file to google storage.
          const fileName = cleanAudioFileName(file.name);
          const audioPath = await uploadFileToFireStorage(
            file,
            SONGS_UPLOAD_PATH,
            fileName,
          );
          if (audioPath) {
            const payload: ISongsDto = {
              duration,
              title: fileName,
              artists: [],
              genre: [],
              source: audioPath,
              metadata: {
                kind: file.type,
                size: file.size,
                name: fileName,
              },
            };
            const _song = await songsRequest.saveNewSong(payload);
            onUploadCompleted(fileName);
            setUploadFinished(true);
            setLoading(false);
          }
        });
      };

      // In case that the file couldn't be read
      reader.onerror = function (event) {
        console.error("An error ocurred reading the file: ", event);
      };

      // Read file as an ArrayBuffer, important !
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.log("Error uploading bulk mp3 file::", err);
    }
    // When the file has been successfully read
  };

  useEffect(() => {
    getDurationAndUpload();
  }, []);

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-md px-5 py-3 shadow-md ring-1",
        isUploadFinished
          ? "bg-violet-200 ring-violet-200"
          : "bg-slate-100 ring-slate-100",
      )}
    >
      <div className="flex items-center gap-4">
        <i>
          <Image
            src={MusicIcon}
            alt="music-icon"
            height={50}
            width={50}
            className="h-[20px] w-[20px]"
          />
        </i>
        <div className="text-md italic">{file.name}</div>
      </div>
      {isLoading && (
        <div className="flex items-center gap-2">
          <span className="text-xs">Uploading...</span>
          <Spinner color="slate" />
        </div>
      )}
      {!isLoading && isUploadFinished && (
        <CheckCircleFilled className="text-violet-500" />
      )}
    </div>
  );
}
