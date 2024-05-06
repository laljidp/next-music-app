import mediaRequests from "@/services/request/media.request";
import { TWButton } from "../UI/Button";
import TWModal from "../UI/Modal";
import { useContext, useState } from "react";
import { SnackContext } from "@/context/snack.context";

interface DeleteMediaModalProps {
  id: string | null;
  isOpen: boolean;
  onClose: () => void;
  onMediaDeleted?: () => void;
}

export default function DeleteMediaModal({
  isOpen,
  onClose,
  id,
  onMediaDeleted = () => {},
}: DeleteMediaModalProps) {
  const { showSnack } = useContext(SnackContext);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setLoading(false);
    onClose();
  };

  const handleDelete = async () => {
    // TODO: call api to delete media
    try {
      if (!id) return;

      setLoading(true);
      const data = await mediaRequests.deleteMedia(id);
      console.log(data);
      if (data) {
        // TODO: show message
        showSnack("Media has been deleted.", "success");
        onMediaDeleted();
      } else {
        // TODO: show failed message
        showSnack("Failed to delete media, Please try again", "error");
      }
      handleClose();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log("ERROR deleting media request::", err);
      showSnack("Failed to delete media, Please try again", "error");
    }
  };

  return (
    <TWModal isOpen={isOpen} onClose={handleClose}>
      <div className="flex flex-col gap-4">
        <div className="text-lg font-medium text-violet-500">Delete Media</div>
        <div>Are you sure you want delete this media?</div>
        <div className="flex justify-end gap-3">
          <TWButton onClick={handleClose} variant="secondary" small>
            Close
          </TWButton>
          <TWButton
            loading={loading}
            onClick={handleDelete}
            variant="outline"
            small
          >
            Yes, delete
          </TWButton>
        </div>
      </div>
    </TWModal>
  );
}
