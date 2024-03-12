import { IAlbumDto } from "@/services/types/albums.types";

interface UploadBulkSongsProps {
  album: IAlbumDto;
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadBulkSongs(props: UploadBulkSongsProps) {
  const { album, isOpen, onClose } = props;
  return (
    <div className="p-2">
      <div>Upload songs..</div>
    </div>
  );
}
