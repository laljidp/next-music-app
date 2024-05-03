import { useState } from "react";
import { TWButton } from "../UI/Button";
import MediaPlaceholder from "../Media/MediaPlaceholder";
import TWModal from "../UI/Modal";

interface MediaSelectUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMediaSelect: (media_url: string) => void;
}

export default function MediaSelectUploadModal(
  props: MediaSelectUploadModalProps,
) {
  const { isOpen, onClose } = props;
  const [mediaUrl, setMediaUrl] = useState("");

  const handleSubmit = () => {
    props.onMediaSelect(mediaUrl);
    onClose();
  };

  const onClear = () => {
    setMediaUrl("");
  };

  return (
    <TWModal
      isOpen={isOpen}
      onClose={onClose}
      className="relative mt-[5%] h-[80%] md:w-[100%] xl:w-[90%]"
    >
      <div>
        <div className="py-2 font-medium text-violet-500">Select Media</div>
        <div>
          <MediaPlaceholder allowSelect onSelectMedia={setMediaUrl} />
        </div>
        {mediaUrl && (
          <div className="absolute bottom-5 right-5 flex gap-3">
            <TWButton small variant="outline" onClick={handleSubmit}>
              Select photo
            </TWButton>
            <TWButton onClick={onClear} variant="secondary" small>
              Clear
            </TWButton>
          </div>
        )}
      </div>
    </TWModal>
  );
}
