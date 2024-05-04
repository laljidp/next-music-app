import { useContext, useState } from "react";
import { TWButton } from "../UI/Button";
import TWInput from "../UI/Input";
import TWModal, { ModelSize } from "../UI/Modal";
import playlistRequest from "@/services/request/playlist.request";
import { SnackContext } from "@/context/snack.context";

interface AddPlaylistsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaylistAdded?: () => void;
}

export default function AddPlaylistsModal({
  isOpen,
  onClose,
  onPlaylistAdded = () => {},
}: AddPlaylistsModalProps) {
  const [name, setName] = useState("");
  const [isLoading, setLoading] = useState(false);
  const { showSnack } = useContext(SnackContext);

  const handleClose = () => {
    setName("");
    onClose();
    setLoading(false);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = await playlistRequest.addPlaylist({ name });
      // TODO: Call api to save playlist
      if (data.success) {
        showSnack(`${name} playlist has created.`, "success");
        handleClose();
        onPlaylistAdded();
      } else {
        showSnack("Playlist failed to create, Please try again later", "error");
      }
    } catch (err) {
      setLoading(false);
      console.log("ERROR submit add playlist", err);
    }
  };

  return (
    <TWModal isOpen={isOpen} onClose={handleClose} size={ModelSize.SM}>
      <div className="my-2 font-bold text-violet-500">Add Playlist</div>
      <div className="mt-3 flex flex-col gap-4">
        <TWInput
          value={name}
          onChange={({ currentTarget }) => setName(currentTarget.value)}
          placeholder="Enter playlist name"
          name="name"
        />
        <TWButton loading={isLoading} onClick={handleSubmit}>
          Submit
        </TWButton>
      </div>
    </TWModal>
  );
}
