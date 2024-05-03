import { SearchOutlined } from "@ant-design/icons";
import TWInput from "../UI/Input";
import TWModal from "../UI/Modal";
import useSWR from "swr";
import { apiUrls } from "@/constants";
import songsRequest from "@/services/request/songs.request";
import { useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import Spinner from "../UI/Spinner";
import Image from "next/image";
import { TWButton } from "../UI/Button";

interface SongsSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSongSelected: (songsIds: string[]) => void;
}

export default function SongSelectionModal(props: SongsSelectionModalProps) {
  const { isOpen, onClose, onSongSelected = () => {} } = props;
  const [search, setSearch] = useState("");
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);

  const debounceSearch = useDebounce(search, 1000);

  const { isLoading, data } = useSWR(
    `${apiUrls.songs}?search=${debounceSearch}&batch=35&minimal=true`,
    songsRequest.fetchSongs,
    {
      revalidateOnMount: true,
      fallbackData: [],
    },
  );

  const handleClose = () => {
    setSelectedSongIds([]);
    onClose();
  };

  const handleSelectDeselectSong = (id: string) => {
    const isSelected = selectedSongIds.includes(id);
    if (!isSelected) {
      const newLists = [...selectedSongIds, id];
      setSelectedSongIds(newLists);
    } else {
      const newLists = selectedSongIds.filter((sid) => sid !== id);
      setSelectedSongIds(newLists);
    }
  };

  return (
    <TWModal
      isOpen={isOpen}
      onClose={handleClose}
      className="relative h-[75%] w-[70%]"
    >
      <h1 className="font-medium text-violet-500">Select songs</h1>
      <div className="pt-2">
        <TWInput
          placeholder="Search songs"
          name="search"
          value={search}
          onChange={({ currentTarget }) => setSearch(currentTarget.value)}
          icon={<SearchOutlined className="text-slate-500" />}
        />
      </div>
      <div className="mt=2">
        {isLoading && (
          <div className="mt-[5rem]">
            <Spinner size="xl" color="violet" />
          </div>
        )}
        {!isLoading && data.length === 0 && (
          <div className="flex h-[300px] items-center justify-center">
            No songs found !
          </div>
        )}
        <div className="mt-2 grid h-[calc(100vh-400px)] grid-cols-2 gap-2 overflow-auto px-2 py-2">
          {!isLoading &&
            data.map((song) => (
              <div
                onClick={() => handleSelectDeselectSong(song?._id || "")}
                role="button"
                aria-selected={selectedSongIds.includes(song._id || "")}
                className="h-[45px] rounded-lg p-2 ring-1 ring-violet-300 hover:bg-violet-100
                 aria-[selected=true]:bg-violet-400"
                key={song._id}
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={song.coverImage || "/next-streaming-192x192.png"}
                    alt="song"
                    className="h-[30px] w-[30px] object-contain"
                    height={35}
                    width={35}
                  />
                  <span>{song.title}</span>
                </div>
              </div>
            ))}
        </div>
        <div className="absolute bottom-5 right-5 flex gap-2">
          <TWButton variant="secondary" small onClick={handleClose}>
            Close
          </TWButton>
          <TWButton
            onClick={() => {
              onSongSelected(selectedSongIds);
              handleClose();
            }}
            variant="outline"
            small
          >
            Import songs ({selectedSongIds.length})
          </TWButton>
        </div>
      </div>
    </TWModal>
  );
}
