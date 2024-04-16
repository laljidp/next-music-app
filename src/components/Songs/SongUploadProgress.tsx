import { MusicIcon } from "@/assets/svgs";
import { uploadFileToFireStorage } from "@/services/firebase/storage.firebase";
import songsRequest from "@/services/request/songs.request";
import { ISongsDto } from "@/services/types/songs.types";
import Image from "next/image";
import { useEffect, useState } from "react";

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
    // When the file has been successfully read
    reader.onload = async (event: any) => {
      // Create an instance of AudioContext
      const audioContext = new window.AudioContext();
      console.timeLog();

      // Asynchronously decode audio file data contained in an ArrayBuffer.
      audioContext.decodeAudioData(event.target.result, async (buffer) => {
        // Obtain the duration in seconds of the audio file (with milliseconds as well, a float value)
        const duration = buffer.duration;
        // Upload file to google storage.
        const audioPath = await uploadFileToFireStorage(file);
        if (audioPath) {
          const payload: ISongsDto = {
            duration,
            title: file.name,
            artists: [],
            genre: [],
            source: audioPath,
            metadata: {
              kind: file.type,
              size: file.size,
              name: file.name,
            },
          };
          const _song = await songsRequest.saveNewSong(payload);
          console.log({ _song });
          onUploadCompleted(file.name);
        }
        console.log("The duration of the song is of: " + duration + " seconds");
        console.timeEnd();
        // Alternatively, just display the integer value with
        // parseInt(duration)
        // 12 seconds
      });
    };

    // In case that the file couldn't be read
    reader.onerror = function (event) {
      console.error("An error ocurred reading the file: ", event);
    };

    // Read file as an ArrayBuffer, important !
    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    getDurationAndUpload();
  }, []);

  return (
    <div className="rounded-md px-5 py-3 ring-1 ring-violet-300">
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
        <div className="text-lg">{file.name}</div>
      </div>
    </div>
  );
}
