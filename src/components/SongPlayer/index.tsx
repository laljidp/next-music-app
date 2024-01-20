import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

interface SongPlayerProps {
  src: string;
}

export default function SongPlayer({ src }: SongPlayerProps) {
  return (
    <div>
      <AudioPlayer
        autoPlay={false}
        src={src}
        showJumpControls={false}
        onPlay={(e) => console.log("onPlay")}
        // other props here
      />
    </div>
  );
}
