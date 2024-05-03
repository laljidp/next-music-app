import TWModal from "../UI/Modal";
import UploadBulkMedia from "./MediaUpload/BulkMediaUpload";

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MediaUploadModal({
  isOpen,
  onClose,
}: MediaUploadModalProps) {
  return (
    <TWModal
      isOpen={isOpen}
      onClose={onClose}
      allowBackdrop
      className="w-550px mt-[5%] min-h-[80%] overflow-auto"
    >
      <div className="mt-3">
        <div className="my-2">
          <span className="font-medium text-violet-500">
            Upload Media photos
          </span>
        </div>
        <UploadBulkMedia />
      </div>
    </TWModal>
  );
}
